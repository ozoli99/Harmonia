package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ozoli99/Praesto/appointment"
	"github.com/ozoli99/Praesto/calendars"
	"github.com/ozoli99/Praesto/config"
	"github.com/ozoli99/Praesto/notifications"
)

func generateSecureState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b), nil
}

func GinWrap(h http.Handler) gin.HandlerFunc {
    return func(c *gin.Context) {
        h.ServeHTTP(c.Writer, c.Request)
    }
}

func main() {
	configuration := config.Load("./harmonia-config.yaml")

	database, err := gorm.Open(postgres.Open(configuration.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	if err := database.AutoMigrate(&appointment.Appointment{}); err != nil {
		log.Fatalf("Failed to auto-migrate models: %v", err)
	}

	calendarConfiguration := calendars.CalendarConfig{
		CredentialsFile: configuration.GoogleCredFile,
		CalendarID: configuration.GoogleCalendarID,
	}
	calendarAdapter, err := calendars.NewCalendarAdapter("google", calendarConfiguration)
	if err != nil {
		log.Fatalf("Calendar adapter initialization error: %v", err)
	}

	notificationConfiguration := notifications.NotificationConfig{
		TwilioAccountSID: configuration.TwilioSID,
		TwilioAuthToken: configuration.TwilioAuthToken,
		TwilioFromPhone: configuration.TwilioFromPhone,
		DummyCustomerPhone: "",
	}
	notificationService, err := notifications.NewNotificationServiceFactory("twilio", notificationConfiguration)
	if err != nil {
		log.Fatalf("Notification service initialization error: %v", err)
	}

	appointmentRepository := appointment.NewGormRepository(database)
	appointmentService := appointment.NewService(appointmentRepository, notificationService, calendarAdapter, notificationConfiguration)

	clerk.SetKey(configuration.ClerkSecretKey)

	router := gin.Default()
	store := cookie.NewStore([]byte("super-secret-key"))
	router.Use(sessions.Sessions("auth-session", store))

	protected := clerkhttp.WithHeaderAuthorization()

	router.GET("/", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{"access": "public"})
	})

	router.GET("/protected", GinWrap(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := clerk.SessionClaimsFromContext(r.Context())
		if !ok {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized"}`))
			return
		}
		usr, err := user.Get(r.Context(), claims.Subject)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(fmt.Sprintf(`{"error": "%v"}`, err)))
			return
		}
		fmt.Fprintf(w, `{"user_id": "%s", "user_banned": %t}`, usr.ID, usr.Banned)
	})))
	
	router.GET("/protected", GinWrap(protected(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := clerk.SessionClaimsFromContext(r.Context())
		if !ok {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"access": "unauthorized"}`))
			return
		}
		usr, err := user.Get(r.Context(), claims.Subject)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(fmt.Sprintf(`{"error": "%v"}`, err)))
			return
		}
		fmt.Fprintf(w, `{"user_id": "%s", "user_banned": %t}`, usr.ID, usr.Banned)
	}))))

	router.GET("/login", func(context *gin.Context) {
		state, err := generateSecureState()
		if err != nil {
			context.String(http.StatusInternalServerError, "Failed to generate state")
			return
		}
		session := sessions.Default(context)
		session.Set("state", state)
		session.Save()

		context.Redirect(http.StatusTemporaryRedirect, "https://dashboard.clerk.dev/sign-in")
	})

	router.GET("/logout", func(context *gin.Context) {
		session := sessions.Default(context)
		session.Clear()
		session.Save()

		context.Redirect(http.StatusTemporaryRedirect, "http://localhost:3000")
	})

	router.POST("/appointments", func(context *gin.Context) {
		providerID := uint(1)
		customerID := uint(2)
		startTime := time.Now().Add(24 * time.Hour)
		endTime := startTime.Add(1 * time.Hour)
		appointment, err := appointmentService.BookAppointment(providerID, customerID, startTime, endTime)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		context.JSON(http.StatusOK, appointment)
	})

	router.PUT("/appointments/:id", func(context *gin.Context) {
		idStr := context.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid appointment ID"})
			return
		}
		var request struct {
			NewStartTime string `json:"newStartTime"`
			NewEndTime   string `json:"newEndTime"`
		}
		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		newStartTime, err := time.Parse(time.RFC3339, request.NewStartTime)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid start time format"})
			return
		}
		newEndTime, err := time.Parse(time.RFC3339, request.NewEndTime)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid end time format"})
			return
		}
		appointment, err := appointmentService.RescheduleAppointment(uint(id), newStartTime, newEndTime)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		context.JSON(http.StatusOK, appointment)
	})

	router.DELETE("/appointments/:id", func(context *gin.Context) {
		idStr := context.Param("id")
		id, err := strconv.ParseUint(idStr, 10, 32)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid appointment ID"})
			return
		}
		if err := appointmentService.CancelAppointment(uint(id)); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		context.JSON(http.StatusOK, gin.H{"message": "Appointment cancelled"})
	})

	log.Printf("Starting Harmonia on port %s", configuration.Port)
	if err := http.ListenAndServe(":"+configuration.Port, router); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
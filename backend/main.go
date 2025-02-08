package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ozoli99/Praesto/appointment"
	"github.com/ozoli99/Praesto/auth"
	"github.com/ozoli99/Praesto/calendars"
	"github.com/ozoli99/Praesto/config"
	"github.com/ozoli99/Praesto/notifications"
)

func main() {
	configuration := config.Load("harmonia-config.yaml")

	database, err := gorm.Open(postgres.Open(configuration.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	// TODO: Auto-migrate models

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

	authConfiguration := auth.Auth0Config{
		Domain: configuration.AuthDomain,
		Audience: configuration.AuthAudience,
	}
	authProvider := "auth0"
	authAdapter, err := auth.NewAuthAdapterFactory(authProvider, authConfiguration)
	if err != nil {
		log.Fatalf("Auth adapter initialization error: %v", err)
	}

	router := gin.Default()
	router.Use(authAdapter.Middleware())

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

		err = appointmentService.CancelAppointment(uint(id))
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		context.JSON(http.StatusOK, gin.H{"message": "Appointment cancelled"})
	})

	router.GET("/profile", func(context *gin.Context) {
		// TODO: Retrieve user info from the session or database.
		profile := gin.H{
			"id":             1,
			"name":           "John Doe",
			"email":          "john@example.com",
			"profilePicture": "https://via.placeholder.com/150",
			"role":           "masseur",
			"bio":            "Certified massage therapist with 10 years of experience.",
			"experience":     10,
			"specialties":    []string{"Swedish Massage", "Deep Tissue", "Sports Massage"},
			"location":       "Los Angeles, CA",
		}
		context.JSON(http.StatusOK, profile)
	})

	router.PUT("/profile", func(context *gin.Context) {
		var profileUpdate map[string]interface{}
		if err := context.ShouldBindJSON(&profileUpdate); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// TOFO: Update the user profile in the database.
		context.JSON(http.StatusOK, gin.H{"message": "Profile updated", "profile": profileUpdate})
	})

	log.Printf("Starting Harmonia on port %s", configuration.Port)
	if err := http.ListenAndServe(":" + configuration.Port, router); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
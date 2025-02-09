package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/ozoli99/Praesto/appointment"
	"github.com/ozoli99/Praesto/auth"
	"github.com/ozoli99/Praesto/calendars"
	"github.com/ozoli99/Praesto/config"
	"github.com/ozoli99/Praesto/notifications"
	"github.com/ozoli99/Praesto/user"
)

func generateSecureState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func main() {
	configuration := config.Load("./harmonia-config.yaml")

	database, err := gorm.Open(postgres.Open(configuration.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	if err := database.AutoMigrate(&user.User{}, &appointment.Appointment{}); err != nil {
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

	userRepository := user.NewGormRepository(database)
	userService := user.NewService(userRepository)

	authConfiguration := auth.Auth0Config{
		Domain:       configuration.AuthDomain,
		ClientID:     configuration.AuthClientID,
		ClientSecret: configuration.AuthClientSecret,
		CallbackURL:  configuration.AuthCallbackURL,
		Audience:     configuration.AuthAudience,
	}
	authProvider := "auth0"
	authAdapter, err := auth.NewAuthAdapterFactory(authProvider, authConfiguration)
	if err != nil {
		log.Fatalf("Auth adapter initialization error: %v", err)
	}

	router := gin.Default()
	store := cookie.NewStore([]byte("super-secret-key"))
	router.Use(sessions.Sessions("auth-session", store))
	router.Use(authAdapter.Middleware())

	// --- Auth Routes ---

	router.GET("/login", func(context *gin.Context) {
		state, err := generateSecureState()
		if err != nil {
			log.Printf("Failed to generate state: %v", err)
			context.String(http.StatusInternalServerError, "Internal Server Error")
			return
		}
		session := sessions.Default(context)
		session.Set("state", state)
		if err := session.Save(); err != nil {
			log.Printf("Failed to save session: %v", err)
			context.String(http.StatusInternalServerError, "Internal Server Error")
			return
		}
		oauth2Config := authAdapter.(*auth.Auth0Adapter).OAuth2Config
		context.Redirect(http.StatusTemporaryRedirect, oauth2Config.AuthCodeURL(state))
	})

	router.GET("/callback", func(context *gin.Context) {
		session := sessions.Default(context)
		if context.Query("state") != session.Get("state") {
			context.String(http.StatusBadRequest, "Invalid state parameter")
			return
		}

		code := context.Query("code")
		oauth2Config := authAdapter.(*auth.Auth0Adapter).OAuth2Config
		token, err := oauth2Config.Exchange(context.Request.Context(), code)
		if err != nil {
			context.String(http.StatusUnauthorized, "Failed to exchange authorization code for token")
			return
		}

		rawIDToken, ok := token.Extra("id_token").(string)
		if !ok {
			context.String(http.StatusInternalServerError, "No id_token field in token")
			return
		}
		idToken, err := authAdapter.(*auth.Auth0Adapter).Verifier.Verify(context.Request.Context(), rawIDToken)
		if err != nil {
			context.String(http.StatusInternalServerError, "Failed to verify ID token")
			return
		}
		var claims map[string]interface{}
		if err := idToken.Claims(&claims); err != nil {
			context.String(http.StatusInternalServerError, "Failed to parse token claims")
			return
		}

		registeredUser, err := userService.SyncUserFromClaims(claims)
		if err != nil {
			context.String(http.StatusInternalServerError, "Failed to register user: " + err.Error())
			return
		}

		session.Set("access_token", token.AccessToken)
		session.Set("profile", registeredUser)
		session.Save()

		context.Redirect(http.StatusTemporaryRedirect, "/profile")
	})

	router.GET("/logout", func(context *gin.Context) {
		session := sessions.Default(context)
		session.Clear()
		session.Save()

		logoutURL := fmt.Sprintf("https://%s/v2/logout?client_id=%s&returnTo=%s", configuration.AuthDomain, configuration.AuthClientID, "http://localhost:3000")
		context.Redirect(http.StatusTemporaryRedirect, logoutURL)
	})

	// --- Protected Routes ---

	router.GET("/profile", func(context *gin.Context) {
		session := sessions.Default(context)
		profile := session.Get("profile")
		if profile == nil {
			context.Redirect(http.StatusSeeOther, "/login")
			return
		}
		context.JSON(http.StatusOK, profile)
	})

	router.PUT("/profile", func(context *gin.Context) {
		var profileUpdate map[string]interface{}
		if err := context.ShouldBindJSON(&profileUpdate); err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// TODO: Update the user profile in the database.
		context.JSON(http.StatusOK, gin.H{"message": "Profile updated", "profile": profileUpdate})
	})

	// --- Appointment Endpoints

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

	log.Printf("Starting Harmonia on port %s", configuration.Port)
	if err := http.ListenAndServe(":" + configuration.Port, router); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
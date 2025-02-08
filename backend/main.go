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

	log.Printf("Starting Harmonia on port %s", configuration.Port)
	if err := http.ListenAndServe(":" + configuration.Port, router); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
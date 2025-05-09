package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ozoli99/Harmonia/config"
	"github.com/ozoli99/Harmonia/db"
	"github.com/ozoli99/Harmonia/handlers"
	"github.com/ozoli99/Harmonia/middleware"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
)

func main() {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(fmt.Sprintf("Failed to initialize logger: %v", err))
	}
	defer logger.Sync()

	cfg, err := config.LoadConfig("../../harmonia-config.yaml")
	if err != nil {
		logger.Fatal("Error loading configuration", zap.Error(err))
	}

	dbConn := db.NewPostgresDB(cfg.DatabaseURL, logger)

	appointmentRepo := db.NewAppointmentRepository(dbConn, logger)
	
	appointmentHandler := handlers.NewAppointmentHandler(appointmentRepo, logger)
	paymentHandler := handlers.NewPaymentHandler(dbConn, cfg, logger)
	subscriptionHandler := handlers.NewSubscriptionHandler(dbConn, cfg, logger)

	handlers.InitializeClerk(cfg, logger)

	router := gin.New()
	router.Use(
		middleware.RequestLoggingMiddleware(logger),
		middleware.ErrorHandlingMiddleware(logger),
		middleware.CORSMiddleware(),
	)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	apiV1 := router.Group("/api/v1")
	{
		apiV1.Use(handlers.ClerkMiddleware(cfg))

		apiV1.GET("/appointments", appointmentHandler.GetAppointments)
		apiV1.POST("/appointments", appointmentHandler.CreateAppointment)
		apiV1.PUT("/appointments/:id", appointmentHandler.UpdateAppointment)
		apiV1.DELETE("/appointments/:id", appointmentHandler.DeleteAppointment)

	}
	
	paymentRoutes := apiV1.Group("/payments")
	paymentRoutes.Use(handlers.RoleMiddleware("client"))
	{
		paymentRoutes.POST("/checkout", paymentHandler.CreatePaymentIntent)
		paymentRoutes.POST("/webhook", paymentHandler.HandleStripeWebhook)
	}

	subscriptionRoutes := apiV1.Group("/subscriptions")
	subscriptionRoutes.Use(handlers.RoleMiddleware("client"))
	{
		subscriptionRoutes.POST("/checkout", subscriptionHandler.CreateSubscription)
		subscriptionRoutes.POST("/webhook", subscriptionHandler.HandleStripeSubscriptionWebhook)
	}

	// Clients can only book/view appointments
	clientRoutes := apiV1.Group("/clients")
	clientRoutes.Use(handlers.RoleMiddleware("client"))
	{
		clientRoutes.POST("/appointments", appointmentHandler.CreateAppointment)
		clientRoutes.GET("/appointments", appointmentHandler.GetAppointments)
	}
	
	// Masseurs can manage their own appointments
	masseurRoutes := apiV1.Group("/masseurs")
	masseurRoutes.Use(handlers.RoleMiddleware("masseur"))
	{
		//masseurRoutes.GET("/appointments", getMasseurAppointments)
		masseurRoutes.PUT("/appointments/:id", appointmentHandler.UpdateAppointment)
	}

	// Admins have full control
	adminRoutes := apiV1.Group("/admin")
	adminRoutes.Use(handlers.RoleMiddleware("admin"))
	{
		//adminRoutes.GET("/users", listUsers)
		//adminRoutes.DELETE("/users/:id", deleteUser)
		adminRoutes.DELETE("/appointments/:id", appointmentHandler.DeleteAppointment)
	}

	srv := &http.Server{
		Addr: ":" + cfg.Port,
		Handler: router,
	}

	go func() {
		logger.Info("Starting server", zap.String("port", cfg.Port))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Server failed", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5 * time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown", zap.Error(err))
	}
	logger.Info("Server exiting")
}
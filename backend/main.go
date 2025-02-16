package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"go.uber.org/zap"
	"gopkg.in/yaml.v3"
)

type Config struct {
	Port           string `yaml:"Port"`
	DatabaseURL    string `yaml:"DatabaseURL"`
	ClerkSecretKey string `yaml:"ClerkSecretKey"`
}

type Appointment struct {
	ID              int       `db:"id" json:"id"`
	ClientID        int       `db:"client_id" json:"clientId"`
	MasseurID       int       `db:"masseur_id" json:"masseurId"`
	AppointmentDate time.Time `db:"appointment_date" json:"appointmentDate"`
	StartTime       string    `db:"start_time" json:"startTime"`
	EndTime         string    `db:"end_time" json:"endTime"`
	Type            string    `db:"type" json:"type"`
	Status          string    `db:"status" json:"status"`
	Description     string    `db:"description" json:"description"`
	Location        string    `db:"location" json:"location"`
	RecurrenceRule  string    `db:"recurrence_rule" json:"recurrenceRule"`
	CreatedAt       time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt       time.Time `db:"updated_at" json:"updatedAt"`
}

var (
	db       *sqlx.DB
	validate *validator.Validate
	logger   *zap.Logger
	config   Config
	clerkClient clerk.Client
)

func loadConfig(filename string) error {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}
	return yaml.Unmarshal(data, &config)
}

func initClerk() {
	var err error
	clerkClient, err = clerk.NewClient(config.ClerkSecretKey)
	if err != nil {
		logger.Fatal("Error initializing Clerk client", zap.Error(err))
	}
}

func initDB() {
	var err error
	db, err = sqlx.Connect("postgres", config.DatabaseURL)
	if err != nil {
		logger.Fatal("Error opening database", zap.Error(err))
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err = db.Ping(); err != nil {
		logger.Fatal("Error connecting to database", zap.Error(err))
	}
	logger.Info("Connected to harmonia database successfully")
}

func main() {
	var err error
	logger, err = zap.NewProduction()
	if err != nil {
		panic(fmt.Sprintf("Can't initialize zap logger: %v", err))
	}
	defer logger.Sync()

	if err := loadConfig("harmonia-config.yaml"); err != nil {
		logger.Fatal("Error loading configuration", zap.Error(err))
	}

	initDB()

	validate = validator.New()

	initClerk()

	router := gin.New()
	router.Use(RequestLoggingMiddleware(), ErrorHandlingMiddleware(), CORSMiddleware())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	apiV1 := router.Group("/api/v1")
	apiV1.Use(ClerkMiddleware())
	{
		apiV1.GET("/appointments", getAppointments)
		apiV1.POST("/appointments", createAppointment)
		apiV1.PUT("/appointments/:id", updateAppointment)
		apiV1.DELETE("/appointments/:id", deleteAppointment)
	}

	// Clients can only book/view appointments
	clientRoutes := apiV1.Group("/clients")
	clientRoutes.Use(RoleMiddleware("client"))
	{
		clientRoutes.POST("/appointments", createAppointment)
		clientRoutes.GET("/appointments", getAppointments)
	}
	
	// Masseurs can manage their own appointments
	masseurRoutes := apiV1.Group("/masseurs")
	masseurRoutes.Use(RoleMiddleware("masseur"))
	{
		//masseurRoutes.GET("/appointments", getMasseurAppointments)
		masseurRoutes.PUT("/appointments/:id", updateAppointment)
	}

	// Admins have full control
	adminRoutes := apiV1.Group("/admin")
	adminRoutes.Use(RoleMiddleware("admin"))
	{
		//adminRoutes.GET("/users", listUsers)
		//adminRoutes.DELETE("/users/:id", deleteUser)
		adminRoutes.DELETE("/appointments/:id", deleteAppointment)
	}

	srv := &http.Server{
		Addr: ":" + config.Port,
		Handler: router,
	}

	go func() {
		logger.Info("Starting server", zap.String("port", config.Port))
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

func getAppointments(c *gin.Context) {
	ctx := c.Request.Context()

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	statusFilter := c.Query("status")
	clientIDFilter := c.Query("client_id")
	masseurIDFilter := c.Query("masseur_id")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	query := `
		SELECT id, client_id, masseur_id, appointment_date, start_time, end_time, type, status, description, location, recurrence_rule, created_at, updated_at 
		FROM appointments
		WHERE 1=1
	`

	args := map[string]interface{}{}

	if statusFilter != "" {
		query += " AND status = :status"
		args["status"] = statusFilter
	}
	if clientIDFilter != "" {
		query += " AND client_id = :client_id"
		args["client_id"], _ = strconv.Atoi(clientIDFilter)
	}
	if masseurIDFilter != "" {
		query += " AND masseur_id = :masseur_id"
		args["masseur_id"], _ = strconv.Atoi(masseurIDFilter)
	}
	if startDate != "" {
		query += " AND appointment_date >= :start_date"
		args["start_date"] = startDate
	}
	if endDate != "" {
		query += " AND appointment_date <= :end_date"
		args["end_date"] = endDate
	}

	query += " ORDER BY appointment_date DESC LIMIT :limit OFFSET :offset"
	args["limit"] = limit
	args["offset"] = offset

	var appointments []Appointment
	namedStmt, err := db.PrepareNamedContext(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare statement"})
		return
	}
	defer namedStmt.Close()

	err = namedStmt.SelectContext(ctx, &appointments, args)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
		return
	}
	
	c.JSON(http.StatusOK, appointments)
}

func createAppointment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	
	var appt Appointment
	if err := c.ShouldBindJSON(&appt); err != nil {
		c.Error(fmt.Errorf("invalid JSON: %w", err))
		return
	}

	if err := validate.Struct(appt); err != nil {
		c.Error(fmt.Errorf("validation error: %w", err))
		return
	}

	appt.ClientID, _ = strconv.Atoi(userID.(string))
	appt.CreatedAt = time.Now()
	appt.UpdatedAt = time.Now()

	query := `
		INSERT INTO appointments (client_id, masseur_id, appointment_date, start_time, end_time, type, status, description, location, recurrence_rule, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
	`
	err := db.QueryRowContext(c.Request.Context(), query,
		appt.ClientID,
		appt.MasseurID,
		appt.AppointmentDate,
		appt.StartTime,
		appt.EndTime,
		appt.Type,
		appt.Status,
		appt.Description,
		appt.Location,
		appt.RecurrenceRule,
		appt.CreatedAt,
		appt.UpdatedAt,
	).Scan(&appt.ID)
	if err != nil {
		c.Error(fmt.Errorf("insert error: %w", err))
		return
	}

	logger.Info("Created appointment", zap.Int("appointment_id", appt.ID))
	c.JSON(http.StatusCreated, appt)
}

func updateAppointment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.Error(fmt.Errorf("invalid appointment ID: %s", idParam))
		return
	}

	var masseurID int
	err = db.QueryRow("SELECT masseur_id FROM appointments WHERE id=$1", id).Scan(&masseurID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}

	if strconv.Itoa(masseurID) != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only modify your own appointments"})
		return
	}

	var appt Appointment
	if err := c.ShouldBindJSON(&appt); err != nil {
		c.Error(fmt.Errorf("invalid JSON: %w", err))
		return
	}

	if err := validate.Struct(appt); err != nil {
		c.Error(fmt.Errorf("validation error: %w", err))
		return
	}
	
	appt.UpdatedAt = time.Now()

	query := `
		UPDATE appointments
		SET client_id=$1, masseur_id=$2, appointment_date=$3, start_time=$4, end_time=$5, type=$6, status=$7, description=$8, location=$9, recurrence_rule=$10, updated_at=$11
		WHERE id=$12
	`
	_, err = db.ExecContext(c.Request.Context(), query,
		appt.ClientID,
		appt.MasseurID,
		appt.AppointmentDate,
		appt.StartTime,
		appt.EndTime,
		appt.Type,
		appt.Status,
		appt.Description,
		appt.Location,
		appt.RecurrenceRule,
		appt.UpdatedAt,
		id,
	)
	if err != nil {
		c.Error(fmt.Errorf("update error: %w", err))
		return
	}

	appt.ID = id
	logger.Info("Updated appointment", zap.Int("appointment_id", appt.ID))
	c.JSON(http.StatusOK, appt)
}

func deleteAppointment(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.Error(fmt.Errorf("invalid appointment ID: %s", idParam))
		return
	}

	query := `DELETE FROM appointments WHERE id=$1`
	_, err = db.ExecContext(c.Request.Context(), query, id)
	if err != nil {
		c.Error(fmt.Errorf("delete error: %w", err))
		return
	}

	logger.Info("Deleted appointment", zap.Int("appointment_id", id))
	c.JSON(http.StatusOK, gin.H{"message": "Appointment deleted successfully"})
}

func fetchUserDetails(userID string) (string, string, error) {
	apiKey := config.ClerkSecretKey
	url := fmt.Sprintf("http://api.clerk.dev/v1/users/%s", userID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", "", err
	}
	req.Header.Set("Authorization", "Bearer " + apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("failed to fetch user details: %s", resp.Status)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", "", err
	}

	var userData struct {
		EmailAddresses []struct {
			EmailAddress string `json:"email_address"`
		} `json:"email_addresses"`
		PublicMetadata struct {
			Role string `json:"role"`
		} `json:"public_metadata"`
	}

	if err := json.Unmarshal(body, &userData); err != nil {
		return "", "", err
	}

	email := ""
	if len(userData.EmailAddresses) > 0 {
		email = userData.EmailAddresses[0].EmailAddress
	}

	role := userData.PublicMetadata.Role

	return email, role, nil
}

func ClerkMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}
		token := tokenParts[1]

		session, err := clerkClient.VerifyToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		userID := session.Claims.Subject

		email, role, err := fetchUserDetails(userID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to fetch user details"})
			c.Abort()
			return
		}

		c.Set("user_id", userID)
		c.Set("user_email", email)
		c.Set("user_role", role)

		c.Next()
	}
}

func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user role type"})
			c.Abort()
			return
		}

		for _, allowed := range allowedRoles {
			if roleStr == allowed {
				c.Next()
				return
			}
		}
		
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		c.Abort()
	}
}

func RequestLoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		latency := time.Since(start)
		status := c.Writer.Status()
		logger.Info("HTTP request", zap.Int("status", status), zap.String("method", c.Request.Method), zap.String("path", c.Request.URL.Path), zap.Duration("latency", latency),)
	}
}

func ErrorHandlingMiddleware() gin.HandlerFunc {
	return func (c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			for _, e := range c.Errors {
				logger.Error("Unhandled error", zap.Error(e.Err))
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": c.Errors.Last().Error()})
		}
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.Writer.Header().Set("Access-Control-Allow-Origin", "*") // Use a specific domain in production
		context.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		context.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		context.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
		if context.Request.Method == "OPTIONS" {
			context.AbortWithStatus(204)
			return
		}
		context.Next()
	}
}
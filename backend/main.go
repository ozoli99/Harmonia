package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Appointment struct {
	ID          int       `db:"id" json:"id"`
	Provider    string    `db:"provider" json:"provider"`
	Customer    string    `db:"customer" json:"customer"`
	Date        time.Time `db:"date" json:"date"`
	StartTime   string    `db:"start_time" json:"startTime"`
	EndTime     string    `db:"end_time" json:"endTime"`
	Type        string    `db:"type" json:"type"`
	Status      string    `db:"status" json:"status"`
	Description string    `db:"description" json:"description"`
	Location    string    `db:"location" json:"location"`
	CreatedAt   time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt   time.Time `db:"updated_at" json:"updatedAt"`
}

var db *sql.DB

func initDB() {
	connStr := "user=postgres password=COMPUTERScience99@ dbname=harmonia sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	log.Println("Connected to harmonia database successfully.")
}

func main() {
	initDB()

	router := gin.Default()
	router.Use(CORSMiddleware())

	router.GET("/api/appointments", getAppointments)

	router.Run(":3000")
}

func getAppointments(c *gin.Context) {
	rows, err := db.Query(`
		SELECT id, client_id, masseur_id, appointment_date, start_time, end_time, type, status, description, location, recurrence_rule, created_at, updated_at 
		FROM appointments
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var appointments []struct {
		ID             int
		ClientID       int
		MasseurID      int
		AppointmentDate string
		StartTime      string
		EndTime        string
		Type           string
		Status         string
		Description    string
		Location       string
		RecurrenceRule string
		CreatedAt      string
		UpdatedAt      string
	}

	for rows.Next() {
		var appt struct {
			ID             int
			ClientID       int
			MasseurID      int
			AppointmentDate string
			StartTime      string
			EndTime        string
			Type           string
			Status         string
			Description    string
			Location       string
			RecurrenceRule string
			CreatedAt      string
			UpdatedAt      string
		}
		err := rows.Scan(&appt.ID, &appt.ClientID, &appt.MasseurID, &appt.AppointmentDate, &appt.StartTime, &appt.EndTime, &appt.Type, &appt.Status, &appt.Description, &appt.Location, &appt.RecurrenceRule, &appt.CreatedAt, &appt.UpdatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		appointments = append(appointments, appt)
	}

	c.JSON(http.StatusOK, appointments)
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
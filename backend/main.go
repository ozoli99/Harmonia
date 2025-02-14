package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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

func main() {
	router := gin.Default()

	router.Use(CORSMiddleware())

	router.GET("/api/appointments", getAppointments)

	router.Run(":3000")
}

func getAppointments(context *gin.Context) {
	appointments := []gin.H{
		{"id": 1, "provider": "Masseur A", "customer": "Client A", "formattedTime": "14:00", "status": "confirmed"},
		{"id": 2, "provider": "Masseur B", "customer": "Client B", "formattedTime": "15:30", "status": "pending"},
		{"id": 3, "provider": "Masseur A", "customer": "Client A", "formattedTime": "15:00", "status": "confirmed"},
		{"id": 4, "provider": "Masseur A", "customer": "Client A", "formattedTime": "16:00", "status": "confirmed"},
	}
	context.JSON(http.StatusOK, appointments)
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
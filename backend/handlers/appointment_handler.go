package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/ozoli99/Harmonia/db"
	"github.com/ozoli99/Harmonia/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

type AppointmentHandler struct {
	Repo      db.AppointmentRepository
	Validator *validator.Validate
	Logger    *zap.Logger
}

func NewAppointmentHandler(repo db.AppointmentRepository, logger *zap.Logger) *AppointmentHandler {
	return &AppointmentHandler{
		Repo:      repo,
		Validator: validator.New(),
		Logger:    logger,
	}
}

func (h *AppointmentHandler) GetAppointments(c *gin.Context) {
	ctx := c.Request.Context()

	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}
	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	filters := map[string]string{
		"status":     c.Query("status"),
		"client_id":  c.Query("client_id"),
		"masseur_id": c.Query("masseur_id"),
	}

	appointments, err := h.Repo.GetAll(ctx, filters, limit, offset)
	if err != nil {
		h.Logger.Error("Failed to get appointments", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get appointments"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

func (h *AppointmentHandler) CreateAppointment(c *gin.Context) {
	userIDIfc, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID, ok := userIDIfc.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user id type"})
		return
	}

	var status string
	if err := h.Repo.GetSubscriptionStatus(c.Request.Context(), userID, &status); err != nil || status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Active subscription required"})
		return
	}
	
	var appt models.Appointment
	if err := c.ShouldBindJSON(&appt); err != nil {
		c.Error(fmt.Errorf("invalid JSON: %w", err))
		return
	}

	if err := h.Validator.Struct(appt); err != nil {
		c.Error(fmt.Errorf("validation error: %w", err))
		return
	}
	
	clientID, err := strconv.Atoi(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID conversion error"})
		return
	}

	appt.ClientID = clientID
	appt.CreatedAt = time.Now()
	appt.UpdatedAt = time.Now()

	err = h.Repo.Create(c.Request.Context(), &appt)
	if err != nil {
		c.Error(fmt.Errorf("insert error: %w", err))
		return
	}

	h.Logger.Info("Created appointment", zap.Int("appointment_id", appt.ID))
	c.JSON(http.StatusCreated, appt)
}

func (h *AppointmentHandler) UpdateAppointment(c *gin.Context) {
	userIDIfc, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID, ok := userIDIfc.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user id type"})
		return
	}

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.Error(fmt.Errorf("invalid appointment ID: %s", idParam))
		return
	}

	var ownerID int
	if err := h.Repo.GetAppointmentOwner(c.Request.Context(), id, &ownerID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Appointment not found"})
		return
	}
	if strconv.Itoa(ownerID) != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only modify your own appointments"})
		return
	}

	var appt models.Appointment
	if err := c.ShouldBindJSON(&appt); err != nil {
		c.Error(fmt.Errorf("invalid JSON: %w", err))
		return
	}

	if err := h.Validator.Struct(appt); err != nil {
		c.Error(fmt.Errorf("validation error: %w", err))
		return
	}
	
	appt.UpdatedAt = time.Now()

	err = h.Repo.Update(c.Request.Context(), id, &appt)
	if err != nil {
		c.Error(fmt.Errorf("update error: %w", err))
		return
	}

	appt.ID = id
	h.Logger.Info("Updated appointment", zap.Int("appointment_id", appt.ID))
	c.JSON(http.StatusOK, appt)
}

func (h *AppointmentHandler) DeleteAppointment(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.Error(fmt.Errorf("invalid appointment ID: %s", idParam))
		return
	}

	err = h.Repo.Delete(c.Request.Context(), id)
	if err != nil {
		c.Error(fmt.Errorf("delete error: %w", err))
		return
	}

	h.Logger.Info("Deleted appointment", zap.Int("appointment_id", id))
	c.JSON(http.StatusOK, gin.H{"message": "Appointment deleted successfully"})
}
package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/account"
	"github.com/stripe/stripe-go/v81/accountlink"
	"github.com/stripe/stripe-go/v81/paymentintent"
	"github.com/stripe/stripe-go/v81/webhook"
	"go.uber.org/zap"

	"github.com/ozoli99/Harmonia/config"
)

type PaymentHandler struct {
	DB     *sqlx.DB
	Config *config.Config
	Logger *zap.Logger
}

func NewPaymentHandler(db *sqlx.DB, cfg *config.Config, logger *zap.Logger) *PaymentHandler {
	return &PaymentHandler{
		DB:     db,
		Config: cfg,
		Logger: logger,
	}
}

func (h *PaymentHandler) CreateMasseurStripeAccount(c *gin.Context) {
	userIDIfc, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDIfc.(string)

	var role string
	err := h.DB.Get(&role, "SELECT role FROM user_profiles WHERE id = $1", userID)
	if err != nil || role != "masseur" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only masseurs can create Stripe accounts"})
		return
	}
	
	accParams := &stripe.AccountParams{
		Type:    stripe.String("express"),
		Country: stripe.String("US"),
		Email:   stripe.String("masseur@example.com"),
	}
	acc, err := account.New(accParams)
	if err != nil {
		h.Logger.Error("Failed to create Stripe account", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Stripe account"})
		return
	}

	linkParams := &stripe.AccountLinkParams{
		Account:    stripe.String(acc.ID),
		RefreshURL: stripe.String("https://harmonia.com/retry"),
		ReturnURL:  stripe.String("https://harmonia.com/success"),
		Type:       stripe.String("account_onboarding"),
	}
	link, err := accountlink.New(linkParams)
	if err != nil {
		h.Logger.Error("Failed to create Stripe onboarding link", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Stripe onboarding link"})
		return
	}

	_, err = h.DB.Exec("UPDATE user_profiles SET stripe_account_id = $1 WHERE id = $2", acc.ID, userID)
	if err != nil {
		h.Logger.Error("Failed to save Stripe account ID", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save Stripe account ID"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"onboarding_url": link.URL})
}

func (h *PaymentHandler) CreatePaymentIntent(c *gin.Context) {
	var request struct {
		AppointmentID int64  `json:"appointment_id" binding:"required"`
		Amount        int64  `json:"amount" binding:"required"`
		Currency      string `json:"currency"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if request.Currency == "" {
		request.Currency = "usd"
	}

	var masseurStripeID string
	err := h.DB.Get(&masseurStripeID, `
		SELECT u.stripe_account_id 
		FROM appointments a 
		JOIN user_profiles u ON a.masseur_id = u.id 
		WHERE a.id = $1`, request.AppointmentID)
    if err != nil || masseurStripeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Masseur not onboarded with Stripe"})
		return
	}

	params := &stripe.PaymentIntentParams{
		Amount:               stripe.Int64(request.Amount),
		Currency:             stripe.String(request.Currency),
		ApplicationFeeAmount: stripe.Int64(request.Amount / 10),
		TransferData: &stripe.PaymentIntentTransferDataParams{
			Destination: stripe.String(masseurStripeID),
		},
		Metadata: map[string]string{
			"appointment_id": strconv.FormatInt(request.AppointmentID, 10),
		},
	}
	intent, err := paymentintent.New(params)
	if err != nil {
		h.Logger.Error("Stripe error", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create payment intent"})
		return
	}

	_, err = h.DB.Exec(`
		INSERT INTO payments (appointment_id, amount, currency, status, stripe_payment_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $6)
	`, request.AppointmentID, request.Amount, request.Currency, "pending", intent.ID, time.Now())

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store payment record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"client_secret": intent.ClientSecret})
}

func (h *PaymentHandler) HandleStripeWebhook(c *gin.Context) {
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	endpointSecret := h.Config.StripeWebhookSecret
	event, err := webhook.ConstructEvent(payload, c.GetHeader("Stripe-Signature"), endpointSecret)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid webhook signature"})
		return
	}

	switch event.Type {
	case "payment_intent.succeeded":
		var intent stripe.PaymentIntent
		if err := json.Unmarshal(event.Data.Raw, &intent); err == nil {
			h.handleSuccessfulPayment(intent)
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *PaymentHandler) handleSuccessfulPayment(intent stripe.PaymentIntent) {
	appointmentID := intent.Metadata["appointment_id"]
	_, err := h.DB.Exec(`
		UPDATE payments
		SET status = 'paid', stripe_payment_id = $1, updated_at = NOW()
		WHERE appointment_id = $2
	`, intent.ID, appointmentID)

	if err != nil {
		h.Logger.Error("Failed to update payment record", zap.Error(err))
	} else {
		h.Logger.Info("Payment successful for appointment", zap.String("appointment_id", appointmentID))
	}
}
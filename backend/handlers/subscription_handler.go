package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/checkout/session"
	"github.com/stripe/stripe-go/v81/webhook"
	"go.uber.org/zap"

	"github.com/ozoli99/Harmonia/config"
)

type SubscriptionHandler struct {
	DB     *sqlx.DB
	Config *config.Config
	Logger *zap.Logger
}

func NewSubscriptionHandler(db *sqlx.DB, cfg *config.Config, logger *zap.Logger) *SubscriptionHandler {
	return &SubscriptionHandler{
		DB:     db,
		Config: cfg,
		Logger: logger,
	}
}

func (h *SubscriptionHandler) HandleStripeSubscriptionWebhook(c *gin.Context) {
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
	case "checkout.session.completed":
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err == nil {
			h.handleSubscriptionSuccess(session)
		}

	case "customer.subscription.deleted":
		var sub stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &sub); err == nil {
			h.handleSubscriptionCancellation(sub)
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *SubscriptionHandler) handleSubscriptionSuccess(session stripe.CheckoutSession) {
	userID := session.Metadata["user_id"]
	subID := session.Subscription.ID

	if session.PaymentStatus != "paid" {
		h.Logger.Info("Subscription payment not completed", zap.String("user_id", userID))
		return
	}

	_, err := h.DB.ExecContext(context.Background(), `
		UPDATE subscriptions
		SET status = 'active', stripe_subscription_id = $1, updated_at = NOW()
		WHERE user_id = $2
	`, subID, userID)

	if err != nil {
		h.Logger.Error("Failed to activate subscription", zap.Error(err))
	} else {
		h.Logger.Info("Subscription activated", zap.String("user_id", userID))
	}
}

func (h *SubscriptionHandler) handleSubscriptionCancellation(sub stripe.Subscription) {
	_, err := h.DB.ExecContext(context.Background(), `
		UPDATE subscriptions
		SET status = 'canceled', updated_at = NOW()
		WHERE stripe_subscription_id = $1
	`, sub.ID)

	if err != nil {
		h.Logger.Error("Failed to cancel subscription", zap.Error(err))
	} else {
		h.Logger.Info("Subscription canceled", zap.String("subscription_id", sub.ID))
	}
}

func (h *SubscriptionHandler) CreateSubscription(c *gin.Context) {
	var request struct {
		PlanID string `json:"plan_id" binding:"required"` // Stripe price_id
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDIfc, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := userIDIfc.(string)

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		Mode:               stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(request.PlanID),
				Quantity: stripe.Int64(1),
			},
		},
		SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
			TrialPeriodDays: stripe.Int64(7),
		},
		AutomaticTax: &stripe.CheckoutSessionAutomaticTaxParams{
			Enabled: stripe.Bool(true),
		},
		SuccessURL: stripe.String(h.Config.StripeSuccessURL),
		CancelURL:  stripe.String(h.Config.StripeCancelURL),
		Metadata: map[string]string{
			"user_id": userID,
		},
	}

	session, err := session.New(params)
	if err != nil {
		h.Logger.Error("Stripe error", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Stripe session"})
		return
	}

	_, err = h.DB.ExecContext(c.Request.Context(), `
		INSERT INTO subscriptions (user_id, stripe_session_id, plan_id, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
	`, userID, session.ID, request.PlanID, "pending")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store subscription record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"checkout_url": session.URL})
}
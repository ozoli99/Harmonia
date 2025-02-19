package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ozoli99/Harmonia/config"
	"go.uber.org/zap"

	"github.com/clerkinc/clerk-sdk-go/clerk"
)

var ClerkClient clerk.Client

func InitializeClerk(cfg *config.Config, logger *zap.Logger) {
	var err error
	ClerkClient, err = clerk.NewClient(cfg.ClerkSecretKey)
	if err != nil {
		logger.Fatal("Error initializing Clerk client", zap.Error(err))
	}
}

func ClerkMiddleware(cfg *config.Config) gin.HandlerFunc {
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

		session, err := ClerkClient.VerifyToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		userID := session.Claims.Subject

		email, role, err := fetchUserDetails(cfg, userID)
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

func fetchUserDetails(cfg *config.Config, userID string) (string, string, error) {
	apiKey := cfg.ClerkSecretKey
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

	body, err := io.ReadAll(resp.Body)
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
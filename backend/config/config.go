package config

import (
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Port                string `yaml:"Port"`
	DatabaseURL         string `yaml:"DatabaseURL"`
	ClerkSecretKey      string `yaml:"ClerkSecretKey"`
	StripeSecretKey     string `yaml:"StripeSecretKey"`
	StripeWebhookSecret string `yaml:"StripeWebhookSecret"`
	StripeSuccessURL    string `yaml:"StripeSuccessURL"`
	StripeCancelURL     string `yaml:"StripeCancelURL"`
}

func LoadConfig(filename string) (*Config, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}
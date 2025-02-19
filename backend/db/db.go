package db

import (
	"time"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

func NewPostgresDB(databaseURL string, logger *zap.Logger) *sqlx.DB {
	db, err := sqlx.Connect("postgres", databaseURL)
	if err != nil {
		logger.Fatal("Error opening database", zap.Error(err))
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)
	return db
}
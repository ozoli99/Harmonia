package db

import (
	"context"
	"fmt"
	"strconv"

	"github.com/ozoli99/Harmonia/models"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

type AppointmentRepository interface {
	GetAll(ctx context.Context, filters map[string]string, limit, offset int) ([]models.Appointment, error)
	GetAppointmentOwner(ctx context.Context, appointmentID int, ownerID *int) error
	GetSubscriptionStatus(ctx context.Context, userID string, status *string) error
	Create(ctx context.Context, appt *models.Appointment) error
	Update(ctx context.Context, id int, appt *models.Appointment) error
	Delete(ctx context.Context, id int) error
}

type PostgresAppointmentRepository struct {
	db     *sqlx.DB
	logger *zap.Logger
}

func NewAppointmentRepository(db *sqlx.DB, logger *zap.Logger) AppointmentRepository {
	return &PostgresAppointmentRepository{
		db:     db,
		logger: logger,
	}
}

func (r *PostgresAppointmentRepository) GetAll(ctx context.Context, filters map[string]string, limit, offset int) ([]models.Appointment, error) {
	query := `
		SELECT id, client_id, masseur_id, appointment_date, start_time, end_time, type, status, description, location, recurrence_rule, created_at, updated_at 
		FROM appointments
		WHERE 1=1
	`

	args := map[string]interface{}{}

	if status, ok := filters["status"]; ok && status != "" {
		query += " AND status = :status"
		args["status"] = status
	}
	if clientID, ok := filters["client_id"]; ok && clientID != "" {
		id, err := strconv.Atoi(clientID)
		if err == nil {
			query += " AND client_id = :client_id"
			args["client_id"] = id
		}
	}
	if masseurID, ok := filters["masseur_id"]; ok && masseurID != "" {
		id, err := strconv.Atoi(masseurID)
		if err == nil {
			query += " AND masseur_id = :masseur_id"
			args["masseur_id"] = id
		}
	}
	if startDate, ok := filters["start_date"]; ok && startDate != "" {
		query += " AND appointment_date >= :start_date"
		args["start_date"] = startDate
	}
	if endDate, ok := filters["end_date"]; ok && endDate != "" {
		query += " AND appointment_date <= :end_date"
		args["end_date"] = endDate
	}

	query += " ORDER BY appointment_date DESC LIMIT :limit OFFSET :offset"
	args["limit"] = limit
	args["offset"] = offset

	var appointments []models.Appointment
	namedStmt, err := r.db.PrepareNamedContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("prepare statement error: %w", err)
	}
	defer namedStmt.Close()

	err = namedStmt.SelectContext(ctx, &appointments, args)
	if err != nil {
		return nil, fmt.Errorf("select error: %w", err)
	}
	
	return appointments, nil
}

func (r *PostgresAppointmentRepository) GetAppointmentOwner(ctx context.Context, appointmentID int, ownerID *int) error {
	query := `SELECT client_id FROM appointments WHERE id=$1`
	return r.db.GetContext(ctx, ownerID, query, appointmentID)
}

func (r *PostgresAppointmentRepository) GetSubscriptionStatus(ctx context.Context, userID string, status *string) error {
	query := `SELECT status FROM subscriptions WHERE user_id = $1`
	return r.db.GetContext(ctx, status, query, userID)
}

func (r *PostgresAppointmentRepository) Create(ctx context.Context, appt *models.Appointment) error {
	query := `
		INSERT INTO appointments (client_id, masseur_id, appointment_date, start_time, end_time, type, status, description, location, recurrence_rule, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING id
	`
	return r.db.QueryRowContext(ctx, query,
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
}

func (r *PostgresAppointmentRepository) Update(ctx context.Context, id int, appt *models.Appointment) error {
	query := `
		UPDATE appointments
		SET client_id=$1, masseur_id=$2, appointment_date=$3, start_time=$4, end_time=$5, type=$6, status=$7, description=$8, location=$9, recurrence_rule=$10, updated_at=$11
		WHERE id=$12
	`
	_, err := r.db.ExecContext(ctx, query,
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
	return err
}

func (r *PostgresAppointmentRepository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM appointments WHERE id=$1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
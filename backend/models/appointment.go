package models

import "time"

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
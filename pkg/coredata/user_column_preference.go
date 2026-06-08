// Copyright (c) 2026 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package coredata

import (
	"context"
	"encoding/json"
	"fmt"
	"maps"
	"time"

	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
	"go.probo.inc/probo/pkg/gid"
)

type UserColumnPreference struct {
	ID              gid.GID                `db:"id"`
	ProfileID       gid.GID                `db:"profile_id"`
	ReportType      MonitoringReportType   `db:"report_type"`
	SelectedColumns []string               `db:"-"`
	CreatedAt       time.Time              `db:"created_at"`
	UpdatedAt       time.Time              `db:"updated_at"`
}

func (u *UserColumnPreference) LoadByProfileAndReportType(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
	profileID gid.GID,
	reportType MonitoringReportType,
) error {
	query := fmt.Sprintf(`
		SELECT
			id,
			profile_id,
			report_type,
			selected_columns,
			created_at,
			updated_at
		FROM
			user_column_preferences
		WHERE
			%s
			AND profile_id = @profile_id
			AND report_type = @report_type
		`,
		scope.SQLFragment(),
	)

	args := pgx.StrictNamedArgs{
		"profile_id":  profileID,
		"report_type": reportType,
	}

	maps.Copy(args, scope.SQLArguments())

	var selectedColumnsJSON json.RawMessage

	err := conn.
		QueryRow(ctx, query, args).
		Scan(
			&u.ID,
			&u.ProfileID,
			&u.ReportType,
			&selectedColumnsJSON,
			&u.CreatedAt,
			&u.UpdatedAt,
		)
	if err != nil {
		if err == pgx.ErrNoRows {
			return ErrResourceNotFound
		}

		return fmt.Errorf("cannot load user column preference: %w", err)
	}

	if err := json.Unmarshal(selectedColumnsJSON, &u.SelectedColumns); err != nil {
		return fmt.Errorf("cannot unmarshal selected columns: %w", err)
	}

	return nil
}

func (u *UserColumnPreference) Upsert(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
) error {
	selectedColumnsJSON, err := json.Marshal(u.SelectedColumns)
	if err != nil {
		return fmt.Errorf("cannot marshal selected columns: %w", err)
	}

	query := `
		INSERT INTO user_column_preferences (
			id,
			tenant_id,
			profile_id,
			report_type,
			selected_columns,
			created_at,
			updated_at
		) VALUES (
			@id,
			@tenant_id,
			@profile_id,
			@report_type,
			@selected_columns,
			NOW(),
			NOW()
		)
		ON CONFLICT (tenant_id, profile_id, report_type)
		DO UPDATE SET
			selected_columns = @selected_columns,
			updated_at = NOW()
		RETURNING
			created_at, updated_at
		`

	args := pgx.StrictNamedArgs{
		"id":               u.ID,
		"profile_id":       u.ProfileID,
		"report_type":      u.ReportType,
		"selected_columns": selectedColumnsJSON,
	}

	maps.Copy(args, scope.SQLArguments())

	return conn.
		QueryRow(ctx, query, args).
		Scan(&u.CreatedAt, &u.UpdatedAt)
}

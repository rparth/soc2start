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
	"go.probo.inc/probo/pkg/iam/policy"
	"go.probo.inc/probo/pkg/page"
)

type (
	MonitoringReport struct {
		ID             gid.GID              `db:"id"`
		OrganizationID gid.GID              `db:"organization_id"`
		ReportType     MonitoringReportType  `db:"report_type"`
		Name           string               `db:"name"`
		FileID         *gid.GID             `db:"file_id"`
		UploaderID     *gid.GID             `db:"uploader_id"`
		RowCount       int                  `db:"row_count"`
		Summary        json.RawMessage      `db:"summary"`
		CreatedAt      time.Time            `db:"created_at"`
		UpdatedAt      time.Time            `db:"updated_at"`
	}

	MonitoringReports []*MonitoringReport
)

func (m *MonitoringReport) CursorKey(field MonitoringReportOrderField) page.CursorKey {
	switch field {
	case MonitoringReportOrderFieldCreatedAt:
		return page.NewCursorKey(m.ID, m.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", field))
}

func (m *MonitoringReport) AuthorizationAttributes(
	ctx context.Context,
	conn pg.Querier,
	resourceIDs []gid.GID,
) (policy.AttributesByID, error) {
	q := `SELECT id, organization_id FROM monitoring_reports WHERE id = ANY(@resource_ids::text[])`

	args := pgx.StrictNamedArgs{
		"resource_ids": resourceIDs,
	}

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return nil, fmt.Errorf("cannot query authorization attributes: %w", err)
	}

	defer rows.Close()

	attrsByID := make(policy.AttributesByID)

	for rows.Next() {
		var id, organizationID gid.GID

		if err := rows.Scan(&id, &organizationID); err != nil {
			return nil, fmt.Errorf("cannot scan authorization attributes: %w", err)
		}

		attrsByID[id] = policy.Attributes{
			"organization_id": organizationID.String(),
		}
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("cannot iterate authorization attributes: %w", err)
	}

	return attrsByID, nil
}

func (m *MonitoringReport) LoadByID(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
	reportID gid.GID,
) error {
	q := `
SELECT
	id,
	organization_id,
	report_type,
	name,
	file_id,
	uploader_id,
	row_count,
	summary,
	created_at,
	updated_at
FROM
	monitoring_reports
WHERE
	%s
	AND id = @report_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"report_id": reportID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query monitoring report: %w", err)
	}

	report, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[MonitoringReport])
	if err != nil {
		return fmt.Errorf("cannot collect monitoring report: %w", err)
	}

	*m = report

	return nil
}

func (ms *MonitoringReports) CountByOrganizationID(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
	organizationID gid.GID,
	filter *MonitoringReportFilter,
) (int, error) {
	q := `
SELECT
	COUNT(id)
FROM
	monitoring_reports
WHERE
	%s
	AND organization_id = @organization_id
	AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), filter.SQLFragment())

	args := pgx.StrictNamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, filter.SQLArguments())

	row := conn.QueryRow(ctx, q, args)

	var count int

	err := row.Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("cannot count monitoring reports: %w", err)
	}

	return count, nil
}

func (ms *MonitoringReports) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[MonitoringReportOrderField],
	filter *MonitoringReportFilter,
) error {
	q := `
SELECT
	id,
	organization_id,
	report_type,
	name,
	file_id,
	uploader_id,
	row_count,
	summary,
	created_at,
	updated_at
FROM
	monitoring_reports
WHERE
	%s
	AND organization_id = @organization_id
	AND %s
	AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), filter.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"organization_id": organizationID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, filter.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query monitoring reports: %w", err)
	}

	reports, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[MonitoringReport])
	if err != nil {
		return fmt.Errorf("cannot collect monitoring reports: %w", err)
	}

	*ms = reports

	return nil
}

func (m *MonitoringReport) Insert(
	ctx context.Context,
	conn pg.Tx,
	scope Scoper,
) error {
	q := `
INSERT INTO monitoring_reports (
	id,
	tenant_id,
	organization_id,
	report_type,
	name,
	file_id,
	uploader_id,
	row_count,
	summary,
	created_at,
	updated_at
) VALUES (
	@id,
	@tenant_id,
	@organization_id,
	@report_type,
	@name,
	@file_id,
	@uploader_id,
	@row_count,
	@summary,
	@created_at,
	@updated_at
)
`

	args := pgx.StrictNamedArgs{
		"id":              m.ID,
		"tenant_id":       scope.GetTenantID(),
		"organization_id": m.OrganizationID,
		"report_type":     m.ReportType,
		"name":            m.Name,
		"file_id":         m.FileID,
		"uploader_id":     m.UploaderID,
		"row_count":       m.RowCount,
		"summary":         m.Summary,
		"created_at":      m.CreatedAt,
		"updated_at":      m.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot insert monitoring report: %w", err)
	}

	return nil
}

func (m *MonitoringReport) Delete(
	ctx context.Context,
	conn pg.Tx,
	scope Scoper,
) error {
	q := `
DELETE FROM monitoring_reports
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": m.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot delete monitoring report: %w", err)
	}

	return nil
}

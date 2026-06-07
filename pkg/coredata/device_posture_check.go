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
	"time"

	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
	"go.probo.inc/probo/pkg/gid"
)

type (
	DevicePostureCheck struct {
		ID         gid.GID            `db:"id"`
		DeviceID   gid.GID            `db:"device_id"`
		CheckKey   string             `db:"check_key"`
		Status     PostureCheckStatus `db:"status"`
		Evidence   json.RawMessage    `db:"evidence"`
		ObservedAt time.Time          `db:"observed_at"`
		CreatedAt  time.Time          `db:"created_at"`
	}

	DevicePostureChecks []*DevicePostureCheck
)

func (dpc *DevicePostureChecks) LoadByDeviceID(
	ctx context.Context,
	conn pg.Querier,
	deviceID gid.GID,
) error {
	q := `
SELECT
	id,
	device_id,
	check_key,
	status,
	evidence,
	observed_at,
	created_at
FROM
	device_posture_checks
WHERE
	device_id = @device_id
ORDER BY
	check_key ASC
`

	args := pgx.StrictNamedArgs{"device_id": deviceID}

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query device posture checks: %w", err)
	}

	checks, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[DevicePostureCheck])
	if err != nil {
		return fmt.Errorf("cannot collect device posture checks: %w", err)
	}

	*dpc = checks

	return nil
}

func (dpc *DevicePostureCheck) Upsert(
	ctx context.Context,
	conn pg.Tx,
	tenantID gid.TenantID,
) error {
	q := `
INSERT INTO device_posture_checks (
	id,
	tenant_id,
	device_id,
	check_key,
	status,
	evidence,
	observed_at,
	created_at
) VALUES (
	@id,
	@tenant_id,
	@device_id,
	@check_key,
	@status,
	@evidence,
	@observed_at,
	@created_at
)
ON CONFLICT (device_id, check_key) DO UPDATE SET
	status = EXCLUDED.status,
	evidence = EXCLUDED.evidence,
	observed_at = EXCLUDED.observed_at
`

	args := pgx.StrictNamedArgs{
		"id":          dpc.ID,
		"tenant_id":   tenantID,
		"device_id":   dpc.DeviceID,
		"check_key":   dpc.CheckKey,
		"status":      dpc.Status,
		"evidence":    dpc.Evidence,
		"observed_at": dpc.ObservedAt,
		"created_at":  dpc.CreatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot upsert device posture check: %w", err)
	}

	return nil
}

func (dpc *DevicePostureChecks) DeleteByDeviceID(
	ctx context.Context,
	conn pg.Tx,
	deviceID gid.GID,
) error {
	q := `DELETE FROM device_posture_checks WHERE device_id = @device_id`

	args := pgx.StrictNamedArgs{"device_id": deviceID}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot delete device posture checks: %w", err)
	}

	return nil
}

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
	Device struct {
		ID              gid.GID       `db:"id"`
		OrganizationID  gid.GID       `db:"organization_id"`
		ProfileID       *gid.GID      `db:"profile_id"`
		HardwareUUID    string        `db:"hardware_uuid"`
		SerialNumber    *string       `db:"serial_number"`
		Hostname        string        `db:"hostname"`
		Platform        string        `db:"platform"`
		OSVersion       string        `db:"os_version"`
		AgentVersion    string        `db:"agent_version"`
		APIKeyHash      string        `db:"api_key_hash"`
		Status          DeviceStatus  `db:"status"`
		LastHeartbeatAt *time.Time    `db:"last_heartbeat_at"`
		EnrolledAt      time.Time     `db:"enrolled_at"`
		CreatedAt       time.Time     `db:"created_at"`
		UpdatedAt       time.Time     `db:"updated_at"`
	}

	Devices []*Device
)

func (d *Device) CursorKey(field DeviceOrderField) page.CursorKey {
	switch field {
	case DeviceOrderFieldEnrolledAt:
		return page.NewCursorKey(d.ID, d.EnrolledAt)
	case DeviceOrderFieldHostname:
		return page.NewCursorKey(d.ID, d.Hostname)
	}

	panic(fmt.Sprintf("unsupported order by: %s", field))
}

func (d *Device) AuthorizationAttributes(
	ctx context.Context,
	conn pg.Querier,
	resourceIDs []gid.GID,
) (policy.AttributesByID, error) {
	q := `SELECT id, organization_id FROM devices WHERE id = ANY(@resource_ids::text[])`

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

func (d *Device) LoadByID(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
	deviceID gid.GID,
) error {
	q := `
SELECT
	id,
	organization_id,
	profile_id,
	hardware_uuid,
	serial_number,
	hostname,
	platform,
	os_version,
	agent_version,
	api_key_hash,
	status,
	last_heartbeat_at,
	enrolled_at,
	created_at,
	updated_at
FROM
	devices
WHERE
	%s
	AND id = @device_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"device_id": deviceID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query device: %w", err)
	}

	device, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Device])
	if err != nil {
		return fmt.Errorf("cannot collect device: %w", err)
	}

	*d = device

	return nil
}

func (d *Device) LoadByHardwareUUID(
	ctx context.Context,
	conn pg.Querier,
	organizationID gid.GID,
	hardwareUUID string,
) error {
	q := `
SELECT
	id,
	organization_id,
	profile_id,
	hardware_uuid,
	serial_number,
	hostname,
	platform,
	os_version,
	agent_version,
	api_key_hash,
	status,
	last_heartbeat_at,
	enrolled_at,
	created_at,
	updated_at
FROM
	devices
WHERE
	organization_id = @organization_id
	AND hardware_uuid = @hardware_uuid
LIMIT 1;
`

	args := pgx.StrictNamedArgs{
		"organization_id": organizationID,
		"hardware_uuid":   hardwareUUID,
	}

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query device by hardware uuid: %w", err)
	}

	device, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Device])
	if err != nil {
		return fmt.Errorf("cannot collect device: %w", err)
	}

	*d = device

	return nil
}

func (ds *Devices) CountByOrganizationID(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
	organizationID gid.GID,
	filter *DeviceFilter,
) (int, error) {
	q := `
SELECT
	COUNT(id)
FROM
	devices
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
		return 0, fmt.Errorf("cannot count devices: %w", err)
	}

	return count, nil
}

func (ds *Devices) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Querier,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[DeviceOrderField],
	filter *DeviceFilter,
) error {
	q := `
SELECT
	id,
	organization_id,
	profile_id,
	hardware_uuid,
	serial_number,
	hostname,
	platform,
	os_version,
	agent_version,
	api_key_hash,
	status,
	last_heartbeat_at,
	enrolled_at,
	created_at,
	updated_at
FROM
	devices
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
		return fmt.Errorf("cannot query devices: %w", err)
	}

	devices, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Device])
	if err != nil {
		return fmt.Errorf("cannot collect devices: %w", err)
	}

	*ds = devices

	return nil
}

func (d *Device) Insert(
	ctx context.Context,
	conn pg.Tx,
	scope Scoper,
) error {
	q := `
INSERT INTO devices (
	id,
	tenant_id,
	organization_id,
	profile_id,
	hardware_uuid,
	serial_number,
	hostname,
	platform,
	os_version,
	agent_version,
	api_key_hash,
	status,
	last_heartbeat_at,
	enrolled_at,
	created_at,
	updated_at
) VALUES (
	@id,
	@tenant_id,
	@organization_id,
	@profile_id,
	@hardware_uuid,
	@serial_number,
	@hostname,
	@platform,
	@os_version,
	@agent_version,
	@api_key_hash,
	@status,
	@last_heartbeat_at,
	@enrolled_at,
	@created_at,
	@updated_at
)
`

	args := pgx.StrictNamedArgs{
		"id":                d.ID,
		"tenant_id":         scope.GetTenantID(),
		"organization_id":   d.OrganizationID,
		"profile_id":        d.ProfileID,
		"hardware_uuid":     d.HardwareUUID,
		"serial_number":     d.SerialNumber,
		"hostname":          d.Hostname,
		"platform":          d.Platform,
		"os_version":        d.OSVersion,
		"agent_version":     d.AgentVersion,
		"api_key_hash":      d.APIKeyHash,
		"status":            d.Status,
		"last_heartbeat_at": d.LastHeartbeatAt,
		"enrolled_at":       d.EnrolledAt,
		"created_at":        d.CreatedAt,
		"updated_at":        d.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot insert device: %w", err)
	}

	return nil
}

func (d *Device) Update(
	ctx context.Context,
	conn pg.Tx,
	scope Scoper,
) error {
	q := `
UPDATE devices SET
	hostname = @hostname,
	platform = @platform,
	os_version = @os_version,
	agent_version = @agent_version,
	status = @status,
	last_heartbeat_at = @last_heartbeat_at,
	updated_at = @updated_at
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"id":                d.ID,
		"hostname":          d.Hostname,
		"platform":          d.Platform,
		"os_version":        d.OSVersion,
		"agent_version":     d.AgentVersion,
		"status":            d.Status,
		"last_heartbeat_at": d.LastHeartbeatAt,
		"updated_at":        d.UpdatedAt,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot update device: %w", err)
	}

	return nil
}

func (d *Device) ReEnroll(
	ctx context.Context,
	conn pg.Tx,
	scope Scoper,
) error {
	q := `
UPDATE devices SET
	profile_id = @profile_id,
	serial_number = @serial_number,
	hostname = @hostname,
	platform = @platform,
	os_version = @os_version,
	agent_version = @agent_version,
	api_key_hash = @api_key_hash,
	status = @status,
	last_heartbeat_at = @last_heartbeat_at,
	updated_at = @updated_at
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"id":                d.ID,
		"profile_id":        d.ProfileID,
		"serial_number":     d.SerialNumber,
		"hostname":          d.Hostname,
		"platform":          d.Platform,
		"os_version":        d.OSVersion,
		"agent_version":     d.AgentVersion,
		"api_key_hash":      d.APIKeyHash,
		"status":            d.Status,
		"last_heartbeat_at": d.LastHeartbeatAt,
		"updated_at":        d.UpdatedAt,
	}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot re-enroll device: %w", err)
	}

	return nil
}

func (d *Device) Delete(
	ctx context.Context,
	conn pg.Tx,
	scope Scoper,
) error {
	q := `
DELETE FROM devices
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": d.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot delete device: %w", err)
	}

	return nil
}

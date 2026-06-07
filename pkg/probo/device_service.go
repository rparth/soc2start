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

package probo

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
	"go.probo.inc/probo/pkg/coredata"
	"go.probo.inc/probo/pkg/gid"
	"go.probo.inc/probo/pkg/page"
	"go.probo.inc/probo/pkg/securetoken"
)

type DeviceService struct {
	svc *Service
}

type EnrollmentTokenClaims struct {
	OrganizationID gid.GID `json:"oid"`
	ProfileID      gid.GID `json:"pid"`
}

func (s *DeviceService) GenerateEnrollmentToken(
	organizationID gid.GID,
	profileID gid.GID,
) (string, error) {
	claims := EnrollmentTokenClaims{
		OrganizationID: organizationID,
		ProfileID:      profileID,
	}

	payload, err := json.Marshal(claims)
	if err != nil {
		return "", fmt.Errorf("cannot marshal enrollment claims: %w", err)
	}

	encoded := base64.RawURLEncoding.EncodeToString(payload)

	token, err := securetoken.Sign(encoded, s.svc.tokenSecret)
	if err != nil {
		return "", fmt.Errorf("cannot sign enrollment token: %w", err)
	}

	return token, nil
}

func (s *DeviceService) parseEnrollmentToken(token string) (*EnrollmentTokenClaims, error) {
	encoded, err := securetoken.Verify(token, s.svc.tokenSecret)
	if err != nil {
		return nil, fmt.Errorf("invalid enrollment token: %w", err)
	}

	payload, err := base64.RawURLEncoding.DecodeString(encoded)
	if err != nil {
		return nil, fmt.Errorf("cannot decode enrollment token payload: %w", err)
	}

	var claims EnrollmentTokenClaims
	if err := json.Unmarshal(payload, &claims); err != nil {
		return nil, fmt.Errorf("cannot parse enrollment claims: %w", err)
	}

	return &claims, nil
}

func (s *DeviceService) generateAPIKey() (raw string, hash string, err error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", "", fmt.Errorf("cannot generate random bytes: %w", err)
	}

	raw = hex.EncodeToString(b)
	h := sha256.Sum256([]byte(raw))
	hash = hex.EncodeToString(h[:])

	return raw, hash, nil
}

func (s *DeviceService) verifyAPIKey(raw string, hash string) bool {
	h := sha256.Sum256([]byte(raw))

	return hex.EncodeToString(h[:]) == hash
}

func (s *DeviceService) Enroll(
	ctx context.Context,
	enrollmentToken string,
	hardwareUUID string,
	serialNumber *string,
	hostname string,
	platform string,
	osVersion string,
	agentVersion string,
) (*coredata.Device, string, error) {
	claims, err := s.parseEnrollmentToken(enrollmentToken)
	if err != nil {
		return nil, "", fmt.Errorf("cannot parse enrollment token: %w", err)
	}

	rawKey, keyHash, err := s.generateAPIKey()
	if err != nil {
		return nil, "", err
	}

	scope := coredata.NewScopeFromObjectID(claims.OrganizationID)
	now := time.Now()

	device := &coredata.Device{
		ID:             gid.New(scope.GetTenantID(), coredata.DeviceEntityType),
		OrganizationID: claims.OrganizationID,
		ProfileID:      &claims.ProfileID,
		HardwareUUID:   hardwareUUID,
		SerialNumber:   serialNumber,
		Hostname:       hostname,
		Platform:       platform,
		OSVersion:      osVersion,
		AgentVersion:   agentVersion,
		APIKeyHash:     keyHash,
		Status:         coredata.DeviceStatusOnline,
		LastHeartbeatAt: &now,
		EnrolledAt:     now,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(ctx context.Context, tx pg.Tx) error {
			return device.Insert(ctx, tx, scope)
		},
	)
	if err != nil {
		return nil, "", fmt.Errorf("cannot insert device: %w", err)
	}

	return device, rawKey, nil
}

func (s *DeviceService) Heartbeat(
	ctx context.Context,
	deviceID gid.GID,
	agentVersion string,
	hostname string,
	osVersion string,
) (*coredata.Device, error) {
	scope := coredata.NewScopeFromObjectID(deviceID)
	device := &coredata.Device{}

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return device.LoadByID(ctx, conn, scope, deviceID)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot load device: %w", err)
	}

	if device.Status == coredata.DeviceStatusRevoked {
		return nil, fmt.Errorf("device is revoked")
	}

	now := time.Now()
	device.Status = coredata.DeviceStatusOnline
	device.LastHeartbeatAt = &now
	device.UpdatedAt = now

	if agentVersion != "" {
		device.AgentVersion = agentVersion
	}
	if hostname != "" {
		device.Hostname = hostname
	}
	if osVersion != "" {
		device.OSVersion = osVersion
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(ctx context.Context, tx pg.Tx) error {
			return device.Update(ctx, tx, scope)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot update device: %w", err)
	}

	return device, nil
}

func (s *DeviceService) PushPostures(
	ctx context.Context,
	deviceID gid.GID,
	results []PostureResult,
) error {
	tenantID := deviceID.TenantID()
	now := time.Now()

	return s.svc.pg.WithTx(
		ctx,
		func(ctx context.Context, tx pg.Tx) error {
			for _, r := range results {
				evidence, err := json.Marshal(r.Evidence)
				if err != nil {
					evidence = []byte("{}")
				}

				observedAt := r.ObservedAt
				if observedAt.IsZero() {
					observedAt = now
				}

				check := &coredata.DevicePostureCheck{
					ID:         gid.New(tenantID, coredata.DevicePostureCheckEntityType),
					DeviceID:   deviceID,
					CheckKey:   r.CheckKey,
					Status:     coredata.PostureCheckStatus(r.Status),
					Evidence:   evidence,
					ObservedAt: observedAt,
					CreatedAt:  now,
				}

				if err := check.Upsert(ctx, tx, tenantID); err != nil {
					return fmt.Errorf("cannot upsert posture check %q: %w", r.CheckKey, err)
				}
			}

			return nil
		},
	)
}

func (s *DeviceService) Unenroll(
	ctx context.Context,
	deviceID gid.GID,
) error {
	scope := coredata.NewScopeFromObjectID(deviceID)
	now := time.Now()

	return s.svc.pg.WithTx(
		ctx,
		func(ctx context.Context, tx pg.Tx) error {
			device := &coredata.Device{}
			if err := device.LoadByID(ctx, tx, scope, deviceID); err != nil {
				return fmt.Errorf("cannot load device: %w", err)
			}

			device.Status = coredata.DeviceStatusRevoked
			device.UpdatedAt = now

			return device.Update(ctx, tx, scope)
		},
	)
}

type PostureResult struct {
	CheckKey   string          `json:"check_key"`
	Status     string          `json:"status"`
	Evidence   json.RawMessage `json:"evidence,omitempty"`
	ObservedAt time.Time       `json:"observed_at"`
}

func (s *DeviceService) Get(
	ctx context.Context,
	scope coredata.Scoper,
	deviceID gid.GID,
) (*coredata.Device, error) {
	device := &coredata.Device{}

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return device.LoadByID(ctx, conn, scope, deviceID)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot get device: %w", err)
	}

	return device, nil
}

func (s *DeviceService) GetByAPIKey(
	ctx context.Context,
	apiKey string,
) (*coredata.Device, error) {
	h := sha256.Sum256([]byte(apiKey))
	keyHash := hex.EncodeToString(h[:])

	var device coredata.Device

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
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
	api_key_hash = $1
LIMIT 1
`
			rows, err := conn.Query(ctx, q, keyHash)
			if err != nil {
				return fmt.Errorf("cannot query device by api key: %w", err)
			}

			d, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[coredata.Device])
			if err != nil {
				return fmt.Errorf("cannot find device: %w", err)
			}

			device = d
			return nil
		},
	)
	if err != nil {
		return nil, err
	}

	return &device, nil
}

func (s *DeviceService) Delete(
	ctx context.Context,
	scope coredata.Scoper,
	deviceID gid.GID,
) error {
	device := coredata.Device{ID: deviceID}

	return s.svc.pg.WithTx(
		ctx,
		func(ctx context.Context, tx pg.Tx) error {
			return device.Delete(ctx, tx, scope)
		},
	)
}

func (s *DeviceService) ListForOrganizationID(
	ctx context.Context,
	scope coredata.Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.DeviceOrderField],
	filter *coredata.DeviceFilter,
) (*page.Page[*coredata.Device, coredata.DeviceOrderField], error) {
	var devices coredata.Devices

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return devices.LoadByOrganizationID(ctx, conn, scope, organizationID, cursor, filter)
		},
	)
	if err != nil {
		return nil, err
	}

	return page.NewPage(devices, cursor), nil
}

func (s *DeviceService) CountForOrganizationID(
	ctx context.Context,
	scope coredata.Scoper,
	organizationID gid.GID,
	filter *coredata.DeviceFilter,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) (err error) {
			devices := coredata.Devices{}

			count, err = devices.CountByOrganizationID(ctx, conn, scope, organizationID, filter)
			if err != nil {
				return fmt.Errorf("cannot count devices: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s *DeviceService) GetPostureChecks(
	ctx context.Context,
	deviceID gid.GID,
) (coredata.DevicePostureChecks, error) {
	var checks coredata.DevicePostureChecks

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return checks.LoadByDeviceID(ctx, conn, deviceID)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot get posture checks: %w", err)
	}

	return checks, nil
}

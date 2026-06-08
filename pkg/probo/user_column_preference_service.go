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
	"fmt"

	"go.gearno.de/kit/pg"
	"go.probo.inc/probo/pkg/coredata"
	"go.probo.inc/probo/pkg/gid"
)

type UserColumnPreferenceService struct {
	svc *Service
}

func (s *UserColumnPreferenceService) GetByProfileAndReportType(
	ctx context.Context,
	scope coredata.Scoper,
	profileID gid.GID,
	reportType coredata.MonitoringReportType,
) (*coredata.UserColumnPreference, error) {
	pref := &coredata.UserColumnPreference{}

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return pref.LoadByProfileAndReportType(ctx, conn, scope, profileID, reportType)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot get user column preference: %w", err)
	}

	return pref, nil
}

func (s *UserColumnPreferenceService) Upsert(
	ctx context.Context,
	scope coredata.Scoper,
	profileID gid.GID,
	reportType coredata.MonitoringReportType,
	selectedColumns []string,
) (*coredata.UserColumnPreference, error) {
	pref := &coredata.UserColumnPreference{
		ID:              gid.New(scope.GetTenantID(), coredata.UserColumnPreferenceEntityType),
		ProfileID:       profileID,
		ReportType:      reportType,
		SelectedColumns: selectedColumns,
	}

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return pref.Upsert(ctx, conn, scope)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot upsert user column preference: %w", err)
	}

	return pref, nil
}

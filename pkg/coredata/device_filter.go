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
	"github.com/jackc/pgx/v5"
	"go.probo.inc/probo/pkg/gid"
)

type DeviceFilter struct {
	status    *DeviceStatus
	profileID *gid.GID
}

func NewDeviceFilter(
	status *DeviceStatus,
	profileID *gid.GID,
) *DeviceFilter {
	return &DeviceFilter{
		status:    status,
		profileID: profileID,
	}
}

func (f *DeviceFilter) SQLArguments() pgx.StrictNamedArgs {
	args := pgx.StrictNamedArgs{
		"has_status_filter":     false,
		"filter_status":        nil,
		"has_profile_id_filter": false,
		"filter_profile_id":    nil,
	}

	if f.status != nil {
		args["has_status_filter"] = true
		args["filter_status"] = string(*f.status)
	}

	if f.profileID != nil {
		args["has_profile_id_filter"] = true
		args["filter_profile_id"] = f.profileID.String()
	}

	return args
}

func (f *DeviceFilter) SQLFragment() string {
	return `
(
    CASE
        WHEN @has_status_filter::boolean = false THEN TRUE
        WHEN @has_status_filter::boolean = true THEN
            status = @filter_status::device_status
        ELSE TRUE
    END
)
AND
(
    CASE
        WHEN @has_profile_id_filter::boolean = false THEN TRUE
        WHEN @has_profile_id_filter::boolean = true THEN
            profile_id = @filter_profile_id
        ELSE TRUE
    END
)`
}

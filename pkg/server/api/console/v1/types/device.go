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

package types

import (
	"go.probo.inc/probo/pkg/coredata"
	"go.probo.inc/probo/pkg/gid"
	"go.probo.inc/probo/pkg/page"
)

type (
	DeviceEdge struct {
		Cursor page.CursorKey `json:"cursor"`
		Node   *Device        `json:"node"`
	}

	DeviceConnection struct {
		TotalCount int
		Edges      []*DeviceEdge
		PageInfo   PageInfo

		Resolver any
		ParentID gid.GID
		Filter   *DeviceFilter
	}

	DeviceOrder struct {
		Field     coredata.DeviceOrderField `json:"field"`
		Direction page.OrderDirection       `json:"direction"`
	}

	DeviceFilter struct {
		Status *coredata.DeviceStatus `json:"status,omitempty"`
	}
)

func NewDeviceConnection(
	p *page.Page[*coredata.Device, coredata.DeviceOrderField],
	parentType any,
	parentID gid.GID,
	filter *DeviceFilter,
) *DeviceConnection {
	edges := make([]*DeviceEdge, len(p.Data))
	for i, device := range p.Data {
		edges[i] = NewDeviceEdge(device, p.Cursor.OrderBy.Field)
	}

	return &DeviceConnection{
		Edges:    edges,
		PageInfo: *NewPageInfo(p),

		Resolver: parentType,
		ParentID: parentID,
		Filter:   filter,
	}
}

func NewDeviceEdge(d *coredata.Device, orderField coredata.DeviceOrderField) *DeviceEdge {
	return &DeviceEdge{
		Node:   NewDevice(d),
		Cursor: d.CursorKey(orderField),
	}
}

func NewDevice(d *coredata.Device) *Device {
	device := &Device{
		ID: d.ID,
		Organization: &Organization{
			ID: d.OrganizationID,
		},
		Hostname:        d.Hostname,
		Platform:        d.Platform,
		OsVersion:       d.OSVersion,
		AgentVersion:    d.AgentVersion,
		Status:          d.Status,
		LastHeartbeatAt: d.LastHeartbeatAt,
		EnrolledAt:      d.EnrolledAt,
		CreatedAt:       d.CreatedAt,
		UpdatedAt:       d.UpdatedAt,
	}

	if d.ProfileID != nil {
		device.Owner = &Profile{
			ID: *d.ProfileID,
		}
	}

	return device
}

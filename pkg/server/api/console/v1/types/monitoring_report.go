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
	MonitoringReportEdge struct {
		Cursor page.CursorKey   `json:"cursor"`
		Node   *MonitoringReport `json:"node"`
	}

	MonitoringReportConnection struct {
		TotalCount int
		Edges      []*MonitoringReportEdge
		PageInfo   PageInfo

		Resolver any
		ParentID gid.GID
		Filter   *MonitoringReportFilter
	}

	MonitoringReportOrder struct {
		Field     coredata.MonitoringReportOrderField `json:"field"`
		Direction page.OrderDirection                 `json:"direction"`
	}

	MonitoringReportFilter struct {
		ReportType *coredata.MonitoringReportType `json:"reportType,omitempty"`
	}
)

func NewMonitoringReportConnection(
	p *page.Page[*coredata.MonitoringReport, coredata.MonitoringReportOrderField],
	parentType any,
	parentID gid.GID,
	filter *MonitoringReportFilter,
) *MonitoringReportConnection {
	edges := make([]*MonitoringReportEdge, len(p.Data))
	for i, report := range p.Data {
		edges[i] = NewMonitoringReportEdge(report, p.Cursor.OrderBy.Field)
	}

	return &MonitoringReportConnection{
		Edges:    edges,
		PageInfo: *NewPageInfo(p),

		Resolver: parentType,
		ParentID: parentID,
		Filter:   filter,
	}
}

func NewMonitoringReportEdge(r *coredata.MonitoringReport, orderField coredata.MonitoringReportOrderField) *MonitoringReportEdge {
	return &MonitoringReportEdge{
		Node:   NewMonitoringReport(r),
		Cursor: r.CursorKey(orderField),
	}
}

func NewMonitoringReport(r *coredata.MonitoringReport) *MonitoringReport {
	report := &MonitoringReport{
		ID: r.ID,
		Organization: &Organization{
			ID: r.OrganizationID,
		},
		ReportType: r.ReportType,
		Name:       r.Name,
		RowCount:   r.RowCount,
		Summary:    string(r.Summary),
		CreatedAt:  r.CreatedAt,
		UpdatedAt:  r.UpdatedAt,
	}

	if r.FileID != nil {
		report.File = &File{
			ID: *r.FileID,
		}
	}

	if r.UploaderID != nil {
		report.Uploader = &Profile{
			ID: *r.UploaderID,
		}
	}

	return report
}

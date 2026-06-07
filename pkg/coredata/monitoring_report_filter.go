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
)

type MonitoringReportFilter struct {
	reportType *MonitoringReportType
}

func NewMonitoringReportFilter(
	reportType *MonitoringReportType,
) *MonitoringReportFilter {
	return &MonitoringReportFilter{
		reportType: reportType,
	}
}

func (f *MonitoringReportFilter) SQLArguments() pgx.StrictNamedArgs {
	args := pgx.StrictNamedArgs{
		"has_report_type_filter": false,
		"filter_report_type":     nil,
	}

	if f.reportType != nil {
		args["has_report_type_filter"] = true
		args["filter_report_type"] = string(*f.reportType)
	}

	return args
}

func (f *MonitoringReportFilter) SQLFragment() string {
	return `
(
    CASE
        WHEN @has_report_type_filter::boolean = false THEN TRUE
        WHEN @has_report_type_filter::boolean = true THEN
            report_type = @filter_report_type::monitoring_report_type
        ELSE TRUE
    END
)`
}

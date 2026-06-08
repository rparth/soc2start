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
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"go.gearno.de/kit/pg"
	"go.probo.inc/probo/pkg/coredata"
	"go.probo.inc/probo/pkg/filevalidation"
	"go.probo.inc/probo/pkg/gid"
	"go.probo.inc/probo/pkg/page"
)

type MonitoringReportService struct {
	svc           *Service
	fileValidator *filevalidation.FileValidator
}

type (
	MonitoringReportSummary struct {
		TotalRows    int                       `json:"totalRows"`
		PassCount    int                       `json:"passCount"`
		FailCount    int                       `json:"failCount"`
		ByService    map[string]ServiceSummary  `json:"byService"`
		BySeverity   map[string]SeveritySummary `json:"bySeverity"`
	}

	ServiceSummary struct {
		Pass int `json:"pass"`
		Fail int `json:"fail"`
	}

	SeveritySummary struct {
		Pass int `json:"pass"`
		Fail int `json:"fail"`
	}
)

func (s MonitoringReportService) Get(
	ctx context.Context, scope coredata.Scoper,
	reportID gid.GID,
) (*coredata.MonitoringReport, error) {
	report := &coredata.MonitoringReport{}

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return report.LoadByID(ctx, conn, scope, reportID)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot get monitoring report: %w", err)
	}

	return report, nil
}

func (s *MonitoringReportService) Create(
	ctx context.Context, scope coredata.Scoper,
	organizationID gid.GID,
	reportType coredata.MonitoringReportType,
	name string,
	uploaderID *gid.GID,
	fileUpload *FileUpload,
) (*coredata.MonitoringReport, error) {
	organization := &coredata.Organization{}

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return organization.LoadByID(ctx, conn, scope, organizationID)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot load organization: %w", err)
	}

	var buf bytes.Buffer
	reader := io.TeeReader(fileUpload.Content, &buf)

	summary, rowCount, err := parseProwlerCSV(reader, reportType)
	if err != nil {
		return nil, fmt.Errorf("cannot parse CSV: %w", err)
	}

	summaryJSON, err := json.Marshal(summary)
	if err != nil {
		return nil, fmt.Errorf("cannot marshal summary: %w", err)
	}

	uploadReq := &FileUpload{
		Content:     bytes.NewReader(buf.Bytes()),
		Filename:    fileUpload.Filename,
		Size:        fileUpload.Size,
		ContentType: fileUpload.ContentType,
	}

	f, err := s.svc.Files.UploadAndSaveFile(
		ctx,
		scope,
		s.fileValidator,
		map[string]string{
			"type":            "monitoring-report",
			"organization-id": organizationID.String(),
			"report-type":     string(reportType),
		},
		uploadReq,
	)
	if err != nil {
		return nil, fmt.Errorf("cannot upload file: %w", err)
	}

	now := time.Now()

	report := &coredata.MonitoringReport{
		ID:             gid.New(scope.GetTenantID(), coredata.MonitoringReportEntityType),
		OrganizationID: organizationID,
		ReportType:     reportType,
		Name:           name,
		FileID:         &f.ID,
		UploaderID:     uploaderID,
		RowCount:       rowCount,
		Summary:        summaryJSON,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(ctx context.Context, tx pg.Tx) error {
			return report.Insert(ctx, tx, scope)
		},
	)
	if err != nil {
		return nil, fmt.Errorf("cannot insert monitoring report: %w", err)
	}

	return report, nil
}

func (s MonitoringReportService) Delete(
	ctx context.Context, scope coredata.Scoper,
	reportID gid.GID,
) error {
	report := coredata.MonitoringReport{ID: reportID}

	return s.svc.pg.WithTx(
		ctx,
		func(ctx context.Context, tx pg.Tx) error {
			return report.Delete(ctx, tx, scope)
		},
	)
}

func (s MonitoringReportService) ListForOrganizationID(
	ctx context.Context, scope coredata.Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.MonitoringReportOrderField],
	filter *coredata.MonitoringReportFilter,
) (*page.Page[*coredata.MonitoringReport, coredata.MonitoringReportOrderField], error) {
	var reports coredata.MonitoringReports

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) error {
			return reports.LoadByOrganizationID(ctx, conn, scope, organizationID, cursor, filter)
		},
	)
	if err != nil {
		return nil, err
	}

	return page.NewPage(reports, cursor), nil
}

func (s MonitoringReportService) CountForOrganizationID(
	ctx context.Context, scope coredata.Scoper,
	organizationID gid.GID,
	filter *coredata.MonitoringReportFilter,
) (int, error) {
	var count int

	err := s.svc.pg.WithConn(
		ctx,
		func(ctx context.Context, conn pg.Querier) (err error) {
			reports := coredata.MonitoringReports{}

			count, err = reports.CountByOrganizationID(ctx, conn, scope, organizationID, filter)
			if err != nil {
				return fmt.Errorf("cannot count monitoring reports: %w", err)
			}

			return nil
		},
	)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (s MonitoringReportService) GetFileContent(
	ctx context.Context, scope coredata.Scoper,
	reportID gid.GID,
) (string, error) {
	report, err := s.Get(ctx, scope, reportID)
	if err != nil {
		return "", fmt.Errorf("cannot get monitoring report: %w", err)
	}

	if report.FileID == nil {
		return "", fmt.Errorf("monitoring report has no file")
	}

	file, err := s.svc.Files.Get(ctx, scope, *report.FileID)
	if err != nil {
		return "", fmt.Errorf("cannot get file: %w", err)
	}

	result, err := s.svc.s3.GetObject(
		ctx,
		&s3.GetObjectInput{
			Bucket: &s.svc.bucket,
			Key:    &file.FileKey,
		},
	)
	if err != nil {
		return "", fmt.Errorf("cannot get file from S3: %w", err)
	}

	defer func() { _ = result.Body.Close() }()

	data, err := io.ReadAll(result.Body)
	if err != nil {
		return "", fmt.Errorf("cannot read file data: %w", err)
	}

	return string(data), nil
}

func parseProwlerCSV(r io.Reader, reportType coredata.MonitoringReportType) (*MonitoringReportSummary, int, error) {
	csvReader := csv.NewReader(r)
	csvReader.Comma = ';'
	csvReader.LazyQuotes = true

	header, err := csvReader.Read()
	if err != nil {
		return nil, 0, fmt.Errorf("cannot read CSV header: %w", err)
	}

	colIndex := make(map[string]int)
	for i, col := range header {
		colIndex[strings.TrimSpace(strings.ToUpper(col))] = i
	}

	statusIdx, hasStatus := colIndex["STATUS"]
	serviceIdx, hasService := colIndex["SERVICE_NAME"]
	severityIdx, hasSeverity := colIndex["SEVERITY"]

	if !hasStatus {
		return nil, 0, fmt.Errorf("CSV missing required STATUS column")
	}

	summary := &MonitoringReportSummary{
		ByService:  make(map[string]ServiceSummary),
		BySeverity: make(map[string]SeveritySummary),
	}

	rowCount := 0

	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, 0, fmt.Errorf("cannot read CSV row: %w", err)
		}

		rowCount++
		summary.TotalRows = rowCount

		status := strings.ToUpper(strings.TrimSpace(record[statusIdx]))
		isFail := status == "FAIL"

		if isFail {
			summary.FailCount++
		} else {
			summary.PassCount++
		}

		if hasService && serviceIdx < len(record) {
			svcName := strings.TrimSpace(record[serviceIdx])
			if svcName != "" {
				s := summary.ByService[svcName]
				if isFail {
					s.Fail++
				} else {
					s.Pass++
				}
				summary.ByService[svcName] = s
			}
		}

		if hasSeverity && severityIdx < len(record) {
			sev := strings.TrimSpace(record[severityIdx])
			if sev != "" {
				s := summary.BySeverity[sev]
				if isFail {
					s.Fail++
				} else {
					s.Pass++
				}
				summary.BySeverity[sev] = s
			}
		}
	}

	return summary, rowCount, nil
}

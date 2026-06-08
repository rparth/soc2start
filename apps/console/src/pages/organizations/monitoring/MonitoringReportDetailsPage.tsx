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

import { formatDate, type GraphQLError, sprintf } from "@probo/helpers";
import { usePageTitle } from "@probo/hooks";
import { useTranslate } from "@probo/i18n";
import {
  ActionDropdown,
  Badge,
  Button,
  Card,
  DropdownItem,
  IconTrashCan,
  Input,
  PageHeader,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useConfirm,
  useToast,
} from "@probo/ui";
import { useCallback, useMemo, useState } from "react";
import {
  graphql,
  type PreloadedQuery,
  useMutation,
  usePreloadedQuery,
} from "react-relay";
import { useNavigate } from "react-router";

import type { MonitoringReportDetailsPageDeleteMutation } from "#/__generated__/core/MonitoringReportDetailsPageDeleteMutation.graphql";
import type { MonitoringReportDetailsPageQuery } from "#/__generated__/core/MonitoringReportDetailsPageQuery.graphql";
import { useOrganizationId } from "#/hooks/useOrganizationId";

export const monitoringReportDetailsPageQuery = graphql`
  query MonitoringReportDetailsPageQuery($reportId: ID!) {
    node(id: $reportId) {
      ... on MonitoringReport {
        id
        name
        reportType
        rowCount
        summary
        rawContent
        createdAt
        updatedAt
        organization {
          id
        }
        file {
          id
          fileName
          downloadUrl
        }
        uploader {
          id
          fullName
        }
        canDelete: permission(action: "core:monitoring-report:delete")
      }
    }
  }
`;

const deleteReportMutation = graphql`
  mutation MonitoringReportDetailsPageDeleteMutation(
    $input: DeleteMonitoringReportInput!
  ) {
    deleteMonitoringReport(input: $input) {
      deletedMonitoringReportId
    }
  }
`;

type SummaryData = {
  totalRows: number;
  passCount: number;
  failCount: number;
  byService: Record<string, { pass: number; fail: number }>;
  bySeverity: Record<string, { pass: number; fail: number }>;
};

interface MonitoringReportDetailsPageProps {
  queryRef: PreloadedQuery<MonitoringReportDetailsPageQuery>;
}

export default function MonitoringReportDetailsPage({
  queryRef,
}: MonitoringReportDetailsPageProps) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();
  const navigate = useNavigate();
  const { toast } = useToast();
  const confirm = useConfirm();

  const data = usePreloadedQuery(monitoringReportDetailsPageQuery, queryRef);
  const report = data.node;

  const reportType = report.reportType ?? "PROWLER";
  const basePath =
    reportType === "PROWLER"
      ? "monitoring/prowler"
      : "monitoring/pentesting";
  const title = reportType === "PROWLER" ? __("Prowler") : __("Pentesting");
  const reportName = report.name ?? "";

  usePageTitle(reportName);

  const [activeTab, setActiveTab] = useState<"summary" | "raw">("summary");

  const [deleteReport] =
    useMutation<MonitoringReportDetailsPageDeleteMutation>(
      deleteReportMutation,
    );

  const handleDelete = () => {
    confirm(
      () =>
        new Promise<void>((resolve, reject) => {
          deleteReport({
            variables: {
              input: { monitoringReportId: report.id! },
            },
            onCompleted(_, errors) {
              if (errors?.length) {
                toast({
                  title: __("Error"),
                  description: (errors as GraphQLError[])[0]?.message ?? __("Unknown error"),
                  variant: "error",
                });
                reject(new Error((errors as GraphQLError[])[0]?.message));
                return;
              }
              void navigate(
                `/organizations/${organizationId}/${basePath}`,
              );
              resolve();
            },
            onError(error) {
              toast({
                title: __("Error"),
                description: __("Failed to delete report"),
                variant: "error",
              });
              reject(error);
            },
          });
        }),
      {
        message: sprintf(
          __("Are you sure you want to delete '%s'?"),
          reportName,
        ),
      },
    );
  };

  const summary: SummaryData | null = useMemo(() => {
    if (!report.summary) return null;
    try {
      return JSON.parse(report.summary) as SummaryData;
    } catch {
      return null;
    }
  }, [report.summary]);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[__("Monitoring"), title]}
        title={reportName}
        description={sprintf(
          __("Uploaded %s • %s rows"),
          formatDate(report.createdAt ?? ""),
          (report.rowCount ?? 0).toLocaleString(),
        )}
      >
        {report.canDelete && (
          <ActionDropdown>
            <DropdownItem
              icon={IconTrashCan}
              variant="danger"
              onClick={handleDelete}
            >
              {__("Delete")}
            </DropdownItem>
          </ActionDropdown>
        )}
      </PageHeader>

      <Tabs>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "summary"
              ? "border-accent-bold text-txt-primary"
              : "border-transparent text-txt-secondary hover:text-txt-primary"
          }`}
          onClick={() => setActiveTab("summary")}
        >
          {__("Summary")}
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "raw"
              ? "border-accent-bold text-txt-primary"
              : "border-transparent text-txt-secondary hover:text-txt-primary"
          }`}
          onClick={() => setActiveTab("raw")}
        >
          {__("Raw Data")}
        </button>
      </Tabs>

      {activeTab === "summary" && summary && (
        <SummaryTab summary={summary} />
      )}
      {activeTab === "raw" && report.rawContent && (
        <RawDataTab rawContent={report.rawContent} />
      )}
    </div>
  );
}

function SummaryTab({ summary }: { summary: SummaryData }) {
  const { __ } = useTranslate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-txt-secondary">{__("Total Checks")}</p>
          <p className="text-2xl font-semibold">
            {summary.totalRows.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-txt-secondary">{__("Passed")}</p>
          <p className="text-2xl font-semibold text-green-600">
            {summary.passCount.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-txt-secondary">{__("Failed")}</p>
          <p className="text-2xl font-semibold text-red-600">
            {summary.failCount.toLocaleString()}
          </p>
        </Card>
      </div>

      {Object.keys(summary.bySeverity).length > 0 && (
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold">{__("By Severity")}</h3>
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>{__("Severity")}</Th>
                <Th>{__("Pass")}</Th>
                <Th>{__("Fail")}</Th>
                <Th>{__("Total")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(summary.bySeverity)
                .sort(([a], [b]) => {
                  const order = [
                    "critical",
                    "high",
                    "medium",
                    "low",
                    "informational",
                  ];
                  return (
                    order.indexOf(a.toLowerCase()) -
                    order.indexOf(b.toLowerCase())
                  );
                })
                .map(([severity, counts]) => (
                  <Tr key={severity}>
                    <Td>
                      <Badge
                        variant={
                          severity.toLowerCase() === "critical" ||
                          severity.toLowerCase() === "high"
                            ? "danger"
                            : severity.toLowerCase() === "medium"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {severity}
                      </Badge>
                    </Td>
                    <Td>{counts.pass.toLocaleString()}</Td>
                    <Td>{counts.fail.toLocaleString()}</Td>
                    <Td>
                      {(counts.pass + counts.fail).toLocaleString()}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Card>
      )}

      {Object.keys(summary.byService).length > 0 && (
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-semibold">{__("By Service")}</h3>
          </div>
          <Table>
            <Thead>
              <Tr>
                <Th>{__("Service")}</Th>
                <Th>{__("Pass")}</Th>
                <Th>{__("Fail")}</Th>
                <Th>{__("Total")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(summary.byService)
                .sort(([, a], [, b]) => b.fail - a.fail)
                .map(([service, counts]) => (
                  <Tr key={service}>
                    <Td className="font-medium">{service}</Td>
                    <Td>{counts.pass.toLocaleString()}</Td>
                    <Td>{counts.fail.toLocaleString()}</Td>
                    <Td>
                      {(counts.pass + counts.fail).toLocaleString()}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function RawDataTab({ rawContent }: { rawContent: string }) {
  const { __ } = useTranslate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("FAIL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const { headers, rows, error } = useMemo(() => {
    const lines = rawContent.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      return { headers: [], rows: [], error: "Empty CSV file" };
    }

    const parseLine = (line: string) =>
      line.split(";").map((cell) => cell.trim());

    return {
      headers: parseLine(lines[0]),
      rows: lines.slice(1).map(parseLine),
      error: null,
    };
  }, [rawContent]);

  const statusIdx = useMemo(
    () => headers.findIndex((h) => h.toUpperCase() === "STATUS"),
    [headers],
  );
  const severityIdx = useMemo(
    () => headers.findIndex((h) => h.toUpperCase() === "SEVERITY"),
    [headers],
  );

  const uniqueStatuses = useMemo(() => {
    if (statusIdx < 0) return [];
    const set = new Set(rows.map((r) => r[statusIdx]).filter(Boolean));
    return Array.from(set).sort();
  }, [rows, statusIdx]);

  const uniqueSeverities = useMemo(() => {
    if (severityIdx < 0) return [];
    const set = new Set(rows.map((r) => r[severityIdx]).filter(Boolean));
    const order = ["critical", "high", "medium", "low", "informational"];
    return Array.from(set).sort(
      (a, b) =>
        order.indexOf(a.toLowerCase()) - order.indexOf(b.toLowerCase()),
    );
  }, [rows, severityIdx]);

  const filteredRows = useMemo(() => {
    let result = rows;

    if (statusFilter !== "ALL" && statusIdx >= 0) {
      result = result.filter(
        (row) => row[statusIdx]?.toUpperCase() === statusFilter,
      );
    }

    if (severityFilter !== "ALL" && severityIdx >= 0) {
      result = result.filter(
        (row) => row[severityIdx]?.toUpperCase() === severityFilter.toUpperCase(),
      );
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((row) =>
        row.some((cell) => cell.toLowerCase().includes(lower)),
      );
    }

    return result;
  }, [rows, search, statusFilter, severityFilter, statusIdx, severityIdx]);

  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(0);
    },
    [],
  );

  if (error) {
    return (
      <Card className="p-8 text-center text-txt-secondary">{error}</Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder={__("Search across all columns...")}
          value={search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        {statusIdx >= 0 && (
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-md border border-primary bg-primary px-3 py-1.5 text-sm text-txt-primary"
          >
            <option value="ALL">{__("All statuses")}</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s.toUpperCase()}>
                {s}
              </option>
            ))}
          </select>
        )}
        {severityIdx >= 0 && (
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-md border border-primary bg-primary px-3 py-1.5 text-sm text-txt-primary"
          >
            <option value="ALL">{__("All severities")}</option>
            {uniqueSeverities.map((s) => (
              <option key={s} value={s.toUpperCase()}>
                {s}
              </option>
            ))}
          </select>
        )}
        <p className="ml-auto text-sm text-txt-secondary">
          {sprintf(
            __("%s of %s rows"),
            filteredRows.length.toLocaleString(),
            rows.length.toLocaleString(),
          )}
        </p>
      </div>

      <Card className="overflow-x-auto">
        <Table>
          <Thead>
            <Tr>
              {headers.map((header, i) => (
                <Th key={i} className="whitespace-nowrap">
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRows.map((row, i) => (
              <Tr key={i}>
                {row.map((cell, j) => (
                  <Td
                    key={j}
                    className="max-w-xs truncate whitespace-nowrap"
                    title={cell}
                  >
                    {cell}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            {__("Previous")}
          </Button>
          <span className="text-sm text-txt-secondary">
            {sprintf(
              __("Page %s of %s"),
              (page + 1).toString(),
              totalPages.toString(),
            )}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            {__("Next")}
          </Button>
        </div>
      )}
    </div>
  );
}

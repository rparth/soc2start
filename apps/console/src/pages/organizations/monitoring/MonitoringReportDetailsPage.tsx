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
  Card,
  DropdownItem,
  IconTrashCan,
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
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
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
  const passRate =
    summary.totalRows > 0
      ? Math.round((summary.passCount / summary.totalRows) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-txt-tertiary">
            {__("Total Checks")}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
            {summary.totalRows.toLocaleString()}
          </p>
          <div className="mt-3 flex gap-1 h-1.5 rounded-full overflow-hidden bg-subtle">
            {summary.passCount > 0 && (
              <div
                className="bg-txt-success rounded-full transition-all duration-300"
                style={{ width: `${passRate}%` }}
              />
            )}
            {summary.failCount > 0 && (
              <div
                className="bg-txt-danger rounded-full transition-all duration-300"
                style={{ width: `${100 - passRate}%` }}
              />
            )}
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-txt-tertiary">
            {__("Passed")}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold tabular-nums tracking-tight text-txt-success">
              {summary.passCount.toLocaleString()}
            </p>
            <span className="text-sm text-txt-secondary tabular-nums">
              {passRate}%
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-txt-tertiary">
            {__("Failed")}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold tabular-nums tracking-tight text-txt-danger">
              {summary.failCount.toLocaleString()}
            </p>
            <span className="text-sm text-txt-secondary tabular-nums">
              {100 - passRate}%
            </span>
          </div>
        </Card>
      </div>

      {Object.keys(summary.bySeverity).length > 0 && (
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
      )}

      {Object.keys(summary.byService).length > 0 && (
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
      )}
    </div>
  );
}

function RawDataTab({ rawContent }: { rawContent: string }) {
  const { __ } = useTranslate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data, columns, error } = useMemo(() => {
    const lines = rawContent.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      return { data: [], columns: [], error: "Empty CSV file" };
    }

    const parseLine = (line: string) =>
      line.split(";").map((cell) => cell.trim());

    const headers = parseLine(lines[0]);
    const records = lines.slice(1).map((line) => {
      const cells = parseLine(line);
      const record: Record<string, string> = {};
      headers.forEach((header, i) => {
        record[header] = cells[i] ?? "";
      });
      return record;
    });

    const cols: ColumnDef<Record<string, string>>[] = headers.map(
      (header) => ({
        accessorKey: header,
        header: header,
      }),
    );

    return { data: records, columns: cols, error: null };
  }, [rawContent]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  if (error) {
    return (
      <Card className="p-8 text-center text-txt-secondary">{error}</Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={__("Search across all columns...")}
          className="w-full max-w-sm px-3 py-2 text-sm border border-bd-default rounded-lg bg-primary text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:ring-2 focus:ring-accent-bold/30 focus:border-accent-bold"
        />
        <span className="text-xs text-txt-tertiary whitespace-nowrap tabular-nums">
          {sprintf(
            __("%s of %s rows"),
            table.getFilteredRowModel().rows.length.toLocaleString(),
            data.length.toLocaleString(),
          )}
        </span>
      </div>

      <Table>
        <Thead>
          <Tr>
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  className="cursor-pointer select-none hover:text-txt-secondary"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span className="inline-flex items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: " ↑",
                      desc: " ↓",
                    }[header.column.getIsSorted() as string] ?? ""}
                  </span>
                </Th>
              )),
            )}
          </Tr>
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id} className="whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-txt-tertiary tabular-nums">
            {sprintf(
              __("Page %s of %s"),
              (table.getState().pagination.pageIndex + 1).toLocaleString(),
              table.getPageCount().toLocaleString(),
            )}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-bd-default bg-primary text-txt-primary hover:bg-subtle disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {__("Previous")}
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-bd-default bg-primary text-txt-primary hover:bg-subtle disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {__("Next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconMagnifyingGlass,
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
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  graphql,
  type PreloadedQuery,
  useLazyLoadQuery,
  useMutation,
  usePreloadedQuery,
} from "react-relay";
import { useNavigate } from "react-router";

import type { MonitoringReportDetailsPageDeleteMutation } from "#/__generated__/core/MonitoringReportDetailsPageDeleteMutation.graphql";
import type { MonitoringReportDetailsPagePrefsQuery } from "#/__generated__/core/MonitoringReportDetailsPagePrefsQuery.graphql";
import type { MonitoringReportDetailsPageQuery } from "#/__generated__/core/MonitoringReportDetailsPageQuery.graphql";
import type { MonitoringReportDetailsPageUpdatePrefsMutation } from "#/__generated__/core/MonitoringReportDetailsPageUpdatePrefsMutation.graphql";
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
        <RawDataTab
          rawContent={report.rawContent}
          organizationId={report.organization?.id ?? organizationId}
          reportType={reportType}
        />
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

const columnPrefsQuery = graphql`
  query MonitoringReportDetailsPagePrefsQuery(
    $organizationId: ID!
    $reportType: MonitoringReportType!
  ) {
    viewer {
      userColumnPreferences(
        organizationId: $organizationId
        reportType: $reportType
      ) {
        selectedColumns
      }
    }
  }
`;

const updateColumnPrefsMutation = graphql`
  mutation MonitoringReportDetailsPageUpdatePrefsMutation(
    $input: UpdateUserColumnPreferencesInput!
  ) {
    updateUserColumnPreferences(input: $input) {
      userColumnPreference {
        selectedColumns
      }
    }
  }
`;

const PAGE_SIZES = [10, 25, 50] as const;

function RawDataTab({
  rawContent,
  organizationId,
  reportType,
}: {
  rawContent: string;
  organizationId: string;
  reportType: string;
}) {
  const { __ } = useTranslate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);

  const prefsData =
    useLazyLoadQuery<MonitoringReportDetailsPagePrefsQuery>(
      columnPrefsQuery,
      { organizationId, reportType: reportType as "PROWLER" | "PENTEST" },
    );

  const savedColumns =
    prefsData.viewer?.userColumnPreferences?.selectedColumns ?? null;

  const [commitUpdatePrefs] =
    useMutation<MonitoringReportDetailsPageUpdatePrefsMutation>(
      updateColumnPrefsMutation,
    );

  const { data, headers, error } = useMemo(() => {
    const lines = rawContent.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      return { data: [], headers: [] as string[], error: "Empty CSV file" };
    }

    const parseLine = (line: string) =>
      line.split(";").map((cell) => cell.trim());

    const hdrs = parseLine(lines[0]);
    const records = lines.slice(1).map((line) => {
      const cells = parseLine(line);
      const record: Record<string, string> = {};
      hdrs.forEach((header, i) => {
        record[header] = cells[i] ?? "";
      });
      return record;
    });

    return { data: records, headers: hdrs, error: null };
  }, [rawContent]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (savedColumns && savedColumns.length > 0) {
        const vis: VisibilityState = {};
        for (const h of headers) {
          vis[h] = savedColumns.includes(h);
        }
        return vis;
      }
      return {};
    },
  );

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistPreferences = useCallback(
    (vis: VisibilityState) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const selected = headers.filter((h) => vis[h] !== false);
        commitUpdatePrefs({
          variables: {
            input: {
              organizationId,
              reportType: reportType as "PROWLER" | "PENTEST",
              selectedColumns: selected,
            },
          },
        });
      }, 800);
    },
    [headers, organizationId, reportType, commitUpdatePrefs],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleVisibilityChange = useCallback(
    (updater: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
      setColumnVisibility((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        persistPreferences(next);
        return next;
      });
    },
    [persistPreferences],
  );

  const columns = useMemo<ColumnDef<Record<string, string>>[]>(
    () =>
      headers.map((header) => ({
        accessorKey: header,
        header: header,
      })),
    [headers],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, pagination: { pageIndex: 0, pageSize } },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: handleVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const visibleCount = headers.filter((h) => columnVisibility[h] !== false).length;
  const allVisible = visibleCount === headers.length || Object.keys(columnVisibility).length === 0;

  const handleToggleAll = () => {
    if (allVisible) {
      const vis: VisibilityState = {};
      for (const h of headers) vis[h] = false;
      handleVisibilityChange(vis);
    } else {
      handleVisibilityChange({});
    }
  };

  const isFiltering = globalFilter.length > 0;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const totalCount = data.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = Math.max(1, table.getPageCount());

  if (error) {
    return (
      <Card className="p-8 text-center text-txt-secondary">{error}</Card>
    );
  }

  return (
    <div className="flex gap-5">
      <div className="w-56 shrink-0">
        <Card className="p-0 overflow-hidden">
          <div className="px-3 py-3 border-b border-border-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-txt-tertiary">
                {__("Columns")}
              </span>
              <span className="text-xs tabular-nums font-medium text-txt-secondary bg-subtle rounded-md px-1.5 py-0.5">
                {visibleCount}/{headers.length}
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-xs font-medium text-accent-bold hover:text-accent-bold/80 transition-colors duration-150"
            >
              {allVisible ? __("Deselect All") : __("Select All")}
            </button>
          </div>
          <div className="max-h-[calc(100vh-20rem)] overflow-y-auto p-1.5">
            {headers.map((header) => {
              const isVisible = columnVisibility[header] !== false;
              return (
                <label
                  key={header}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors duration-150 ${
                    isVisible
                      ? "hover:bg-subtle"
                      : "hover:bg-subtle opacity-60 hover:opacity-80"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() =>
                      handleVisibilityChange((prev) => ({
                        ...prev,
                        [header]: !isVisible,
                      }))
                    }
                    className="size-3.5 rounded border-border-low text-accent-bold focus:ring-accent-bold/30 accent-[var(--color-accent-bold)] transition-transform duration-150 active:scale-90"
                  />
                  <span
                    className={`text-sm truncate transition-colors duration-150 ${
                      isVisible ? "text-txt-primary" : "text-txt-tertiary"
                    }`}
                  >
                    {header}
                  </span>
                </label>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm group">
            <IconMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-txt-tertiary group-focus-within:text-accent-bold transition-colors duration-150 pointer-events-none"
            />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={__("Search across all columns...")}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border-low rounded-md bg-level-1 text-txt-primary placeholder:text-txt-tertiary focus:outline-none focus:ring-2 focus:ring-accent-bold/30 focus:border-accent-bold transition-[border-color,box-shadow] duration-150"
            />
          </div>
          <span className="text-xs text-txt-tertiary whitespace-nowrap tabular-nums">
            {isFiltering ? (
              <>
                <span className="font-semibold text-accent-bold">
                  {filteredCount.toLocaleString()}
                </span>
                {" "}{__("of")}{" "}
                {totalCount.toLocaleString()}{" "}{__("rows")}
              </>
            ) : (
              sprintf(
                __("%s rows"),
                totalCount.toLocaleString(),
              )
            )}
          </span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Thead>
              <Tr>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    return (
                      <Th
                        key={header.id}
                        className={`cursor-pointer select-none transition-colors duration-150 ${
                          sorted
                            ? "text-txt-primary"
                            : "hover:text-txt-secondary"
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted ? (
                            <span className="text-accent-bold">
                              {sorted === "asc" ? (
                                <IconChevronUp className="size-3.5" />
                              ) : (
                                <IconChevronDown className="size-3.5" />
                              )}
                            </span>
                          ) : null}
                        </span>
                      </Th>
                    );
                  }),
                )}
              </Tr>
            </Thead>
            <Tbody>
              {table.getRowModel().rows.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={table.getVisibleLeafColumns().length}
                    className="text-center py-12"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-txt-tertiary text-sm">
                        {visibleCount === 0
                          ? __("Select at least one column to view data")
                          : isFiltering
                            ? sprintf(__("No rows match \"%s\""), globalFilter)
                            : __("No data available")}
                      </span>
                    </div>
                  </Td>
                </Tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} className="whitespace-nowrap max-w-xs truncate">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-txt-tertiary">{__("Rows per page")}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                table.setPageIndex(0);
              }}
              className="px-2 py-1 text-xs border border-border-low rounded-md bg-level-1 text-txt-primary focus:outline-none focus:ring-2 focus:ring-accent-bold/30 transition-[border-color,box-shadow] duration-150"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-txt-tertiary tabular-nums mr-2">
              {sprintf(
                __("Page %s of %s"),
                currentPage.toLocaleString(),
                totalPages.toLocaleString(),
              )}
            </span>
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-md border border-border-low bg-level-1 text-txt-primary hover:bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              aria-label={__("Previous page")}
            >
              <IconChevronLeft className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-md border border-border-low bg-level-1 text-txt-primary hover:bg-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              aria-label={__("Next page")}
            >
              <IconChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Button,
  Card,
  DropdownItem,
  EmptyState,
  HelpButton,
  IconTrashCan,
  IconUpload,
  PageHeader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useConfirm,
  useToast,
} from "@probo/ui";
import {
  ConnectionHandler,
  graphql,
  type PreloadedQuery,
  useFragment,
  useMutation,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";
import { Link } from "react-router";

import type { MonitoringReportsPageDeleteMutation } from "#/__generated__/core/MonitoringReportsPageDeleteMutation.graphql";
import type { MonitoringReportsPageFragment$key } from "#/__generated__/core/MonitoringReportsPageFragment.graphql";
import type { MonitoringReportsPageQuery } from "#/__generated__/core/MonitoringReportsPageQuery.graphql";
import type { MonitoringReportsPageRefetchQuery } from "#/__generated__/core/MonitoringReportsPageRefetchQuery.graphql";
import type { MonitoringReportsPageRowFragment$key } from "#/__generated__/core/MonitoringReportsPageRowFragment.graphql";
import { helpContent } from "#/components/help/helpContent";
import { useOrganizationId } from "#/hooks/useOrganizationId";

import { UploadMonitoringReportDialog } from "./UploadMonitoringReportDialog";

export const MonitoringReportsConnectionKey =
  "MonitoringReportsPage_monitoringReports";

export const monitoringReportsPageQuery = graphql`
  query MonitoringReportsPageQuery(
    $organizationId: ID!
    $reportType: MonitoringReportType!
  ) {
    node(id: $organizationId) {
      ... on Organization {
        canCreateReport: permission(
          action: "core:monitoring-report:create"
        )
        ...MonitoringReportsPageFragment
          @arguments(reportType: $reportType)
      }
    }
  }
`;

const deleteReportMutation = graphql`
  mutation MonitoringReportsPageDeleteMutation(
    $input: DeleteMonitoringReportInput!
    $connections: [ID!]!
  ) {
    deleteMonitoringReport(input: $input) {
      deletedMonitoringReportId @deleteEdge(connections: $connections)
    }
  }
`;

const reportRowFragment = graphql`
  fragment MonitoringReportsPageRowFragment on MonitoringReport {
    id
    name
    reportType
    rowCount
    createdAt
    uploader {
      id
      fullName
    }
    canDelete: permission(action: "core:monitoring-report:delete")
  }
`;

const monitoringReportsPageFragment = graphql`
  fragment MonitoringReportsPageFragment on Organization
  @refetchable(queryName: "MonitoringReportsPageRefetchQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 50 }
    after: { type: "CursorKey" }
    reportType: { type: "MonitoringReportType!" }
  ) {
    id
    monitoringReports(
      first: $first
      after: $after
      filter: { reportType: $reportType }
      orderBy: { field: CREATED_AT, direction: DESC }
    )
      @connection(
        key: "MonitoringReportsPage_monitoringReports"
        filters: ["filter"]
      ) {
      edges {
        node {
          id
          canDelete: permission(action: "core:monitoring-report:delete")
          ...MonitoringReportsPageRowFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface MonitoringReportsPageProps {
  queryRef: PreloadedQuery<MonitoringReportsPageQuery>;
  reportType: "PROWLER" | "PENTEST";
}

export default function MonitoringReportsPage({
  queryRef,
  reportType,
}: MonitoringReportsPageProps) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();

  const title = reportType === "PROWLER" ? __("Prowler") : __("Pentesting");
  const basePath =
    reportType === "PROWLER"
      ? "monitoring/prowler"
      : "monitoring/pentesting";

  usePageTitle(title);

  const organization = usePreloadedQuery(monitoringReportsPageQuery, queryRef);

  const { data, loadNext, hasNext, isLoadingNext } =
    usePaginationFragment<
      MonitoringReportsPageRefetchQuery,
      MonitoringReportsPageFragment$key
    >(monitoringReportsPageFragment, organization.node);

  const currentFilter = { reportType };

  const connectionId = ConnectionHandler.getConnectionID(
    organizationId,
    MonitoringReportsConnectionKey,
    { filter: currentFilter },
  );

  const reports =
    data?.monitoringReports?.edges?.map((edge) => edge.node) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[__("Monitoring"), title]}
        title={title}
        description={
          reportType === "PROWLER"
            ? __("Upload and review Prowler security scan reports.")
            : __("Upload and review penetration testing reports.")
        }
      >
        <HelpButton
          content={
            reportType === "PROWLER"
              ? helpContent.prowler
              : helpContent.pentesting
          }
        />
        {organization.node.canCreateReport && (
          <UploadMonitoringReportDialog
            organizationId={organizationId}
            reportType={reportType}
            connectionId={connectionId}
          >
            <Button icon={IconUpload}>{__("Upload report")}</Button>
          </UploadMonitoringReportDialog>
        )}
      </PageHeader>

      {reports.length === 0 ? (
        <EmptyState
          icon={<IconUpload size={32} />}
          title={__("No reports yet")}
          description={
            reportType === "PROWLER"
              ? __(
                  "Upload your first Prowler CSV report to see security findings.",
                )
              : __(
                  "Upload your first penetration testing report to track findings.",
                )
          }
        />
      ) : (
        <Card>
          <Table>
            <Thead>
              <Tr>
                <Th>{__("Name")}</Th>
                <Th>{__("Rows")}</Th>
                <Th>{__("Uploaded by")}</Th>
                <Th>{__("Upload date")}</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {reports.map((report) => (
                <ReportRow
                  key={report.id}
                  fKey={report}
                  basePath={basePath}
                  connectionId={connectionId}
                />
              ))}
            </Tbody>
          </Table>
        </Card>
      )}

      {hasNext && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => loadNext(50)}
            disabled={isLoadingNext}
          >
            {isLoadingNext ? __("Loading...") : __("Load more")}
          </Button>
        </div>
      )}
    </div>
  );
}

function ReportRow({
  fKey,
  basePath,
  connectionId,
}: {
  fKey: MonitoringReportsPageRowFragment$key;
  basePath: string;
  connectionId: string;
}) {
  const { __ } = useTranslate();
  const { toast } = useToast();
  const confirm = useConfirm();
  const organizationId = useOrganizationId();

  const report = useFragment(reportRowFragment, fKey);

  const [deleteReport] =
    useMutation<MonitoringReportsPageDeleteMutation>(deleteReportMutation);

  const handleDelete = () => {
    confirm(
      () =>
        new Promise<void>((resolve, reject) => {
          deleteReport({
            variables: {
              input: { monitoringReportId: report.id },
              connections: [connectionId],
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
          report.name,
        ),
      },
    );
  };

  return (
    <Tr>
      <Td>
        <Link
          to={`/organizations/${organizationId}/${basePath}/${report.id}`}
          className="font-medium text-txt-primary hover:underline"
        >
          {report.name}
        </Link>
      </Td>
      <Td>{report.rowCount.toLocaleString()}</Td>
      <Td>{report.uploader?.fullName ?? "—"}</Td>
      <Td>{formatDate(report.createdAt)}</Td>
      <Td>
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
      </Td>
    </Tr>
  );
}

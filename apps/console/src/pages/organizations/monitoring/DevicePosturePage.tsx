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
  EmptyState,
  IconCircleCheck,
  IconKey,
  IconTrashCan,
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

import type { DevicePosturePageDeleteMutation } from "#/__generated__/core/DevicePosturePageDeleteMutation.graphql";
import type { DevicePosturePageFragment$key } from "#/__generated__/core/DevicePosturePageFragment.graphql";
import type { DevicePosturePageQuery } from "#/__generated__/core/DevicePosturePageQuery.graphql";
import type { DevicePosturePageRefetchQuery } from "#/__generated__/core/DevicePosturePageRefetchQuery.graphql";
import type { DevicePosturePageRowFragment$key } from "#/__generated__/core/DevicePosturePageRowFragment.graphql";
import { useOrganizationId } from "#/hooks/useOrganizationId";

import { GenerateEnrollmentTokenDialog } from "./GenerateEnrollmentTokenDialog";

export const DevicePostureConnectionKey = "DevicePosturePage_devices";

export const devicePosturePageQuery = graphql`
  query DevicePosturePageQuery($organizationId: ID!) {
    node(id: $organizationId) {
      ... on Organization {
        canCreateDevice: permission(action: "core:device:create")
        canDeleteDevice: permission(action: "core:device:delete")
        ...DevicePosturePageFragment
      }
    }
  }
`;

const deleteDeviceMutation = graphql`
  mutation DevicePosturePageDeleteMutation(
    $input: DeleteDeviceInput!
    $connections: [ID!]!
  ) {
    deleteDevice(input: $input) {
      deletedDeviceId @deleteEdge(connections: $connections)
    }
  }
`;

const deviceRowFragment = graphql`
  fragment DevicePosturePageRowFragment on Device {
    id
    hostname
    platform
    osVersion
    agentVersion
    status
    lastHeartbeatAt
    enrolledAt
    owner {
      id
      fullName
    }
    postureSummary {
      total
      pass
      fail
      unknown
    }
    canDelete: permission(action: "core:device:delete")
  }
`;

const devicePosturePageFragment = graphql`
  fragment DevicePosturePageFragment on Organization
  @refetchable(queryName: "DevicePosturePageRefetchQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 50 }
    after: { type: "CursorKey" }
  ) {
    id
    devices(
      first: $first
      after: $after
      orderBy: { field: ENROLLED_AT, direction: DESC }
    )
      @connection(key: "DevicePosturePage_devices") {
      edges {
        node {
          id
          canDelete: permission(action: "core:device:delete")
          ...DevicePosturePageRowFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface DevicePosturePageProps {
  queryRef: PreloadedQuery<DevicePosturePageQuery>;
}

export default function DevicePosturePage({
  queryRef,
}: DevicePosturePageProps) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();

  usePageTitle(__("Device Posture"));

  const organization = usePreloadedQuery(devicePosturePageQuery, queryRef);

  const { data, loadNext, hasNext, isLoadingNext } =
    usePaginationFragment<
      DevicePosturePageRefetchQuery,
      DevicePosturePageFragment$key
    >(devicePosturePageFragment, organization.node);

  const connectionId = ConnectionHandler.getConnectionID(
    organizationId,
    DevicePostureConnectionKey,
  );

  const devices =
    data?.devices?.edges?.map((edge) => edge.node) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[__("Monitoring")]}
        title={__("Device Posture")}
        description={__(
          "View connected agents and their security posture status.",
        )}
      >
        {organization.node?.canCreateDevice && (
          <GenerateEnrollmentTokenDialog organizationId={organizationId}>
            <Button icon={IconKey}>
              {__("Enroll device")}
            </Button>
          </GenerateEnrollmentTokenDialog>
        )}
      </PageHeader>

      {devices.length === 0 ? (
        <EmptyState
          icon={<IconCircleCheck size={32} />}
          title={__("No devices enrolled")}
          description={__(
            "Install the soc2start-agent on a device and enroll it to see posture data here.",
          )}
        />
      ) : (
        <Card>
          <Table>
            <Thead>
              <Tr>
                <Th>{__("Hostname")}</Th>
                <Th>{__("Platform")}</Th>
                <Th>{__("OS")}</Th>
                <Th>{__("Agent")}</Th>
                <Th>{__("Status")}</Th>
                <Th>{__("Owner")}</Th>
                <Th>{__("Posture")}</Th>
                <Th>{__("Last Seen")}</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {devices.map((device) => (
                <DeviceRow
                  key={device.id}
                  fKey={device}
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

function statusVariant(status: string) {
  switch (status) {
    case "ONLINE":
      return "success" as const;
    case "OFFLINE":
      return "neutral" as const;
    case "REVOKED":
      return "danger" as const;
    default:
      return "neutral" as const;
  }
}

function DeviceRow({
  fKey,
  connectionId,
}: {
  fKey: DevicePosturePageRowFragment$key;
  connectionId: string;
}) {
  const { __ } = useTranslate();
  const { toast } = useToast();
  const confirm = useConfirm();
  const organizationId = useOrganizationId();

  const device = useFragment(deviceRowFragment, fKey);

  const [deleteDevice] =
    useMutation<DevicePosturePageDeleteMutation>(deleteDeviceMutation);

  const handleDelete = () => {
    confirm(
      () =>
        new Promise<void>((resolve, reject) => {
          deleteDevice({
            variables: {
              input: { deviceId: device.id },
              connections: [connectionId],
            },
            onCompleted(_, errors) {
              if (errors?.length) {
                toast({
                  title: __("Error"),
                  description:
                    (errors as GraphQLError[])[0]?.message ??
                    __("Unknown error"),
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
                description: __("Failed to delete device"),
                variant: "error",
              });
              reject(error);
            },
          });
        }),
      {
        message: sprintf(
          __("Are you sure you want to remove '%s'?"),
          device.hostname,
        ),
      },
    );
  };

  const { postureSummary } = device;
  const postureLabel =
    postureSummary.total === 0
      ? __("No checks")
      : `${postureSummary.pass}/${postureSummary.total}`;

  const postureVariant =
    postureSummary.total === 0
      ? ("neutral" as const)
      : postureSummary.fail > 0
        ? ("danger" as const)
        : ("success" as const);

  return (
    <Tr>
      <Td>
        <Link
          to={`/organizations/${organizationId}/monitoring/devices/${device.id}`}
          className="font-medium text-txt-primary hover:underline"
        >
          {device.hostname}
        </Link>
      </Td>
      <Td>{device.platform}</Td>
      <Td>{device.osVersion}</Td>
      <Td>{device.agentVersion}</Td>
      <Td>
        <Badge variant={statusVariant(device.status)}>
          {device.status}
        </Badge>
      </Td>
      <Td>{device.owner?.fullName ?? "—"}</Td>
      <Td>
        <Badge variant={postureVariant}>{postureLabel}</Badge>
      </Td>
      <Td>
        {device.lastHeartbeatAt ? formatDate(device.lastHeartbeatAt) : "—"}
      </Td>
      <Td>
        {device.canDelete && (
          <ActionDropdown>
            <DropdownItem
              icon={IconTrashCan}
              variant="danger"
              onClick={handleDelete}
            >
              {__("Remove")}
            </DropdownItem>
          </ActionDropdown>
        )}
      </Td>
    </Tr>
  );
}

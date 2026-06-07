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

import { formatDate } from "@probo/helpers";
import { usePageTitle } from "@probo/hooks";
import { useTranslate } from "@probo/i18n";
import {
  Badge,
  Card,
  PageHeader,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@probo/ui";
import { graphql, type PreloadedQuery, usePreloadedQuery } from "react-relay";

import type { DevicePostureDetailPageQuery } from "#/__generated__/core/DevicePostureDetailPageQuery.graphql";
import { useOrganizationId } from "#/hooks/useOrganizationId";

export const devicePostureDetailPageQuery = graphql`
  query DevicePostureDetailPageQuery($deviceId: ID!) {
    node(id: $deviceId) {
      ... on Device {
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
        postureChecks {
          id
          checkKey
          status
          evidence
          observedAt
        }
      }
    }
  }
`;

interface DevicePostureDetailPageProps {
  queryRef: PreloadedQuery<DevicePostureDetailPageQuery>;
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

function checkStatusVariant(status: string) {
  switch (status) {
    case "PASS":
      return "success" as const;
    case "FAIL":
      return "danger" as const;
    case "UNKNOWN":
      return "neutral" as const;
    case "NOT_APPLICABLE":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

function formatCheckKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DevicePostureDetailPage({
  queryRef,
}: DevicePostureDetailPageProps) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();
  const data = usePreloadedQuery(devicePostureDetailPageQuery, queryRef);
  const device = data.node;

  usePageTitle(device?.hostname ?? __("Device"));

  if (!device) {
    return null;
  }

  const postureSummary = device.postureSummary ?? {
    total: 0,
    pass: 0,
    fail: 0,
    unknown: 0,
  };
  const postureChecks = device.postureChecks ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          __("Monitoring"),
          {
            label: __("Device Posture"),
            to: `/organizations/${organizationId}/monitoring/devices`,
          },
        ]}
        title={device.hostname ?? ""}
        description={`${device.platform ?? ""} · ${device.osVersion ?? ""} · Agent ${device.agentVersion ?? ""}`}
      >
        <Badge variant={statusVariant(device.status ?? "OFFLINE")}>
          {device.status ?? "OFFLINE"}
        </Badge>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-txt-secondary">{__("Owner")}</p>
            <p className="mt-1 font-medium">
              {device.owner?.fullName ?? "—"}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-txt-secondary">{__("Last Seen")}</p>
            <p className="mt-1 font-medium">
              {device.lastHeartbeatAt
                ? formatDate(device.lastHeartbeatAt)
                : "—"}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-txt-secondary">{__("Enrolled")}</p>
            <p className="mt-1 font-medium">
              {formatDate(device.enrolledAt)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-txt-secondary">
              {__("Posture Score")}
            </p>
            <p className="mt-1 font-medium">
              {postureSummary.total === 0
                ? "—"
                : `${postureSummary.pass}/${postureSummary.total} ${__("passing")}`}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{__("Posture Checks")}</h3>
        </div>
        {postureChecks.length === 0 ? (
          <div className="px-4 pb-4 text-sm text-txt-secondary">
            {__("No posture checks reported yet.")}
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>{__("Check")}</Th>
                <Th>{__("Status")}</Th>
                <Th>{__("Last Observed")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {postureChecks.map((check) => (
                <Tr key={check.id}>
                  <Td className="font-medium">
                    {formatCheckKey(check.checkKey)}
                  </Td>
                  <Td>
                    <Badge variant={checkStatusVariant(check.status)}>
                      {check.status}
                    </Badge>
                  </Td>
                  <Td>{formatDate(check.observedAt)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}

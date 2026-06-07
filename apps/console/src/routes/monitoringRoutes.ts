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

import { lazy } from "@probo/react-lazy";
import type { AppRoute } from "@probo/routes";

import { PageSkeleton } from "#/components/skeletons/PageSkeleton";

export const monitoringRoutes = [
  {
    path: "monitoring/prowler",
    Fallback: PageSkeleton,
    Component: lazy(
      () =>
        import(
          "#/pages/organizations/monitoring/MonitoringReportsPageLoader"
        ),
    ),
  },
  {
    path: "monitoring/pentesting",
    Fallback: PageSkeleton,
    Component: lazy(
      () =>
        import(
          "#/pages/organizations/monitoring/MonitoringReportsPageLoader"
        ),
    ),
  },
  {
    path: "monitoring/prowler/:reportId",
    Fallback: PageSkeleton,
    Component: lazy(
      () =>
        import(
          "#/pages/organizations/monitoring/MonitoringReportDetailsPageLoader"
        ),
    ),
  },
  {
    path: "monitoring/pentesting/:reportId",
    Fallback: PageSkeleton,
    Component: lazy(
      () =>
        import(
          "#/pages/organizations/monitoring/MonitoringReportDetailsPageLoader"
        ),
    ),
  },
  {
    path: "monitoring/devices",
    Fallback: PageSkeleton,
    Component: lazy(
      () =>
        import(
          "#/pages/organizations/monitoring/DevicePosturePageLoader"
        ),
    ),
  },
  {
    path: "monitoring/devices/:deviceId",
    Fallback: PageSkeleton,
    Component: lazy(
      () =>
        import(
          "#/pages/organizations/monitoring/DevicePostureDetailPageLoader"
        ),
    ),
  },
] satisfies AppRoute[];

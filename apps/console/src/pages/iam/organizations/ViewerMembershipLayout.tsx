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

import { useTranslate } from "@probo/i18n";
import { Button, Layout, Skeleton } from "@probo/ui";
import { Suspense, useState } from "react";
import { graphql, type PreloadedQuery, useMutation, usePreloadedQuery } from "react-relay";
import { Outlet } from "react-router";

import type { ViewerMembershipLayoutQuery } from "#/__generated__/iam/ViewerMembershipLayoutQuery.graphql";
import type { ViewerMembershipLayoutResendMutation } from "#/__generated__/iam/ViewerMembershipLayoutResendMutation.graphql";
import { CoreRelayProvider } from "#/providers/CoreRelayProvider";
import { CurrentUser } from "#/providers/CurrentUser";

import { MembershipsDropdown } from "./_components/MembershipsDropdown";
import { Sidebar } from "./_components/Sidebar";
import { ViewerMembershipDropdown } from "./_components/ViewerMembershipDropdown";

export const viewerMembershipLayoutQuery = graphql`
  query ViewerMembershipLayoutQuery(
    $organizationId: ID!
    $hideSidebar: Boolean!
  ) {
    organization: node(id: $organizationId) @required(action: THROW) {
      __typename
      ... on Organization {
        ...MembershipsDropdown_organizationFragment
        ...ViewerMembershipDropdownFragment
        ...SidebarFragment @skip(if: $hideSidebar)
        viewer @required(action: THROW) {
          fullName
          membership @required(action: THROW) {
            role
          }
        }
      }
    }
    viewer @required(action: THROW) {
      email
      emailVerified
    }
  }
`;

const resendVerificationEmailMutation = graphql`
  mutation ViewerMembershipLayoutResendMutation($input: ResendVerificationEmailInput!) {
    resendVerificationEmail(input: $input) {
      success
    }
  }
`;

export function ViewerMembershipLayout(props: {
  hideSidebar?: boolean;
  queryRef: PreloadedQuery<ViewerMembershipLayoutQuery>;
}) {
  const { hideSidebar = false, queryRef } = props;

  const { organization, viewer }
    = usePreloadedQuery<ViewerMembershipLayoutQuery>(
      viewerMembershipLayoutQuery,
      queryRef,
    );
  if (organization.__typename !== "Organization") {
    throw new Error("invalid type for organization node");
  }

  return (
    <Layout
      headerLeading={(
        <MembershipsDropdown organizationFKey={organization} />
      )}
      headerTrailing={(
        <Suspense fallback={<Skeleton className="w-32 h-8" />}>
          <ViewerMembershipDropdown fKey={organization} />
        </Suspense>
      )}
      sidebar={!hideSidebar && <Sidebar fKey={organization} />}
    >
      {!viewer.emailVerified && (
        <EmailVerificationBanner email={viewer.email} />
      )}
      <CoreRelayProvider>
        <CurrentUser
          value={{
            email: viewer.email,
            fullName: organization.viewer.fullName,
            role: organization.viewer.membership.role,
          }}
        >
          <Outlet context={organization.viewer.membership.role} />
        </CurrentUser>
      </CoreRelayProvider>
    </Layout>
  );
}

function EmailVerificationBanner({ email }: { email: string }) {
  const { __ } = useTranslate();
  const [sent, setSent] = useState(false);

  const [resendEmail, isInFlight]
    = useMutation<ViewerMembershipLayoutResendMutation>(resendVerificationEmailMutation);

  const handleResend = () => {
    resendEmail({
      variables: { input: { email } },
      onCompleted: () => setSent(true),
    });
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-yellow-50 dark:bg-yellow-950/30 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2.5 text-sm">
      <p className="text-yellow-800 dark:text-yellow-200">
        {__("Please verify your email address to secure your account.")}
      </p>
      {sent
        ? (
            <span className="text-yellow-700 dark:text-yellow-300 whitespace-nowrap">
              {__("Verification email sent")}
            </span>
          )
        : (
            <Button
              variant="secondary"
              className="text-xs py-1 px-3"
              onClick={handleResend}
              disabled={isInFlight}
            >
              {isInFlight ? __("Sending...") : __("Resend verification email")}
            </Button>
          )}
    </div>
  );
}

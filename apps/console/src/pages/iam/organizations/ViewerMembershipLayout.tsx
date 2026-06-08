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
    <div className="flex items-center justify-between gap-4 bg-warning border-b border-border-warning px-5 py-3 text-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-txt-warning/20 flex items-center justify-center">
          <span className="text-txt-warning text-xs font-bold">!</span>
        </div>
        <p className="text-txt-warning font-medium truncate">
          {__("Please verify your email address to secure your account.")}
        </p>
      </div>
      {sent
        ? (
            <span className="text-txt-success text-xs font-medium whitespace-nowrap flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                <path d="M11.5 3.5L5.5 10L2.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {__("Verification email sent")}
            </span>
          )
        : (
            <Button
              variant="secondary"
              className="text-xs py-1.5 px-4 whitespace-nowrap"
              onClick={handleResend}
              disabled={isInFlight}
            >
              {isInFlight ? __("Sending...") : __("Resend email")}
            </Button>
          )}
    </div>
  );
}

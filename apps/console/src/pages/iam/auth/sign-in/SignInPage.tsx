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
import { Button } from "@probo/ui";
import { type PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Link, useLocation } from "react-router";
import { graphql } from "relay-runtime";

import type { SignInPageQuery } from "#/__generated__/iam/SignInPageQuery.graphql";

import { Divider } from "./_components/Divider";
import { OIDCButton } from "./_components/OIDCButton";

export const signInPageQuery = graphql`
  query SignInPageQuery {
    oidcProviders {
      ...OIDCButtonFragment
    }
  }
`;

type Props = {
  queryRef: PreloadedQuery<SignInPageQuery>;
};

export default function SignInPage(props: Props) {
  const { __ } = useTranslate();
  const location = useLocation();

  const data = usePreloadedQuery<SignInPageQuery>(signInPageQuery, props.queryRef);

  return (
    <div className="w-full max-w-sm mx-auto pt-8">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        {__("Sign in to your account")}
      </h1>

      <div className="mt-8 space-y-4">
        {data.oidcProviders.map((providerRef, index) => (
          <div key={index} className="auth-btn-hover rounded-lg">
            <OIDCButton providerRef={providerRef} />
          </div>
        ))}

        <div className="auth-btn-hover rounded-lg">
          <Button
            variant="secondary"
            className="w-full h-12"
            to={{ pathname: "/auth/sso-login", search: location.search }}
          >
            {__("Sign in with SSO")}
          </Button>
        </div>

        <Divider>{__("Or")}</Divider>

        <div className="auth-btn-hover rounded-lg">
          <Button
            variant="secondary"
            className="w-full h-12"
            to={{ pathname: "/auth/password-login", search: location.search }}
          >
            {__("Sign in with email")}
          </Button>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border-solid text-center">
        <p className="text-sm text-txt-secondary">
          {__("New to SOC2Start.io?")}
          {" "}
          <Link
            to={{ pathname: "/auth/register", search: location.search }}
            className="font-medium text-txt-primary hover:text-txt-accent transition-colors underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent"
          >
            {__("Create account")}
          </Link>
        </p>
      </div>
    </div>
  );
}

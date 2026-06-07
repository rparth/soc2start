// Copyright (c) 2025-2026 Probo Inc <hello@getprobo.com>.
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

import { Card, Logo } from "@probo/ui";
import type { PropsWithChildren } from "react";
import { Outlet } from "react-router";

import { IAMRelayProvider } from "#/providers/IAMRelayProvider";

export default function AuthLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="relative min-h-dvh text-txt-primary bg-level-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--color-level-1)_0%,_var(--color-level-0)_70%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--color-border-low)_1px,_transparent_1px)] [background-size:24px_24px]" />
      <Card className="relative w-full max-w-lg px-12 py-12 flex flex-col items-center justify-center shadow-mid">
        <div className="w-full flex flex-col items-center justify-center gap-10">
          <Logo withPicto />
          <div className="w-full border-t border-t-border-solid" />
        </div>
        <IAMRelayProvider>
          {children ?? <Outlet />}
        </IAMRelayProvider>
      </Card>
    </div>
  );
}

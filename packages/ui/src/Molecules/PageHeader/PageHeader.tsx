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

import type { PropsWithChildren, ReactNode } from "react";

import { Breadcrumb } from "../../Atoms/Breadcrumb/Breadcrumb";

type BreadcrumbItem = { label: string; to?: string };

type Props = PropsWithChildren<{
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: (BreadcrumbItem | string)[];
}>;

export function PageHeader({ title, description, breadcrumbs, children }: Props) {
  return (
    <div className="space-y-2 w-full">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start w-full">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl sm:text-2xl flex gap-3 sm:gap-4 font-semibold items-center">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-txt-secondary">{description}</p>
          )}
        </div>
        <div className="flex gap-3 flex-shrink-0">{children}</div>
      </div>
    </div>
  );
}

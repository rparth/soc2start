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

import { clsx } from "clsx";
import { useId } from "react";

type Props = {
  className?: string;
  withPicto?: boolean;
};

function ShieldIcon({ size = 32 }: { size?: number }) {
  const id = useId();
  const fillId = `shield-fill-${id}`;
  const strokeId = `check-stroke-${id}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A3D5E" />
          <stop offset="100%" stopColor="#0D2137" />
        </linearGradient>
        <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D278" />
          <stop offset="100%" stopColor="#27AE60" />
        </linearGradient>
      </defs>
      <path
        d="M256 36 L88 112 L88 252 C88 376 256 480 256 480 C256 480 424 376 424 252 L424 112 Z"
        fill={`url(#${fillId})`}
      />
      <path
        d="M256 36 L88 112 L88 252 C88 376 256 480 256 480 C256 480 424 376 424 252 L424 112 Z"
        fill="none"
        stroke="#2D5A8A"
        strokeWidth="3"
        opacity="0.4"
      />
      <polyline
        points="190,264 234,316 328,204"
        fill="none"
        stroke={`url(#${strokeId})`}
        strokeWidth="36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, withPicto }: Props) {
  if (withPicto) {
    return (
      <div className={clsx(className, "flex items-center gap-3")} role="img" aria-label="SOC2Start.io">
        <ShieldIcon size={40} />
        <span className="text-2xl tracking-[-1.5px] leading-none">
          <span className="font-extrabold text-[var(--color-txt-primary)]">SOC2</span>
          <span className="font-light text-[var(--color-txt-primary)]">Start</span>
          <span className="font-light text-[var(--color-txt-accent)]">.io</span>
        </span>
      </div>
    );
  }
  return (
    <span className={clsx(className, "tracking-[-1.5px] leading-none")} role="img" aria-label="SOC2Start.io">
      <span className="font-extrabold">SOC2</span>
      <span className="font-light">Start</span>
      <span className="font-light text-[var(--color-txt-accent)]">.io</span>
    </span>
  );
}

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

type Props = {
  className?: string;
  withPicto?: boolean;
};

function ShieldIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
    >
      <defs>
        <linearGradient id="shield-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A3D5E" />
          <stop offset="100%" stopColor="#0D2137" />
        </linearGradient>
        <linearGradient id="check-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D278" />
          <stop offset="100%" stopColor="#27AE60" />
        </linearGradient>
      </defs>
      <path
        d="M256 36 L88 112 L88 252 C88 376 256 480 256 480 C256 480 424 376 424 252 L424 112 Z"
        fill="url(#shield-fill)"
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
        stroke="url(#check-stroke)"
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
      <div className={clsx(className, "flex items-center gap-2")}>
        <ShieldIcon />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 160 24"
          className="h-6"
          role="img"
          aria-label="SOC2Start.io"
        >
          <text
            x="0"
            y="18"
            fontFamily="Inter, system-ui, sans-serif"
            fill="var(--color-txt-primary)"
          >
            <tspan fontWeight="800" letterSpacing="-1.5px">SOC2</tspan>
            <tspan fontWeight="300">Start</tspan>
          </text>
          <text
            x="118"
            y="18"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="300"
            fill="var(--color-txt-accent)"
          >.io</text>
        </svg>
      </div>
    );
  }
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 160 24"
      role="img"
      aria-label="SOC2Start.io"
    >
      <text
        x="0"
        y="18"
        fontFamily="Inter, system-ui, sans-serif"
        fill="currentColor"
      >
        <tspan fontWeight="800" letterSpacing="-1.5px">SOC2</tspan>
        <tspan fontWeight="300">Start</tspan>
      </text>
      <text
        x="118"
        y="18"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="300"
        fill="var(--color-txt-accent)"
      >.io</text>
    </svg>
  );
}

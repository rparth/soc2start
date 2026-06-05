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

export function Logo({ className, withPicto }: Props) {
  const id = useId();
  if (withPicto) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className={clsx(className, "aspect-[200/32]")}
        viewBox="0 0 200 32"
        role="img"
        aria-label="SOC2Start.io"
      >
        <rect
          width="28"
          height="28"
          x="2"
          y="2"
          rx="6"
          fill="#1A3D5E"
        />
        <path
          d="M10 17.5l4 4 8-9"
          stroke="#27AE60"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <text
          x="38"
          y="22"
          fontFamily="Inter, system-ui, sans-serif"
          fill="var(--color-txt-primary)"
        >
          <tspan fontWeight="800" letterSpacing="-1.5px">SOC2</tspan>
          <tspan fontWeight="300">Start</tspan>
        </text>
        <text
          x="150"
          y="22"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="300"
          fill="#27AE60"
        >.io</text>
      </svg>
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
        fill="#27AE60"
      >.io</text>
    </svg>
  );
}

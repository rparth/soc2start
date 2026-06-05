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

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  PropsWithChildren,
} from "react";
import { Link, type To } from "react-router";
import { tv, type VariantProps } from "tailwind-variants";

import { Slot } from "../Slot";

export const button = tv({
  base: "flex items-center justify-center gap-[6px] px-6 py-3 rounded-lg cursor-pointer text-sm font-semibold focus:outline-none whitespace-nowrap w-max transition-all duration-150",
  variants: {
    variant: {
      primary:
                "bg-emerald text-white hover:bg-emerald-light hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(39,174,96,0.3)] shadow-base active:bg-emerald active:translate-y-0 active:scale-[0.98] active:shadow-none",
      secondary:
                "bg-white text-txt-primary hover:bg-subtle hover:border-border-accent hover:text-txt-primary shadow-base hover:shadow-hover active:bg-highlight active:scale-[0.98] active:shadow-none border-2 border-border-strong",
      tertiary:
                "bg-transparent text-txt-primary hover:text-txt-accent active:bg-tertiary-pressed",
      quaternary:
                "bg-highlight text-txt-primary hover:bg-highlight-hover active:bg-highlight-pressed",
      danger: "bg-danger-plain text-txt-invert hover:bg-danger-hover shadow-base hover:shadow-hover active:bg-danger-pressed border border-border-danger",
    },
    disabled: {
      true: "opacity-60 cursor-default",
    },
    empty: {
      true: "p-2 size-8",
    },
  },
  defaultVariants: {
    variant: "primary",
    icon: false,
    children: undefined,
  },
});

type Props = PropsWithChildren<
  {
    icon?: FC<{ size: number; className?: string }>;
    iconAfter?: FC<{ size: number; className?: string }>;
    disabled?: boolean;
    onClick?: () => void;
    variant?:
      | "primary"
      | "secondary"
      | "tertiary"
      | "quaternary"
      | "danger";
    to?: To;
    asChild?: boolean;
  } & VariantProps<typeof button>
>
& (
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>
    );

export const Button = (props: Props) => {
  const {
    icon: IconComponent,
    iconAfter: IconAfterComponent,
    children,
    onClick,
    variant,
    asChild,
    ...componentProps
  } = props;
  if (asChild) {
    return (
      <Slot
        {...componentProps}
        className={button({ ...props, variant, empty: !children })}
      >
        {children}
      </Slot>
    );
  }

  const Component = props.to ? Link : "button";
  return (
  // @ts-expect-error Component is too dynamic
    <Component
      {...componentProps}
      onClick={onClick}
      className={button({ ...props, variant, empty: !children })}
    >
      {IconComponent && <IconComponent size={16} className="flex-none" />}
      {children}
      {IconAfterComponent && (
        <IconAfterComponent size={16} className="flex-none" />
      )}
    </Component>
  );
};

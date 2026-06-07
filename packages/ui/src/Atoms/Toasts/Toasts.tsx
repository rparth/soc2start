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

import type { FC } from "react";
import { tv } from "tailwind-variants";
import { create } from "zustand";
import { combine } from "zustand/middleware";

import { IconCircleCheck } from "../Icons/IconCircleCheck";
import { IconCircleInfo } from "../Icons/IconCircleInfo";
import { IconCircleX } from "../Icons/IconCircleX";
import { IconCrossLargeX } from "../Icons/IconCrossLargeX";
import { IconWarning } from "../Icons/IconWarning";
import type { IconProps } from "../Icons/type";

type Toast = {
  title: string;
  description: string;
  variant?: "success" | "error" | "warning" | "info";
  id: string;
};

const duration = 4000;

const useToasts = create(
  combine({ toasts: [] as Toast[] }, set => ({
    add: (toast: Pick<Toast, "title" | "description" | "variant">) => {
      const id = Date.now().toString();
      set(state => ({
        toasts: [{ ...toast, id }, ...state.toasts],
      }));
      setTimeout(() => {
        set(state => ({
          toasts: [
            ...state.toasts.filter(toast => toast.id !== id),
          ],
        }));
      }, duration);
    },
    remove: (id: string) =>
      set(state => ({
        toasts: state.toasts.filter(toast => toast.id !== id),
      })),
  })),
);

/**
 * Hook used to trigger toasts
 */
export function useToast() {
  return {
    toast: useToasts().add,
  };
}

/**
 * Toasts displayed at the bottom right of the screen.
 */
export function Toasts() {
  const { toasts, remove } = useToasts();
  return (
    <div className="fixed z-100 bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 space-y-3">
      {toasts.map(toast => (
        <div key={toast.id}>
          <Toast {...toast} onClose={() => remove(toast.id)} />
        </div>
      ))}
    </div>
  );
}

const variantIcon: Record<string, FC<IconProps>> = {
  success: IconCircleCheck,
  error: IconCircleX,
  warning: IconWarning,
  info: IconCircleInfo,
};

const toastStyles = tv({
  slots: {
    wrapper:
            "relative overflow-hidden bg-level-1 border border-border-solid rounded-xl shadow-dialog animate-in slide-in-from-bottom-3 fade-in-0 duration-200 ease-[var(--ease-out-expo)]",
    icon: "flex-none mt-0.5",
    timer: "absolute bottom-0 left-0 h-[2px] starting:scale-x-0 scale-x-100 origin-left transition-transform ease-linear rounded-b-xl",
    close: "flex-none p-1 rounded-md text-txt-quaternary hover:text-txt-secondary hover:bg-subtle transition-colors duration-150 cursor-pointer",
  },
  variants: {
    variant: {
      success: {
        icon: "text-txt-success",
        timer: "bg-txt-success/40",
      },
      error: {
        icon: "text-txt-danger",
        timer: "bg-txt-danger/40",
      },
      warning: {
        icon: "text-txt-warning",
        timer: "bg-txt-warning/40",
      },
      info: {
        icon: "text-txt-info",
        timer: "bg-txt-info/40",
      },
    },
  },
  defaultVariants: {
    variant: "success",
  },
});

export function Toast({ onClose, ...props }: Toast & { onClose: () => void }) {
  const { wrapper, icon, timer, close } = toastStyles(props);
  const IconComponent = variantIcon[props.variant ?? "success"];

  return (
    <div className={wrapper()}>
      <div className="flex items-start gap-3 p-4">
        <div className={icon()}>
          <IconComponent size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-txt-primary">{props.title}</div>
          {props.description && (
            <div className="text-sm text-txt-secondary mt-0.5 leading-snug">{props.description}</div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className={close()}
        >
          <IconCrossLargeX size={14} />
        </button>
      </div>
      <div
        className={timer()}
        style={{ transitionDuration: `${duration}ms` }}
      />
    </div>
  );
}

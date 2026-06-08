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

import { clsx } from "clsx";
import {
  type FC,
  forwardRef,
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import { tv } from "tailwind-variants";

import { IconChevronRight } from "../Icons";

import { sidebarContext, useSidebarCollapsed } from "./Sidebar";

const sectionHeader = tv({
  base: "flex items-center gap-2 w-full py-2 rounded-full cursor-pointer select-none transition-colors",
  variants: {
    hasActiveChild: {
      true: "text-txt-accent",
      false: "text-txt-tertiary",
    },
    isCollapsed: {
      true: "px-[10px]",
      false: "px-3",
    },
    isHovered: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      hasActiveChild: false,
      isHovered: true,
      className: "bg-subtle-hover",
    },
    {
      hasActiveChild: false,
      isHovered: false,
      className: "",
    },
  ],
  defaultVariants: {
    hasActiveChild: false,
    isHovered: false,
  },
});

type FlyoutProps = PropsWithChildren<{
  show: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  label: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}>;

const FlyoutPanel = forwardRef<HTMLDivElement, FlyoutProps>(
  function FlyoutPanel({ show, triggerRef, label, children, onMouseEnter, onMouseLeave }, ref) {
    const [leftPx, setLeftPx] = useState(56);
    const [animateIn, setAnimateIn] = useState(false);

    useLayoutEffect(() => {
      if (show && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setLeftPx(rect.right + 4);
      }
    }, [show, triggerRef]);

    useEffect(() => {
      if (show) {
        const id = requestAnimationFrame(() => setAnimateIn(true));
        return () => {
          cancelAnimationFrame(id);
          setAnimateIn(false);
        };
      }
    }, [show]);

    if (!show) return null;

    return createPortal(
      <div
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={clsx(
          "fixed top-12 bottom-0 z-50 w-[220px] border-r border-border-solid bg-level-1 px-2 py-4 shadow-lg transition-all duration-150 ease-out overflow-y-auto",
          animateIn
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-2",
        )}
        style={{ left: leftPx }}
      >
        <div className="px-3 py-1.5 text-xs font-semibold text-txt-secondary uppercase tracking-wider">
          {label}
        </div>
        {children}
      </div>,
      document.body,
    );
  },
);

type Props = PropsWithChildren<{
  icon: FC<{ size: number }>;
  label: string;
  basePaths: string[];
}>;

export function SidebarSection({ icon: Icon, label, basePaths, children }: Props) {
  const isCollapsed = useSidebarCollapsed();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [showFlyout, setShowFlyout] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const hasActiveChild = basePaths.some(path => location.pathname.startsWith(path));

  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(`sidebar-section-${label}`);
    if (stored !== null) return JSON.parse(stored) as boolean;
    return hasActiveChild;
  });

  useEffect(() => {
    if (hasActiveChild && !isOpen) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  useEffect(() => {
    setShowFlyout(false);
  }, [location.pathname, isCollapsed]);

  const toggleOpen = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem(`sidebar-section-${label}`, JSON.stringify(next));
  }, [isOpen, label]);

  useEffect(() => {
    if (!showFlyout) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        flyoutRef.current && !flyoutRef.current.contains(e.target as Node)
        && triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setShowFlyout(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowFlyout(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showFlyout]);

  const openFlyout = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setShowFlyout(true), 120);
  }, []);

  const closeFlyout = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    closeTimerRef.current = setTimeout(() => setShowFlyout(false), 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  if (isCollapsed) {
    return (
      <li>
        <button
          ref={triggerRef}
          type="button"
          onMouseEnter={() => { setIsHovered(true); openFlyout(); }}
          onMouseLeave={() => { setIsHovered(false); closeFlyout(); }}
          className={sectionHeader({ hasActiveChild, isCollapsed: true, isHovered })}
        >
          <Icon size={16} />
        </button>
        <FlyoutPanel
          ref={flyoutRef}
          show={showFlyout}
          triggerRef={triggerRef}
          label={label}
          onMouseEnter={cancelClose}
          onMouseLeave={closeFlyout}
        >
          <sidebarContext.Provider value={{ open: true }}>
            <ul className="space-y-[2px]">
              {children}
            </ul>
          </sidebarContext.Provider>
        </FlyoutPanel>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={toggleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={sectionHeader({ hasActiveChild, isCollapsed: false, isHovered })}
      >
        <Icon size={16} />
        <span className="flex-1 text-left text-sm font-semibold">{label}</span>
        <IconChevronRight
          size={12}
          className={clsx(
            "transition-transform duration-150",
            isOpen && "rotate-90",
          )}
        />
      </button>
      <ul
        className={clsx(
          "overflow-hidden transition-all duration-150",
          isOpen ? "ml-5 mt-[2px] space-y-[2px]" : "max-h-0",
        )}
      >
        {isOpen && children}
      </ul>
    </li>
  );
}

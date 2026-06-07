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
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import { tv } from "tailwind-variants";

import { IconChevronRight } from "../Icons";

import { sidebarContext, useSidebarCollapsed } from "./Sidebar";

const sectionHeader = tv({
  base: "flex items-center gap-2 w-full py-2 rounded-full cursor-pointer select-none transition-colors",
  variants: {
    hasActiveChild: {
      true: "text-txt-primary",
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFlyout]);

  if (isCollapsed) {
    return (
      <li className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setShowFlyout(!showFlyout)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={sectionHeader({ hasActiveChild, isCollapsed: true, isHovered })}
        >
          <Icon size={16} />
        </button>
        {showFlyout && (
          <div
            ref={flyoutRef}
            className="absolute left-full top-0 ml-1 z-50 min-w-[200px] rounded-lg border border-border-solid bg-level-0 p-2 shadow-md"
          >
            <div className="px-3 py-1.5 text-xs font-medium text-txt-tertiary uppercase tracking-wider">
              {label}
            </div>
            <sidebarContext.Provider value={{ open: true }}>
              <ul className="space-y-[2px]">
                {children}
              </ul>
            </sidebarContext.Provider>
          </div>
        )}
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
        <span className="flex-1 text-left text-sm">{label}</span>
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

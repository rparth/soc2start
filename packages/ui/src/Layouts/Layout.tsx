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
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";

import { IconCrossLargeX, IconListStack } from "../Atoms/Icons";
import { Logo } from "../Atoms/Logo/Logo";
import { Sidebar } from "../Atoms/Sidebar/Sidebar";
import { Toasts } from "../Atoms/Toasts/Toasts";
import { ConfirmDialog } from "../Molecules/Dialog/ConfirmDialog";

type Props = PropsWithChildren<{
  headerLeading?: ReactNode;
  headerTrailing: ReactNode;
  sidebar?: ReactNode;
}>;

const LayoutContext = createContext({
  setDrawer: (() => {}) as (v: boolean) => void,
  setMobileMenu: (() => {}) as (v: boolean) => void,
});

export function Layout({
  headerLeading,
  headerTrailing,
  sidebar,
  children,
}: Props) {
  const [hasDrawer, setDrawer] = useState(false);
  const [mobileMenuOpen, setMobileMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileMenuOpen]);

  const layoutContext = useMemo(
    () => ({
      setDrawer,
      setMobileMenu,
    }),
    [],
  );
  return (
    <LayoutContext value={layoutContext}>
      <div className="text-txt-primary bg-level-0 min-h-screen">
        <header className="fixed top-0 z-20 left-0 right-0 px-3 lg:px-4 flex items-center border-b border-border-solid h-12 bg-level-0">
          {sidebar && (
            <button
              className="lg:hidden mr-2 p-1.5 -ml-1 rounded-lg text-txt-secondary hover:text-txt-primary hover:bg-highlight transition-colors duration-150"
              onClick={() => setMobileMenu(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen
                ? <IconCrossLargeX size={20} />
                : <IconListStack size={20} />}
            </button>
          )}
          <Link to="/">
            <Logo withPicto size="sm" />
          </Link>
          {headerLeading && (
            <>
              <svg
                className="mx-3 text-txt-tertiary hidden sm:block"
                width="8"
                height="18"
                viewBox="0 0 8 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 17L7 1" stroke="currentColor" />
              </svg>
              <div className="hidden sm:contents">
                {headerLeading}
              </div>
            </>
          )}
          <div className="ml-auto">{headerTrailing}</div>
        </header>

        {sidebar && mobileMenuOpen && (
          <div className="fixed inset-0 z-10 lg:hidden">
            <div
              className="absolute inset-0 bg-dialog/30"
              onClick={() => setMobileMenu(false)}
            />
            <aside className="relative z-10 h-full w-[280px] max-w-[85vw] bg-level-0 border-r border-border-solid pt-12 flex flex-col overflow-y-auto">
              <div className="px-4 flex-1 pb-2 pt-4">
                {sidebar}
              </div>
            </aside>
          </div>
        )}

        <div className="flex min-h-screen" id="main">
          {sidebar && (
            <div className="hidden lg:contents">
              <Sidebar>{sidebar}</Sidebar>
            </div>
          )}
          <main
            className={clsx(
              "w-full mt-12 transition-all duration-300",
              hasDrawer && "lg:pr-105",
            )}
          >
            <div className="py-6 px-4 sm:px-6 lg:py-12 lg:px-8 max-w-[1200px] w-full mx-auto min-h-[calc(100vh-48px)]">
              {children}
            </div>
          </main>
        </div>
        <Toasts />
        <ConfirmDialog />
      </div>
    </LayoutContext>
  );
}

export function Drawer({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const { setDrawer } = useContext(LayoutContext);
  useEffect(() => {
    setDrawer(true);
    return () => {
      setDrawer(false);
    };
  }, [setDrawer]);
  return createPortal(
    <aside
      className={clsx(
        "fixed pt-20 top-0 right-0 w-full sm:w-105 px-4 sm:px-6 pb-8 border-border-solid sm:border-l h-screen bg-level-0 z-10",
        className,
      )}
    >
      {children}
    </aside>,
    document.body,
  );
}

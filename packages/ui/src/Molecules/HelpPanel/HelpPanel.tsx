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
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Button } from "../../Atoms/Button/Button";
import { IconCircleQuestionmark } from "../../Atoms/Icons/IconCircleQuestionmark";
import { IconCrossLargeX } from "../../Atoms/Icons/IconCrossLargeX";

export type HelpSection = {
  title: string;
  content: string;
};

export type HelpContent = {
  title: string;
  subtitle?: string;
  description: string;
  sections?: HelpSection[];
  relatedPages?: { label: string; key: string }[];
};

type HelpPanelContextValue = {
  open: (content: HelpContent) => void;
  close: () => void;
  isOpen: boolean;
};

const HelpPanelContext = createContext<HelpPanelContextValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function useHelpPanel() {
  return useContext(HelpPanelContext);
}

export function HelpPanelProvider({ children }: PropsWithChildren) {
  const [content, setContent] = useState<HelpContent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const open = useCallback((c: HelpContent) => {
    setContent(c);
    setIsVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setIsVisible(false);
      setContent(null);
    }, 300);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isVisible, close]);

  return (
    <HelpPanelContext.Provider value={{ open, close, isOpen: isVisible }}>
      {children}
      {isVisible && content && (
        <HelpPanelOverlay isOpen={isOpen} onClose={close} content={content} />
      )}
    </HelpPanelContext.Provider>
  );
}

function HelpPanelOverlay({
  isOpen,
  onClose,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  content: HelpContent;
}) {
  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-dialog/20 backdrop-blur-[1px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-level-1 shadow-dialog border-l border-border-low",
          "transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between px-6 py-4 border-b border-border-low">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-md bg-accent/10 flex items-center justify-center">
                <IconCircleQuestionmark size={18} className="text-txt-accent" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-txt-primary">{content.title}</h2>
                {content.subtitle && (
                  <p className="text-xs text-txt-tertiary">{content.subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-md flex items-center justify-center hover:bg-tertiary-hover transition-colors"
            >
              <IconCrossLargeX size={16} className="text-txt-secondary" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-6">
              <p className="text-sm text-txt-secondary leading-relaxed">{content.description}</p>

              {content.sections && content.sections.length > 0 && (
                <div className="space-y-4">
                  {content.sections.map((section) => (
                    <HelpSectionCard key={section.title} section={section} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function HelpSectionCard({ section }: { section: HelpSection }) {
  return (
    <div className="rounded-md border border-border-low bg-level-0 p-4 space-y-2">
      <h3 className="text-sm font-medium text-txt-primary">{section.title}</h3>
      <p className="text-sm text-txt-secondary leading-relaxed">{section.content}</p>
    </div>
  );
}

export function HelpButton({
  content,
  variant = "icon",
  label,
}: {
  content: HelpContent;
  variant?: "icon" | "button";
  label?: ReactNode;
}) {
  const { open } = useHelpPanel();

  if (variant === "button") {
    return (
      <Button variant="secondary" onClick={() => open(content)}>
        <IconCircleQuestionmark size={16} />
        {label ?? "Help"}
      </Button>
    );
  }

  return (
    <button
      onClick={() => open(content)}
      className="size-8 rounded-md flex items-center justify-center hover:bg-tertiary-hover transition-colors text-txt-tertiary hover:text-txt-secondary"
      aria-label="Help"
    >
      <IconCircleQuestionmark size={18} />
    </button>
  );
}

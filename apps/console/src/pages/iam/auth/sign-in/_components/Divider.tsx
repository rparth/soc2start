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

export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-8 w-full flex items-center gap-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-mid to-border-mid" />
      <span className="text-xs uppercase tracking-wider text-txt-quaternary font-medium select-none">
        {children}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border-mid to-border-mid" />
    </div>
  );
}

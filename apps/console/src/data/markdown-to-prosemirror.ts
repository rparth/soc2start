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

import { type Token, type Tokens, lexer } from "marked";

type ProseMirrorMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

type ProseMirrorNode = {
  type: string;
  content?: ProseMirrorNode[];
  marks?: ProseMirrorMark[];
  text?: string;
  attrs?: Record<string, unknown>;
};

function unescapeHtml(html: string): string {
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function textNode(text: string, marks?: ProseMirrorMark[]): ProseMirrorNode {
  const node: ProseMirrorNode = { type: "text", text: unescapeHtml(text) };
  if (marks && marks.length > 0) {
    node.marks = marks;
  }
  return node;
}

function convertInlineTokens(tokens: Token[], outerMarks: ProseMirrorMark[] = []): ProseMirrorNode[] {
  const nodes: ProseMirrorNode[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "text": {
        const t = token as Tokens.Text;
        if (t.tokens && t.tokens.length > 0) {
          nodes.push(...convertInlineTokens(t.tokens, outerMarks));
        } else if (t.text) {
          nodes.push(textNode(t.text, outerMarks.length > 0 ? [...outerMarks] : undefined));
        }
        break;
      }
      case "strong":
        nodes.push(...convertInlineTokens(
          (token as Tokens.Strong).tokens,
          [...outerMarks, { type: "bold" }],
        ));
        break;
      case "em":
        nodes.push(...convertInlineTokens(
          (token as Tokens.Em).tokens,
          [...outerMarks, { type: "italic" }],
        ));
        break;
      case "del":
        nodes.push(...convertInlineTokens(
          (token as Tokens.Del).tokens,
          [...outerMarks, { type: "strike" }],
        ));
        break;
      case "codespan": {
        const code = unescapeHtml((token as Tokens.Codespan).text);
        if (code) {
          nodes.push(textNode(code, [...outerMarks, { type: "code" }]));
        }
        break;
      }
      case "link": {
        const link = token as Tokens.Link;
        nodes.push(...convertInlineTokens(
          link.tokens,
          [...outerMarks, { type: "link", attrs: { href: link.href } }],
        ));
        break;
      }
      case "br":
        nodes.push({ type: "hardBreak" });
        break;
      case "escape":
        nodes.push(textNode((token as Tokens.Escape).text, outerMarks.length > 0 ? [...outerMarks] : undefined));
        break;
      default:
        break;
    }
  }

  return nodes;
}

function convertBlockTokens(tokens: Token[]): ProseMirrorNode[] {
  const nodes: ProseMirrorNode[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const h = token as Tokens.Heading;
        const content = convertInlineTokens(h.tokens);
        nodes.push({
          type: "heading",
          attrs: { level: h.depth },
          ...(content.length > 0 ? { content } : {}),
        });
        break;
      }
      case "paragraph": {
        const p = token as Tokens.Paragraph;
        const content = convertInlineTokens(p.tokens);
        nodes.push({
          type: "paragraph",
          ...(content.length > 0 ? { content } : {}),
        });
        break;
      }
      case "blockquote": {
        const bq = token as Tokens.Blockquote;
        const content = convertBlockTokens(bq.tokens);
        nodes.push({
          type: "blockquote",
          ...(content.length > 0 ? { content } : {}),
        });
        break;
      }
      case "code": {
        const cb = token as Tokens.Code;
        const node: ProseMirrorNode = {
          type: "codeBlock",
          attrs: { language: cb.lang || null },
        };
        if (cb.text) {
          node.content = [{ type: "text", text: cb.text }];
        }
        nodes.push(node);
        break;
      }
      case "list": {
        const list = token as Tokens.List;
        const items = list.items.map((item) => {
          const children: ProseMirrorNode[] = [];
          for (const child of item.tokens) {
            if (child.type === "text") {
              const textToken = child as Tokens.Text;
              const inlineContent = textToken.tokens
                ? convertInlineTokens(textToken.tokens)
                : [textNode(textToken.text)];
              children.push({
                type: "paragraph",
                ...(inlineContent.length > 0 ? { content: inlineContent } : {}),
              });
            } else {
              children.push(...convertBlockTokens([child]));
            }
          }
          if (children.length === 0) {
            children.push({ type: "paragraph" });
          }
          return { type: "listItem", content: children } as ProseMirrorNode;
        });

        if (list.ordered) {
          nodes.push({
            type: "orderedList",
            attrs: { start: list.start },
            content: items,
          });
        } else {
          nodes.push({
            type: "bulletList",
            content: items,
          });
        }
        break;
      }
      case "table": {
        const table = token as Tokens.Table;
        const rows: ProseMirrorNode[] = [];

        const headerCells = table.header.map((cell) => {
          const content = convertInlineTokens(cell.tokens);
          return {
            type: "tableHeader",
            attrs: { colspan: 1, rowspan: 1, colwidth: null },
            content: [{
              type: "paragraph",
              ...(content.length > 0 ? { content } : {}),
            }],
          } as ProseMirrorNode;
        });
        rows.push({ type: "tableRow", content: headerCells });

        for (const row of table.rows) {
          const dataCells = row.map((cell) => {
            const content = convertInlineTokens(cell.tokens);
            return {
              type: "tableCell",
              attrs: { colspan: 1, rowspan: 1, colwidth: null },
              content: [{
                type: "paragraph",
                ...(content.length > 0 ? { content } : {}),
              }],
            } as ProseMirrorNode;
          });
          rows.push({ type: "tableRow", content: dataCells });
        }

        nodes.push({ type: "table", content: rows });
        break;
      }
      case "hr":
        nodes.push({ type: "horizontalRule" });
        break;
      case "text": {
        const t = token as Tokens.Text;
        const content = t.tokens
          ? convertInlineTokens(t.tokens)
          : [textNode(t.text)];
        nodes.push({
          type: "paragraph",
          ...(content.length > 0 ? { content } : {}),
        });
        break;
      }
      case "space":
      case "html":
        break;
      default:
        break;
    }
  }

  return nodes;
}

export function markdownToProseMirrorJSON(markdown: string): string {
  const tokens = lexer(markdown);
  const content = convertBlockTokens(tokens);
  return JSON.stringify({
    type: "doc",
    content,
  });
}

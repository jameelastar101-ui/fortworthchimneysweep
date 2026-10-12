// Parses the `[label](href)` markdown-link syntax out of a plain content
// string so frontmatter copy can carry an inline link (internal page, tel:)
// without storing raw HTML. Keeps content data-only and diffable against the
// source copy word for word. An optional `|nofollow` suffix inside the
// parens (e.g. `[label](https://example.com|nofollow)`) marks that one link
// rel="nofollow" without changing the default (external links still render
// with only rel="noopener" unless marked).
//
// Also resolves `{{price:id}}`/`{{price-range}}` tokens (see lib/prices)
// before parsing links, so both this module's consumers — the visible
// Inline component and toPlainText's schema text — pick up centralized
// prices with no separate wiring.
import { interpolatePrices } from './prices';

export type InlinePart = string | { text: string; href: string; nofollow?: boolean };

export function parseInlineLinks(rawText: string): InlinePart[] {
  const text = interpolatePrices(rawText);
  const parts: InlinePart[] = [];
  const re = /\[([^\]]+)\]\(([^)|]+)(\|nofollow)?\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push({ text: m[1], href: m[2], nofollow: Boolean(m[3]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

// Strips the `[label](href)` syntax down to just the visible label text —
// used so schema.org text matches the rendered page exactly (schema can't
// carry markup, only the words a reader actually sees).
export function toPlainText(text: string): string {
  return parseInlineLinks(text)
    .map((p) => (typeof p === 'string' ? p : p.text))
    .join('');
}

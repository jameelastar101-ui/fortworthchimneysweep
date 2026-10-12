// Scans each built service page for every "$"-prefixed price string and
// fails the build if any of them doesn't match a display value in
// src/data/prices.json (or the computed overall business range) — the
// invariant that keeps a page from drifting back to a hand-typed price that
// bypasses the data file. Matching is case-insensitive so a mid-sentence
// "up to $350" still matches the "Up to $350" tier-card display it's a
// lowercase variant of (see src/data/prices.json's dryer-complex and
// leak-repair-masonry-structural entries, and the build report).
//
// Scoped to the service pages (by their content-collection slug) rather than
// the whole built site — blog posts and other pages can legitimately
// mention an unrelated dollar figure (e.g. a legal fine) that has nothing to
// do with service pricing and shouldn't trip this check.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const prices = JSON.parse(readFileSync('src/data/prices.json', 'utf8'));

const servicePages = readdirSync('src/content/services')
  .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  .map((f) => f.replace(/\.mdx?$/, ''));

const withMin = prices.filter((p) => p.min != null);
const withMax = prices.filter((p) => p.max != null);
const overallMin = Math.min(...withMin.map((p) => p.min));
const overallMax = Math.max(...withMax.map((p) => p.max));
const overallDisplay = `$${overallMin.toLocaleString('en-US')} to $${overallMax.toLocaleString('en-US')}`;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const known = [...prices.map((p) => p.display), overallDisplay]
  .sort((a, b) => b.length - a.length)
  .map(escapeRe);
// The trailing (?!\d) stops a short display (e.g. "$99") from matching as a
// false-positive prefix of a longer unrelated number (e.g. "$999") — without
// it that longer number would be partly masked and the check would miss it.
const knownRe = new RegExp(`(?:${known.join('|')})(?!\\d)`, 'gi');
const bareDollarRe = /\$\d[\d,]*(?:\.\d+)?\+?/g;

const problems = [];
for (const slug of servicePages) {
  const file = join('dist', slug, 'index.html');
  let html;
  try {
    html = readFileSync(file, 'utf8');
  } catch {
    continue; // not built (e.g. a not-yet-wired content entry) — nothing to check
  }
  const masked = html.replace(knownRe, '');
  const leftovers = masked.match(bareDollarRe);
  if (leftovers) problems.push({ file, leftovers });
}

if (problems.length) {
  console.error(`\nPrice strings found that don't match any entry in src/data/prices.json:\n`);
  for (const { file, leftovers } of problems) {
    console.error(`  ${file}: ${leftovers.join(', ')}`);
  }
  console.error('\nAdd the price to src/data/prices.json, or reference an existing id with {{price:id}}.\n');
  process.exit(1);
}
console.log(`✓ Every price string across ${servicePages.length} service page(s) matches src/data/prices.json (${prices.length} entries).`);

// Single source of truth for every price shown anywhere on the site —
// pricing cards, opening lines, FAQ cost sentences, and ServiceSchema
// offers all resolve a price id through this file instead of carrying a
// hand-typed "$X-$Y" string. Edit src/data/prices.json to change a price;
// every page that cites that id picks it up on the next build.
import pricesData from '../data/prices.json';

export interface PriceEntry {
  id: string;
  service: string;
  label: string;
  // null when that side has no stated figure: `min` is null for an
  // "Up to $X" tier with no stated minimum, `max` is null for an
  // open-ended "$X+" tier (the number before the + is a floor for the
  // next bracket, not a true ceiling).
  min: number | null;
  max: number | null;
  openEnded: boolean;
  minIsStated: boolean;
  display: string;
}

const prices = pricesData as PriceEntry[];
const byId = new Map(prices.map((p) => [p.id, p]));

export function getPrice(id: string): PriceEntry {
  const entry = byId.get(id);
  if (!entry) throw new Error(`Unknown price id "${id}" — add it to src/data/prices.json.`);
  return entry;
}

export function priceDisplay(id: string): string {
  return getPrice(id).display;
}

// Resolves a page's pricing tiers (name/priceId/subtext/addOn, as stored
// in frontmatter) into the {name,price,subtext,addOn} shape PricingCards
// renders, looking up each tier's display string by its priceId.
export function resolveTiers<T extends { priceId: string }>(
  tiers: T[],
): (Omit<T, 'priceId'> & { price: string })[] {
  return tiers.map(({ priceId, ...rest }) => ({ ...rest, price: priceDisplay(priceId) }));
}

// One ServiceSchema Offer per tier with a stated minimum — a tier priced
// "Included" (no min/max at all) is skipped, same as before this file
// existed.
export function tierOffers(
  tiers: { priceId: string }[],
): { minPrice: number; maxPrice?: number }[] {
  return tiers
    .map((t) => getPrice(t.priceId))
    .filter((p) => p.min != null)
    .map((p) => ({ minPrice: p.min as number, ...(p.max != null ? { maxPrice: p.max } : {}) }));
}

// A page's single aggregate priceLow/priceHigh (the pages that price
// themselves as one range via ServiceSchema's plain Offer, rather than one
// Offer per tier).
export function priceRange(id: string): { min: number; max: number } {
  const p = getPrice(id);
  if (p.min == null || p.max == null) {
    throw new Error(`Price id "${id}" has no stated min/max, so it can't back a priceLow/priceHigh range.`);
  }
  return { min: p.min, max: p.max };
}

// The business-wide low/high, computed from every entry's stated min/max —
// never hand-typed, so it can't drift from the per-service prices it's
// built from.
export function overallRange(): { min: number; max: number } {
  const mins = prices.filter((p) => p.min != null).map((p) => p.min as number);
  const maxes = prices.filter((p) => p.max != null).map((p) => p.max as number);
  return { min: Math.min(...mins), max: Math.max(...maxes) };
}

export function overallRangeDisplay(): string {
  const { min, max } = overallRange();
  return `$${min.toLocaleString('en-US')} to $${max.toLocaleString('en-US')}`;
}

// The only price templating syntax content frontmatter uses:
// `{{price:some-id}}` → that id's display string, `{{price-range}}` → the
// computed overall business range. Run on every piece of content text
// before it's rendered (wired into lib/inline-links so both the visible
// Inline component and the plain-text schema path pick it up automatically).
const TOKEN_RE = /\{\{price:([a-z0-9-]+)\}\}|\{\{price-range\}\}/g;

export function interpolatePrices(text: string): string {
  return text.replace(TOKEN_RE, (_match, id: string | undefined) =>
    id ? priceDisplay(id) : overallRangeDisplay(),
  );
}

# Project Overview — Fort Worth Chimney Sweep (for AI assistants)

This file is a standalone briefing for another AI assistant (ChatGPT, Claude in a browser, etc.) that has no access to this repo. It summarizes what the project is, how it's built, and what rules govern its content, so that assistant can give informed help without re-deriving everything from scratch.

## What this is

A marketing/lead-generation website for **Chimney Sweep Pro**, a chimney-sweep and dryer-vent-cleaning business operating in the Fort Worth, TX area (also serves Keller, TX). The live domain is **fortworthchimneysweep.com**.

- **Business name:** Chimney Sweep Pro
- **Address:** 804 Mustang Dr, Saginaw, TX 76179
- **Phone:** (682) 354-6644 (`tel:+16823546644`) — the only phone number that should ever appear; an old number, (877) 203-8193, must never be used
- **Services:** chimney sweeping/inspection, chimney repair, chimney leak repair, chimney relining, chimney cap installation, animal removal (birds, raccoons, squirrels) from chimneys, dryer vent cleaning
- **Trust badges** (usable only once confirmed): CSIA Certified, Licensed & Insured, BBB Accredited, NCSG Member

## Why it exists / project history

The site is a **rebuild of an existing WordPress site** as a static Astro site, version-controlled in Git and deployed on Netlify — with a brand-new visual design and entirely rewritten content/meta on every page. The one hard constraint carried over from WordPress: **every existing URL/slug must stay exactly the same** (protects existing search rankings and inbound links). New copy and design go live under the old URLs rather than new ones. Full detail: `astro-migration-brief.md` and `docs/astro-migration-brief.md` (URL inventory, design system notes, sequencing plan).

Content for each page is written conversationally (in a chat assistant, following house style rules), then handed to "Claude Code" (the coding agent) purely to implement the Astro build — the coding agent does not originate or rewrite marketing copy itself.

## Tech stack

- **Framework:** [Astro](https://docs.astro.build) ^7.3.4, static output (`output: 'static'`), directory-style URLs with trailing slashes always on (to match the old WordPress URL shape)
- **Content:** Astro content collections (`src/content.config.ts`) — two collections, `services` and `blog`, loaded from Markdown/MDX files via `astro/loaders` glob loader
- **MDX:** `@astrojs/mdx` — used selectively where a post needs the `<OptionalImage>` component (renders an image slot only if the file exists on disk); older posts stay plain `.md`
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`, plus `@fontsource` for Inter Variable and Anton webfonts
- **Sitemap:** `@astrojs/sitemap`
- **Language/runtime:** Node >=22.12.0, TypeScript (`@astrojs/check`)
- **Deployment:** Netlify, building from the `main` branch (`netlify.toml`: `npm run build` → publish `dist`). One legacy WordPress taxonomy redirect is configured (`/category/uncategorized/` → `/category/blogs/`).
- **Build pipeline** (`npm run build`): `astro build` then three custom Node scripts in `scripts/`:
  - `generate-image-sitemap.mjs`
  - `check-placeholders.mjs` — fails the build if placeholder content (e.g. alt text literally `"TODO"`) slipped through
  - `check-prices.mjs` — validates pricing data consistency

## Visual design system — "Rugged Tradesman"

Defined centrally in `src/styles/global.css` as Tailwind v4 `@theme` tokens; components reference the generated utilities (`bg-brand`, `text-ink`, `font-display`, etc.) — never raw hex values.

### Color palette

| Token | Hex | Use |
|---|---|---|
| `--color-brand` | `#d72828` | Primary red, sampled from the logo — buttons, eyebrow text, the short "rule" bar under headings, links |
| `--color-brand-dark` | `#b01f1f` | Hover/pressed state for brand-red elements |
| `--color-ink` | `#111111` | Primary text color; also the dark button background (`.btn-dark`) |
| `--color-paper` | `#ffffff` | Page background |
| `--color-cream` | `#ffffff` | Alternating section-band background — intentionally the *same* white as paper now (was off-white `#f7f5f2`, flattened for contrast); alternating bands are instead marked by a 1px top border (`.section.bg-cream`), not a color shift |
| `--color-charcoal` | `#1c1c1e` | Secondary dark tone (e.g. `.btn-dark` hover) |
| `--color-muted` | `#55534f` | Secondary/body-support text (captions, notes, sub-copy) |
| `--color-line` | `#e2dfda` | Hairline borders, table borders/striping, section-band seams |
| `--color-warn` | `#b45309` | Semantic "book soon" urgency level |
| `--color-ok` | `#15803d` | Semantic "can wait" urgency level |

`--color-brand` itself doubles as the semantic "stop now / urgent" color in the urgency-card system, so there's no separate urgent token.

### Typography

- **Display font** (`--font-display`): **Anton** (`@fontsource/anton`), falling back to Archivo Black / Impact / sans-serif. Used for all headings (`h1–h4`), always **uppercase**, `letter-spacing: 0.01em`, `line-height: 1.05`, `font-weight: 400` (Anton is already a black weight at 400).
- **Body font** (`--font-body`): **Inter Variable** (`@fontsource-variable/inter`), falling back to Inter / system-ui / sans-serif. Used for everything else — paragraphs, nav, buttons, cards.
- Section headings (`.section-title`) scale fluidly: `clamp(2rem, 4.5vw, 3rem)`.
- An "**eyebrow**" label style precedes section headings in places (e.g. blog post header "Chimney Sweep Pro Blog"): small, `font-weight: 800`, `font-size: 0.8rem`, `letter-spacing: 0.16em`, uppercase, colored brand red.
- A signature **"rule"** element — a short (3.5rem × 0.3rem) solid brand-red bar — sits under eyebrows/headings sitewide as a graphic accent, not a typographic rule in the HTML sense.
- Buttons are bold/uppercase: `font-weight: 800`, `letter-spacing: 0.04em`, uppercase text, 2px border, small `2px` radius (`--radius-btn`), with a subtle lift (`translateY(-2px)`) on hover (disabled under `prefers-reduced-motion`).
- Cards and other panels use a slightly larger `4px` radius (`--radius-card`).
- Max content measure for body copy throughout is `max-w-[65ch]`, keeping paragraphs readable at wide viewports.
- Page content width is capped at `--container-page: 72rem`, centered, with `1.25rem` inline padding (`.container-page`).

### Shared structural/motion conventions

- `.section` gives consistent vertical rhythm: `4rem` top/bottom padding on mobile, `5.5rem` from `768px` up.
- Sections alternate `bg-white` / `bg-cream` bands down the page (cream bands get the top hairline border described above).
- A progressive-enhancement scroll-reveal (`.reveal` / `.js .reveal.is-visible`, driven by a tiny `IntersectionObserver` inline script per page) fades + slides content up 14px on scroll into view; everything renders fully visible with no JS, and the effect is skipped under `prefers-reduced-motion: reduce`. This is used throughout service-page sections (paragraphs, prose blocks, card grids).
- Focus states sitewide use a 3px brand-red outline (`:focus-visible`).

## Page design patterns

### Blog post (`src/layouts/BlogPostLayout.astro`)

Simple, single-column, reading-focused layout — no component composition needed per post, since all post HTML comes from the Markdown/MDX body:

1. "Chimney Sweep Pro Blog" eyebrow, then the H1, then the brand-red "rule" bar.
2. `.article-body`: the rendered Markdown content, hand-styled (no Tailwind typography plugin) against the same tokens as the rest of the site — `line-height: 1.7` body copy, `clamp()`-scaled `h2`/`h3`, brand-red links (bold, underline-offset 2px, darkening on hover), disc/decimal lists, rounded (`--radius-card`) full-width images with muted-color figcaptions, and horizontally-scrollable tables with `--color-line` borders and a shaded (`--color-line` background) header row.
3. A phone-CTA card (cream background, bordered, centered on mobile/left-aligned on desktop) at the end of the post — suppressible per-post via `hidePhoneCta`.
4. A sticky mobile-only "Call (682) 354-6644" bar fixed to the bottom of the viewport (hidden ≥`md`, since desktop already has a persistent phone CTA in the header).
5. Structured data: `ArticleSchema` + `BreadcrumbSchema` (Home → Blog → post title), using the post's canonical URL.

### Service page (e.g. `src/pages/chimney-repair-fort-worth-tx.astro`, and the generic `[slug].astro` route)

A long, modular, section-by-section page assembled from shared components, each section only rendering if its frontmatter data is present (so different service pages can include/omit sections freely while sharing one visual language). Typical section order, alternating white/cream backgrounds:

1. **Hero** (`Hero.astro`) — big display headline, subheadline, primary phone CTA, optional hero image.
2. **TrustBadges** — certification/trust-badge strip directly under the hero.
3. **Problems** — heading + intro paragraph + a `CardGrid` of problem cards, optionally paired with a framed image (`FramedImage`, 4:3 ratio) in a two-column layout.
4. **Solutions** — same heading/intro/`CardGrid` pattern, with the framed image optionally on the left or right (`imageSide`), plus optional closing paragraphs (which can carry inline links via `Inline.astro`).
5. **Pricing** — heading + intro, then either `PricingCards` (tiered cards, 1–4 columns, price values interpolated from `src/data/prices.json`/`src/lib/prices.ts`) or a `ComparisonTable` in "table mode" for pages priced as a grid; optional note, cost-factor bullet list, and a bolded closing line.
6. **Decision framework** — heading + intro, a `ComparisonTable`, optional note/prose sub-topics/second table, then urgency-level `CardGrid` cards (tied to the `--color-brand`/`--color-warn`/`--color-ok` semantic colors for "stop now / book soon / can wait"), optional DIY-vs-pro card pair or plain DIY note, then an insurance note and an optional cross-link line.
7. **Mid-page CTA band** (`CTABand`) — full-width high-contrast band to recapture attention partway down the page.
8. **Process** — heading + a vertical numbered `Stepper`, usually paired with a sticky framed image alongside it on desktop.
9. **Local** — heading + intro + one or two text blocks (optionally with a framed image beside the second block), then the service-area line and NAP (name/address/phone), set off by a top hairline border.
10. **FAQ** (`FAQ.astro`) — accordion, cream background, also feeding `FAQSchema` JSON-LD.
11. **Closing CTA band** (`CTABand`, with an optional decorative "brick pattern" treatment) — final call to action.

Structured data on service pages: `ServiceSchema` (with per-tier or aggregate `Offer`s resolved from `prices.json`), `FAQSchema` (when FAQs exist), and `BreadcrumbSchema` (Home → page title). Every visible string on a service page is pulled from its content-collection frontmatter — page files contain layout/markup only, never hand-typed copy.

## Directory structure

```
src/
  components/        Reusable Astro components (Header, Hero, Footer, CardGrid,
                      PricingCards, FAQ, ComparisonTable, Testimonials, etc.)
  components/schema/  JSON-LD structured data: LocalBusinessSchema, ServiceSchema,
                      ArticleSchema, FAQSchema, BreadcrumbSchema
  content/services/   Service-page Markdown content (one file per service/location page)
  content/blog/       Blog post Markdown/MDX content
  content.config.ts   Zod schemas defining frontmatter shape for services & blog
  data/               site.ts (NAP/contact/site-wide constants), home.ts (homepage
                      copy), prices.json (pricing data), reviews.json (testimonials)
  lib/                prices.ts (resolves priceRangeId/priceId → display + schema
                      values), blog-list.ts, inline-links.ts
  layouts/            BaseLayout.astro — shared page shell (head, header, footer)
  pages/              Astro file-based routes — one .astro file per top-level page,
                      plus [slug].astro (dynamic service-page routing) and the
                      /category/blogs/ paginated blog index
public/images/        Static images, organized into one folder per blog post/topic
docs/                 Project-specific rulebooks (see below)
scripts/              Node build-time validation/generation scripts
```

Routing note: most service pages render through the dynamic `src/pages/[slug].astro` from the `services` collection; a handful of pages (animal-removal variants, the dryer-vent and sweep hubs, contact-us) have their own dedicated `.astro` file. Blog posts render through the `blog` collection with a paginated category index at `/category/blogs/`.

## Content model (from `src/content.config.ts`)

Both collections share a **topic-cluster / internal-linking system**:
- `cluster` — which topic cluster a page belongs to (`repair`, `leaks`, `caps`, `animals`, `sweep-inspection`, `dryer-vent`)
- `role` — `pillar` (site-level), `hub` (owns a cluster), or `spoke` (supports a hub)
- `hub` — slug of the parent hub/pillar; sibling spokes under the same hub get auto-linked (up to 3, by priority then date then slug) — spoke siblings are never hand-written
- `related` — manually curated **cross-cluster** links only (max 3)
- Full rules and the actual per-page values live in `docs/cluster-map.md` — this is the source of truth for what cluster/role/hub every page uses; nothing here should be invented or changed without updating that file

Service pages additionally carry a rich, mostly-optional set of section schemas (problems, solutions, pricing, decision framework, local/service-area block, FAQs, CTAs, etc.) so that components only render sections the page's content actually supplies. Pricing on service pages references IDs into `src/data/prices.json` rather than hard-coding numbers, so price changes happen in one file and flow through to both displayed copy and the `ServiceSchema` JSON-LD.

Blog posts carry title/H1 overrides, publish/modified dates, meta/OG/schema image fields, an optional FAQ block (drives both an FAQ accordion and `FAQPage` schema), and a `hidePhoneCta` flag for posts under a stricter one-phone-mention rule.

## Content rules the writing process follows

These live in `docs/` and govern how new copy is written (by a chat assistant, before it ever reaches the Astro build):

- `docs/service-page-writing-rules.md` / `docs/blog-post-writing-rules.md` — fixed business facts, tone ("plain-spoken, practical, confident tradesman, no hype"), scope boundaries, and the existing-URL list that must never change
- `docs/service-page-seo-checklist.md` / `docs/blog-post-seo-checklist.md` — section-by-section SEO QA checklists, with ownership split between the writing assistant, the build agent, and the human (things like live SERP checks, PageSpeed, and schema validation need a human/tool, not an AI)
- `docs/cluster-map.md` — internal linking / topic cluster source of truth (see above)
- `docs/pre-launch-seo-audit.md` — a generated audit of the actual `dist/` build output against those checklists (titles, meta, canonicals, H1s, internal links, image alt text) — a snapshot, not a live document

## Current state (as of this writing)

The repo is mid-migration/active development on `main`: component files, layouts, data files, and several service/blog pages have uncommitted modifications, and a large batch of new blog-post images and new docs files (SEO checklists, writing rules, migration brief) are untracked. Recent commits have focused on blog content additions and schema/SEO fixes (cross-link fixes, phone-link formatting, fire-statistics updates). Treat anything in `docs/` as the current authoritative rules — if this overview and a `docs/` file ever disagree, the `docs/` file wins.

## What NOT to assume

- Do not invent new URLs/slugs — every page's address is fixed by the pre-migration WordPress site (see `astro-migration-brief.md`).
- Do not assume the (877) number is valid — only (682) 354-6644 is current.
- Pricing, trust badges, and NAP details should be treated as business-sensitive facts to get from `src/data/site.ts` / `src/data/prices.json`, not guessed.

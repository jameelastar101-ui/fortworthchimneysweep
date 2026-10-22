# Migration Brief: fortworthchimneysweep.com → Astro + GitHub + Netlify

## Goal
Rebuild the existing WordPress site as a static Astro site, version-controlled in GitHub, deployed on Netlify, **with a brand-new visual design and new content/meta on each page**.

What must NOT change: the existing URL/slug for every page and post (see inventory below). This protects existing rankings and any inbound links/citations pointing at these URLs. Everything else — visual design, on-page copy, meta titles/descriptions — is being redone.

Sequencing note for Claude Code: build the new page/copy in the content collection under the *same slug* it currently occupies. Don't treat "new content" as license to also invent new URLs — new copy still lives at the old address.

## Content delivery workflow
Content and meta for each page will be supplied one page at a time, not all at once. Sequence the build accordingly:
1. Build the full component library and design system first (Header, Footer, Hero, buttons, FAQ, etc.) using placeholder/lorem content, so the visual system is locked in before any real copy arrives.
2. Build the homepage layout and get it fully styled and reviewed — it uses most of the shared components, so it's the fastest way to validate the whole design system at once. Include LocalBusiness schema (sitewide, in the main layout) at this stage.
3. As each service/blog page's content is provided, create that page's content-collection entry at its existing slug and plug it into the already-built layout — don't rebuild layout/styling per page.
4. **Every page's checklist, not just the last one before launch:**
   - Content and meta title/description added
   - Service schema added (service pages) or Article schema (blog posts), pulling from the same frontmatter fields as the visible content — not hand-typed separately
   - FAQPage schema added, generated from the same FAQ data used to render the visible accordion — only if that page has an FAQ section
   - BreadcrumbList schema (should be automatic from the URL path, but confirm it renders per page)
   - Don't treat schema as a final site-wide pass at the end — add it per page as that page is built, the same way you'd add its meta description
5. Treat pages without content yet as simply "not built" rather than filled with placeholder copy that might get missed before launch — makes it easy to track what's actually done.

## Current stack
- WordPress + NitroPack (caching/perf plugin)
- Hosting: unknown current host (to confirm before DNS cutover)
- Domain: fortworthchimneysweep.com
- Business: Chimney Sweep Pro, 804 Mustang Dr, Saginaw, TX 76179
- Canonical phone number: **(877) 203-8193** — use this everywhere (header CTA, hero, footer, click-to-call links, schema). The old site also shows (877) 203-8193 in places; that's being retired, don't carry it over.

## Target stack
- Astro (latest, static output — no SSR needed, this is a marketing/local-service site)
- Content stored as Markdown/MDX in Astro content collections (`src/content/services/`, `src/content/blog/`)
- Git repo on GitHub, deployed via Netlify's Git integration
- Forms via Netlify Forms (no backend/serverless function needed)

## Brand assets
- **Logo**: `cropped-fortworth-chimney-sweep-pro.webp` — red square icon (flame over a brick chimney silhouette) + bold black condensed wordmark "CHIMNEY SWEEP PRO". Carry this over as-is; place the source file in `src/assets/` or `public/`.
- **Everything else is new**: layout, styling, photography treatment, icon style — none of it should resemble the current WordPress theme

## Design direction (final)
Direction: **Rugged Tradesman** — bold, high-contrast, built directly off the logo's own red/black/white palette rather than a generic template look.

- **Primary accent (red)**: `#D72828` (RGB 215, 40, 40) — sampled directly from the logo file, this is the exact brand red
- **Ink/text**: near-black `#111111`, matching the wordmark weight
- **Backgrounds**: white `#FFFFFF` and warm off-white `#F7F5F2` alternating by section; optional dark charcoal `#1C1C1E` for the hero or footer for contrast
- **Headings**: bold condensed sans — **Anton** or **Archivo Black** (echoes the logo's chunky lettering; doesn't need to match exactly)
- **Body text**: **Inter** or **Source Sans 3**, both on Google Fonts
- **Buttons/CTAs**: solid red background, bold white text, minimal corner rounding
- **Icon style**: simple, bold, two-tone (red/white or black/white) flat icons — matching the logo's flat flame/brick icon rather than photographic or line-art icons
- **Imagery**: high-contrast photos of brick/masonry/flame where used; dark overlay on hero photos if a photo hero is used

## Full URL inventory (preserve these exact slugs)

### Service & core landing pages
| Page | URL |
|---|---|
| Home | `/` |
| Chimney Sweep | `/chimney-sweep-fort-worth-tx/` |
| Chimney Sweep Services (landing) | `/chimney-sweep-services/` |
| Chimney Sweep — Keller, TX | `/chimney-sweep-keller-tx/` |
| Chimney Inspection | `/chimney-inspection-fort-worth-tx/` |
| Chimney Repair | `/chimney-repair-fort-worth-tx/` |
| Chimney Cap Installation | `/chimney-cap-installation-fort-worth-tx/` |
| Chimney Relining | `/chimney-relining-fort-worth-tx/` |
| Dryer Vent Cleaning | `/dryer-vent-cleaning-fort-worth-tx/` |
| Chimney Animal Removal | `/chimney-animal-removal-fort-worth-tx/` |
| Bird in Chimney Removal | `/bird-in-chimney-removal/` |
| Raccoon in Chimney | `/raccoon-in-chimney-fort-worth-tx/` |
| Squirrel in Chimney Removal | `/squirrel-in-chimney-removal-fort-worth-tx/` |
| Chimney Leak Repair | `/chimney-leak-repair-fort-worth-tx/` |
| Contact | `/contact-us/` |

### Blog posts (informational articles)
| Post | URL |
|---|---|
| Bird Nest in Chimney | `/bird-nest-in-chimney-fort-worth-tx/` |
| Bird Stuck in Chimney | `/bird-stuck-in-chimney/` |
| Black Chimney Smoke | `/black-chimney-smoke/` |
| Chimney Cap Blew Off | `/chimney-cap-blew-off/` |
| Chimney Cap Installation Cost | `/chimney-cap-installation-cost/` |
| Chimney Leaking After Hail | `/chimney-leaking-after-hail/` |
| Fireplace Smell Wet | `/fireplace-smell-wet/` |
| How to Repair a Leaking Chimney | `/how-to-repair-a-leaking-chimney/` |
| Level 1 vs Level 2 Chimney Inspection | `/level-1-vs-level-2-chimney-inspection/` |
| Mold in Fireplace | `/mold-in-fireplace/` |
| Smoke Smell From Fireplace When Not in Use | `/smoke-smell-from-fireplace-when-not-in-use/` |
| Water Dripping From Chimney | `/water-dripping-from-chimney/` |
| Water Stains on Ceiling Next to Chimney | `/water-stains-on-ceiling-next-to-chimney/` |

### Blog category & pagination pages
| Page | URL |
|---|---|
| Blog category index | `/category/blogs/` |
| Blog category, page 2 | `/category/blogs/page/2/` |
| Uncategorized category | `/category/uncategorized/` |

**Note on category/pagination URLs**: Astro's content collections don't naturally produce WordPress-style `/category/blogs/page/2/` URLs — you'll need to either build a paginated blog index route that reproduces this exact path structure (recommended, since it's indexed), or 301-redirect it to your new blog index if you deliberately restructure blog pagination. **Decision:** build a paginated blog index reproducing `/category/blogs/` and `/category/blogs/page/2/` exactly, and 301-redirect `/category/uncategorized/` to `/category/blogs/` unless the live site shows it has real content.

## Page structure to rebuild as components
Build these as reusable Astro components (`src/components/`), then compose pages from them:

- `Header.astro` — logo, nav (Home / Our Services dropdown / Blog / Contact), phone number CTA button
- `Hero.astro` — headline, subhead, phone CTA, hero image
- `TrustBadges.astro` — CSIA Certified / Licensed & Insured / BBB Accredited / NCSG Member
- `LeadForm.astro` — name/email/message fields, wired to Netlify Forms
- `Testimonials.astro` — review carousel (name, neighborhood, quote)
- `ServiceGrid.astro` — the 9-item service card grid on the homepage (a subset of the 14 service pages), each linking to its service page
- `ProblemsList.astro` — the "Common chimney problems we fix" accordion/list section
- `WhyChooseUs.astro` — 4-column feature block (Fast Response / Transparent Pricing / Certified Techs / Written Reports)
- `ProcessSteps.astro` — the 4-step "How It Works" section
- `ServiceAreas.astro` — neighborhood list + ZIP code list
- `FAQ.astro` — accordion, needs FAQPage schema (see SEO section)
- `Footer.astro` — NAP info, hours, service links, sitemap links

Each individual service page (`chimney-repair-fort-worth-tx`, etc.) reuses `Header`, `Hero` (page-specific), `LeadForm`, `WhyChooseUs`, `ServiceAreas`, `FAQ`, `Footer`. Since copy is being rewritten, treat the current live page only as a reference for *what topics/sections that page needs to cover* (services offered, pricing framing, FAQs) — not as source text to migrate verbatim.

## Content collection schema
Defined in `src/content.config.ts` (source of truth; Astro 7 location).
```
services: { title, slug, metaDescription, ogImage, phone, faqs?, relatedPosts[], ...clusterFields }
blog:     { title, slug, date, metaDescription, ogImage? (default site OG image), faqs?, ...clusterFields }
```
Cluster fields for every page live in `docs/cluster-map.md`. Use those values in each entry's frontmatter and follow the linking rules in that file. Confirm cluster, role, hub, related, and hubAnchor on every page's checklist.

## SEO requirements — do not skip
1. **New `<title>` and meta description per page** — you're writing these fresh; just make sure every URL in the inventory above gets one (no page should ship without a title/meta), and keep them reasonable lengths (title ~50-60 chars, meta ~150-155 chars).
2. **Open Graph tags** — og:title, og:description, og:image, og:type — generate per page from the new content, don't leave these blank.
3. **Canonical tags** — self-referencing canonical on every page.
4. **Structured data (JSON-LD)** — check whether the current NitroPack/theme setup outputs LocalBusiness, FAQPage, or Review schema (view page source or check Google's Rich Results Test on the live URL) and rebuild equivalents fresh, matching the new content.
   - Build as small Astro components in `src/components/schema/`: `LocalBusinessSchema.astro`, `ServiceSchema.astro`, `FAQSchema.astro`, `BreadcrumbSchema.astro` — each renders a `<script type="application/ld+json" set:html={JSON.stringify(data)} />`
   - `LocalBusinessSchema` goes once in the main layout (name, address, phone `(877) 203-8193`, hours, geo, service area)
   - `ServiceSchema` on every service page, `Article` schema on every blog post — pull fields straight from that page's content-collection frontmatter, don't hand-type separately from the visible copy
   - `FAQSchema` only on pages with a visible FAQ accordion, generated from the same FAQ array that renders the accordion
   - `BreadcrumbSchema` auto-generated from the URL path on every page
   - Skip Review/AggregateRating schema unless it's backed by real, verifiable review data — fabricated ratings schema risks a manual penalty
   - Validate one page per template type (homepage, a service page, a blog post) in Google's Rich Results Test before launch
5. **Sitemap** — use `@astrojs/sitemap` integration, generate on build, submit to Google Search Console after launch.
6. **Robots.txt** — recreate, allow all, point to new sitemap.
7. **Image alt text** — write fresh, descriptive alt text for new/replaced images; don't ship images with empty alt attributes.
8. **301 redirects** — only needed for any URL NOT in the inventory above that still gets traffic (check Search Console's indexed-pages report and any old query-string/pagination URLs not listed) — since the inventory above is now the full confirmed list, this should be a short list. Set these up in `netlify.toml` or a `_redirects` file.

## Image migration
Site is getting all-new images, but some current image URLs are indexed in Google Image Search and carry real traffic/ranking value. Don't treat images as "just assets that get swapped" — handle the URL transition deliberately:

1. **Identify which indexed images actually matter** — check Google Search Console → Performance → filter by Search type: Image, to see which specific image URLs get real impressions/clicks. Only bother protecting that shortlist, not every indexed thumbnail.
2. **Indexed image URLs to preserve/redirect** (paste the list from Search Console here once pulled):
   - `[old image URL]` → redirects to → `[new image URL]`
   - `[old image URL]` → redirects to → `[new image URL]`
3. **301-redirect each old image URL to its closest new replacement** (same mechanism as page redirects, via `netlify.toml` or `_redirects`) — this transfers the old URL's image-search signal instead of it just 404ing.
4. **Don't run redirect-target images through Astro's optimized `astro:assets` pipeline** — that pipeline auto-generates hashed, unpredictable output filenames, which breaks a redirect pointed at a specific path. For any image being deliberately redirected to, place it in `public/` and reference it with a plain `<img>` tag at a URL path you control.
5. **Update the image sitemap** (via `@astrojs/sitemap`'s image support, or a dedicated image sitemap) to list the new image URLs so Google recrawls and re-indexes them.
6. **Write fresh alt text** for the new images based on what they actually show — don't try to match old alt text to a different image.

## Functionality to replace (currently WordPress/plugin-dependent)
- **Contact form** → Netlify Forms: add `data-netlify="true"` and a hidden honeypot field, no backend code needed.
- **Review carousel** → static Astro component, data-driven from a JSON/MDX file of reviews, minimal JS for the carousel behavior.
- **FAQ accordion** → native `<details>/<summary>` or small vanilla JS component, no jQuery/plugin dependency.
- **Nav dropdown ("Our Services")** → CSS-only or minimal JS, no WP menu plugin.

## Deployment
- GitHub repo, `main` branch = production
- Netlify: Import from Git → build command `astro build` → publish directory `dist`
- Environment: none needed unless using a form-notification integration later
- Custom domain: attach fortworthchimneysweep.com in Netlify only after preview QA passes; keep the current WordPress host live until DNS cutover is confirmed working

## QA checklist before DNS cutover
- [ ] Every URL from the inventory table above resolves on the Netlify preview URL
- [ ] Every page has a unique, non-empty title tag and meta description (new copy, but nothing left as a placeholder/template default)
- [ ] Contact form successfully submits and appears in Netlify Forms dashboard
- [ ] All images load with correct alt text
- [ ] Mobile responsive check (nav, forms, phone click-to-call links)
- [ ] Sitemap.xml and robots.txt are present and correct
- [ ] Structured data validates in Google's Rich Results Test
- [ ] Phone number is (877) 203-8193 everywhere — header, hero, footer, click-to-call links, and any schema — with no trace of the old (877) 203-8193 number
- [ ] Indexed image URLs (from the Image migration section) 301-redirect correctly to their new replacements

## Explicitly out of scope for this task
- Changing any URL/slug listed in the inventory above — new copy and design still live at the old address
- New pages/services not on the current site (unless separately requested)
- Preserving any part of the current WordPress theme's visual style — a full new design is expected, logo excepted
- Preserving the current copy/meta verbatim — that's being rewritten as part of this project, not carried over

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cluster/linking fields. Values per page live in docs/cluster-map.md.
const clusterFields = {
  cluster: z
    .enum(['repair', 'leaks', 'caps', 'animals', 'sweep-inspection', 'dryer-vent'])
    .optional(),
  role: z.enum(['pillar', 'hub', 'spoke']).optional(),
  hub: z.string().optional(), // slug of the parent hub or pillar
  related: z.array(z.string()).max(3).default([]), // cross-cluster links only
  hubAnchor: z.string().optional(), // link text other pages use when linking TO this page
  priority: z.number().default(100), // sibling ordering; lower shows first
};

const faq = z.array(z.object({ question: z.string(), answer: z.string() }));

// A single content image: path under public/, alt text, optional caption.
// alt is required in the type but may be the literal string "TODO" — see
// FramedImage.astro, which warns on that in dev and fails `astro build` on it.
const imageField = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

// A card in a CardGrid (problems, solutions, urgency levels, DIY vs. pro).
// icon and tone are both optional — CardGrid renders plainly without them.
// image is optional too — only the chimney-sweep-services hub's 8-card
// services grid uses it (image-on-top cards instead of icon cards); every
// other page's cards keep using icon and render unchanged.
const cardItem = z.object({
  icon: z.string().optional(),
  image: imageField.optional(),
  title: z.string(),
  body: z.string(),
  tone: z.enum(['urgent', 'soon', 'ok']).optional(),
});

// Designed service-page sections, card-first (docs/service-page-seo-checklist.md
// Section 3's standard page structure). All optional so a simpler service page
// can skip sections it doesn't need — components only render a section when
// its data is present. Shape is generic (not dryer-vent-specific): every field
// name describes the section's role, not this page's content, so the other 12
// service pages reuse the same fields and components.
const servicePageFields = {
  subheading: z.string().optional(), // one-sentence hero subheading
  heroImage: imageField.optional(),

  // Id into src/data/prices.json for a page priced as one aggregate range
  // rather than distinct tiers — the page resolves this to the
  // priceLow/priceHigh ServiceSchema needs via src/lib/prices instead of
  // carrying those two numbers hand-typed here.
  priceRangeId: z.string().optional(),
  serviceType: z.string().optional(), // ServiceSchema `serviceType`
  areaServed: z.array(z.string()).optional(), // ServiceSchema `areaServed`

  // Section images, keyed by section name. Only render where a section calls
  // for one — an unused key just sits in frontmatter for a future page/section.
  images: z.record(z.string(), imageField).optional(),

  problems: z
    .object({
      heading: z.string(),
      opening: z.string(),
      items: z.array(cardItem),
    })
    .optional(),

  solutions: z
    .object({
      heading: z.string(),
      opening: z.string(),
      items: z.array(cardItem),
      imageSide: z.enum(['left', 'right', 'none']).default('none'),
      // Plain-text paragraphs rendered below the card grid — for pages whose
      // source content defines terms or notes scope after the solutions
      // cards (e.g. animal removal's flue/smoke-chamber definition and
      // quoting note) instead of ending the section on the grid.
      closingParagraphs: z.array(z.string()).optional(),
    })
    .optional(),

  pricing: z
    .object({
      heading: z.string(),
      opening: z.string(),
      // Optional because the chimney-sweep-services hub prices as a table
      // (tableHead/tableRows below) instead of tier cards — every other
      // page keeps setting tiers and renders PricingCards unchanged.
      tiers: z
        .array(
          z.object({
            name: z.string(),
            // Id into src/data/prices.json — the page resolves this to a
            // display string (PricingCards) and a minPrice/maxPrice pair
            // (ServiceSchema's per-tier Offer) via src/lib/prices, instead
            // of carrying either hand-typed separately from that file.
            priceId: z.string(),
            subtext: z.string(),
            // True when this tier is priced on top of the others rather than
            // an alternative to them (e.g. flue cleaning/sanitizing added to
            // an animal removal). PricingCards renders it as a separate,
            // visually distinct card instead of an equal-width grid slot.
            addOn: z.boolean().optional(),
          }),
        )
        .optional(),
      // Table-mode pricing (chimney-sweep-services hub only): a real table,
      // reusing ComparisonTable, instead of PricingCards. Rendered when
      // tiers is omitted.
      tableHead: z.array(z.string()).optional(),
      tableRows: z.array(z.array(z.string())).optional(),
      // Table-mode-only sibling of tiers[].priceId above: one price id per
      // table row, same order as tableRows, fed to ServiceSchema as one
      // Offer per row (alongside the overall AggregateOffer) via
      // src/lib/prices — the page derives each Offer's minPrice/maxPrice
      // from this id instead of a hand-typed numeric offers array.
      rowPriceIds: z.array(z.string()).optional(),
      // Plain-text paragraph directly under the price cards, before
      // costFactors — for a short caveat that applies to the cards as a
      // whole rather than any one tier (e.g. repair's "damper repair is
      // quoted after the assessment" note). Same position/shape as
      // decision.tableNote relative to the table.
      note: z.string().optional(),
      // Bullet list of cost-driving factors, rendered between the price
      // card(s) and the included/not-included panels. Used by pages with a
      // single price range instead of named tiers (e.g. relining).
      costFactors: z.array(z.string()).optional(),
      // Included/not-included panels are omitted on pages whose source
      // content gives no copy for them (e.g. inspection, where pricing is
      // fully explained by the tiers + cost factors + closing line) —
      // all four optional and rendered as a pair.
      includedHeading: z.string().optional(),
      included: z.array(z.string()).optional(),
      notIncludedHeading: z.string().optional(),
      notIncluded: z.array(z.string()).optional(),
      // Optional: the chimney-sweep-services hub's pricing-table source
      // copy supplies only the note paragraph below the table, with no
      // separate bolded closing line — every other page keeps setting this.
      closingLine: z.string().optional(),
      // Urgency block fields below: the chimney-sweep-services hub's brief
      // puts urgency/DIY/insurance content directly under the pricing band
      // with no heading of its own (explicitly not the `decision` section —
      // this page has no Decision Framework section at all). Same shapes as
      // the equivalent `decision` fields, nested here instead so they render
      // inside the Pricing section's own <section> with no second heading.
      urgencyLabel: z.string().optional(),
      urgency: z.array(cardItem).optional(),
      waitingCostsNote: z.string().optional(),
      diyNote: z.string().optional(),
      insuranceNote: z.string().optional(),
    })
    .optional(),

  // "Which service do you need?" router table (chimney-sweep-services hub
  // only): a heading, an opening line, and one table — no urgency/DIY/
  // insurance content (that lives in `pricing` on this page) and no cards,
  // so it's its own small field rather than a trimmed-down `decision`.
  router: z
    .object({
      heading: z.string(),
      opening: z.string(),
      tableHead: z.array(z.string()),
      tableRows: z.array(z.array(z.string())),
    })
    .optional(),

  decision: z
    .object({
      heading: z.string(),
      opening: z.string(),
      tableHead: z.array(z.string()),
      tableRows: z.array(z.array(z.string())),
      tableNote: z.string().optional(), // plain-text paragraph directly under the table
      // Short prose sub-topics (H3 + paragraph) rendered after tableNote —
      // for continuous single-option explanations that don't fit a card pair
      // (e.g. liner grade by fuel type). Same shape as `local.blocks`.
      proseBlocks: z.array(z.object({ heading: z.string(), body: z.string() })).optional(),
      // A second H3 + intro paragraph + full table sub-topic (e.g. sweep's
      // creosote-stages table alongside the main sweep/inspect/repair
      // table) — for a page whose source content has two full tables
      // instead of the usual one. Rendered after proseBlocks, reusing
      // ComparisonTable. Smallest extension for a second-table page rather
      // than inventing a new table component.
      secondTable: z
        .object({
          heading: z.string(),
          intro: z.string(),
          tableHead: z.array(z.string()),
          tableRows: z.array(z.array(z.string())),
        })
        .optional(),
      // Extra card-pair groups rendered after the table (e.g. mesh size, cap
      // style) — same cardItem shape as urgency/diyVsPro, reused as-is.
      extraCardSections: z.array(z.array(cardItem)).optional(),
      waitingCostsNote: z.string().optional(), // plain-text paragraph before the urgency cards
      urgency: z.array(cardItem),
      // DIY vs. professional as a 2-card pair. Omit and use `diyNote`
      // instead when there's no DIY option to present as a parallel choice.
      diyVsPro: z.array(cardItem).optional(),
      diyNote: z.string().optional(), // plain-text paragraph alternative to diyVsPro
      // Plain-text paragraph after urgency (and diyVsPro/diyNote, if present),
      // before insuranceNote — e.g. "what to do right now" guidance for a
      // page with no DIY option (so there's nowhere else for it to go).
      actionNote: z.string().optional(),
      // Plain-text paragraph after diyNote, before insuranceNote — a species
      // health/safety note distinct from the DIY caution (e.g. raccoon
      // rabies risk). Same Callout treatment as actionNote/diyNote/
      // insuranceNote; omitted on pages with no separate health content.
      healthNote: z.string().optional(),
      insuranceNote: z.string(),
      crossLinkLine: z.string().optional(), // plain-text paragraph after insuranceNote, may carry [label](href)
    })
    .optional(),

  midCta: z
    .object({
      headline: z.string(),
      text: z.string(),
    })
    .optional(),

  // Numbered process steps (vertical stepper).
  steps: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
  process: z
    .object({
      heading: z.string(),
      // Plain-text paragraph under the stepper — for a caveat that applies
      // to one step rather than the whole process (e.g. a protected-species
      // exception to the removal step).
      note: z.string().optional(),
    })
    .optional(),

  local: z
    .object({
      heading: z.string(),
      // Optional: omitted on a page whose Local section is a single compact
      // block with no separate opening line (e.g. sweep).
      opening: z.string().optional(),
      // Optional: the chimney-sweep-services hub's Local section has no H3
      // subheadings at all (its source copy has none), so it uses
      // `paragraphs` (plain text, no heading) instead of `blocks`.
      blocks: z.array(z.object({ heading: z.string(), body: z.string() })).optional(),
      paragraphs: z.array(z.string()).optional(),
      imageBlockIndex: z.number().optional(), // which block (0-based) the image sits beside
      serviceAreaLine: z.string(),
      nap: z.string(),
      crossLinkLine: z.string().optional(),
    })
    .optional(),

  closingCta: z
    .object({
      headline: z.string(),
      text: z.string(),
    })
    .optional(),
};

// Entry ids come from the filename, so `chimney-repair-fort-worth-tx.md` renders at
// /chimney-repair-fort-worth-tx/. `slug` is kept in frontmatter as a guard: pages
// assert it matches the URL inventory in astro-migration-brief.md.
const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(), // on-page H1
    titleTag: z.string().optional(), // <title> tag text (ALL CAPS); falls back to title
    slug: z.string(),
    metaDescription: z.string(),
    ogImage: z.string(),
    phone: z.string(),
    relatedPosts: z.array(z.string()).max(3).default([]), // blog slugs to link from this page
    ...clusterFields,
    faqHeading: z.string().optional(),
    faqs: faq.optional(), // drives both the FAQ accordion and FAQPage schema
    ...servicePageFields,
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(), // on-page H1, sentence case; also the card-grid title
    h1: z.string().optional(), // on-page H1 override; falls back to `title` when omitted
    titleTag: z.string(), // <title> tag text — ALL CAPS per blog-post-writing-rules.md, distinct from the H1
    slug: z.string(),
    date: z.coerce.date().optional(), // original publish date — never reset on edits; omit for posts with no visible/schema date
    dateModified: z.coerce.date().optional(), // set when the post is revised; falls back to `date`
    metaDescription: z.string(),
    ogImage: z.string().optional(), // falls back to the site default OG image
    schemaImage: z.string().optional(), // Article schema `image`; falls back to ogImage
    hidePhoneCta: z.boolean().default(false), // true suppresses the layout's bottom phone CTA block, for posts with a stricter one-phone-mention rule
    faqs: faq.optional(),
    ...clusterFields,
  }),
});

export const collections = { services, blog };

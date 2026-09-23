// Homepage content. EVERY string prefixed "[PLACEHOLDER]" is stand-in copy — replace it
// with the real copy. `npm run build` warns about leftovers, and fails a Netlify
// production build (CONTEXT=production) if any remain (scripts/check-placeholders.mjs).
import { serviceLinks } from './site';

const ph = (what: string) => `[PLACEHOLDER] ${what}`;

export const home = {
  title: ph('Homepage title (50–60 chars)'),
  description: ph('Homepage meta description (150–155 chars)'),

  hero: {
    headline: ph('Hero headline'),
    subhead: ph('Hero subhead — one or two sentences'),
  },

  services: {
    heading: ph('Services heading'),
    intro: ph('Services intro'),
    // Titles/links come from the URL inventory; only descriptions are placeholders.
    icons: ['chimney', 'clipboard', 'shield', 'flame', 'clock', 'dollar', 'check', 'pin', 'star'],
    cards: serviceLinks.map((s) => ({ title: s.label, href: s.href, description: ph('Service card description') })),
  },

  problems: {
    heading: ph('Common problems heading'),
    intro: ph('Common problems intro'),
    items: [1, 2, 3, 4, 5].map((n) => ({ title: ph(`Problem ${n}`), body: ph('Problem explanation') })),
  },

  why: {
    heading: ph('Why choose us heading'),
    features: [
      { icon: 'clock', title: 'Fast Response', description: ph('Feature description') },
      { icon: 'dollar', title: 'Transparent Pricing', description: ph('Feature description') },
      { icon: 'shield', title: 'Certified Techs', description: ph('Feature description') },
      { icon: 'clipboard', title: 'Written Reports', description: ph('Feature description') },
    ],
  },

  process: {
    heading: ph('How it works heading'),
    steps: [1, 2, 3, 4].map((n) => ({ title: ph(`Step ${n} title`), description: ph('Step description') })),
  },

  // Real reviews belong in src/data/reviews.json; these are layout stand-ins only.
  reviews: {
    heading: ph('Reviews heading'),
    items: [1, 2, 3].map((n) => ({
      name: ph(`Customer ${n}`),
      neighborhood: ph('Neighborhood'),
      quote: ph('Customer quote'),
    })),
  },

  areas: {
    heading: ph('Service areas heading'),
    intro: ph('Service areas intro'),
    neighborhoods: [1, 2, 3, 4, 5, 6].map((n) => ph(`Neighborhood ${n}`)),
    zips: ['00000', '00001', '00002', '00003'].map((z) => ph(z)),
  },

  faq: {
    heading: ph('FAQ heading'),
    items: [1, 2, 3, 4].map((n) => ({ question: ph(`Question ${n}?`), answer: ph('Answer') })),
  },

  form: {
    heading: ph('Lead form heading'),
    intro: ph('Lead form intro'),
  },
};

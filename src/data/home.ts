// Homepage content. `npm run build` warns about leftover "[PLACEHOLDER]" copy
// and fails a Netlify production build (CONTEXT=production) if any remain
// (scripts/check-placeholders.mjs).
import { serviceLinks, site } from './site';

export const home = {
  title: 'Chimney Sweep & Repair in Fort Worth, TX | Chimney Sweep Pro',
  description:
    'Chimney sweep, inspection, and repair in Fort Worth, TX. Upfront pricing and a written report after every visit. Call (682) 354-6644.',

  hero: {
    headline: "Fort Worth's Trusted Chimney Sweep & Repair Pro",
    subhead:
      "From routine sweeps to full chimney repairs, we give you a price in writing before any work starts and a written report when it's done.",
  },

  services: {
    heading: 'Our Chimney & Dryer Vent Services',
    intro: 'Nine services, one technician you can call for all of them.',
    // Order matches serviceLinks in site.ts; only descriptions/icons are set here.
    icons: ['brush', 'search', 'check', 'chimney', 'flame', 'lint', 'shield', 'droplet', 'pin'],
    cards: serviceLinks.map((s) => ({ title: s.label, href: s.href, description: descriptionFor(s.label) })),
  },

  problems: {
    heading: 'Common Chimney Problems We Fix',
    intro: 'If you recognize any of these, it usually means your chimney needs attention.',
    items: [
      {
        title: 'Creosote & Soot Buildup',
        body: 'Heavy creosote and soot narrow the flue and raise the risk of a chimney fire. A full sweep clears it out, and we flag any buildup that has reached the hard, glazed stage.',
      },
      {
        title: 'Cracked or Crumbling Masonry',
        body: 'Freeze-thaw cycles and age crack mortar joints and brick, letting water into the chimney structure. We repair minor masonry damage and rebuild sections that have failed.',
      },
      {
        title: 'Missing or Damaged Chimney Cap',
        body: "A missing or bent cap lets in rain, birds, and debris, and can cause downdrafts or smoke in the room. We install a cap sized to fit your flue.",
      },
      {
        title: 'Animals Nesting in the Flue',
        body: "Birds, raccoons, and squirrels get into an uncapped or damaged chimney and block the flue with nests and debris. We remove them humanely and cap the chimney so they can't get back in.",
      },
      {
        title: 'Water Leaks Around the Chimney',
        body: 'Flashing, crown, and masonry leaks show up as water stains, a musty smell, or damp brick. We trace the leak to its source and repair it instead of just covering the symptom.',
      },
    ],
  },

  why: {
    heading: 'Why Fort Worth Homeowners Choose Us',
    features: [
      {
        icon: 'clock',
        title: 'Fast Response',
        description: "Call and we'll get a technician scheduled quickly, for a routine sweep or an urgent repair.",
      },
      {
        icon: 'dollar',
        title: 'Transparent Pricing',
        description: 'Your technician confirms the price in writing before any work starts, so there are no surprises on the invoice.',
      },
      {
        icon: 'shield',
        title: 'Certified Techs',
        description: 'Our technicians follow CSIA training standards and NFPA 211 guidelines on every visit.',
      },
      {
        icon: 'clipboard',
        title: 'Written Reports',
        description: 'Every sweep and inspection ends with a written condition report you can keep for your records or an insurance claim.',
      },
    ],
  },

  process: {
    heading: 'How It Works',
    steps: [
      {
        title: 'Call or Request a Quote',
        description: "Tell us what's going on and where you're located, and we'll find a time that works for your schedule.",
      },
      {
        title: 'Get Your Price in Writing',
        description: 'Your technician confirms the price before any work begins, based on what your chimney actually needs.',
      },
      {
        title: 'We Do the Work',
        description: 'Containment and a HEPA-filtered vacuum keep the mess out of your home while we sweep, inspect, or repair.',
      },
      {
        title: 'Review Your Written Report',
        description: 'You get a written record of what we found and what we did, to keep or share with your insurance agent.',
      },
    ],
  },

  // Real reviews belong in src/data/reviews.json; Testimonials.astro renders
  // nothing until real, verifiable reviews are added there.
  reviews: {
    heading: 'What Our Customers Say',
    items: [] as { name: string; neighborhood: string; quote: string }[],
  },

  areas: {
    heading: 'Proudly Serving Fort Worth and Surrounding Communities',
    intro: 'Chimney Sweep Pro is based in Saginaw, TX, and serves homeowners throughout the greater Fort Worth area.',
    // site.areaServed is the single source of truth — also read by
    // LocalBusinessSchema, so the schema and this visible list can't drift.
    neighborhoods: site.areaServed,
    // TODO: no confirmed ZIP list yet — ServiceAreas.astro hides this column
    // until it's filled in. Don't invent ZIP codes.
    zips: [] as string[],
  },

  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'What areas do you serve?',
        answer:
          'We serve Fort Worth, Keller, Mansfield, Southlake, Arlington, Benbrook, North Richland Hills, Burleson, Haltom City, Saginaw, and Weatherford. Call (682) 354-6644 to confirm your city.',
      },
      {
        question: 'Do you give a written report after every visit?',
        answer:
          'Yes. Every sweep and inspection ends with a written report of what we found and what we did, so you have a record for your own files or an insurance claim.',
      },
      {
        question: 'How do I get a price for my chimney?',
        answer:
          'Call (682) 354-6644 or request a quote online. Your technician confirms the exact price in writing before any work begins.',
      },
      {
        question: 'Do you remove animals from chimneys, not just sweeps and repairs?',
        answer:
          "Yes. We remove birds, raccoons, and squirrels from chimneys, then clean and cap the flue so they can't get back in.",
      },
    ],
  },

  form: {
    heading: 'Request a Quote',
    intro: "Tell us what's going on and we'll get back to you to schedule a visit. For faster service, call (682) 354-6644.",
  },
};

function descriptionFor(label: string): string {
  const descriptions: Record<string, string> = {
    'Chimney Sweep': 'Full rotary flue cleaning with a Level 1 inspection and a written condition report every visit.',
    'Chimney Inspection': 'Level 1 and Level 2 inspections that check your whole chimney system, inside and out.',
    'Chimney Repair': 'Masonry, crown, flashing, and firebox repairs, quoted in writing before work starts.',
    'Chimney Cap Installation': 'A properly fitted cap keeps out rain, animals, and debris, and stops downdrafts.',
    'Chimney Relining': 'A new flue liner restores a safe, code-compliant path for smoke and gases.',
    'Dryer Vent Cleaning': 'Lint and blockage removal that cuts dry times and lowers fire risk.',
    'Chimney Animal Removal': "Humane removal of birds, raccoons, and squirrels, plus a cleaning and cap to keep them out.",
    'Chimney Leak Repair': 'We trace the leak to its source and repair flashing, crown, or masonry damage for good.',
    'Chimney Sweep — Keller, TX': 'The same sweep, inspection, and written report, scheduled for Keller homes.',
  };
  return descriptions[label] ?? '';
}

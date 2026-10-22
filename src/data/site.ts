// Single source of truth for business facts (NAP). Used by header, footer, hero,
// click-to-call links and (later) LocalBusiness schema.
export const site = {
  name: 'Chimney Sweep Pro',
  url: 'https://fortworthchimneysweep.com',
  phone: '(877) 203-8193',
  phoneHref: 'tel:+18772038193',
  address: {
    street: '804 Mustang Dr',
    city: 'Saginaw',
    region: 'TX',
    postalCode: '76179',
  },
  // Not provided yet — the footer omits hours until this is filled in.
  hours: [] as string[],
  // Sitewide og:image fallback for any page that has no page-specific one
  // (home, blog category/pagination pages, and blog posts with no ogImage
  // in frontmatter — see content.config.ts's blog `ogImage` comment).
  defaultOgImage: '/images/chimney-sweep/chimney-sweep-fort-worth-hero.webp',
  // Full service area, sitewide — the single list LocalBusinessSchema's
  // areaServed and the homepage/contact-us ServiceAreas section both read
  // from, so they can't drift apart. An individual service page's own
  // areaServed (ServiceSchema) may still be a narrower subset of this.
  areaServed: [
    'Fort Worth',
    'Keller',
    'Mansfield',
    'Southlake',
    'Arlington',
    'Benbrook',
    'North Richland Hills',
    'Burleson',
    'Haltom City',
    'Saginaw',
    'Weatherford',
  ],
};

// Link labels are the page names from the URL inventory; slugs must match it exactly.
export const serviceLinks = [
  { label: 'Chimney Sweep', href: '/chimney-sweep-fort-worth-tx/' },
  { label: 'Chimney Inspection', href: '/chimney-inspection-fort-worth-tx/' },
  { label: 'Chimney Repair', href: '/chimney-repair-fort-worth-tx/' },
  { label: 'Chimney Cap Installation', href: '/chimney-cap-installation-fort-worth-tx/' },
  { label: 'Chimney Relining', href: '/chimney-relining-fort-worth-tx/' },
  { label: 'Dryer Vent Cleaning', href: '/dryer-vent-cleaning-fort-worth-tx/' },
  { label: 'Chimney Animal Removal', href: '/chimney-animal-removal-fort-worth-tx/' },
  { label: 'Chimney Leak Repair', href: '/chimney-leak-repair-fort-worth-tx/' },
  { label: 'Chimney Sweep — Keller, TX', href: '/chimney-sweep-keller-tx/' },
];

export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'Our Services', href: '/chimney-sweep-services/', children: serviceLinks },
  { label: 'Blog', href: '/category/blogs/' },
  { label: 'Contact', href: '/contact-us/' },
];

# Cluster Map: fortworthchimneysweep.com

Source of truth for topic clusters and internal linking. Use these values in each content-collection entry's frontmatter. Do not invent or change slugs. All slugs match the live URL inventory in the migration brief (shown here without slashes).

## How the linking works

- Each page belongs to one **cluster** and has a **role**: `pillar` (site-level), `hub` (owns a cluster), or `spoke` (supports a hub).
- A hub's `hub` field is the pillar when it sits under the pillar. Top-level hubs (`chimney-sweep-fort-worth-tx`, `chimney-sweep-services`, `dryer-vent-cleaning-fort-worth-tx`) have no parent: leave `hub` out and link manually via `related`.
- A spoke's `hub` field names the page it links up to. The link goes in the body, and its link text is that hub's `hubAnchor`.
- **Siblings are automatic.** For any spoke whose hub has `role: hub`, the layout finds other built pages with the same `hub` value and links to up to 3 of them. Order: lowest `priority` first, then newest `date`, then alphabetical by slug. Exclude the page itself. Do not hand-write sibling slugs in `related`.
- **`related` is for cross-cluster links only** (for example, an animal page linking to the cap hub). Max 3. Do not list same-hub siblings in it. If a `related` slug is already shown as a sibling, show it once.
- **Auto-siblings do not apply** to hubs, the pillar, or spokes whose hub is the pillar (currently only `chimney-relining-fort-worth-tx`). Those use `related` by hand.
- **Only render links to pages that are already built.** Content arrives one page at a time, so skip any link whose target slug has no entry yet. No live page should link to a 404 during the migration.
- Hubs and the pillar show a "Related deep dives" block listing every built entry whose `hub` points at them, generated from the collection. If there are none yet, render nothing (no empty heading).
- No more than one link to the same URL per section.
- Blog posts link to their hub in the body copy. Service pages link to related service pages and to relevant blog posts.
- Blog posts do not use `hubAnchor`. Other pages link to a blog post using its own title or a natural descriptive phrase.
- Service pages link to blog posts through `relatedPosts` (max 3 blog slugs, only rendered if built). Blog posts never use it.
- Home, `/contact-us/`, and the three category pages have no cluster fields.

## Schema addition

Already implemented: `clusterFields` is spread into both `services` and `blog` in `src/content.config.ts`. Fields are optional so home, contact, and category pages are not affected. Services also have `relatedPosts`.

```ts
const clusterFields = {
  cluster: z.enum([
    'repair',           // the pillar plus its direct hubs/spokes (relining, planned masonry pages)
    'leaks',
    'caps',
    'animals',
    'sweep-inspection',
    'dryer-vent'
  ]).optional(),
  role: z.enum(['pillar', 'hub', 'spoke']).optional(),
  hub: z.string().optional(),        // slug of parent hub or pillar; omit for the pillar and top-level hubs
  related: z.array(z.string()).max(3).default([]),  // cross-cluster links only
  hubAnchor: z.string().optional(),  // link text other pages use when linking TO this page
  priority: z.number().default(100), // sibling ordering; lower shows first
}
```

Example frontmatter:

```yaml
# water-dripping-from-chimney
cluster: leaks
role: spoke
hub: chimney-leak-repair-fort-worth-tx
# siblings are automatic; no related needed
```

```yaml
# raccoon-in-chimney-fort-worth-tx
cluster: animals
role: spoke
hub: chimney-animal-removal-fort-worth-tx
related: [chimney-cap-installation-fort-worth-tx]  # cross-cluster
```

## Service pages

"none" means leave the field out.

| Slug | cluster | role | hub | related (cross-cluster / manual) | hubAnchor |
|---|---|---|---|---|---|
| `chimney-repair-fort-worth-tx` | repair | pillar | none | none | chimney repair in Fort Worth |
| `chimney-relining-fort-worth-tx` | repair | spoke | chimney-repair-fort-worth-tx | chimney-inspection-fort-worth-tx, level-1-vs-level-2-chimney-inspection, black-chimney-smoke | chimney relining |
| `chimney-leak-repair-fort-worth-tx` | leaks | hub | chimney-repair-fort-worth-tx | chimney-cap-installation-fort-worth-tx | chimney leak repair |
| `chimney-cap-installation-fort-worth-tx` | caps | hub | chimney-repair-fort-worth-tx | chimney-leak-repair-fort-worth-tx, chimney-animal-removal-fort-worth-tx | chimney cap installation |
| `chimney-animal-removal-fort-worth-tx` | animals | hub | chimney-repair-fort-worth-tx | chimney-cap-installation-fort-worth-tx | chimney animal removal |
| `raccoon-in-chimney-fort-worth-tx` | animals | spoke | chimney-animal-removal-fort-worth-tx | chimney-cap-installation-fort-worth-tx | raccoon in chimney removal |
| `squirrel-in-chimney-removal-fort-worth-tx` | animals | spoke | chimney-animal-removal-fort-worth-tx | chimney-cap-installation-fort-worth-tx | squirrel in chimney removal |
| `bird-in-chimney-removal` | animals | spoke | chimney-animal-removal-fort-worth-tx | chimney-cap-installation-fort-worth-tx | bird in chimney removal |
| `chimney-inspection-fort-worth-tx` | sweep-inspection | hub | chimney-repair-fort-worth-tx | chimney-relining-fort-worth-tx | chimney inspection |
| `chimney-sweep-fort-worth-tx` | sweep-inspection | hub | none | chimney-inspection-fort-worth-tx | chimney sweep in Fort Worth |
| `chimney-sweep-services` | sweep-inspection | hub | none | none | chimney sweep services |
| `chimney-sweep-keller-tx` | sweep-inspection | spoke | chimney-sweep-fort-worth-tx | chimney-sweep-services, chimney-inspection-fort-worth-tx | chimney sweep in Keller, TX |
| `dryer-vent-cleaning-fort-worth-tx` | dryer-vent | hub | none | none | dryer vent cleaning in Fort Worth |

## Blog posts

Same-hub siblings are automatic, so `related` lists only cross-cluster links. "none" means leave the field out.

| Slug | cluster | role | hub | related (cross-cluster only) |
|---|---|---|---|---|
| `water-dripping-from-chimney` | leaks | spoke | chimney-leak-repair-fort-worth-tx | none |
| `water-stains-on-ceiling-next-to-chimney` | leaks | spoke | chimney-leak-repair-fort-worth-tx | none |
| `chimney-leaking-after-hail` | leaks | spoke | chimney-leak-repair-fort-worth-tx | chimney-cap-blew-off |
| `how-to-repair-a-leaking-chimney` | leaks | spoke | chimney-leak-repair-fort-worth-tx | none |
| `fireplace-smell-wet` | leaks | spoke | chimney-leak-repair-fort-worth-tx | smoke-smell-from-fireplace-when-not-in-use |
| `mold-in-fireplace` | leaks | spoke | chimney-leak-repair-fort-worth-tx | none |
| `chimney-cap-installation-cost` | caps | spoke | chimney-cap-installation-fort-worth-tx | chimney-leaking-after-hail |
| `chimney-cap-blew-off` | caps | spoke | chimney-cap-installation-fort-worth-tx | chimney-leaking-after-hail |
| `chimney-cap-types` | caps | spoke | chimney-cap-installation-fort-worth-tx | none |
| `chimney-cap-vs-chase-cover` | caps | spoke | chimney-cap-installation-fort-worth-tx | none |
| `chimney-cap-needs-replacing` | caps | spoke | chimney-cap-installation-fort-worth-tx | none |
| `chimney-without-a-cap` | caps | spoke | chimney-cap-installation-fort-worth-tx | none |
| `top-sealing-damper-vs-chimney-cap` | caps | spoke | chimney-cap-installation-fort-worth-tx | none |
| `chimney-cap-sizes` | caps | spoke | chimney-cap-installation-fort-worth-tx | none |
| `bird-stuck-in-chimney` | animals | spoke | chimney-animal-removal-fort-worth-tx | chimney-cap-installation-fort-worth-tx |
| `bird-nest-in-chimney-fort-worth-tx` | animals | spoke | chimney-animal-removal-fort-worth-tx | chimney-cap-installation-fort-worth-tx |
| `level-1-vs-level-2-chimney-inspection` | sweep-inspection | spoke | chimney-inspection-fort-worth-tx | chimney-relining-fort-worth-tx |
| `black-chimney-smoke` | sweep-inspection | spoke | chimney-sweep-fort-worth-tx | chimney-relining-fort-worth-tx, level-1-vs-level-2-chimney-inspection |
| `smoke-smell-from-fireplace-when-not-in-use` | sweep-inspection | spoke | chimney-sweep-fort-worth-tx | fireplace-smell-wet |
| `signs-of-a-clogged-dryer-vent` | dryer-vent | spoke | dryer-vent-cleaning-fort-worth-tx | none |
| `how-often-to-clean-a-dryer-vent` | dryer-vent | spoke | dryer-vent-cleaning-fort-worth-tx | none |
| `dryer-vent-fires` | dryer-vent | spoke | dryer-vent-cleaning-fort-worth-tx | none |
| `dryer-vent-length-and-routing` | dryer-vent | spoke | dryer-vent-cleaning-fort-worth-tx | none |
| `diy-vs-professional-dryer-vent-cleaning` | dryer-vent | spoke | dryer-vent-cleaning-fort-worth-tx | none |
| `foil-vs-rigid-dryer-duct` | dryer-vent | spoke | dryer-vent-cleaning-fort-worth-tx | none |
| `dryer-taking-too-long-to-dry` | dryer-vent | spoke | dryer-vent-cleaning-fort-worth-tx | none |

## Adding new content

1. Pick the page's cluster, role, and hub.
2. Set its slug (service pages: `/[service]-fort-worth-tx/`) and `hubAnchor` (service pages only).
3. Add a row to this file.
4. Add a `related` link only where a real cross-cluster connection exists.
5. Set `priority` only if you want the page to show ahead of newer siblings.

Older pages pick up the new page as a sibling and the hub lists it automatically. Do not edit them.

New cluster: add its value to the `cluster` enum, then create the hub entry.

Planned pages from the keyword research, with suggested placement (nothing is built until requested):
- Crown repair, flashing repair: cluster `leaks`, spokes of the leak hub
- Chimney rebuild, masonry repair, tuckpointing: cluster `repair`, hubs or spokes under the repair pillar (decide when added)
- Fireplace repair: decide its cluster when added

## Notes

- **Bird pages need distinct jobs** so they don't compete. `bird-in-chimney-removal` is the transactional service page. `bird-stuck-in-chimney` covers the live-bird emergency and what to do right now. `bird-nest-in-chimney-fort-worth-tx` covers nests, including seasonal and fire-risk issues.
- **Sweep pages need distinct jobs** to avoid cannibalization. `chimney-sweep-fort-worth-tx` targets "fort worth chimney sweep." `chimney-sweep-services` is the landing page for the whole service menu and links out to every hub.
- **Hubs with no spokes yet:** `chimney-sweep-services`. The related-deep-dives block should render nothing for it. `dryer-vent-cleaning-fort-worth-tx` now has one spoke (`signs-of-a-clogged-dryer-vent`), but that service page has no "related deep dives" block built yet — see the note in astro-migration-brief.md; it's a future addition, not built as part of that post.
- **`chimney-sweep-services`** is a top-level hub in `sweep-inspection` that acts as the whole-menu landing page; it links to every hub via `related` and body copy.
- **Judgment calls to confirm:** `fireplace-smell-wet` and `mold-in-fireplace` sit under leaks. `chimney-relining-fort-worth-tx` sits under the repair pillar.
- **Checklist addition:** for every page, confirm the cluster, role, hub, related, and hubAnchor fields are filled in from this file.
- **`dryer-vent-length-and-routing`** covers multi-story/upstairs-laundry routing itself (see its "Dryer vent routing in multi-story homes" section). No separate `dryer-vent-multi-story-homes` page exists or is planned — don't create one; that topic is merged into this post.

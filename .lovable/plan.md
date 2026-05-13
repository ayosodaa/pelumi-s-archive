## Goal

Ship version 1 of Oluwapelumi Samuel's personal archive site — a visually immersive, multi-page experience using the **Curatorial Archive** direction (Fraunces serif + Inter, paper/ink/clay/earth palette, cinematic full-bleed hero, editorial timeline, scrapbook Junkyard). Content is hardcoded with rich placeholders so we can iterate on visuals first; Supabase admin/CMS comes in v2.

## What ships in v1

### Pages (TanStack Start routes)
- `/` — Home: cinematic hero (full-bleed portrait placeholder + headline), Journey overview (7 eras teaser), featured Lab tools, Junkyard preview, latest Writing, footer.
- `/journey` — Full interactive timeline. Each of the 7 eras gets its own expandable section with description, key projects/orgs, image gallery placeholders, and lessons.
- `/lab` — Filterable grid of tools/templates/frameworks with category chips and expandable detail.
- `/junkyard` — Scrapbook collage of failed experiments with rotation, sticky notes, sketches, and reflections.
- `/writing` — Editorial archive list with date, category tags, reading time, and individual entry pages (`/writing/$slug`) for essays, poetry, reflections.
- `/about` — Short bio + contact.

### Shared components
- `SiteNav` — fixed top nav with mix-blend-difference over hero, solid below.
- `SiteFooter` — editable-shaped (so v2 admin slots in cleanly): bio blurb, era links, social links (LinkedIn, X, Substack, Medium, GitHub, Instagram, email).
- `EraCard`, `ToolCard`, `JunkyardCard`, `WritingEntry` — reusable archive primitives.
- `ImagePlaceholder` — wraps the editorial slot pattern so real images can be swapped in later.

### Content seed
A single `src/content/` module exports typed data for the 7 eras, ~9 lab tools, ~6 junkyard entries, ~6 writing pieces, and the orgs list (BiD Capital Partners, BuildWithORI, OKU Ventures, Startup Builder 360, NCIC, ALU SOWC). This becomes the contract that v2's Supabase tables mirror.

### Visual + motion
- Fraunces (display/serif) + Inter (sans), Google Fonts via root.
- Tokens (paper, ink, earth, clay, plus muted variants) defined in `src/styles.css` with oklch values.
- Framer Motion for: hero text reveal, scroll-triggered fade/translate on era sections, hover lifts on cards, Junkyard rotation easing on hover.
- Editorial details: italic accents in serif, clay underline hovers, hairline ink/10 dividers, tabular-nums dates.

### Hero portrait
Editorial silhouette placeholder via `imagegen` (premium, "editorial cinematic silhouette of a thoughtful figure, soft natural studio light, archival photography mood"), saved to `src/assets/hero-portrait.jpg`. Pelumi can replace it later.

### SEO
Per-route `head()` with unique title + description + og tags. Title pattern: `<Section> — Oluwapelumi Samuel`.

## Out of scope for v1 (planned for v2)
- Supabase auth + admin dashboard (content editing, media uploads, drag-drop sections).
- Real CMS-backed content for eras/lab/junkyard/writing.
- File storage buckets, RLS policies, profile/role tables.
- Audio/podcast embeds, lightbox gallery, reading mode for essays.

A note on hosting: this template runs on TanStack Start (Cloudflare-style edge runtime), not Next.js. It deploys via Lovable's publish flow, not Netlify. We can revisit Netlify hosting later if you need it specifically — let me know and we'll discuss tradeoffs.

## Technical notes

- File-based routing under `src/routes/`. New files: `journey.tsx`, `lab.tsx`, `junkyard.tsx`, `writing.tsx`, `writing.$slug.tsx`, `about.tsx`. Replace placeholder `index.tsx`.
- Components live in `src/components/site/` (nav, footer, hero, era-card, tool-card, junkyard-card, writing-entry, image-placeholder).
- Content in `src/content/{eras,lab,junkyard,writing,site}.ts` exporting typed const arrays.
- `src/styles.css` extended with serif/sans font families and the palette tokens. No new colors used directly in components — everything via tokens.
- `bun add framer-motion` for ambient motion.
- Hero portrait generated once via imagegen premium and imported as ES6 asset.

## v2 preview (so we build with it in mind)

When you're ready: enable Lovable Cloud (Supabase under the hood) → tables for `eras`, `tools`, `junkyard_entries`, `writing`, `site_settings`, `media` → admin routes under `/_authenticated/admin/*` → image upload via storage bucket → swap hardcoded `src/content/*` for server functions reading those tables. The component contract stays the same, so the v1 UI carries forward unchanged.

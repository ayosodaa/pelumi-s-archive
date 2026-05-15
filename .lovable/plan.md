
# Finish the Supabase-driven setup

Goal: bring the site to a state where every page is dynamic, every shareable route has proper SEO, all v2 routes exist, and the production build is green. You'll handle image uploads yourself in Supabase Studio.

## 1. Seed default rows

Insert baseline rows so the site stops relying on hardcoded fallbacks and you can edit everything from Supabase.

- **`website_settings`** (single row): site_title, site_short, tagline, subtagline, hero_title, hero_subtitle, about_text, contact_email, footer_text, seo_title, seo_description. `hero_image_path` left null until you upload.
- **`navigation`** (header): The Journey, The Lab, Junkyard, Writing, Podcast, About — sort_order 1–6.
- **`navigation`** (footer): mirrors of the section links.
- **`social_links`**: 3–4 placeholders (Twitter/X, LinkedIn, GitHub, Email) you can rename/edit later.

## 2. Build the missing routes

All read from Supabase via `src/lib/db.ts` (extended where needed) and reuse the existing Curatorial Archive components.

- **`/projects/$slug`** — full project page: hero, description, tags, status, outcomes, lessons, links, related era. Pulls from `projects`.
- **`/lab/$slug`** — full tool page: description, format, screenshots gallery, tool URL, downloadable resources. Pulls from `tools_lab`.
- **`/junkyard/$slug`** — full failure post-mortem: kind, date, what, why it failed, lesson, sketches gallery. Pulls from `junkyard`.
- **`/podcast`** — index of `podcast_media` entries with embeds + thumbnails. List-only, no detail page.
- **Gallery viewer** — shared `<Gallery slug="...">` component that fetches `galleries` + `gallery_images` and renders a masonry grid with a lightbox. Usable from any route by slug.

## 3. Per-route SEO

Add a `head()` to every route that derives title/description/og from loader data, falling back to `website_settings`.

- Static routes (`/`, `/journey`, `/lab`, `/junkyard`, `/writing`, `/about`, `/podcast`): title pattern `"<Section> — <site_title>"`, description from a section blurb or the settings default.
- Dynamic routes (`/writing/$slug`, `/projects/$slug`, `/lab/$slug`, `/junkyard/$slug`): title from the entry, description from excerpt/description, `og:image` from the entry's image when set, `og:type: article`.
- Add `<link rel="canonical">` only on leaf routes (root keeps defaults — see TanStack canonical dedupe rule).
- Root route gets sitewide defaults + `og:site_name` + a JSON-LD `WebSite` block.

## 4. Verify the build

- Run a clean typecheck/build, fix any remaining TS errors from the new routes.
- Smoke-test each new route renders with the seeded (often empty) tables — empty states must look intentional, not broken.
- Confirm `<DbImage>`/`ImagePlaceholder` falls back gracefully when `*_image_path` is null so you can upload images at your own pace.

## Out of scope

- No admin UI (you edit in Supabase Studio).
- No image uploads from my side — you'll upload via Studio and the site will pick them up automatically.
- No Netlify deploy step (separate task).

## Technical notes

- Detail-route loaders call `getProject(slug)` / `getTool(slug)` / `getJunk(slug)` (the latter two need to be added to `src/lib/db.ts`).
- New `listPodcast()` and `getGallery(slug)` fetchers in `src/lib/db.ts`.
- All loaders use `Route.useLoaderData()` with explicit type casts to keep TS happy (matches the fix already applied in v2).
- `staleTime: 0` on the router (already set) so Studio edits show on next navigation; no extra realtime wiring.
- Detail routes throw `notFound()` when the slug doesn't resolve, with a `notFoundComponent` per route.

After approval I'll execute in this order: seed inserts → db.ts fetchers → new routes → SEO heads → build verification.

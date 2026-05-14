# Supabase-Driven Living Archive — v2 Plan

## Note on stack
Your brief says Next.js, but this project is built on **TanStack Start** (React 19 + Vite, SSR-capable, file-based routing). It supports everything you need — dynamic routes, SSR, ISR-equivalent caching, realtime — and switching to Next.js would mean rebuilding v1 from scratch. I'll proceed on TanStack Start unless you'd rather restart.

You manage everything in Supabase Studio (Table Editor + Storage). No custom admin UI is built.

---

## 1. Enable Lovable Cloud
Provisions Supabase (DB + Storage + Auth) and wires env vars automatically. You'll edit content in the Supabase Studio dashboard.

## 2. Database schema (migrations)

Tables, all with `id uuid pk`, `created_at`, `updated_at`, `published boolean default true`, `sort_order int`:

- **website_settings** (singleton row): site_title, hero_title, hero_subtitle, hero_image_path, about_text, contact_email, footer_text, seo_title, seo_description, seo_og_image
- **social_links**: label, url, icon, sort_order
- **navigation**: label, url, sort_order, location ('header'|'footer')
- **journey_eras**: number, title, slug (unique), years, kicker, description, highlights (text[]), lessons (text[]), featured_image_path, visual_theme, sort_order
- **projects**: title, slug, description, category, tags (text[]), featured_image_path, related_era_id (fk), links (jsonb), outcomes (text[]), lessons_learned (text[]), status, sort_order
- **writing**: title, slug, excerpt, full_content (markdown), category, cover_image_path, publish_date, tags (text[])
- **podcast_media**: title, description, embed_url, thumbnail_path, categories (text[])
- **tools_lab**: code, tool_name, slug, description, format, screenshots (text[]), tool_url, downloadable_resources (jsonb), category
- **junkyard**: project_name, slug, kind, date_label, what, why_failed, lesson, sketches (text[]), category, rotation
- **galleries**: title, slug, linked_section, sort_order
- **gallery_images**: gallery_id (fk), image_path, caption, sort_order

**RLS**: enable on all. One public SELECT policy per table: `USING (published = true)`. No insert/update/delete policies — edits happen in Studio with the service role.

**Storage buckets** (public): `hero`, `eras`, `projects`, `writing`, `podcast`, `tools`, `junkyard`, `galleries`, `downloads`. Public-read storage policy on each.

## 3. Seed data
Migration seeds existing v1 content (7 eras, ~9 tools, junkyard, writing, settings, socials) so the site doesn't go blank on switchover. Hero image gets uploaded to the `hero` bucket.

## 4. Server functions (data layer)
Replace `src/content/*.ts` reads with `createServerFn` handlers in `src/lib/`:
- `getWebsiteSettings`, `getNavigation`, `getSocialLinks`
- `listEras`, `getEraBySlug`
- `listProjects`, `getProjectBySlug`
- `listWriting`, `getWritingBySlug`
- `listTools`, `getToolBySlug`
- `listJunkyard`, `getJunkyardBySlug`
- `listPodcast`, `getGalleryBySlug`

Each resolves storage paths to public URLs via `supabase.storage.from(bucket).getPublicUrl()`.

## 5. Dynamic routes
Refactor existing routes + add new dynamic ones:
- `/` — settings + featured eras/writing/projects
- `/journey` + `/journey/$slug`
- `/lab` + `/lab/$slug`
- `/junkyard` + `/junkyard/$slug`
- `/writing` + `/writing/$slug` (already dynamic)
- `/projects` + `/projects/$slug` (new)
- `/podcast` (new)
- `/about` — pulls from `website_settings.about_text`

Loaders call server fns via TanStack Query (`ensureQueryData` + `useSuspenseQuery`) with short `staleTime` so Studio edits appear on next navigation/refresh. Optional realtime subscription on the homepage for live updates.

## 6. Media handling
Shared `<DbImage>` component: takes a storage path, renders responsive `<img>` with `loading="lazy"`, blur-up placeholder, optional lightbox. Galleries use masonry layout. Footer, nav, socials all driven from DB.

## 7. SEO
Per-route `head()` reads SEO fields from the matching DB record (writing/projects/eras/tools); falls back to `website_settings` defaults. og:image derived from each entry's cover image.

## 8. Out of scope (intentional)
- No admin UI, no auth gating (you edit in Supabase Studio)
- No Stripe/payments, no comments
- Netlify deployment: this Lovable project deploys via Lovable's hosting; custom domain works there. If you want Netlify specifically, that's a separate export step after launch.

---

## What you do after I build
1. Open Supabase Studio (link surfaced in chat)
2. Edit any row in any table → site updates on next load
3. Drag images into Storage buckets → reference the path in the relevant table row

Approve and I'll execute: enable Cloud → migrations + seed → server fns → refactor routes → swap content imports → verify.
# Resume section — plan

Add a dedicated `/resume` page in the same serif/clay editorial style as `/about` and `/journey`, backed by three new Lovable Cloud tables so you can edit content from the backend like the rest of the site.

## New route

`src/routes/resume.tsx` — loader fetches settings, nav, socials, experiences, skills, education. Own `head()` (title, description, og:title/description). Sections top-to-bottom:

1. **Header** — kicker "Resume", serif h1 ("A professional record."), short intro paragraph pulled from `website_settings.resume_intro`, "Download CV (PDF)" button pointing to `website_settings.resume_pdf_url`.
2. **Experience** — vertical timeline of roles: org, title, location, date range, 2–4 bullet achievements. Ordered newest-first.
3. **Skills & expertise** — grouped clusters (e.g. Programme Ops, Entrepreneurship, Conservation, Technology, Writing). Each cluster = heading + tag list.
4. **Education & certifications** — same timeline style as Experience but tighter: institution, credential, date, optional note.
5. Footer (reused).

Add "Resume" to the header nav via the existing `navigation` table (seed row, no code change needed).

## Data model (3 new tables + 2 columns)

```text
website_settings
  + resume_intro       text
  + resume_pdf_path    text  -- stored in existing "downloads" bucket

resume_experience
  id, org, role, location, start_label, end_label,
  is_current bool, bullets text[], sort_order int,
  published bool, created_at, updated_at

resume_skills
  id, cluster (e.g. "Programme Ops"), skills text[],
  sort_order int, published bool, created_at, updated_at

resume_education
  id, institution, credential, date_label, note,
  sort_order int, published bool, created_at, updated_at
```

RLS: public SELECT where `published = true` (mirrors existing content tables); writes restricted to `admin` role via existing `has_role`. Standard GRANTs to `anon`, `authenticated`, `service_role`.

PDF upload uses the existing public `downloads` bucket; `publicUrl("downloads", …)` resolves the link.

## Code changes

- **Migration** (via migration tool) — 3 tables + column additions + RLS + policies + GRANTs + `set_updated_at` triggers + one nav row `('Resume','/resume','header')`.
- **`src/lib/db.ts`** — add types `ResumeExperience`, `ResumeSkillCluster`, `ResumeEducation`; extend `WebsiteSettings` with `resume_intro` and `resume_pdf_url`; add `listResumeExperience()`, `listResumeSkills()`, `listResumeEducation()`.
- **`src/routes/resume.tsx`** — new route matching existing conventions (loader + head + errorComponent, `SiteNav` + `SiteFooter`).
- **`src/components/site/ResumeTimeline.tsx`** — small presentational component for experience/education items.
- Seed empty/example rows so the page renders on first load; you edit real content via the backend afterwards.

## Not in scope

- Auto-generating the PDF from DB content (you upload a PDF you control).
- Public write forms — content stays admin-only.
- Restyling `/about` or removing existing bio.

After you approve, I'll run the migration first, then wire the code once the types regenerate.
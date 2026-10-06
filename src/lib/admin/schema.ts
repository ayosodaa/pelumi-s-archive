// Describes every editable content type for the /admin panel. The editor and
// list screens are generated from this file, so adding a field to the site
// means adding one line here (plus the database column).

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "date"
  | "tags" // text[] edited as comma-separated values
  | "list" // text[] edited one item per line
  | "image" // storage path in `bucket`
  | "images" // text[] of storage paths in `bucket`
  | "file" // storage path in `bucket` (PDFs etc.)
  | "links" // jsonb [{ label, url }]
  | "select" // fixed options
  | "relation"; // id of a row in another table

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  bucket?: string;
  options?: { value: string; label: string }[];
  relation?: { table: string; labelField: string };
  slugFrom?: string; // auto-fill this slug from another field while creating
  placeholder?: string;
};

export type ContentType = {
  table: string;
  label: string; // plural, shown in the dashboard
  singular: string;
  group: "Content" | "Resume" | "Site";
  description: string;
  titleField: string;
  subtitleField?: string;
  singleton?: boolean;
  hasPublished?: boolean;
  hasSortOrder?: boolean;
  orderBy?: { column: string; ascending: boolean };
  publicPath?: (row: Record<string, unknown>) => string | null;
  fields: Field[];
};

const published: Field = {
  name: "published",
  label: "Published",
  type: "boolean",
  help: "Unpublished items are hidden from the public site.",
};

export const contentTypes: ContentType[] = [
  {
    table: "writing",
    label: "Articles",
    singular: "Article",
    group: "Content",
    description: "Essays, reflections and notes on the Writing page.",
    titleField: "title",
    subtitleField: "publish_date",
    hasPublished: true,
    hasSortOrder: false,
    orderBy: { column: "publish_date", ascending: false },
    publicPath: (r) => (r.slug ? `/writing/${r.slug}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, slugFrom: "title", help: "The last part of the article's web address." },
      { name: "excerpt", label: "Excerpt", type: "textarea", help: "One or two sentences shown in lists and link previews." },
      { name: "category", label: "Category", type: "text", placeholder: "Essay, Reflection, Poetry, Note" },
      { name: "publish_date", label: "Publish date", type: "date" },
      { name: "cover_image_path", label: "Cover image", type: "image", bucket: "writing" },
      { name: "full_content", label: "Article", type: "markdown", bucket: "writing" },
      { name: "tags", label: "Tags", type: "tags" },
      { name: "reading_minutes", label: "Reading time (minutes)", type: "number", help: "Leave empty to calculate it from the article length." },
      published,
    ],
  },
  {
    table: "projects",
    label: "Projects",
    singular: "Project",
    group: "Content",
    description: "Programmes, ventures and systems on the Projects page.",
    titleField: "title",
    subtitleField: "category",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: (r) => (r.slug ? `/projects/${r.slug}` : null),
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, slugFrom: "title" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "category", label: "Category", type: "text" },
      { name: "status", label: "Status", type: "text", placeholder: "active, completed, paused" },
      { name: "featured_image_path", label: "Featured image", type: "image", bucket: "projects" },
      { name: "related_era_id", label: "Journey era", type: "relation", relation: { table: "journey_eras", labelField: "title" } },
      { name: "outcomes", label: "Outcomes", type: "list", help: "One outcome per line." },
      { name: "lessons_learned", label: "Lessons learned", type: "list", help: "One lesson per line." },
      { name: "links", label: "Links", type: "links" },
      { name: "tags", label: "Tags", type: "tags" },
      published,
    ],
  },
  {
    table: "journey_eras",
    label: "Journey eras",
    singular: "Era",
    group: "Content",
    description: "The chapters on the Journey page and home page.",
    titleField: "title",
    subtitleField: "years",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: (r) => (r.slug ? `/journey#${r.slug}` : null),
    fields: [
      { name: "number", label: "Number", type: "text", placeholder: "01" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, slugFrom: "title" },
      { name: "years", label: "Years", type: "text", placeholder: "2016 to 2018" },
      { name: "kicker", label: "Kicker", type: "text", help: "Short line shown above the title." },
      { name: "description", label: "Description", type: "textarea" },
      { name: "highlights", label: "Highlights", type: "list", help: "One per line." },
      { name: "lessons", label: "Lessons", type: "list", help: "One per line." },
      { name: "featured_image_path", label: "Image", type: "image", bucket: "eras" },
      published,
    ],
  },
  {
    table: "tools_lab",
    label: "Lab tools",
    singular: "Tool",
    group: "Content",
    description: "Templates, tools and frameworks in The Lab.",
    titleField: "tool_name",
    subtitleField: "category",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: (r) => (r.slug ? `/lab/${r.slug}` : null),
    fields: [
      { name: "tool_name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, slugFrom: "tool_name" },
      { name: "code", label: "Code", type: "text", placeholder: "LAB-01" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "format", label: "Format", type: "text", placeholder: "Spreadsheet, Notion template, Framework" },
      { name: "category", label: "Category", type: "text" },
      { name: "tool_url", label: "Link to the tool", type: "text", placeholder: "https://", help: "Google Docs, Sheets, Slides, Drive, Figma, Canva, Miro, Airtable, YouTube and Loom links are shown inside the page automatically. Make sure the link is shared publicly." },
      { name: "show_embed", label: "Show the tool inside the page", type: "boolean", help: "Turn this off if the tool's website refuses to load inside other sites." },
      { name: "embed_url", label: "Embed link (optional)", type: "text", placeholder: "https://", help: "Only needed if the service gives you a separate embed link, for example from its Share > Embed menu. Leave empty to use the link above." },
      { name: "screenshots", label: "Screenshots", type: "images", bucket: "tools", help: "Shown below the preview. Useful when the tool cannot be embedded." },
      published,
    ],
  },
  {
    table: "junkyard",
    label: "Junkyard",
    singular: "Junkyard item",
    group: "Content",
    description: "Failed experiments and abandoned prototypes.",
    titleField: "project_name",
    subtitleField: "date_label",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: (r) => (r.slug ? `/junkyard/${r.slug}` : null),
    fields: [
      { name: "project_name", label: "Project name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, slugFrom: "project_name" },
      { name: "kind", label: "Kind", type: "text", placeholder: "Prototype, Venture, Idea" },
      { name: "date_label", label: "Date", type: "text", placeholder: "2019" },
      { name: "category", label: "Category", type: "text" },
      { name: "what", label: "What it was", type: "textarea" },
      { name: "why_failed", label: "Why it failed", type: "textarea" },
      { name: "lesson", label: "Lesson", type: "textarea" },
      { name: "rotation", label: "Card tilt (degrees)", type: "number", help: "A small number like -2 or 1.5 gives the card its pinned look." },
      published,
    ],
  },
  {
    table: "podcast_media",
    label: "Podcast & media",
    singular: "Media item",
    group: "Content",
    description: "Interviews, talks and recordings.",
    titleField: "title",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: () => "/podcast",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "embed_url", label: "Embed URL", type: "text", help: "Use the embed link, e.g. https://www.youtube.com/embed/VIDEO_ID or a Spotify embed link." },
      { name: "thumbnail_path", label: "Thumbnail", type: "image", bucket: "podcast" },
      { name: "categories", label: "Categories", type: "tags" },
      published,
    ],
  },
  {
    table: "resume_experience",
    label: "Experience",
    singular: "Role",
    group: "Resume",
    description: "Roles on the Resume page, newest first.",
    titleField: "role",
    subtitleField: "org",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: () => "/resume",
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "org", label: "Organisation", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "start_label", label: "Start", type: "text", placeholder: "Apr 2023" },
      { name: "end_label", label: "End", type: "text", placeholder: "Leave empty if current" },
      { name: "is_current", label: "Current role", type: "boolean" },
      { name: "bullets", label: "Achievements", type: "list", help: "One per line. Two to four works best." },
      published,
    ],
  },
  {
    table: "resume_skills",
    label: "Skills",
    singular: "Skill cluster",
    group: "Resume",
    description: "Grouped skills on the Resume page.",
    titleField: "cluster",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: () => "/resume",
    fields: [
      { name: "cluster", label: "Cluster name", type: "text", required: true },
      { name: "skills", label: "Skills", type: "tags" },
      published,
    ],
  },
  {
    table: "resume_education",
    label: "Education",
    singular: "Credential",
    group: "Resume",
    description: "Education and certifications.",
    titleField: "credential",
    subtitleField: "institution",
    hasPublished: true,
    hasSortOrder: true,
    publicPath: () => "/resume",
    fields: [
      { name: "credential", label: "Credential", type: "text", required: true },
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "date_label", label: "Date", type: "text" },
      { name: "note", label: "Note", type: "textarea" },
      published,
    ],
  },
  {
    table: "website_settings",
    label: "Site settings",
    singular: "Site settings",
    group: "Site",
    description: "Your name, bio, home page hero, contact email, SEO and resume PDF.",
    titleField: "site_title",
    singleton: true,
    publicPath: () => "/",
    fields: [
      { name: "site_title", label: "Full name / site title", type: "text" },
      { name: "site_short", label: "Short name (top left of the menu)", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "subtagline", label: "Sub tagline", type: "textarea" },
      { name: "hero_title", label: "Home page headline", type: "text" },
      { name: "hero_subtitle", label: "Home page intro", type: "textarea" },
      { name: "hero_image_path", label: "Home page image", type: "image", bucket: "hero" },
      { name: "about_text", label: "About page text", type: "markdown", bucket: "hero" },
      { name: "about_image_path", label: "About page portrait", type: "image", bucket: "hero" },
      { name: "contact_email", label: "Contact email", type: "text" },
      { name: "footer_text", label: "Footer note", type: "text" },
      { name: "seo_title", label: "Search engine title", type: "text" },
      { name: "seo_description", label: "Search engine description", type: "textarea" },
      { name: "seo_og_image", label: "Link preview image", type: "image", bucket: "hero", help: "Shown when the home page is shared. 1200 × 630 works best." },
      { name: "resume_intro", label: "Resume intro", type: "textarea" },
      { name: "resume_pdf_path", label: "Resume PDF", type: "file", bucket: "downloads" },
    ],
  },
  {
    table: "navigation",
    label: "Menu links",
    singular: "Menu link",
    group: "Site",
    description: "Links in the top menu.",
    titleField: "label",
    subtitleField: "url",
    hasPublished: true,
    hasSortOrder: true,
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "url", label: "URL", type: "text", required: true, placeholder: "/writing" },
      {
        name: "location",
        label: "Location",
        type: "select",
        options: [
          { value: "header", label: "Top menu" },
          { value: "footer", label: "Footer" },
        ],
      },
      published,
    ],
  },
  {
    table: "social_links",
    label: "Social links",
    singular: "Social link",
    group: "Site",
    description: "LinkedIn, Substack, Medium and other profiles.",
    titleField: "label",
    subtitleField: "url",
    hasPublished: true,
    hasSortOrder: true,
    fields: [
      { name: "label", label: "Label", type: "text", required: true, placeholder: "LinkedIn" },
      { name: "url", label: "URL", type: "text", required: true, placeholder: "https://" },
      published,
    ],
  },
];

export function getContentType(table: string): ContentType | undefined {
  return contentTypes.find((c) => c.table === table);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

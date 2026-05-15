import { supabase } from "@/integrations/supabase/client";

// ---------- types (DB-aligned) ----------
export type Era = {
  id: string;
  number: string | null;
  title: string;
  slug: string;
  years: string | null;
  kicker: string | null;
  description: string | null;
  highlights: string[];
  lessons: string[];
  featured_image_url: string | null;
};

export type Tool = {
  id: string;
  code: string | null;
  tool_name: string;
  slug: string;
  description: string | null;
  format: string | null;
  category: string | null;
  tool_url: string | null;
  screenshots: string[];
};

export type JunkItem = {
  id: string;
  project_name: string;
  slug: string;
  kind: string | null;
  date_label: string | null;
  what: string | null;
  why_failed: string | null;
  lesson: string | null;
  rotation: number;
  category: string | null;
};

export type Writing = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  full_content: string | null;
  category: string | null;
  publish_date: string | null;
  reading_minutes: number | null;
  tags: string[];
  cover_image_url: string | null;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  tags: string[];
  status: string | null;
  featured_image_url: string | null;
  outcomes: string[];
  lessons_learned: string[];
  links: { label: string; url: string }[];
  related_era_id: string | null;
};

export type SocialLink = { id: string; label: string; url: string; icon: string | null };
export type NavItem = { id: string; label: string; url: string; location: "header" | "footer" };

export type WebsiteSettings = {
  site_title: string | null;
  site_short: string | null;
  tagline: string | null;
  subtagline: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  about_text: string | null;
  contact_email: string | null;
  footer_text: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image: string | null;
};

// ---------- helpers ----------
export function publicUrl(bucket: string, path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

// ---------- fetchers ----------
export async function getSettings(): Promise<WebsiteSettings> {
  const { data } = await supabase
    .from("website_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return {
    site_title: data?.site_title ?? "Oluwapelumi Samuel",
    site_short: data?.site_short ?? "O. Samuel",
    tagline: data?.tagline ?? null,
    subtagline: data?.subtagline ?? null,
    hero_title: data?.hero_title ?? null,
    hero_subtitle: data?.hero_subtitle ?? null,
    hero_image_url: publicUrl("hero", data?.hero_image_path ?? null),
    about_text: data?.about_text ?? null,
    contact_email: data?.contact_email ?? null,
    footer_text: data?.footer_text ?? null,
    seo_title: data?.seo_title ?? null,
    seo_description: data?.seo_description ?? null,
    seo_og_image: data?.seo_og_image ?? null,
  };
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase
    .from("social_links")
    .select("id,label,url,icon,sort_order")
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((r) => ({ id: r.id, label: r.label, url: r.url, icon: r.icon }));
}

export async function getNavigation(location: "header" | "footer" = "header"): Promise<NavItem[]> {
  const { data } = await supabase
    .from("navigation")
    .select("id,label,url,location,sort_order")
    .eq("published", true)
    .eq("location", location)
    .order("sort_order");
  return (data ?? []).map((r) => ({ id: r.id, label: r.label, url: r.url, location: r.location as "header" | "footer" }));
}

export async function listEras(): Promise<Era[]> {
  const { data } = await supabase
    .from("journey_eras")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    number: r.number,
    title: r.title,
    slug: r.slug,
    years: r.years,
    kicker: r.kicker,
    description: r.description,
    highlights: (r.highlights as string[]) ?? [],
    lessons: (r.lessons as string[]) ?? [],
    featured_image_url: publicUrl("eras", r.featured_image_path),
  }));
}

export async function getEra(slug: string): Promise<Era | null> {
  const eras = await listEras();
  return eras.find((e) => e.slug === slug) ?? null;
}

export async function listTools(): Promise<Tool[]> {
  const { data } = await supabase
    .from("tools_lab")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    tool_name: r.tool_name,
    slug: r.slug,
    description: r.description,
    format: r.format,
    category: r.category,
    tool_url: r.tool_url,
    screenshots: ((r.screenshots as string[]) ?? []).map((p) => publicUrl("tools", p)!).filter(Boolean),
  }));
}

export async function getTool(slug: string): Promise<Tool | null> {
  const tools = await listTools();
  return tools.find((t) => t.slug === slug) ?? null;
}

export async function listJunkyard(): Promise<JunkItem[]> {
  const { data } = await supabase
    .from("junkyard")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    project_name: r.project_name,
    slug: r.slug,
    kind: r.kind,
    date_label: r.date_label,
    what: r.what,
    why_failed: r.why_failed,
    lesson: r.lesson,
    rotation: Number(r.rotation ?? 0),
    category: r.category,
  }));
}

export async function getJunk(slug: string): Promise<JunkItem | null> {
  const items = await listJunkyard();
  return items.find((i) => i.slug === slug) ?? null;
}

export async function listWriting(): Promise<Writing[]> {
  const { data } = await supabase
    .from("writing")
    .select("*")
    .eq("published", true)
    .order("publish_date", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    full_content: r.full_content,
    category: r.category,
    publish_date: r.publish_date,
    reading_minutes: r.reading_minutes,
    tags: (r.tags as string[]) ?? [],
    cover_image_url: publicUrl("writing", r.cover_image_path),
  }));
}

export async function getWriting(slug: string): Promise<Writing | null> {
  const all = await listWriting();
  return all.find((w) => w.slug === slug) ?? null;
}

export async function listProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    category: r.category,
    tags: (r.tags as string[]) ?? [],
    status: r.status,
    featured_image_url: publicUrl("projects", r.featured_image_path),
    outcomes: (r.outcomes as string[]) ?? [],
    lessons_learned: (r.lessons_learned as string[]) ?? [],
    links: (r.links as { label: string; url: string }[]) ?? [],
    related_era_id: r.related_era_id,
  }));
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await listProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

// ---------- podcast ----------
export type PodcastItem = {
  id: string;
  title: string;
  description: string | null;
  embed_url: string | null;
  thumbnail_url: string | null;
  categories: string[];
};

export async function listPodcast(): Promise<PodcastItem[]> {
  const { data } = await supabase
    .from("podcast_media")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    embed_url: r.embed_url,
    thumbnail_url: publicUrl("podcast", r.thumbnail_path),
    categories: (r.categories as string[]) ?? [],
  }));
}

// ---------- gallery ----------
export type GalleryImage = { id: string; url: string; caption: string | null };
export type Gallery = { id: string; slug: string; title: string; images: GalleryImage[] };

export async function getGallery(slug: string): Promise<Gallery | null> {
  const { data: g } = await supabase
    .from("galleries")
    .select("id,slug,title")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (!g) return null;
  const { data: imgs } = await supabase
    .from("gallery_images")
    .select("id,image_path,caption,sort_order")
    .eq("gallery_id", g.id)
    .order("sort_order");
  return {
    id: g.id,
    slug: g.slug,
    title: g.title,
    images: (imgs ?? []).map((i) => ({
      id: i.id,
      url: publicUrl("galleries", i.image_path)!,
      caption: i.caption,
    })),
  };
}

// Aggregate fetcher for the homepage
export async function getHomeData() {
  const [settings, eras, tools, junk, writing] = await Promise.all([
    getSettings(),
    listEras(),
    listTools(),
    listJunkyard(),
    listWriting(),
  ]);
  return { settings, eras, tools, junk, writing };
}

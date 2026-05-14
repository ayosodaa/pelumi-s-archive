
-- Helper: updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- 1. website_settings (singleton)
create table public.website_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text,
  site_short text,
  tagline text,
  subtagline text,
  hero_title text,
  hero_subtitle text,
  hero_image_path text,
  about_text text,
  contact_email text,
  footer_text text,
  seo_title text,
  seo_description text,
  seo_og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_website_settings_updated before update on public.website_settings for each row execute function public.set_updated_at();

-- 2. social_links
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_social_links_updated before update on public.social_links for each row execute function public.set_updated_at();

-- 3. navigation
create table public.navigation (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  location text not null default 'header' check (location in ('header','footer')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_navigation_updated before update on public.navigation for each row execute function public.set_updated_at();

-- 4. journey_eras
create table public.journey_eras (
  id uuid primary key default gen_random_uuid(),
  number text,
  title text not null,
  slug text not null unique,
  years text,
  kicker text,
  description text,
  highlights text[] not null default '{}',
  lessons text[] not null default '{}',
  featured_image_path text,
  visual_theme text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_journey_eras_updated before update on public.journey_eras for each row execute function public.set_updated_at();

-- 5. projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category text,
  tags text[] not null default '{}',
  featured_image_path text,
  related_era_id uuid references public.journey_eras(id) on delete set null,
  links jsonb not null default '[]',
  outcomes text[] not null default '{}',
  lessons_learned text[] not null default '{}',
  status text default 'active',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_projects_updated before update on public.projects for each row execute function public.set_updated_at();

-- 6. writing
create table public.writing (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  full_content text,
  category text,
  cover_image_path text,
  publish_date date,
  reading_minutes int,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_writing_updated before update on public.writing for each row execute function public.set_updated_at();

-- 7. podcast_media
create table public.podcast_media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  embed_url text,
  thumbnail_path text,
  categories text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_podcast_media_updated before update on public.podcast_media for each row execute function public.set_updated_at();

-- 8. tools_lab
create table public.tools_lab (
  id uuid primary key default gen_random_uuid(),
  code text,
  tool_name text not null,
  slug text not null unique,
  description text,
  format text,
  screenshots text[] not null default '{}',
  tool_url text,
  downloadable_resources jsonb not null default '[]',
  category text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_tools_lab_updated before update on public.tools_lab for each row execute function public.set_updated_at();

-- 9. junkyard
create table public.junkyard (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  slug text not null unique,
  kind text,
  date_label text,
  what text,
  why_failed text,
  lesson text,
  sketches text[] not null default '{}',
  category text,
  rotation numeric default 0,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_junkyard_updated before update on public.junkyard for each row execute function public.set_updated_at();

-- 10. galleries + gallery_images
create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  linked_section text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_galleries_updated before update on public.galleries for each row execute function public.set_updated_at();

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  image_path text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Enable RLS + public-read policies
alter table public.website_settings enable row level security;
alter table public.social_links enable row level security;
alter table public.navigation enable row level security;
alter table public.journey_eras enable row level security;
alter table public.projects enable row level security;
alter table public.writing enable row level security;
alter table public.podcast_media enable row level security;
alter table public.tools_lab enable row level security;
alter table public.junkyard enable row level security;
alter table public.galleries enable row level security;
alter table public.gallery_images enable row level security;

create policy "public read" on public.website_settings for select using (true);
create policy "public read" on public.social_links for select using (published);
create policy "public read" on public.navigation for select using (published);
create policy "public read" on public.journey_eras for select using (published);
create policy "public read" on public.projects for select using (published);
create policy "public read" on public.writing for select using (published);
create policy "public read" on public.podcast_media for select using (published);
create policy "public read" on public.tools_lab for select using (published);
create policy "public read" on public.junkyard for select using (published);
create policy "public read" on public.galleries for select using (published);
create policy "public read" on public.gallery_images for select using (true);

-- Storage buckets (public)
insert into storage.buckets (id, name, public) values
  ('hero','hero',true),
  ('eras','eras',true),
  ('projects','projects',true),
  ('writing','writing',true),
  ('podcast','podcast',true),
  ('tools','tools',true),
  ('junkyard','junkyard',true),
  ('galleries','galleries',true),
  ('downloads','downloads',true)
on conflict (id) do nothing;

-- Public read for all archive buckets
create policy "public read archive buckets" on storage.objects for select
  using (bucket_id in ('hero','eras','projects','writing','podcast','tools','junkyard','galleries','downloads'));

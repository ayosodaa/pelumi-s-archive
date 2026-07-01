
ALTER TABLE public.website_settings
  ADD COLUMN IF NOT EXISTS resume_intro text,
  ADD COLUMN IF NOT EXISTS resume_pdf_path text;

-- resume_experience
CREATE TABLE public.resume_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org text NOT NULL,
  role text NOT NULL,
  location text,
  start_label text,
  end_label text,
  is_current boolean NOT NULL DEFAULT false,
  bullets text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resume_experience TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_experience TO authenticated;
GRANT ALL ON public.resume_experience TO service_role;
ALTER TABLE public.resume_experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published experience" ON public.resume_experience FOR SELECT USING (published = true);
CREATE POLICY "admins manage experience" ON public.resume_experience FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_resume_experience_updated BEFORE UPDATE ON public.resume_experience FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- resume_skills
CREATE TABLE public.resume_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster text NOT NULL,
  skills text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resume_skills TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_skills TO authenticated;
GRANT ALL ON public.resume_skills TO service_role;
ALTER TABLE public.resume_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published skills" ON public.resume_skills FOR SELECT USING (published = true);
CREATE POLICY "admins manage skills" ON public.resume_skills FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_resume_skills_updated BEFORE UPDATE ON public.resume_skills FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- resume_education
CREATE TABLE public.resume_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  credential text NOT NULL,
  date_label text,
  note text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.resume_education TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_education TO authenticated;
GRANT ALL ON public.resume_education TO service_role;
ALTER TABLE public.resume_education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published education" ON public.resume_education FOR SELECT USING (published = true);
CREATE POLICY "admins manage education" ON public.resume_education FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_resume_education_updated BEFORE UPDATE ON public.resume_education FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

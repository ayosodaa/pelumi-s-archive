-- Lab tools: optional embedded preview on the tool's page.
ALTER TABLE public.tools_lab
  ADD COLUMN IF NOT EXISTS embed_url text,
  ADD COLUMN IF NOT EXISTS show_embed boolean NOT NULL DEFAULT true;

## Lock down storage writes to admins only

Right now the 9 storage buckets (`hero`, `eras`, `projects`, `writing`, `podcast`, `tools`, `junkyard`, `galleries`, `downloads`) are public-read but have **no write policies**. Depending on Supabase defaults, that can let any signed-in user upload, overwrite, or delete files. Since this site has no admin UI (you upload via Supabase Studio as the project owner, which bypasses RLS), no end user ever needs write access.

### Approach

Add an `admin` role using the standard `user_roles` + `has_role()` pattern, then add INSERT/UPDATE/DELETE policies on `storage.objects` scoped to admins for each of the 9 buckets. Keep the existing public SELECT policy untouched so the site can still read images.

### Migration steps (single SQL migration)

1. Create `app_role` enum (`admin`) and `public.user_roles` table with GRANTs + RLS.
2. Create `public.has_role(_user_id uuid, _role app_role)` security-definer function (canonical pattern, prevents RLS recursion).
3. On `storage.objects`, add three policies per bucket — INSERT, UPDATE, DELETE — each `USING / WITH CHECK (bucket_id = '<name>' AND public.has_role(auth.uid(), 'admin'))`. Covers all 9 buckets.
4. Leave the existing public SELECT policy alone.

### After the migration

- You'll need to insert one row into `user_roles` (`user_id = <your auth user id>`, `role = 'admin'`) so you can upload from a signed-in client later if you ever add one. **For now, Studio uploads continue to work unchanged** — Studio uses the service role and bypasses RLS entirely.
- No frontend code changes. The site only reads from storage, which stays public.

### Out of scope

- No admin UI, no role-management screen, no signed-upload flow — you've said uploads happen in Studio.
- The other finding (`website_settings.contact_email` exposed) is separate and not addressed here.

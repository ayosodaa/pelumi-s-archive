## Goal

Add **Vercel** as an additional deploy target for this TanStack Start app, keeping the existing Lovable Cloud (Cloudflare Workers) publish flow fully intact. SSR stays on, Supabase reads/writes keep working, no static export.

## What you should know first

- **Lovable Publish still works as today** — preview URL and `pelumi-archive-lab.lovable.app` are untouched. Vercel becomes a parallel deploy you trigger from Vercel's dashboard or CLI.
- **One repo, two targets.** The same source builds for Workers (current) or Node/Vercel (new), selected by a build flag.
- **Database keeps working** — Supabase is HTTP; identical behavior on Node and Workers. RLS, storage, auth all unchanged.
- **One caveat:** any future code you add that's Workers-specific (e.g. `Hyperdrive`, `KV` bindings) won't run on Vercel, and vice versa. Today there's none of that — `src/server.ts` is a plain `fetch` handler, which both runtimes support.

## Changes

### 1. Vite config — dual-target switch
Update `vite.config.ts` so that when `BUILD_TARGET=vercel` is set, it swaps the nitro preset to `vercel` (Node SSR) and disables the Cloudflare plugin. Default behavior (no env var) stays Cloudflare so Lovable Publish is unaffected.

### 2. New files
- **`vercel.json`** — tells Vercel to run `bun run build:vercel`, output dir `.vercel/output` (nitro's vercel preset writes there in the Build Output API v3 format Vercel expects natively).
- **`src/server.node.ts`** *(optional, only if nitro preset alone isn't enough)* — thin Node adapter that re-exports `src/server.ts`'s `fetch` handler. Keeps `src/server.ts` untouched (your requirement).

### 3. `package.json` scripts
Add:
- `"build:vercel": "BUILD_TARGET=vercel vite build"`

Keep existing `build` (Cloudflare) as-is.

### 4. Env vars in Vercel (walkthrough)
In **Vercel Dashboard → your project → Settings → Environment Variables**, add for **Production** and **Preview**:

| Name | Value | Where to get it |
|---|---|---|
| `VITE_SUPABASE_URL` | copy from current `.env` | Lovable → Cloud → Backend → Settings |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | copy from `.env` | same |
| `VITE_SUPABASE_PROJECT_ID` | copy from `.env` | same |
| `SUPABASE_URL` | same as `VITE_SUPABASE_URL` | — |
| `SUPABASE_PUBLISHABLE_KEY` | same as `VITE_SUPABASE_PUBLISHABLE_KEY` | — |
| `SUPABASE_SERVICE_ROLE_KEY` | from Lovable → Cloud → Backend → API keys → service_role | **never commit this** |
| `LOVABLE_API_KEY` | only if you call the AI Gateway from server fns | Lovable → Cloud → Secrets |

I'll print this exact table in the build-mode summary too, with the actual values from `.env` filled in for the public ones.

### 5. Deployment flow
After the code changes, you deploy to Vercel one of two ways:
- **GitHub**: push the repo to GitHub, import it in Vercel, it auto-runs `build:vercel`.
- **CLI**: `npx vercel --prod` from your machine.

Lovable Publish keeps working in parallel — no overlap.

## Out of scope
- Netlify config (you mentioned "Vercel or Netlify" — I'll do Vercel per your earlier pick of *Add Vercel alongside Cloudflare*. Say the word and I'll add a `netlify.toml` + functions adapter in a follow-up).
- Removing Cloudflare/wrangler.
- Custom domains on Vercel — configure in Vercel dashboard after first deploy.

## Risks
- **nitro vercel preset compatibility** with the current `@lovable.dev/vite-tanstack-config` wrapper: the wrapper hardcodes the Cloudflare plugin. If the preset switch can't be done cleanly via env var override, fallback is to bypass the wrapper for the Vercel build and call `tanstackStart({ target: 'vercel' })` + `viteReact()` + `tailwindcss()` directly in a `vite.config.vercel.ts`. I'll verify which works during build mode and pick the cleaner one.

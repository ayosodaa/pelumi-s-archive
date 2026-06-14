// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Dual deploy target:
//   - default: Cloudflare Workers (Lovable Publish)
//   - BUILD_TARGET=vercel: Node SSR via nitro's vercel preset (Build Output API v3)
const isVercel = process.env.BUILD_TARGET === "vercel";

export default defineConfig({
  tanstackStart: {
    // Route TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  ...(isVercel
    ? {
        nitro: {
          preset: "vercel",
        },
      }
    : {}),
});

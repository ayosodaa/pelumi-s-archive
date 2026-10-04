// The public address of the site. Set VITE_SITE_URL in your host's environment
// variables (e.g. https://oluwapelumi.com) once your domain is live.
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ||
  (typeof process !== "undefined" ? process.env.SITE_URL : undefined) ||
  "https://pelumi-archive-lab.lovable.app"
).replace(/\/$/, "");

export function canonical(path: string) {
  return { rel: "canonical", href: `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` };
}

export function absoluteUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

// Rough reading time at ~220 words per minute.
export function readingMinutes(text: string | null | undefined): number {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

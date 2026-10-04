import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// "2024-03-12" -> "12 Mar 2024". Leaves anything it can't parse unchanged.
export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

// Turns Markdown into plain text for short previews and meta descriptions.
export function stripMarkdown(md: string | null | undefined): string {
  return (md ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

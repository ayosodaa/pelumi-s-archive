import { useState } from "react";

// Shows an external tool (Google Sheet, Figma file, Canva design, etc.) inside
// the page. Some websites refuse to load inside other sites; there is no
// reliable way to detect that from here, so the "open in a new tab" link is
// always visible.
export function ToolEmbed({ src, title, openUrl }: { src: string; title: string; openUrl: string | null }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-b-0 border-ink/10 bg-stone-soft px-4 py-2.5">
        <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/50">Live preview</p>
        <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.22em] font-semibold">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="hidden md:inline text-ink/60 hover:text-clay">
            {expanded ? "Shrink" : "Expand"}
          </button>
          {openUrl && (
            <a href={openUrl} target="_blank" rel="noreferrer" className="text-clay hover:underline">
              Open in a new tab ↗
            </a>
          )}
        </div>
      </div>
      <div className={`relative border border-ink/10 bg-stone ${expanded ? "h-[88vh]" : "h-[70vh] min-h-[480px] md:h-[640px]"}`}>
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-ink/45">Loading preview…</p>
        <iframe
          src={src}
          title={`${title} preview`}
          className="relative w-full h-full"
          loading="lazy"
          allow="fullscreen; clipboard-write; autoplay; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="mt-3 text-xs text-ink/45">
        If the preview stays blank, the tool's website does not allow embedding. Use "Open in a new tab" instead.
      </p>
    </section>
  );
}

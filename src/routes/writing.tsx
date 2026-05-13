import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { writings } from "@/content/writing";

const categories = ["All", "Essay", "Reflection", "Poetry", "Note"] as const;

export const Route = createFileRoute("/writing")({
  head: () => ({
    meta: [
      { title: "Writing & Media — Oluwapelumi Samuel" },
      {
        name: "description",
        content:
          "Essays, reflections, poetry, and notes — the parallel practice that keeps the systems work honest.",
      },
      { property: "og:title", content: "Writing & Media — Oluwapelumi Samuel" },
      {
        property: "og:description",
        content: "An editorial archive of essays, reflections, poetry, and field notes.",
      },
    ],
  }),
  component: WritingPage,
});

function WritingPage() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return writings.filter((w) => {
      const matchCat = cat === "All" || w.category === cat;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.excerpt.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [cat, query]);

  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">
          Writing & Media
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          The long way of <span className="italic">thinking</span> clearly.
        </h1>
        <p className="mt-8 max-w-2xl text-ink/65 text-lg text-pretty">
          Essays, reflections, poetry, and field notes — written between
          programmes, after meetings, before everyone else woke up.
        </p>
      </header>

      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
        <div className="border-y border-ink/10 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] font-semibold border transition-colors ${
                  cat === c
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper text-ink/60 border-ink/15 hover:border-ink/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the archive…"
            className="bg-transparent border-b border-ink/20 focus:border-clay outline-none text-sm py-2 md:w-64 placeholder:text-ink/40"
          />
        </div>

        <div className="mt-4">
          {filtered.map((w) => (
            <Link
              key={w.slug}
              to="/writing/$slug"
              params={{ slug: w.slug }}
              className="block py-8 md:py-10 border-b border-ink/10 group"
            >
              <div className="grid grid-cols-12 gap-4 items-baseline">
                <time className="col-span-12 md:col-span-2 text-[10px] font-mono uppercase tracking-[0.22em] text-ink/45">
                  {w.date}
                </time>
                <div className="col-span-12 md:col-span-8">
                  <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight group-hover:text-clay transition-colors">
                    {w.title}
                  </h2>
                  <p className="mt-3 text-ink/65 max-w-2xl">{w.excerpt}</p>
                </div>
                <div className="col-span-12 md:col-span-2 md:text-right text-[10px] font-mono uppercase tracking-[0.22em] text-ink/40">
                  {w.category} · {w.readingMinutes}m
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-20 text-center font-serif italic text-xl text-ink/50">
            No entries under that filter yet.
          </p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}

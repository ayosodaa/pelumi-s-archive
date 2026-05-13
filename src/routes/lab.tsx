import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ToolCard } from "@/components/site/ToolCard";
import { tools, labCategories } from "@/content/lab";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "The Lab — Oluwapelumi Samuel" },
      {
        name: "description",
        content:
          "Tools, templates, and frameworks for operations, programme design, financial decisions, and automation — used in the field across Africa.",
      },
      { property: "og:title", content: "The Lab — Oluwapelumi Samuel" },
      {
        property: "og:description",
        content: "A public-facing experimentation space — filterable, downloadable, useful.",
      },
    ],
  }),
  component: LabPage,
});

function LabPage() {
  const [active, setActive] = useState<(typeof labCategories)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = active === "All" || t.category === active;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [active, query]);

  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-12 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">
          The Lab
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          A public workshop of tools, templates, and decision frameworks.
        </h1>
        <p className="mt-8 max-w-2xl text-ink/65 text-lg text-pretty">
          Pulled from real programmes, real spreadsheets, real Mondays. Take
          anything you need.
        </p>
      </header>

      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
        <div className="border-y border-ink/10 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-16 bg-paper/90 backdrop-blur z-30">
          <div className="flex flex-wrap gap-1.5">
            {labCategories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] font-semibold border transition-colors ${
                  active === c
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
            placeholder="Search the lab…"
            className="bg-transparent border-b border-ink/20 focus:border-clay outline-none text-sm py-2 md:w-64 placeholder:text-ink/40"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-20 text-center font-serif italic text-xl text-ink/50">
            Nothing in that drawer yet. Try another tag.
          </p>
        )}

        <div className="mt-24 border-t border-ink/10 pt-10 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-earth mb-4">
            On the bench
          </p>
          <p className="font-serif text-2xl text-pretty">
            New tools land here every few weeks. If something is missing that
            you wish existed, write — half of these started as someone else's
            problem.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

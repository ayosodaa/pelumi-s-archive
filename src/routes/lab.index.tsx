import { useMemo, useState } from "react";
import { canonical } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ToolCard } from "@/components/site/ToolCard";
import { listTools, listEras, getNavigation, getSocialLinks, getSettings, type Tool } from "@/lib/db";

export const Route = createFileRoute("/lab/")({
  loader: async () => {
    const [tools, eras, nav, socials, settings] = await Promise.all([listTools(), listEras(), getNavigation("header"), getSocialLinks(), getSettings()]);
    return { tools, eras, nav, socials, settings };
  },
  head: () => ({
    meta: [
      { title: "The Lab — Oluwapelumi Samuel" },
      { name: "description", content: "A public workshop of tools, templates, and decision frameworks." },
      { property: "og:title", content: "The Lab" },
      { property: "og:description", content: "A public workshop of tools, templates, and decision frameworks." },
    ],
    links: [canonical("/lab")],
  }),
  errorComponent: ({ error }) => { console.error(error); return <div className="p-12">Something went wrong. Please try again later.</div>; },
  component: LabPage,
});

function LabPage() {
  const { tools, eras, nav, socials, settings } = Route.useLoaderData() as { tools: Tool[]; eras: any; nav: any; socials: any; settings: any };
  const cats = useMemo(() => {
    const set = new Set<string>();
    tools.forEach((t) => t.category && set.add(t.category));
    return ["All", ...Array.from(set)];
  }, [tools]);
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");
  const filtered = tools.filter((t) => {
    const matchCat = active === "All" || t.category === active;
    const q = query.trim().toLowerCase();
    const matchQ = !q || t.tool_name.toLowerCase().includes(q) || (t.description ?? "").toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-12 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">The Lab</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          A public workshop of tools, templates, and decision frameworks.
        </h1>
      </header>
      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
        <div className="border-y border-ink/10 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-16 bg-paper/90 backdrop-blur z-30">
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <button key={c} onClick={() => setActive(c)} className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] font-semibold border transition-colors ${active === c ? "bg-ink text-paper border-ink" : "bg-paper text-ink/60 border-ink/15 hover:border-ink/40"}`}>
                {c}
              </button>
            ))}
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the lab…" className="bg-transparent border-b border-ink/20 focus:border-clay outline-none text-sm py-2 md:w-64 placeholder:text-ink/40" />
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => <ToolCard key={t.id} tool={t} />)}
        </div>
        {filtered.length === 0 && <p className="mt-20 text-center font-serif italic text-xl text-ink/50">Nothing in that drawer yet.</p>}
      </section>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

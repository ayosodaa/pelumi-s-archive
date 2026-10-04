import { canonical } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JunkCard } from "@/components/site/JunkCard";
import { listJunkyard, listEras, getNavigation, getSocialLinks, getSettings, type JunkItem } from "@/lib/db";

export const Route = createFileRoute("/junkyard/")({
  loader: async () => {
    const [items, eras, nav, socials, settings] = await Promise.all([listJunkyard(), listEras(), getNavigation("header"), getSocialLinks(), getSettings()]);
    return { items, eras, nav, socials, settings };
  },
  head: () => ({
    meta: [
      { title: "The Junkyard — Oluwapelumi Samuel" },
      { name: "description", content: "A scrapbook of failed experiments, abandoned prototypes, and lessons learned." },
      { property: "og:title", content: "The Junkyard" },
      { property: "og:description", content: "A scrapbook of failed experiments, abandoned prototypes, and lessons learned." },
    ],
    links: [canonical("/junkyard")],
  }),
  errorComponent: ({ error }) => { console.error(error); return <div className="p-12">Something went wrong. Please try again later.</div>; },
  component: JunkyardPage,
});

function JunkyardPage() {
  const { items, eras, nav, socials, settings } = Route.useLoaderData();
  return (
    <main className="bg-earth/95 text-paper min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ochre mb-6">The Junkyard</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          A scrapbook of failed experiments, abandoned prototypes, and strange ideas.
        </h1>
      </header>
      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-24 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-ink">
          {(items as JunkItem[]).map((j) => <JunkCard key={j.id} item={j} />)}
        </div>
      </section>
      <div className="bg-paper text-ink">
        <SiteFooter settings={settings} socials={socials} eras={eras} />
      </div>
    </main>
  );
}

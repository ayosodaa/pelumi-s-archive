import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EraCard } from "@/components/site/EraCard";
import { listEras, getNavigation, getSocialLinks, getSettings, type Era } from "@/lib/db";

export const Route = createFileRoute("/journey")({
  loader: async () => {
    const [eras, nav, socials, settings] = await Promise.all([listEras(), getNavigation("header"), getSocialLinks(), getSettings()]);
    return { eras, nav, socials, settings };
  },
  head: () => ({ meta: [{ title: "The Journey So Far — Oluwapelumi Samuel" }] }),
  errorComponent: ({ error }) => <div className="p-12">Failed: {error.message}</div>,
  component: JourneyPage,
});

function JourneyPage() {
  const { eras, nav, socials, settings } = Route.useLoaderData();
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">The Journey So Far</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          Seven eras of <span className="italic">building</span>, breaking, and re-building across Africa.
        </h1>
        <p className="mt-8 max-w-2xl text-ink/65 text-lg text-pretty">
          Tap any era to expand its description, key chapters, and the lessons that survived the season.
        </p>
      </header>
      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-24">
        {(eras as Era[]).map((era, i) => <EraCard key={era.id} era={era} defaultOpen={i === 0} />)}
        <div className="border-t border-ink/10" />
      </section>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

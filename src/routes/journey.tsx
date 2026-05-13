import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EraCard } from "@/components/site/EraCard";
import { eras } from "@/content/eras";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "The Journey So Far — Oluwapelumi Samuel" },
      {
        name: "description",
        content:
          "Seven eras of building across Africa: conservation, community, literature, technology, programme design, leadership, and operations.",
      },
      { property: "og:title", content: "The Journey So Far — Oluwapelumi Samuel" },
      {
        property: "og:description",
        content: "An expandable timeline across seven distinct eras of work.",
      },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav />
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">
          The Journey So Far
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          Seven eras of <span className="italic">building</span>, breaking, and re-building across Africa.
        </h1>
        <p className="mt-8 max-w-2xl text-ink/65 text-lg text-pretty">
          Each era overlaps the next. Tap any to expand its description, key
          chapters, and the lessons that survived the season.
        </p>
      </header>

      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-24">
        {eras.map((era, i) => (
          <EraCard key={era.id} era={era} defaultOpen={i === 0} />
        ))}
        <div className="border-t border-ink/10" />
      </section>

      <SiteFooter />
    </main>
  );
}

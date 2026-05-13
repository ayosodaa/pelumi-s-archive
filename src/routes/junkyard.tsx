import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JunkCard } from "@/components/site/JunkCard";
import { junkyard } from "@/content/junkyard";

export const Route = createFileRoute("/junkyard")({
  head: () => ({
    meta: [
      { title: "The Junkyard — Oluwapelumi Samuel" },
      {
        name: "description",
        content:
          "Failed experiments, abandoned prototypes, strange ideas, and lessons learned. The unfinished side of the archive.",
      },
      { property: "og:title", content: "The Junkyard — Oluwapelumi Samuel" },
      {
        property: "og:description",
        content: "A scrapbook of things that did not work — and the lessons that survived them.",
      },
    ],
  }),
  component: JunkyardPage,
});

function JunkyardPage() {
  return (
    <main className="bg-earth/95 text-paper min-h-screen">
      <SiteNav />

      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ochre mb-6">
          The Junkyard
        </p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          A scrapbook of failed experiments, abandoned prototypes, and strange ideas.
        </h1>
        <p className="mt-8 max-w-2xl text-paper/70 text-lg text-pretty">
          The polished portfolio is upstairs. This is the basement — sketches,
          dead ends, half-shipped notions, and the lessons they left behind.
        </p>
      </header>

      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-24 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-ink">
          {junkyard.map((j) => (
            <JunkCard key={j.id} item={j} />
          ))}
        </div>

        <div className="mt-24 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ochre mb-4">
            House rule
          </p>
          <p className="font-serif italic text-2xl md:text-3xl text-paper/85 text-pretty">
            "Every shipped system was, at some point, junk. The trick is to fail in
            a way the next version of you can read."
          </p>
        </div>
      </section>

      <div className="bg-paper text-ink">
        <SiteFooter />
      </div>
    </main>
  );
}

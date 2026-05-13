import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/Hero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ToolCard } from "@/components/site/ToolCard";
import { JunkCard } from "@/components/site/JunkCard";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { eras } from "@/content/eras";
import { tools } from "@/content/lab";
import { junkyard } from "@/content/junkyard";
import { writings } from "@/content/writing";
import { site } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oluwapelumi Samuel — A living archive across Africa" },
      {
        name: "description",
        content:
          "Programme operations, ecosystem building, conservation, technology, writing, and experiments — documented as a living archive.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main className="bg-paper text-ink">
      <SiteNav overHero />
      <Hero />

      {/* Journey teaser */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-[1400px] mx-auto">
        <SectionHeader
          kicker="The Journey So Far"
          title="Seven eras of building, breaking, and re-building."
          description="Conservation. Community. Literature. Technology. Programme design. Leadership. Operations. Each one a different way of asking the same question."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-7 border-t border-ink/10">
          {eras.map((e, i) => (
            <Link
              key={e.id}
              to="/journey"
              hash={e.id}
              className="group p-6 border-l border-ink/10 first:border-l-0 hover:bg-stone-soft transition-colors"
            >
              <span className="block font-serif italic text-2xl text-clay/70 group-hover:text-clay mb-3">
                {e.number}
              </span>
              <h3 className="font-serif text-lg leading-tight tracking-tight mb-2">
                {e.title}
              </h3>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink/45">
                {e.years}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Link
            to="/journey"
            className="text-xs uppercase tracking-[0.25em] font-medium border-b border-ink/30 pb-1 hover:text-clay hover:border-clay transition-colors"
          >
            Walk the full journey →
          </Link>
        </div>
      </section>

      {/* Lab teaser */}
      <section className="bg-stone-soft border-y border-ink/10">
        <div className="px-6 md:px-12 py-24 md:py-32 max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <SectionHeader
              kicker="The Lab"
              title="Tools, templates, and frameworks — used in the field."
            />
            <Link
              to="/lab"
              className="text-xs uppercase tracking-[0.25em] font-medium border-b border-ink/30 pb-1 hover:text-clay hover:border-clay transition-colors self-start"
            >
              Open the full lab →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.slice(0, 6).map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Junkyard teaser */}
      <section className="bg-earth/95 text-paper py-24 md:py-32">
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ochre mb-5">
              The Junkyard
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight text-balance">
              Failed experiments, abandoned prototypes, strange ideas, and lessons learned.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-ink">
            {junkyard.slice(0, 3).map((j) => (
              <JunkCard key={j.id} item={j} />
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/junkyard"
              className="text-xs uppercase tracking-[0.25em] font-medium text-paper border-b border-paper/40 pb-1 hover:text-ochre hover:border-ochre transition-colors"
            >
              Wander the full junkyard →
            </Link>
          </div>
        </div>
      </section>

      {/* Writing teaser */}
      <section className="px-6 md:px-12 py-24 md:py-32 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <SectionHeader
              kicker="Writing & Media"
              title="Essays, reflections, poetry."
              description="The parallel practice that keeps the systems work honest."
            />
            <Link
              to="/writing"
              className="inline-block mt-8 text-xs uppercase tracking-[0.25em] font-medium border-b border-ink/30 pb-1 hover:text-clay hover:border-clay transition-colors"
            >
              Read the archive →
            </Link>
          </div>
          <div className="md:col-span-8 space-y-2">
            {writings.slice(0, 4).map((w, i) => (
              <motion.div
                key={w.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  to="/writing/$slug"
                  params={{ slug: w.slug }}
                  className="block py-6 border-t border-ink/10 group"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                    <time className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink/45 md:w-24 shrink-0">
                      {w.date}
                    </time>
                    <div className="flex-1">
                      <h3 className="font-serif text-2xl md:text-3xl leading-tight tracking-tight group-hover:text-clay transition-colors">
                        {w.title}
                      </h3>
                      <p className="mt-2 text-ink/60 max-w-xl">{w.excerpt}</p>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink/40 shrink-0">
                      {w.category} · {w.readingMinutes}m
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Orgs strip */}
      <section className="border-t border-ink/10 bg-paper">
        <div className="px-6 md:px-12 py-16 max-w-[1400px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/40 mb-8">
            Built and supported with
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-4 font-serif italic text-xl md:text-2xl text-ink/70">
            {site.orgs.map((o) => (
              <span key={o}>{o}</span>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

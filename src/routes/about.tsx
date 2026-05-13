import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { site } from "@/content/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Oluwapelumi Samuel" },
      {
        name: "description",
        content:
          "Oluwapelumi Samuel — a systems thinker working across programme operations, entrepreneurship, conservation, technology, and writing in Africa.",
      },
      { property: "og:title", content: "About — Oluwapelumi Samuel" },
      {
        property: "og:description",
        content:
          "A short introduction, the orgs I work with, and the best ways to get in touch.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav />

      <section className="px-6 md:px-12 pt-32 md:pt-40 pb-24 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">
            About
          </p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[0.98] tracking-tight text-balance">
            <span className="italic">Oluwapelumi</span> Samuel — a systems thinker, programme operator, and quiet writer.
          </h1>

          <div className="mt-10 space-y-6 font-serif text-xl leading-relaxed text-ink/80">
            <p>
              I work at the seams of programmes, products, and ecosystems across
              Africa — designing the operational scaffolding that lets ambitious
              ideas survive their second year.
            </p>
            <p>
              My practice spans conservation fieldwork, community organising,
              technology product experiments, programme design, and the kind of
              quiet operations work that does not photograph well but compounds.
            </p>
            <p>
              Alongside the work, I write. Essays, reflections, occasional
              poetry — usually before the inbox opens.
            </p>
          </div>

          <div className="mt-14 border-t border-ink/10 pt-10">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-earth mb-6">
              Currently & previously
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 font-serif italic text-xl text-ink/75">
              {site.orgs.map((o) => (
                <li key={o}>— {o}</li>
              ))}
            </ul>
          </div>

          <div className="mt-14 border-t border-ink/10 pt-10">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">
              Get in touch
            </p>
            <a
              href={`mailto:${site.email}`}
              className="font-serif text-3xl md:text-4xl italic text-clay underline decoration-1 underline-offset-4"
            >
              {site.email}
            </a>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.22em] font-medium">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-clay"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="md:col-span-5 md:pl-8">
          <div className="md:sticky md:top-28 space-y-4">
            <ImagePlaceholder
              caption="Portrait — Studio session, 2024"
              aspect="aspect-[4/5]"
            />
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-ink/45">
              Plate 01 — replace with editorial portrait
            </p>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </main>
  );
}

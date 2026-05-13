import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { writings } from "@/content/writing";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    const entry = writings.find((w) => w.slug === params.slug);
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.entry.title} — Oluwapelumi Samuel` },
          { name: "description", content: loaderData.entry.excerpt },
          { property: "og:title", content: loaderData.entry.title },
          { property: "og:description", content: loaderData.entry.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Writing — Oluwapelumi Samuel" }],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center bg-paper text-ink p-8">
      <div className="text-center">
        <h1 className="font-serif text-5xl mb-4">Not in the archive.</h1>
        <Link to="/writing" className="text-clay underline">Back to writing</Link>
      </div>
    </main>
  ),
  component: WritingEntryPage,
});

function WritingEntryPage() {
  const { entry } = Route.useLoaderData();
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav />

      <article className="px-6 md:px-12 pt-32 md:pt-40 pb-24 max-w-3xl mx-auto">
        <Link
          to="/writing"
          className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink/50 hover:text-clay"
        >
          ← The Archive
        </Link>

        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] font-bold text-clay">
          {entry.category} · {entry.date} · {entry.readingMinutes} min
        </p>
        <h1 className="mt-5 font-serif text-5xl md:text-6xl leading-[0.98] tracking-tight text-balance">
          {entry.title}
        </h1>
        <p className="mt-6 font-serif italic text-2xl text-ink/70 text-pretty">
          {entry.excerpt}
        </p>

        <div className="mt-14 space-y-7 font-serif text-xl leading-relaxed text-ink/85">
          {entry.body.map((p, i) => (
            <p key={i} className="text-pretty">{p}</p>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-ink/10 text-[10px] uppercase tracking-[0.25em] font-medium text-ink/50">
          End of entry · Filed under {entry.category}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}

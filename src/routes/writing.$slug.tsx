import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getWriting, listEras, getNavigation, getSocialLinks, getSettings } from "@/lib/db";

export const Route = createFileRoute("/writing/$slug")({
  loader: async ({ params }) => {
    const [entry, eras, nav, socials, settings] = await Promise.all([
      getWriting(params.slug),
      listEras(),
      getNavigation("header"),
      getSocialLinks(),
      getSettings(),
    ]);
    if (!entry) throw notFound();
    return { entry, eras, nav, socials, settings };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.entry.title} — Oluwapelumi Samuel` },
          { name: "description", content: loaderData.entry.excerpt ?? "" },
          { property: "og:title", content: loaderData.entry.title },
          { property: "og:description", content: loaderData.entry.excerpt ?? "" },
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
  errorComponent: ({ error }) => <div className="p-12">Failed: {error.message}</div>,
  component: WritingEntryPage,
});

function WritingEntryPage() {
  const { entry, eras, nav, socials, settings } = Route.useLoaderData();
  const paragraphs = (entry.full_content ?? "").split(/\n\n+/);
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <article className="px-6 md:px-12 pt-32 md:pt-40 pb-24 max-w-3xl mx-auto">
        <Link to="/writing" className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink/50 hover:text-clay">← The Archive</Link>
        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] font-bold text-clay">
          {entry.category} · {entry.publish_date} · {entry.reading_minutes} min
        </p>
        <h1 className="mt-5 font-serif text-5xl md:text-6xl leading-[0.98] tracking-tight text-balance">{entry.title}</h1>
        {entry.excerpt && <p className="mt-6 font-serif italic text-2xl text-ink/70 text-pretty">{entry.excerpt}</p>}
        {entry.cover_image_url && <img src={entry.cover_image_url} alt={entry.title} className="mt-10 w-full aspect-[16/9] object-cover" loading="lazy" />}
        <div className="mt-14 space-y-7 font-serif text-xl leading-relaxed text-ink/85">
          {paragraphs.map((p, i) => <p key={i} className="text-pretty whitespace-pre-line">{p}</p>)}
        </div>
      </article>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

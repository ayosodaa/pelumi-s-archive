import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { getJunk, listEras, getNavigation, getSocialLinks, getSettings } from "@/lib/db";

export const Route = createFileRoute("/junkyard/$slug")({
  loader: async ({ params }) => {
    const [item, eras, nav, socials, settings] = await Promise.all([
      getJunk(params.slug),
      listEras(),
      getNavigation("header"),
      getSocialLinks(),
      getSettings(),
    ]);
    if (!item) throw notFound();
    return { item, eras, nav, socials, settings };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.project_name} — The Junkyard` },
          { name: "description", content: loaderData.item.what ?? "" },
          { property: "og:title", content: loaderData.item.project_name },
          { property: "og:description", content: loaderData.item.what ?? "" },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "The Junkyard — Oluwapelumi Samuel" }],
    links: [{ rel: "canonical", href: `https://pelumi-archive-lab.lovable.app/junkyard/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center bg-earth/95 text-paper p-8">
      <div className="text-center">
        <h1 className="font-serif text-5xl mb-4">Lost to the scrap heap.</h1>
        <Link to="/junkyard" className="text-ochre underline">Back to the junkyard</Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => <div className="p-12">Failed: {error.message}</div>,
  component: JunkPage,
});

function JunkPage() {
  const { item, eras, nav, socials, settings } = Route.useLoaderData();
  return (
    <main className="bg-earth/95 text-paper min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <article className="px-6 md:px-12 pt-32 md:pt-40 pb-24 max-w-[900px] mx-auto">
        <Link to="/junkyard" className="text-[10px] uppercase tracking-[0.25em] font-medium text-paper/60 hover:text-ochre">← The Junkyard</Link>
        <div className="mt-10 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-ochre">
          <span>{item.kind}</span>
          <span className="text-paper/40">{item.date_label}</span>
        </div>
        <h1 className="mt-5 font-serif text-5xl md:text-6xl leading-[0.98] tracking-tight text-balance">{item.project_name}</h1>

        <div className="mt-14 text-paper">
          <ImagePlaceholder caption={item.project_name} aspect="aspect-[16/9]" tone="ink" />
        </div>

        <section className="mt-14 space-y-10 font-serif text-xl leading-relaxed text-paper/85">
          {item.what && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ochre mb-3">What it was</p>
              <p className="text-pretty">{item.what}</p>
            </div>
          )}
          {item.why_failed && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ochre mb-3">Why it failed</p>
              <p className="text-pretty">{item.why_failed}</p>
            </div>
          )}
          {item.lesson && (
            <div className="border-l-2 border-ochre/60 pl-5">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-ochre mb-3">Lesson</p>
              <p className="italic text-pretty">{item.lesson}</p>
            </div>
          )}
        </section>
      </article>
      <div className="bg-paper text-ink">
        <SiteFooter settings={settings} socials={socials} eras={eras} />
      </div>
    </main>
  );
}

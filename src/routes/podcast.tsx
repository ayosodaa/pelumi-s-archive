import { canonical } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import {
  listPodcast,
  listEras,
  getNavigation,
  getSocialLinks,
  getSettings,
  type PodcastItem,
} from "@/lib/db";

export const Route = createFileRoute("/podcast")({
  loader: async () => {
    const [items, eras, nav, socials, settings] = await Promise.all([
      listPodcast(),
      listEras(),
      getNavigation("header"),
      getSocialLinks(),
      getSettings(),
    ]);
    return { items, eras, nav, socials, settings };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Podcast & Media — ${loaderData?.settings.site_title ?? "Oluwapelumi Samuel"}` },
      { name: "description", content: "Conversations, interviews, and recordings from the archive." },
      { property: "og:title", content: "Podcast & Media" },
      { property: "og:description", content: "Conversations, interviews, and recordings from the archive." },
    ],
    links: [canonical("/podcast")],
  }),
  errorComponent: ({ error }) => { console.error(error); return <div className="p-12">Something went wrong. Please try again later.</div>; },
  component: PodcastPage,
});

function PodcastPage() {
  const { items, eras, nav, socials, settings } = Route.useLoaderData() as {
    items: PodcastItem[]; eras: any; nav: any; socials: any; settings: any;
  };
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">Podcast & Media</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          Conversations, recorded for the <span className="italic">long memory</span>.
        </h1>
      </header>
      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
        {items.length === 0 ? (
          <p className="font-serif italic text-xl text-ink/50 border-t border-ink/10 pt-12">
            The recording booth is being set up. Episodes appear here as they're released.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-ink/10 pt-12">
            {items.map((p) => (
              <article key={p.id} className="border border-ink/10 bg-paper p-6">
                {p.thumbnail_url ? (
                  <img src={p.thumbnail_url} alt={p.title} className="w-full aspect-[16/9] object-cover" loading="lazy" />
                ) : (
                  <ImagePlaceholder caption={p.title} aspect="aspect-[16/9]" />
                )}
                <div className="mt-5 flex flex-wrap gap-2 text-[9px] font-mono uppercase tracking-[0.22em] text-clay">
                  {p.categories.map((c) => <span key={c}>· {c}</span>)}
                </div>
                <h2 className="mt-3 font-serif text-2xl leading-tight tracking-tight">{p.title}</h2>
                {p.description && <p className="mt-3 text-sm text-ink/65">{p.description}</p>}
                {p.embed_url && (
                  <div className="mt-5 aspect-video">
                    <iframe src={p.embed_url} title={p.title} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

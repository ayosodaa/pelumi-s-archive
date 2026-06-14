import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { getSettings, getSocialLinks, listEras, getNavigation } from "@/lib/db";

export const Route = createFileRoute("/about")({
  loader: async () => {
    const [settings, socials, eras, nav] = await Promise.all([getSettings(), getSocialLinks(), listEras(), getNavigation("header")]);
    return { settings, socials, eras, nav };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `About — ${loaderData?.settings.site_title ?? "Oluwapelumi Samuel"}` },
      { name: "description", content: (loaderData?.settings.about_text ?? "").slice(0, 160) },
      { property: "og:title", content: `About — ${loaderData?.settings.site_title ?? ""}` },
      { property: "og:description", content: (loaderData?.settings.about_text ?? "").slice(0, 160) },
    ],
    links: [{ rel: "canonical", href: "https://pelumi-archive-lab.lovable.app/about" }],
  }),
  errorComponent: ({ error }) => { console.error(error); return <div className="p-12">Something went wrong. Please try again later.</div>; },
  component: AboutPage,
});

function AboutPage() {
  const { settings, socials, eras, nav } = Route.useLoaderData();
  const paragraphs = (settings.about_text ?? "").split(/\n\n+/);
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <section className="px-6 md:px-12 pt-32 md:pt-40 pb-24 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-7">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">About</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[0.98] tracking-tight text-balance">
            <span className="italic">{settings.site_title}</span>
          </h1>
          <div className="mt-10 space-y-6 font-serif text-xl leading-relaxed text-ink/80">
            {paragraphs.map((p: string, i: number) => <p key={i} className="whitespace-pre-line">{p}</p>)}
          </div>
          {settings.contact_email && (
            <div className="mt-14 border-t border-ink/10 pt-10">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">Get in touch</p>
              <a href={`mailto:${settings.contact_email}`} className="font-serif text-3xl md:text-4xl italic text-clay underline decoration-1 underline-offset-4">
                {settings.contact_email}
              </a>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.22em] font-medium">
                {(socials as { id: string; label: string; url: string }[]).map((s) => (
                  <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer" className="hover:text-clay">{s.label}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <aside className="md:col-span-5 md:pl-8">
          <div className="md:sticky md:top-28 space-y-4">
            <ImagePlaceholder caption="Portrait — replace via backend" aspect="aspect-[4/5]" />
          </div>
        </aside>
      </section>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

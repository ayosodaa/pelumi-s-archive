import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { getTool, listEras, getNavigation, getSocialLinks, getSettings } from "@/lib/db";

export const Route = createFileRoute("/lab/$slug")({
  loader: async ({ params }) => {
    const [tool, eras, nav, socials, settings] = await Promise.all([
      getTool(params.slug),
      listEras(),
      getNavigation("header"),
      getSocialLinks(),
      getSettings(),
    ]);
    if (!tool) throw notFound();
    return { tool, eras, nav, socials, settings };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.tool.tool_name} — The Lab` },
          { name: "description", content: loaderData.tool.description ?? "" },
          { property: "og:title", content: loaderData.tool.tool_name },
          { property: "og:description", content: loaderData.tool.description ?? "" },
          { property: "og:type", content: "article" },
          ...(loaderData.tool.screenshots[0]
            ? [{ property: "og:image", content: loaderData.tool.screenshots[0] }]
            : []),
        ]
      : [{ title: "The Lab — Oluwapelumi Samuel" }],
    links: [{ rel: "canonical", href: `https://pelumi-archive-lab.lovable.app/lab/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center bg-paper text-ink p-8">
      <div className="text-center">
        <h1 className="font-serif text-5xl mb-4">Tool not in the lab.</h1>
        <Link to="/lab" className="text-clay underline">Back to the lab</Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => <div className="p-12">Failed: {error.message}</div>,
  component: ToolPage,
});

function ToolPage() {
  const { tool, eras, nav, socials, settings } = Route.useLoaderData();
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <article className="px-6 md:px-12 pt-32 md:pt-40 pb-24 max-w-[1100px] mx-auto">
        <Link to="/lab" className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink/50 hover:text-clay">← The Lab</Link>
        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] font-bold text-clay">
          {tool.code} · {tool.category} · {tool.format}
        </p>
        <h1 className="mt-5 font-serif text-5xl md:text-6xl leading-[0.98] tracking-tight text-balance">{tool.tool_name}</h1>
        {tool.description && (
          <p className="mt-8 font-serif text-2xl text-ink/75 max-w-3xl text-pretty">{tool.description}</p>
        )}

        {tool.tool_url && (
          <a href={tool.tool_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 mt-10 bg-ink text-paper px-5 py-3 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-clay transition-colors">
            Open the tool →
          </a>
        )}

        {tool.screenshots.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.screenshots.map((s, i) => (
              <img key={i} src={s} alt={`${tool.tool_name} screenshot ${i + 1}`} loading="lazy" className="w-full aspect-[4/3] object-cover border border-ink/10" />
            ))}
          </div>
        ) : (
          <div className="mt-14"><ImagePlaceholder caption={`${tool.tool_name} — preview`} aspect="aspect-[16/9]" /></div>
        )}
      </article>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

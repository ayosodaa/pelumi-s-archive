import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import {
  getProject, listEras, getNavigation, getSocialLinks, getSettings,
} from "@/lib/db";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const [project, eras, nav, socials, settings] = await Promise.all([
      getProject(params.slug),
      listEras(),
      getNavigation("header"),
      getSocialLinks(),
      getSettings(),
    ]);
    if (!project) throw notFound();
    return { project, eras, nav, socials, settings };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — Oluwapelumi Samuel` },
          { name: "description", content: loaderData.project.description ?? "" },
          { property: "og:title", content: loaderData.project.title },
          { property: "og:description", content: loaderData.project.description ?? "" },
          { property: "og:type", content: "article" },
          ...(loaderData.project.featured_image_url
            ? [{ property: "og:image", content: loaderData.project.featured_image_url }]
            : []),
        ]
      : [{ title: "Project — Oluwapelumi Samuel" }],
    links: [{ rel: "canonical", href: `https://pelumi-archive-lab.lovable.app/projects/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <main className="min-h-screen grid place-items-center bg-paper text-ink p-8">
      <div className="text-center">
        <h1 className="font-serif text-5xl mb-4">Project not found.</h1>
        <Link to="/journey" className="text-clay underline">Back to the journey</Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => <div className="p-12">Failed: {error.message}</div>,
  component: ProjectPage,
});

function ProjectPage() {
  const { project, eras, nav, socials, settings } = Route.useLoaderData();
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <article className="px-6 md:px-12 pt-32 md:pt-40 pb-24 max-w-[1100px] mx-auto">
        <Link to="/" className="text-[10px] uppercase tracking-[0.25em] font-medium text-ink/50 hover:text-clay">← Archive</Link>
        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] font-bold text-clay">
          {project.category}{project.status ? ` · ${project.status}` : ""}
        </p>
        <h1 className="mt-5 font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">{project.title}</h1>
        {project.description && (
          <p className="mt-8 font-serif text-2xl text-ink/75 max-w-3xl text-pretty">{project.description}</p>
        )}

        {project.featured_image_url ? (
          <img src={project.featured_image_url} alt={project.title} loading="lazy" className="mt-12 w-full aspect-[16/9] object-cover" />
        ) : (
          <div className="mt-12"><ImagePlaceholder caption={project.title} aspect="aspect-[16/9]" /></div>
        )}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {project.outcomes.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-earth mb-4">Outcomes</p>
              <ul className="space-y-2 font-serif text-lg text-ink/85">
                {project.outcomes.map((o) => <li key={o} className="border-l-2 border-earth/40 pl-4">{o}</li>)}
              </ul>
            </section>
          )}
          {project.lessons_learned.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">Lessons</p>
              <ul className="space-y-2 font-serif italic text-lg text-ink/80">
                {project.lessons_learned.map((l) => <li key={l}>— {l}</li>)}
              </ul>
            </section>
          )}
        </div>

        {project.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-[0.22em] font-mono text-ink/55 border border-ink/15 px-2 py-1">{t}</span>
            ))}
          </div>
        )}

        {project.links.length > 0 && (
          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">Links</p>
            <ul className="space-y-2">
              {project.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noreferrer" className="font-serif italic text-xl text-clay underline decoration-1 underline-offset-4">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "@/lib/site";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";
import { listProjects, listEras, getNavigation, getSocialLinks, getSettings, type Project } from "@/lib/db";

export const Route = createFileRoute("/projects/")({
  loader: async () => {
    const [projects, eras, nav, socials, settings] = await Promise.all([
      listProjects(),
      listEras(),
      getNavigation("header"),
      getSocialLinks(),
      getSettings(),
    ]);
    return { projects, eras, nav, socials, settings };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Projects — ${loaderData?.settings.site_title ?? "Oluwapelumi Samuel"}` },
      { name: "description", content: "Programmes, ventures, and systems built across Africa." },
      { property: "og:title", content: "Projects" },
      { property: "og:description", content: "Programmes, ventures, and systems built across Africa." },
    ],
    links: [canonical("/projects")],
  }),
  errorComponent: ({ error }) => {
    console.error(error);
    return <div className="p-12">Something went wrong. Please try again later.</div>;
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects, eras, nav, socials, settings } = Route.useLoaderData();
  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />
      <header className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">Projects</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl text-balance">
          Things that were <span className="italic">built</span>, shipped, and lived with.
        </h1>
      </header>
      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
        {projects.length === 0 ? (
          <p className="border-t border-ink/10 pt-10 text-ink/50">No projects published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 border-t border-ink/10 pt-10">
            {(projects as Project[]).map((p) => (
              <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} className="group block">
                {p.featured_image_url ? (
                  <img src={p.featured_image_url} alt={p.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                ) : (
                  <ImagePlaceholder caption={p.title} />
                )}
                <p className="mt-5 text-[10px] uppercase tracking-[0.3em] font-bold text-clay">
                  {[p.category, p.status].filter(Boolean).join(" · ")}
                </p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl leading-tight tracking-tight group-hover:text-clay transition-colors">
                  {p.title}
                </h2>
                {p.description && <p className="mt-3 text-ink/65 line-clamp-3">{p.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

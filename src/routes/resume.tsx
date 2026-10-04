import { canonical } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  getSettings,
  getSocialLinks,
  getNavigation,
  listEras,
  listResumeExperience,
  listResumeSkills,
  listResumeEducation,
  type ResumeExperience,
  type ResumeSkillCluster,
  type ResumeEducation,
} from "@/lib/db";

export const Route = createFileRoute("/resume")({
  loader: async () => {
    const [settings, socials, nav, eras, experience, skills, education] = await Promise.all([
      getSettings(),
      getSocialLinks(),
      getNavigation("header"),
      listEras(),
      listResumeExperience(),
      listResumeSkills(),
      listResumeEducation(),
    ]);
    return { settings, socials, nav, eras, experience, skills, education };
  },
  head: ({ loaderData }) => {
    const title = `Resume — ${loaderData?.settings.site_title ?? "Oluwapelumi Samuel"}`;
    const description =
      (loaderData?.settings.resume_intro ?? "").slice(0, 160) ||
      "Professional experience, skills, and education of Oluwapelumi Samuel.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      links: [canonical("/resume")],
    };
  },
  errorComponent: ({ error }) => {
    console.error(error);
    return <div className="p-12">Something went wrong. Please try again later.</div>;
  },
  component: ResumePage,
});

function ResumePage() {
  const { settings, socials, nav, eras, experience, skills, education } = Route.useLoaderData();

  return (
    <main className="bg-paper text-ink min-h-screen">
      <SiteNav nav={nav} brand={settings.site_short} />

      {/* Header */}
      <section className="px-6 md:px-12 pt-32 md:pt-40 pb-16 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-6">Resume · Professional record</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight text-balance">
            A <span className="italic">professional</span> record.
          </h1>
          {settings.resume_intro && (
            <p className="mt-8 font-serif text-xl md:text-2xl leading-relaxed text-ink/75 max-w-2xl">
              {settings.resume_intro}
            </p>
          )}
        </div>
        <div className="md:col-span-4 md:pt-6 flex md:justify-end">
          {settings.resume_pdf_url ? (
            <a
              href={settings.resume_pdf_url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 border border-ink/30 hover:border-clay hover:text-clay px-6 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-colors"
            >
              <span>Download CV (PDF)</span>
              <span className="text-clay group-hover:translate-x-0.5 transition-transform">↓</span>
            </a>
          ) : (
            <div className="text-[11px] uppercase tracking-[0.25em] text-ink/40 border border-dashed border-ink/20 px-6 py-4">
              CV PDF — upload via backend
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      <section className="px-6 md:px-12 py-20 max-w-[1400px] mx-auto border-t border-ink/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">01 — Experience</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">Where the work happened.</h2>
          </div>
          <div className="md:col-span-8 md:pt-3">
            <p className="font-serif text-lg text-ink/70">
              Roles across programme design, entrepreneurship, conservation, and studio work — ordered newest first.
            </p>
          </div>
        </div>

        <ol className="relative border-l border-ink/15 ml-3 md:ml-6">
          {experience.map((x: ResumeExperience) => (
            <li key={x.id} className="relative pl-8 md:pl-12 pb-14 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-[7px] top-2 h-3 w-3 rounded-full ${x.is_current ? "bg-clay" : "bg-ink/30"}`}
              />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-ink/60">
                    {x.start_label}{x.start_label && (x.end_label || x.is_current) ? " — " : ""}{x.is_current ? "Present" : x.end_label ?? ""}
                  </p>
                  {x.location && <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-ink/40">{x.location}</p>}
                </div>
                <div className="md:col-span-9">
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight">
                    {x.role}
                    <span className="text-ink/50"> · </span>
                    <span className="italic text-clay">{x.org}</span>
                  </h3>
                  {x.bullets.length > 0 && (
                    <ul className="mt-5 space-y-3 font-serif text-lg leading-relaxed text-ink/80 max-w-3xl">
                      {x.bullets.map((b, i) => (
                        <li key={i} className="pl-5 relative">
                          <span aria-hidden className="absolute left-0 top-[0.7em] h-px w-3 bg-clay/60" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section className="px-6 md:px-12 py-20 max-w-[1400px] mx-auto border-t border-ink/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">02 — Skills</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">A working vocabulary.</h2>
          </div>
          <div className="md:col-span-8 md:pt-3">
            <p className="font-serif text-lg text-ink/70">
              Not a checklist — the tools, methods, and disciplines actively used across recent work.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {skills.map((c: ResumeSkillCluster) => (
            <div key={c.id} className="border-t border-ink/15 pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">{c.cluster}</p>
              <ul className="flex flex-wrap gap-2">
                {c.skills.map((s, i) => (
                  <li
                    key={i}
                    className="border border-ink/20 px-3 py-1.5 text-sm font-serif italic text-ink/80 hover:border-clay hover:text-clay transition-colors"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="px-6 md:px-12 py-20 max-w-[1400px] mx-auto border-t border-ink/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">03 — Education & certifications</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight">Where the training happened.</h2>
          </div>
        </div>

        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {education.map((e: ResumeEducation) => (
            <li key={e.id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-ink/60">{e.date_label}</p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-serif text-xl md:text-2xl">
                  {e.credential}
                  <span className="text-ink/50"> · </span>
                  <span className="italic text-clay">{e.institution}</span>
                </h3>
                {e.note && <p className="mt-2 font-serif text-lg text-ink/70 max-w-2xl">{e.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      {settings.contact_email && (
        <section className="px-6 md:px-12 py-20 max-w-[1400px] mx-auto border-t border-ink/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">Get in touch</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                For roles, collaborations, or a longer conversation —
              </h2>
              <a
                href={`mailto:${settings.contact_email}`}
                className="mt-6 inline-block font-serif text-3xl md:text-4xl italic text-clay underline decoration-1 underline-offset-4"
              >
                {settings.contact_email}
              </a>
            </div>
            {settings.resume_pdf_url && (
              <div className="md:col-span-4 md:text-right">
                <a
                  href={settings.resume_pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 border border-ink/30 hover:border-clay hover:text-clay px-6 py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-colors"
                >
                  <span>Download CV</span>
                  <span className="text-clay">↓</span>
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      <SiteFooter settings={settings} socials={socials} eras={eras} />
    </main>
  );
}

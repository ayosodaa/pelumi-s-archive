import { Link } from "@tanstack/react-router";
import { site } from "@/content/site";
import { eras } from "@/content/eras";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="font-serif text-3xl leading-tight text-balance mb-6">
            {site.tagline}
          </p>
          <p className="text-sm text-ink/60 max-w-md">{site.bio}</p>
          <a
            href={`mailto:${site.email}`}
            className="inline-block mt-8 font-serif italic text-xl text-clay underline decoration-1 underline-offset-4"
          >
            {site.email}
          </a>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/40 mb-6">
            The Journey
          </h4>
          <ul className="space-y-3 text-sm">
            {eras.slice(0, 7).map((e) => (
              <li key={e.id}>
                <Link
                  to="/journey"
                  hash={e.id}
                  className="hover:text-clay transition-colors"
                >
                  <span className="font-serif italic text-ink/40 mr-2">
                    {e.number}
                  </span>
                  {e.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/40 mb-6">
            Sections
          </h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/lab" className="hover:text-clay">The Lab</Link></li>
            <li><Link to="/junkyard" className="hover:text-clay">Junkyard</Link></li>
            <li><Link to="/writing" className="hover:text-clay">Writing</Link></li>
            <li><Link to="/about" className="hover:text-clay">About</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[10px] uppercase tracking-[0.25em] font-bold text-ink/40 mb-6">
            Presence
          </h4>
          <ul className="space-y-3 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-clay transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-ink/40">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>A Living Archive — Vol. 01</span>
        </div>
      </div>
    </footer>
  );
}

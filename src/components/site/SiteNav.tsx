import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/db";

export function SiteNav({
  overHero = false,
  nav = [],
  brand = "O. Samuel",
}: {
  overHero?: boolean;
  nav?: NavItem[];
  brand?: string | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled && !open;
  const fallback: NavItem[] = [
    { id: "1", label: "The Journey", url: "/journey", location: "header" },
    { id: "2", label: "The Lab", url: "/lab", location: "header" },
    { id: "3", label: "Junkyard", url: "/junkyard", location: "header" },
    { id: "4", label: "Writing", url: "/writing", location: "header" },
    { id: "6", label: "Projects", url: "/projects", location: "header" },
    { id: "5", label: "About", url: "/about", location: "header" },
  ];
  const items = nav.length ? nav : fallback;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        transparent
          ? "text-paper mix-blend-difference"
          : "bg-paper/85 backdrop-blur-md text-ink border-b border-ink/5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif italic text-lg tracking-tight">
          {brand ?? "O. Samuel"}
        </Link>
        <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.22em] font-medium">
          {items.map((l) => (
            <a key={l.id} href={l.url} className="hover:text-clay transition-colors">
              {l.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden text-[11px] uppercase tracking-[0.22em] font-medium"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-ink/10 bg-paper text-ink">
          <ul className="max-w-[1400px] mx-auto px-6 py-6 space-y-4">
            {items.map((l) => (
              <li key={l.id}>
                <a href={l.url} onClick={() => setOpen(false)} className="block font-serif text-2xl hover:text-clay">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

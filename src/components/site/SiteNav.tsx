import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/journey", label: "The Journey" },
  { to: "/lab", label: "The Lab" },
  { to: "/junkyard", label: "Junkyard" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav({ overHero = false }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled;

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
          O. Samuel
        </Link>
        <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.22em] font-medium">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-clay" }}
              className="hover:text-clay transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/about"
          className="md:hidden text-[11px] uppercase tracking-[0.22em] font-medium"
        >
          Menu
        </Link>
      </div>
    </nav>
  );
}

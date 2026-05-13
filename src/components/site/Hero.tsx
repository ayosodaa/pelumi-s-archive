import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-portrait.jpg";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink text-paper">
      {/* Portrait */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Editorial portrait"
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-left scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
      </div>

      {/* Top archive label */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-28 md:pt-32 flex justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-paper/60">
        <span>Archive Vol. 01 — Living Edition</span>
        <span className="hidden md:inline">Lat 6.5244° N — Lon 3.3792° E</span>
      </div>

      {/* Headline */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 absolute-inset-block flex flex-col justify-end pb-20 md:pb-28 pt-32 min-h-[100svh]">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight max-w-5xl text-balance"
        >
          Building systems, designing programmes, and exploring{" "}
          <span className="italic text-ochre">ideas</span> across Africa.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-2xl text-paper/75 text-base md:text-lg text-pretty"
        >
          {site.subtagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Link
            to="/journey"
            className="group bg-paper text-ink px-5 py-3 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-clay hover:text-paper transition-colors flex items-center gap-3"
          >
            Explore the Journey
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/lab"
            className="border border-paper/40 text-paper px-5 py-3 text-xs uppercase tracking-[0.22em] font-semibold hover:bg-paper hover:text-ink transition-colors"
          >
            Open the Lab
          </Link>
          <Link
            to="/junkyard"
            className="text-paper/70 px-5 py-3 text-xs uppercase tracking-[0.22em] font-semibold hover:text-paper transition-colors"
          >
            Visit the Junkyard →
          </Link>
        </motion.div>
      </div>

      {/* Bottom marquee of disciplines */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-paper/15 py-4 overflow-hidden bg-ink/40 backdrop-blur-sm">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          className="flex gap-12 whitespace-nowrap text-[11px] font-mono uppercase tracking-[0.25em] text-paper/55"
        >
          {Array.from({ length: 2 }).flatMap((_, i) =>
            [
              "Programme Operations",
              "Ecosystem Building",
              "Entrepreneurship",
              "Conservation",
              "Technology",
              "Writing",
              "Product Experimentation",
              "Community Leadership",
              "Systems Design",
              "Development Across Africa",
            ].map((t) => (
              <span key={`${i}-${t}`} className="flex items-center gap-12">
                <span>{t}</span>
                <span className="text-clay">◆</span>
              </span>
            )),
          )}
        </motion.div>
      </div>
    </section>
  );
}

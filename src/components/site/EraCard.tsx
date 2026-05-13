import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Era } from "@/content/eras";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function EraCard({ era, defaultOpen = false }: { era: Era; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <article id={era.id} className="border-t border-ink/10 py-10 md:py-14 scroll-mt-24">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left grid grid-cols-12 gap-6 items-baseline group"
      >
        <span className="col-span-2 md:col-span-1 font-serif italic text-2xl md:text-3xl text-clay">
          {era.number}
        </span>
        <div className="col-span-10 md:col-span-7">
          <h3 className="font-serif text-3xl md:text-4xl tracking-tight group-hover:text-clay transition-colors">
            {era.title}
          </h3>
          <p className="mt-2 text-sm text-ink/55 font-mono uppercase tracking-[0.18em]">
            {era.years} — {era.kicker}
          </p>
        </div>
        <div className="hidden md:flex col-span-4 justify-end items-baseline">
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-ink/50 group-hover:text-clay transition-colors">
            {open ? "— Collapse" : "+ Expand"}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-10 grid grid-cols-12 gap-6 md:gap-10">
              <div className="col-span-12 md:col-span-7 md:col-start-2">
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-pretty">
                  {era.description}
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {era.highlights.map((h) => (
                    <div
                      key={h}
                      className="border-l-2 border-earth/40 pl-4 py-1 text-sm text-ink/75"
                    >
                      {h}
                    </div>
                  ))}
                </div>

                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {era.artifacts.map((a) => (
                    <div key={a.caption} className="space-y-2">
                      <ImagePlaceholder caption={a.caption} aspect="aspect-[4/5]" />
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/45">
                        {a.caption}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 border-t border-ink/10 pt-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">
                    Lessons
                  </p>
                  <ul className="space-y-2">
                    {era.lessons.map((l) => (
                      <li key={l} className="font-serif italic text-lg md:text-xl text-ink/80">
                        — {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

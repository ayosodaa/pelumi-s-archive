import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { JunkItem } from "@/lib/db";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function JunkCard({ item }: { item: JunkItem }) {
  return (
    <motion.article
      initial={{ rotate: item.rotation, y: 0 }}
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="bg-paper border border-ink/10 p-5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] flex flex-col gap-4"
    >
      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em]">
        <span className="text-clay font-bold">{item.kind}</span>
        <span className="text-ink/40">{item.date_label}</span>
      </div>

      <ImagePlaceholder caption={item.project_name} aspect="aspect-[5/4]" />

      <div>
        <h3 className="font-serif text-xl leading-tight tracking-tight mb-3">{item.project_name}</h3>
        <p className="text-sm text-ink/65 mb-4">{item.what}</p>
        <p className="text-sm text-ink/85 italic font-serif border-l-2 border-clay/50 pl-3">
          Why it failed: <span className="not-italic font-sans text-ink/65">{item.why_failed}</span>
        </p>
      </div>

      <div className="border-t border-ink/10 pt-3">
        <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-earth mb-1">Lesson</p>
        <p className="font-serif italic text-base text-ink/80">{item.lesson}</p>
      </div>
    </motion.article>
  );
}

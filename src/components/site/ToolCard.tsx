import { Link } from "@tanstack/react-router";
import type { Tool } from "@/lib/db";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      to="/lab/$slug"
      params={{ slug: tool.slug }}
      className="group block border border-ink/8 bg-paper p-6 md:p-7 transition-all hover:border-clay/40 hover:bg-stone-soft"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink/40">{tool.code}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-earth font-semibold">{tool.category}</span>
      </div>
      <h3 className="font-serif text-2xl leading-tight tracking-tight mb-3 group-hover:text-clay transition-colors">
        {tool.tool_name}
      </h3>
      <p className="text-sm text-ink/65 leading-relaxed mb-8">{tool.description}</p>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] font-medium">
        <span className="text-ink/45">{tool.format}</span>
        <span className="text-clay group-hover:translate-x-1 transition-transform">Open →</span>
      </div>
    </Link>
  );
}

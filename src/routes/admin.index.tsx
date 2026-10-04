import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { contentTypes } from "@/lib/admin/schema";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    contentTypes
      .filter((c) => !c.singleton)
      .forEach(async (c) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count } = await (supabase as any).from(c.table).select("id", { count: "exact", head: true });
        setCounts((prev) => ({ ...prev, [c.table]: count ?? 0 }));
      });
  }, []);

  const groups = ["Content", "Resume", "Site"] as const;
  return (
    <div className="max-w-5xl">
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-3">Dashboard</p>
      <h1 className="font-serif text-4xl tracking-tight">Edit your site</h1>
      <p className="mt-2 text-ink/60">Changes go live on the public site as soon as you save.</p>

      <div className="mt-8">
        <Link
          to="/admin/$table/$id"
          params={{ table: "writing", id: "new" }}
          className="inline-flex items-center rounded bg-clay px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
        >
          Write a new article
        </Link>
      </div>

      {groups.map((g) => (
        <section key={g} className="mt-10">
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-ink/45 mb-3">{g}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contentTypes.filter((c) => c.group === g).map((c) => (
              <Link
                key={c.table}
                to="/admin/$table"
                params={{ table: c.table }}
                className="block rounded border border-ink/10 bg-paper p-5 hover:border-clay transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-xl">{c.label}</h3>
                  {!c.singleton && <span className="text-xs font-mono text-ink/45">{counts[c.table] ?? "·"}</span>}
                </div>
                <p className="mt-1.5 text-sm text-ink/60">{c.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

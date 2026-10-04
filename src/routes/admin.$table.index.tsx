import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { getContentType } from "@/lib/admin/schema";
import { listRows, saveOrder, updateRow, getSingletonRow, type Row } from "@/lib/admin/api";
import { formatDate } from "@/lib/utils";
import { btnPrimary } from "@/components/admin/styles";

export const Route = createFileRoute("/admin/$table/")({
  component: ListPage,
});

function ListPage() {
  const { table } = Route.useParams();
  const ct = getContentType(table);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [singletonId, setSingletonId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    if (!ct) return;
    setError(null);
    try {
      if (ct.singleton) {
        const row = await getSingletonRow(ct.table);
        setSingletonId(row?.id ?? "new");
      } else {
        setRows(await listRows(ct));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, [ct]);

  useEffect(() => {
    setRows(null);
    setSingletonId(null);
    load();
  }, [load]);

  if (!ct) return <p>Unknown section.</p>;
  if (ct.singleton) {
    if (error) return <p className="text-red-700">{error}</p>;
    if (!singletonId) return <p className="text-sm text-ink/50">Loading…</p>;
    return <Navigate to="/admin/$table/$id" params={{ table, id: singletonId }} replace />;
  }

  async function move(index: number, delta: number) {
    if (!rows || !ct) return;
    const next = [...rows];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    try {
      await saveOrder(ct.table, next.map((r) => r.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reorder");
      load();
    }
  }

  async function togglePublished(row: Row) {
    if (!ct) return;
    const value = !row.published;
    setRows((prev) => prev?.map((r) => (r.id === row.id ? { ...r, published: value } : r)) ?? null);
    try {
      await updateRow(ct.table, row.id, { published: value });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update");
      load();
    }
  }

  const q = query.trim().toLowerCase();
  const visible = (rows ?? []).filter((r) => !q || String(r[ct.titleField] ?? "").toLowerCase().includes(q));
  const canReorder = ct.hasSortOrder && !q;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs text-ink/50 hover:text-clay">← Dashboard</Link>
          <h1 className="mt-2 font-serif text-4xl tracking-tight">{ct.label}</h1>
          <p className="mt-1 text-ink/60">{ct.description}</p>
        </div>
        <Link to="/admin/$table/$id" params={{ table, id: "new" }} className={btnPrimary}>
          New {ct.singular.toLowerCase()}
        </Link>
      </div>

      {error && <p className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      {rows && rows.length > 6 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${ct.label.toLowerCase()}…`}
          className="mt-8 w-full sm:w-72 rounded border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-clay"
        />
      )}

      <div className="mt-6 rounded border border-ink/10 bg-paper divide-y divide-ink/10">
        {rows === null && !error && <p className="p-5 text-sm text-ink/50">Loading…</p>}
        {rows?.length === 0 && <p className="p-5 text-sm text-ink/50">Nothing here yet.</p>}
        {visible.map((r, i) => {
          const subtitle = ct.subtitleField ? r[ct.subtitleField] : null;
          return (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3">
              {canReorder && (
                <div className="flex flex-col">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="px-1 text-xs text-ink/50 hover:text-ink disabled:opacity-20">▲</button>
                  <button type="button" aria-label="Move down" disabled={i === visible.length - 1} onClick={() => move(i, 1)} className="px-1 text-xs text-ink/50 hover:text-ink disabled:opacity-20">▼</button>
                </div>
              )}
              <Link to="/admin/$table/$id" params={{ table, id: r.id }} className="min-w-0 flex-1 group">
                <p className="truncate font-medium group-hover:text-clay">{String(r[ct.titleField] ?? "Untitled")}</p>
                {subtitle ? (
                  <p className="truncate text-xs text-ink/50">
                    {ct.subtitleField === "publish_date" ? formatDate(String(subtitle)) : String(subtitle)}
                  </p>
                ) : null}
              </Link>
              {ct.hasPublished && (
                <button
                  type="button"
                  onClick={() => togglePublished(r)}
                  title="Click to toggle"
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${r.published ? "bg-earth/15 text-earth" : "bg-stone text-ink/50"}`}
                >
                  {r.published ? "Published" : "Draft"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

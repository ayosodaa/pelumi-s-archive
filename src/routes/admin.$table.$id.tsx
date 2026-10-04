import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getContentType, slugify, type ContentType } from "@/lib/admin/schema";
import { deleteRow, getRow, insertRow, updateRow, type Row } from "@/lib/admin/api";
import { supabase } from "@/integrations/supabase/client";
import { readingMinutes } from "@/lib/site";
import { FieldInput } from "@/components/admin/FieldInput";
import { labelCls, btnPrimary, btnSecondary } from "@/components/admin/styles";

export const Route = createFileRoute("/admin/$table/$id")({
  component: EditPage,
});

function emptyValues(ct: ContentType): Record<string, unknown> {
  const v: Record<string, unknown> = {};
  for (const f of ct.fields) {
    if (f.type === "boolean") v[f.name] = f.name === "published" ? ct.table !== "writing" : false;
    else if (f.type === "tags" || f.type === "list" || f.type === "links") v[f.name] = [];
    else if (f.type === "select") v[f.name] = f.options?.[0]?.value ?? "";
    else if (f.type === "date") v[f.name] = ct.table === "writing" ? new Date().toISOString().slice(0, 10) : null;
    else v[f.name] = null;
  }
  return v;
}

function EditPage() {
  const { table, id } = Route.useParams();
  const ct = getContentType(table);
  const navigate = useNavigate();
  const isNew = id === "new";

  const [values, setValues] = useState<Record<string, unknown> | null>(null);
  const [row, setRow] = useState<Row | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const slugTouched = useRef(false);

  useEffect(() => {
    if (!ct) return;
    setStatus(null);
    setDirty(false);
    slugTouched.current = !isNew;
    if (isNew) {
      setRow(null);
      setValues(emptyValues(ct));
      return;
    }
    getRow(ct.table, id)
      .then((r) => {
        setRow(r);
        if (!r) return setStatus({ kind: "error", text: "This item no longer exists." });
        const v = emptyValues(ct);
        for (const f of ct.fields) v[f.name] = r[f.name] ?? v[f.name];
        setValues(v);
      })
      .catch((e) => setStatus({ kind: "error", text: e.message }));
  }, [ct, id, isNew]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!ct) return <p>Unknown section.</p>;

  function set(name: string, value: unknown) {
    setDirty(true);
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (ct && !slugTouched.current) {
        const slugField = ct.fields.find((f) => f.slugFrom === name);
        if (slugField) next[slugField.name] = slugify(String(value ?? ""));
      }
      return next;
    });
    if (ct?.fields.find((f) => f.name === name && f.slugFrom)) slugTouched.current = true;
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!values || !ct) return;
    const missing = ct.fields.filter((f) => f.required && !String(values[f.name] ?? "").trim());
    if (missing.length) {
      setStatus({ kind: "error", text: `Please fill in: ${missing.map((f) => f.label).join(", ")}.` });
      return;
    }
    const payload: Record<string, unknown> = {};
    for (const f of ct.fields) {
      let v = values[f.name];
      if (typeof v === "string" && f.type !== "markdown") v = v.trim();
      if (f.type === "links") v = ((v as { label: string; url: string }[]) ?? []).filter((l) => l.url.trim());
      if ((f.type === "text" || f.type === "textarea" || f.type === "date") && v === "") v = null;
      payload[f.name] = v;
    }
    if ("slug" in payload && payload.slug) payload.slug = slugify(String(payload.slug));
    if (ct.table === "writing" && (payload.reading_minutes === null || payload.reading_minutes === undefined)) {
      payload.reading_minutes = readingMinutes(String(payload.full_content ?? ""));
    }

    setSaving(true);
    setStatus(null);
    try {
      if (isNew) {
        if (ct.hasSortOrder) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { count } = await (supabase as any).from(ct.table).select("id", { count: "exact", head: true });
          payload.sort_order = count ?? 0;
        }
        const created = await insertRow(ct.table, payload);
        setDirty(false);
        navigate({ to: "/admin/$table/$id", params: { table: ct.table, id: created.id }, replace: true });
        return;
      }
      const updated = await updateRow(ct.table, id, payload);
      setRow(updated);
      setValues((prev) => ({ ...prev, ...payload }));
      setDirty(false);
      setStatus({ kind: "ok", text: "Saved. The change is live." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save";
      setStatus({ kind: "error", text: msg.includes("duplicate key") ? "Another item already uses this slug. Please choose a different one." : msg });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!ct || isNew) return;
    if (!window.confirm(`Delete this ${ct.singular.toLowerCase()}? This cannot be undone.`)) return;
    try {
      await deleteRow(ct.table, id);
      setDirty(false);
      navigate({ to: "/admin/$table", params: { table: ct.table } });
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Could not delete" });
    }
  }

  const publicPath = row && ct.publicPath ? ct.publicPath(row) : null;
  const title = isNew ? `New ${ct.singular.toLowerCase()}` : String(values?.[ct.titleField] || ct.singular);

  return (
    <form onSubmit={save} className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          {ct.singleton ? (
            <Link to="/admin" className="text-xs text-ink/50 hover:text-clay">← Dashboard</Link>
          ) : (
            <Link to="/admin/$table" params={{ table: ct.table }} className="text-xs text-ink/50 hover:text-clay">← {ct.label}</Link>
          )}
          <h1 className="mt-2 font-serif text-3xl md:text-4xl tracking-tight truncate">{ct.singleton ? ct.label : title}</h1>
        </div>
        {publicPath && (
          <a href={publicPath} target="_blank" rel="noreferrer" className="text-sm text-clay hover:underline shrink-0">
            View on site ↗
          </a>
        )}
      </div>

      {!values ? (
        status ? <Status s={status} /> : <p className="mt-8 text-sm text-ink/50">Loading…</p>
      ) : (
        <>
          <div className="mt-8 space-y-6 rounded border border-ink/10 bg-paper p-5 md:p-7">
            {ct.fields.map((f) => (
              <div key={f.name}>
                <span className={labelCls}>
                  {f.label}
                  {f.required && <span className="text-clay"> *</span>}
                </span>
                <FieldInput field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
                {f.help && <p className="mt-1.5 text-xs text-ink/50">{f.help}</p>}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 mt-6 -mx-4 md:mx-0 flex flex-wrap items-center gap-3 border-t border-ink/10 bg-stone-soft/95 backdrop-blur px-4 md:px-0 py-4">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
            </button>
            {!isNew && !ct.singleton && (
              <button type="button" onClick={remove} className={`${btnSecondary} text-red-700 border-red-200 hover:border-red-400`}>
                Delete
              </button>
            )}
            {dirty && !saving && <span className="text-xs text-ink/50">Unsaved changes</span>}
            {status && <Status s={status} inline />}
          </div>
        </>
      )}
    </form>
  );
}

function Status({ s, inline }: { s: { kind: "error" | "ok"; text: string }; inline?: boolean }) {
  return (
    <p className={`${inline ? "" : "mt-8 "}text-sm ${s.kind === "error" ? "text-red-700" : "text-earth"}`} role="status">
      {s.text}
    </p>
  );
}

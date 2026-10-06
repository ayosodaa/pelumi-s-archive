import { useEffect, useRef, useState } from "react";
import type { Field } from "@/lib/admin/schema";
import { fileUrl, uploadFile } from "@/lib/admin/api";
import { supabase } from "@/integrations/supabase/client";
import { MarkdownEditor } from "./MarkdownEditor";
import { inputCls, btnSecondary } from "./styles";

type Props = { field: Field; value: unknown; onChange: (v: unknown) => void };

export function FieldInput({ field, value, onChange }: Props) {
  switch (field.type) {
    case "text":
      return <input type="text" className={inputCls} value={(value as string) ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "textarea":
      return <textarea className={`${inputCls} min-h-[96px]`} value={(value as string) ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "markdown":
      return <MarkdownEditor value={(value as string) ?? ""} onChange={onChange} bucket={field.bucket} />;
    case "number":
      return (
        <input
          type="number"
          step="any"
          className={`${inputCls} max-w-[200px]`}
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );
    case "date":
      return <input type="date" className={`${inputCls} max-w-[220px]`} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value || null)} />;
    case "boolean":
      return (
        <label className="inline-flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" className="h-4 w-4 accent-[var(--clay)]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span className="text-sm">{value ? "Yes" : "No"}</span>
        </label>
      );
    case "select":
      return (
        <select className={`${inputCls} max-w-[260px]`} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "tags":
      return <TagsInput value={(value as string[]) ?? []} onChange={onChange} />;
    case "list":
      return <ListInput value={(value as string[]) ?? []} onChange={onChange} />;
    case "links":
      return <LinksInput value={(value as { label: string; url: string }[]) ?? []} onChange={onChange} />;
    case "image":
    case "file":
      return <UploadInput field={field} value={(value as string) ?? null} onChange={onChange} />;
    case "images":
      return <ImagesInput field={field} value={(value as string[]) ?? []} onChange={onChange} />;
    case "relation":
      return <RelationInput field={field} value={(value as string) ?? null} onChange={onChange} />;
  }
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join(", "));
  useEffect(() => setText(value.join(", ")), [value.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <input
      type="text"
      className={inputCls}
      value={text}
      placeholder="Separate with commas"
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onChange(text.split(",").map((t) => t.trim()).filter(Boolean))}
    />
  );
}

function ListInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join("\n"));
  useEffect(() => setText(value.join("\n")), [value.join("\n")]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <textarea
      className={`${inputCls} min-h-[110px]`}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split("\n").map((t) => t.trim()).filter(Boolean));
      }}
    />
  );
}

function LinksInput({ value, onChange }: { value: { label: string; url: string }[]; onChange: (v: unknown) => void }) {
  const rows = value.length ? value : [];
  const set = (i: number, key: "label" | "url", v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [key]: v } : r)));
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-2">
          <input className={`${inputCls} sm:max-w-[200px]`} placeholder="Label" value={r.label} onChange={(e) => set(i, "label", e.target.value)} />
          <input className={inputCls} placeholder="https://" value={r.url} onChange={(e) => set(i, "url", e.target.value)} />
          <button type="button" className={btnSecondary} onClick={() => onChange(rows.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button type="button" className={btnSecondary} onClick={() => onChange([...rows, { label: "", url: "" }])}>Add link</button>
    </div>
  );
}

function UploadInput({ field, value, onChange }: { field: Field; value: string | null; onChange: (v: unknown) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = fileUrl(field.bucket, value);
  const isImage = field.type === "image";

  async function pick(file: File | undefined) {
    if (!file || !field.bucket) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadFile(field.bucket, file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {isImage && (
        <div className="w-40 aspect-[4/3] rounded border border-ink/10 bg-stone overflow-hidden grid place-items-center shrink-0">
          {url ? <img src={url} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] uppercase tracking-[0.2em] text-ink/40">No image</span>}
        </div>
      )}
      <div className="space-y-2">
        {!isImage && url && (
          <a href={url} target="_blank" rel="noreferrer" className="block text-sm text-clay underline break-all">{value}</a>
        )}
        <div className="flex gap-2">
          <button type="button" className={btnSecondary} disabled={busy} onClick={() => ref.current?.click()}>
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && <button type="button" className={btnSecondary} onClick={() => onChange(null)}>Remove</button>}
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <input ref={ref} type="file" hidden accept={isImage ? "image/*" : "application/pdf,.pdf,.doc,.docx"} onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    </div>
  );
}

function RelationInput({ field, value, onChange }: { field: Field; value: string | null; onChange: (v: unknown) => void }) {
  const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
  useEffect(() => {
    if (!field.relation) return;
    const { table, labelField } = field.relation;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from(table)
      .select(`id,${labelField}`)
      .order("sort_order")
      .then(({ data }: { data: Record<string, string>[] | null }) =>
        setOptions((data ?? []).map((r) => ({ id: r.id, label: r[labelField] }))),
      );
  }, [field.relation]);
  return (
    <select className={`${inputCls} max-w-[360px]`} value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">None</option>
      {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
    </select>
  );
}

function ImagesInput({ field, value, onChange }: { field: Field; value: string[]; onChange: (v: unknown) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(files: FileList | null) {
    if (!files?.length || !field.bucket) return;
    setBusy(true);
    setError(null);
    try {
      const paths: string[] = [];
      for (const file of Array.from(files)) paths.push(await uploadFile(field.bucket, file));
      onChange([...value, ...paths]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {value.map((p, i) => (
            <div key={p} className="relative group">
              <img src={fileUrl(field.bucket, p) ?? ""} alt="" className="w-full aspect-[4/3] object-cover rounded border border-ink/10" />
              <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <button type="button" disabled={i === 0} onClick={() => { const n = [...value]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }} className="rounded bg-paper/90 px-1.5 text-xs disabled:opacity-30">←</button>
                <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded bg-paper/90 px-1.5 text-xs text-red-700">Remove</button>
                <button type="button" disabled={i === value.length - 1} onClick={() => { const n = [...value]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; onChange(n); }} className="rounded bg-paper/90 px-1.5 text-xs disabled:opacity-30">→</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button type="button" className={btnSecondary} disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? "Uploading…" : "Add images"}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <input ref={ref} type="file" hidden multiple accept="image/*" onChange={(e) => pick(e.target.files)} />
    </div>
  );
}

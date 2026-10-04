import { useRef, useState } from "react";
import { Markdown } from "@/components/site/Markdown";
import { publicUrl } from "@/lib/db";
import { uploadFile } from "@/lib/admin/api";
import { inputCls } from "./styles";

type Action = { label: string; title: string; run: (sel: string) => { text: string; cursorOffset?: number } };

const actions: Action[] = [
  { label: "B", title: "Bold", run: (s) => ({ text: `**${s || "bold text"}**` }) },
  { label: "I", title: "Italic", run: (s) => ({ text: `*${s || "italic text"}*` }) },
  { label: "H2", title: "Section heading", run: (s) => ({ text: `\n## ${s || "Heading"}\n` }) },
  { label: "H3", title: "Sub heading", run: (s) => ({ text: `\n### ${s || "Sub heading"}\n` }) },
  { label: "Link", title: "Link", run: (s) => ({ text: `[${s || "link text"}](https://)` }) },
  { label: "Quote", title: "Quote", run: (s) => ({ text: `\n> ${s || "Quote"}\n` }) },
  { label: "List", title: "Bulleted list", run: (s) => ({ text: (s || "Item").split("\n").map((l) => `- ${l}`).join("\n") }) },
  { label: "1.", title: "Numbered list", run: (s) => ({ text: (s || "Item").split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n") }) },
  { label: "Divider", title: "Divider", run: () => ({ text: "\n\n---\n\n" }) },
];

export function MarkdownEditor({
  value,
  onChange,
  bucket,
}: {
  value: string;
  onChange: (v: string) => void;
  bucket?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<"write" | "preview" | "split">("split");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function insert(fn: (sel: string) => { text: string }) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const { text } = fn(value.slice(start, end));
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + text.length;
    });
  }

  async function onImage(file: File | undefined) {
    if (!file || !bucket) return;
    setUploading(true);
    setError(null);
    try {
      const path = await uploadFile(bucket, file);
      const url = publicUrl(bucket, path);
      const caption = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      insert(() => ({ text: `\n\n![${caption}](${url})\n\n` }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const words = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="rounded border border-ink/15 bg-paper">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 px-2 py-1.5">
        {actions.map((a) => (
          <button
            key={a.label}
            type="button"
            title={a.title}
            onClick={() => insert(a.run)}
            className="rounded px-2 py-1 text-xs font-medium hover:bg-stone"
          >
            {a.label}
          </button>
        ))}
        {bucket && (
          <>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded px-2 py-1 text-xs font-medium hover:bg-stone disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Image"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onImage(e.target.files?.[0])} />
          </>
        )}
        <div className="ml-auto flex items-center gap-1 text-xs">
          {(["write", "split", "preview"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded px-2 py-1 capitalize ${view === v ? "bg-ink text-paper" : "hover:bg-stone"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="px-3 pt-2 text-sm text-red-700">{error}</p>}
      <div className={`grid ${view === "split" ? "lg:grid-cols-2" : ""}`}>
        {view !== "preview" && (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputCls} min-h-[480px] rounded-none border-0 font-mono text-sm leading-relaxed focus:ring-0`}
            placeholder={"Write in Markdown.\n\n## A heading\n\nA paragraph with **bold**, *italic* and a [link](https://example.com).\n\nLeave a blank line between paragraphs."}
          />
        )}
        {view !== "write" && (
          <div className={`min-h-[480px] overflow-auto px-5 py-4 ${view === "split" ? "border-t lg:border-t-0 lg:border-l border-ink/10" : ""}`}>
            {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-ink/40">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
      <p className="border-t border-ink/10 px-3 py-1.5 text-[11px] text-ink/45">
        {words} words · about {Math.max(1, Math.round(words / 220))} min read
      </p>
    </div>
  );
}

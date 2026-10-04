import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/lib/db";
import type { ContentType } from "./schema";

export type Row = Record<string, unknown> & { id: string };

// The admin works across many tables generically, so it uses an untyped handle.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function listRows(ct: ContentType): Promise<Row[]> {
  let q = db.from(ct.table).select("*");
  if (ct.orderBy) q = q.order(ct.orderBy.column, { ascending: ct.orderBy.ascending, nullsFirst: false });
  else if (ct.hasSortOrder) q = q.order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  else q = q.order("created_at", { ascending: true });
  const { data, error } = await q;
  fail(error);
  return (data ?? []) as Row[];
}

export async function getRow(table: string, id: string): Promise<Row | null> {
  const { data, error } = await db.from(table).select("*").eq("id", id).maybeSingle();
  fail(error);
  return data as Row | null;
}

export async function getSingletonRow(table: string): Promise<Row | null> {
  const { data, error } = await db.from(table).select("*").order("created_at", { ascending: true }).limit(1).maybeSingle();
  fail(error);
  return data as Row | null;
}

export async function insertRow(table: string, values: Record<string, unknown>): Promise<Row> {
  const { data, error } = await db.from(table).insert(values).select("*").single();
  fail(error);
  return data as Row;
}

export async function updateRow(table: string, id: string, values: Record<string, unknown>): Promise<Row> {
  const { data, error } = await db.from(table).update(values).eq("id", id).select("*").maybeSingle();
  fail(error);
  if (!data) throw new Error("The change was not saved. Your account may not have admin access yet.");
  return data as Row;
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await db.from(table).delete().eq("id", id);
  fail(error);
}

// Rewrites sort_order as 0, 1, 2, ... in the given order.
export async function saveOrder(table: string, ids: string[]): Promise<void> {
  await Promise.all(
    ids.map(async (id, index) => {
      const { error } = await db.from(table).update({ sort_order: index }).eq("id", id);
      fail(error);
    }),
  );
}

export async function uploadFile(bucket: string, file: File): Promise<string> {
  const ext = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin";
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";
  const path = `${new Date().getFullYear()}/${Date.now().toString(36)}-${base}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  fail(error);
  return path;
}

export function fileUrl(bucket: string | undefined, path: unknown): string | null {
  if (!bucket || typeof path !== "string" || !path) return null;
  return publicUrl(bucket, path);
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await db.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) return false;
  return data === true;
}

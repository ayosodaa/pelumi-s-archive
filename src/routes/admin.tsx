import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/admin/api";
import { contentTypes } from "@/lib/admin/schema";
import { labelCls, inputCls, btnPrimary, btnSecondary } from "@/components/admin/styles";

// The admin runs entirely in the browser (it needs your login session), so it
// is never server rendered and is hidden from search engines.
export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin — Oluwapelumi Samuel" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLayout,
});

type Status = "loading" | "signed-out" | "not-admin" | "admin" | "recovery";

function AdminLayout() {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    async function resolve(u: User | null) {
      if (!active) return;
      setUser(u);
      if (!u) return setStatus("signed-out");
      setStatus((await isAdmin(u.id)) ? "admin" : "not-admin");
    }
    supabase.auth.getSession().then(({ data }) => resolve(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setUser(session?.user ?? null);
        setStatus("recovery");
        return;
      }
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        // Defer so we never call Supabase from inside its own callback.
        setTimeout(() => resolve(session?.user ?? null), 0);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return <Centered><p className="text-sm text-ink/50">Loading…</p></Centered>;
  }
  if (status === "signed-out") return <SignIn />;
  if (status === "recovery") return <SetNewPassword onDone={() => setStatus("loading")} />;
  if (status === "not-admin") {
    return (
      <Centered>
        <h1 className="font-serif text-3xl">No admin access</h1>
        <p className="mt-3 text-sm text-ink/60">
          You are signed in as <strong>{user?.email}</strong>, but this account does not have the admin role.
          Make sure the latest database migration has been applied, then sign out and back in.
        </p>
        <button onClick={() => supabase.auth.signOut()} className={btnSecondary + " mt-6"}>Sign out</button>
      </Centered>
    );
  }
  return <AdminChrome email={user?.email ?? ""}><Outlet /></AdminChrome>;
}

function AdminChrome({ email, children }: { email: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const groups = ["Content", "Resume", "Site"] as const;
  return (
    <div className="min-h-screen bg-stone-soft text-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-paper border-b md:border-b-0 md:border-r border-ink/10 md:min-h-screen md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div className="flex items-center justify-between px-5 h-14 border-b border-ink/10">
          <Link to="/admin" className="font-serif italic text-lg">Admin</Link>
          <button className="md:hidden text-[11px] uppercase tracking-[0.2em]" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        <nav className={`${menuOpen ? "block" : "hidden"} md:block px-3 py-4 space-y-6`}>
          {groups.map((g) => (
            <div key={g}>
              <p className="px-2 mb-2 text-[10px] uppercase tracking-[0.25em] font-bold text-ink/40">{g}</p>
              <ul className="space-y-0.5">
                {contentTypes.filter((c) => c.group === g).map((c) => {
                  const href = `/admin/${c.table}`;
                  const active = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={c.table}>
                      <Link
                        to="/admin/$table"
                        params={{ table: c.table }}
                        onClick={() => setMenuOpen(false)}
                        className={`block rounded px-2 py-1.5 text-sm ${active ? "bg-ink text-paper" : "hover:bg-stone"}`}
                      >
                        {c.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="border-t border-ink/10 pt-4 px-2 space-y-2 text-sm">
            <a href="/" target="_blank" rel="noreferrer" className="block text-clay hover:underline">View the site ↗</a>
            <p className="text-xs text-ink/50 truncate" title={email}>{email}</p>
            <button onClick={() => supabase.auth.signOut()} className="text-xs underline text-ink/60 hover:text-ink">Sign out</button>
          </div>
        </nav>
      </aside>
      <main className="min-w-0 px-4 md:px-10 py-8 md:py-10">{children}</main>
    </div>
  );
}

function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const redirectTo = `${window.location.origin}/admin`;
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
        if (error) throw error;
        if (!data.session) setMessage({ kind: "info", text: "Check your inbox and click the confirmation link, then come back here to sign in." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
        setMessage({ kind: "info", text: "If that email has an account, a reset link is on its way." });
      }
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  const titles = { signin: "Sign in", signup: "Create your admin account", reset: "Reset your password" };
  return (
    <Centered>
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-clay mb-4">Site admin</p>
      <h1 className="font-serif text-4xl tracking-tight">{titles[mode]}</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className={labelCls}>Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </label>
        {mode !== "reset" && (
          <label className="block">
            <span className={labelCls}>Password</span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </label>
        )}
        {message && (
          <p className={`text-sm ${message.kind === "error" ? "text-red-700" : "text-earth"}`}>{message.text}</p>
        )}
        <button type="submit" disabled={busy} className={btnPrimary + " w-full"}>
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
      </form>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/60">
        {mode !== "signin" && <button onClick={() => setMode("signin")} className="underline">Sign in instead</button>}
        {mode !== "signup" && <button onClick={() => setMode("signup")} className="underline">First time? Create account</button>}
        {mode !== "reset" && <button onClick={() => setMode("reset")} className="underline">Forgot password</button>}
      </div>
    </Centered>
  );
}

function SetNewPassword({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(error.message);
    window.history.replaceState(null, "", "/admin");
    onDone();
  }
  return (
    <Centered>
      <h1 className="font-serif text-4xl tracking-tight">Choose a new password</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className={btnPrimary + " w-full"}>{busy ? "Saving…" : "Save password"}</button>
      </form>
    </Centered>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink grid place-items-center px-6">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

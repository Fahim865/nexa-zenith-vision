import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { NexaLogo } from "@/components/nexa/Navbar";
import { Button, ErrorNote, Field, TextInput } from "@/components/workspace/ui";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ next: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sign in to NEXA — Your AI workspace" },
      { name: "description", content: "Sign in or create a free NEXA account to use AI tools with 50 free credits." },
      { property: "og:title", content: "Sign in to NEXA" },
      { property: "og:description", content: "Create a free NEXA account and get 50 AI credits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function safeNext(n?: string) {
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/ai";
}

function AuthPage() {
  const { next } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: safeNext(next) as "/ai" });
  }, [user, next, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + safeNext(next) },
      });
      if (error) setError(error.message);
      else if (!data.session) setInfo("Check your inbox to confirm your email, then sign in.");
    }
    setBusy(false);
  }

  async function google() {
    setError(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) setError(r.error.message ?? "Google sign-in failed.");
  }

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="glass-strong depth-shadow w-full max-w-sm rounded-2xl p-7">
        <NexaLogo />
        <h1 className="mt-6 font-display text-2xl font-semibold">
          {mode === "in" ? "Welcome back" : "Create your workspace"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">New accounts get 50 free AI credits.</p>

        <Button className="mt-6 w-full" variant="ghost" onClick={google}>
          Continue with Google
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Field label="Email">
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <TextInput type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error ? <ErrorNote>{error}</ErrorNote> : null}
          {info ? <p className="text-sm text-primary">{info}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "No account? Create one" : "Already have an account? Sign in"}
        </button>
        <Link to="/" className="mt-2 block text-xs text-muted-foreground hover:text-foreground">
          ← Back to NEXA
        </Link>
      </div>
    </div>
  );
}

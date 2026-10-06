import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { RotateCcw, Square, Wand2, Zap } from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button, CopyButton, ErrorNote, Field, Select, TextArea } from "@/components/workspace/ui";
import { getAccessToken, useAuth } from "@/hooks/useAuth";
import { AI_CREDIT_COST, AI_TOOL_CONFIGS } from "@/lib/ai/tools";
import type { ToolMeta } from "@/lib/tools/types";

export default function AiTool({ tool }: { tool: ToolMeta }) {
  const config = AI_TOOL_CONFIGS[tool.slug];
  const { user, credits, refreshCredits } = useAuth();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opts, setOpts] = useState<Record<string, string>>(() =>
    Object.fromEntries((config?.fields ?? []).map((f) => [f.key, f.options[0]!])),
  );
  const abortRef = useRef<AbortController | null>(null);

  if (!config) return <ErrorNote>This AI tool isn't wired up yet.</ErrorNote>;

  async function run() {
    if (!input.trim()) return setError("Add some text first.");
    setBusy(true);
    setError(null);
    setOutput("");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/ai-tool", {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
        body: JSON.stringify({ slug: tool.slug, prompt: input, options: opts }),
      });
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "The AI couldn't finish that request.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((o) => o + dec.decode(value, { stream: true }));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError((e as Error).message);
    } finally {
      setBusy(false);
      abortRef.current = null;
      void refreshCredits();
    }
  }

  if (!user) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <Wand2 className="mx-auto text-primary" size={22} />
        <h2 className="mt-3 font-display text-lg">Sign in to use {tool.name}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          AI tools run on NEXA's servers. Create a free account and get 50 credits — each run costs {AI_CREDIT_COST}.
        </p>
        <Link to="/auth" search={{ next: `/tools/${tool.slug}` }} className="mt-5 inline-block">
          <Button>Sign in or create account</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <Field label={config.inputLabel}>
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} placeholder={config.placeholder} />
        </Field>
        <div className="flex flex-wrap items-center gap-2">
          {busy ? (
            <Button variant="ghost" onClick={() => abortRef.current?.abort()}>
              <Square size={14} /> Stop
            </Button>
          ) : (
            <Button onClick={run} disabled={(credits ?? 0) < AI_CREDIT_COST}>
              <Wand2 size={15} /> Generate · {AI_CREDIT_COST} credits
            </Button>
          )}
          <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
            <RotateCcw size={15} /> Reset
          </Button>
          {output && !busy ? <CopyButton value={output} label="Copy result" /> : null}
        </div>
        {error ? <ErrorNote>{error}</ErrorNote> : null}
        <section aria-live="polite" className="glass min-h-40 rounded-2xl p-5">
          {output ? (
            <MessageResponse>{output}</MessageResponse>
          ) : busy ? (
            <Shimmer>Thinking…</Shimmer>
          ) : (
            <p className="text-sm text-muted-foreground">Your result appears here.</p>
          )}
        </section>
      </div>
      <aside className="glass h-fit space-y-3 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-sm">
          <Zap size={14} className="text-secondary" />
          <span className="font-display">{credits ?? "—"}</span>
          <span className="text-muted-foreground">credits left</span>
        </div>
        {(credits ?? 0) < AI_CREDIT_COST ? (
          <p className="text-xs text-destructive">You're out of credits. Upgrade on the pricing section.</p>
        ) : null}
        {config.fields?.map((f) => (
          <Field key={f.key} label={f.label}>
            <Select value={opts[f.key]} onChange={(e) => setOpts((o) => ({ ...o, [f.key]: e.target.value }))}>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </Field>
        ))}
        <p className="text-xs text-muted-foreground">
          Every run is saved to your <Link to="/dashboard" className="text-primary hover:underline">dashboard history</Link>.
        </p>
      </aside>
    </div>
  );
}

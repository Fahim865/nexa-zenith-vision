import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getTool } from "@/lib/tools/registry";
import { listConversations } from "@/lib/ai/conversations";
import { Trash2, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Activity, ArrowUpRight, Crown, Sparkles, Zap } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AmbientGlow, AmbientNetwork } from "./Ambient";
import { Counter, MagneticButton, Reveal, TiltCard } from "./motion-primitives";

interface Run { id: string; tool_slug: string; kind: string; input: string | null; output: string | null; credits: number; created_at: string }

async function listRuns(): Promise<Run[]> {
  const { data, error } = await supabase.from("ai_runs").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) throw error;
  return (data ?? []) as Run[];
}

/** Animated ring meter for remaining credits. */
function CreditMeter({ used, total }: { used: number; total: number }) {
  const pct = Math.min(1, used / total);
  const r = 78;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative grid place-items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#creditGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)" }}
        />
        <defs>
          <linearGradient id="creditGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--secondary)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-3xl">
          <Counter to={total - used} />
        </div>
        <div className="text-xs text-muted-foreground">credits left</div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const { user, loading, credits, refreshCredits } = useAuth();
  const qc = useQueryClient();
  const runs = useQuery({ queryKey: ["runs", user?.id], queryFn: listRuns, enabled: !!user });
  const chats = useQuery({ queryKey: ["threads", user?.id], queryFn: listConversations, enabled: !!user });
  const [openRun, setOpenRun] = useState<string | null>(null);
  const list = runs.data ?? [];

  const usage = useMemo(() => {
    const days = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (11 - i));
      return d.toISOString().slice(0, 10);
    });
    return days.map((d) => list.filter((r) => r.created_at.slice(0, 10) === d).length);
  }, [list]);
  const max = Math.max(1, ...usage);
  const spent = list.reduce((a, r) => a + r.credits, 0);
  const recentTools = useMemo(
    () => [...new Set(list.map((r) => r.tool_slug))].map((s) => getTool(s)).filter(Boolean).slice(0, 6),
    [list],
  );
  const left = credits ?? 0;
  const total = Math.max(50, left + spent);

  if (!loading && !user) {
    return (
      <div className="relative min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-md px-6 pt-40 text-center">
          <h1 className="font-display text-3xl font-semibold">Your command center</h1>
          <p className="mt-3 text-sm text-muted-foreground">Sign in to see your credits, AI history and saved chats.</p>
          <Link to="/auth" search={{ next: "/dashboard" }} className="mt-6 inline-block">
            <MagneticButton className="rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground" style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))" }}>
              Sign in
            </MagneticButton>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="relative overflow-hidden pb-24 pt-32">
        <AmbientGlow />
        <AmbientNetwork className="opacity-40" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Command center</p>
                <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Your workspace at a glance</h1>
                <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs">
                <Crown size={13} className="text-secondary" />
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">Free</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <TiltCard className="depth-shadow h-full p-6" max={5}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Zap size={14} className="text-secondary" /> AI credits</div>
              <div className="mt-4 flex justify-center"><CreditMeter used={total - left} total={total} /></div>
              <p className="mt-4 text-center text-xs text-muted-foreground">{spent} used · 2 credits per AI run · on-device tools are free</p>
            </TiltCard>

            <TiltCard className="depth-shadow h-full p-6 lg:col-span-2" max={4}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Activity size={14} className="text-primary" /> AI usage · last 12 days</div>
                <span className="text-xs text-muted-foreground">{list.length} runs total</span>
              </div>
              <div className="mt-8 flex h-40 items-end gap-2">
                {usage.map((v, i) => (
                  <div key={i} className="flex-1" title={`${v} runs`}>
                    <div className="w-full rounded-t-md" style={{ height: `${Math.max(3, (v / max) * 150)}px`, background: "linear-gradient(180deg, color-mix(in oklab, var(--primary) 70%, transparent), color-mix(in oklab, var(--secondary) 25%, transparent))", opacity: v ? 0.85 : 0.25 }} />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/60 pt-5">
                {[{ k: "AI generations", v: list.filter((r) => r.kind === "generation").length }, { k: "Chat messages", v: list.filter((r) => r.kind === "chat").length }, { k: "Saved chats", v: chats.data?.length ?? 0 }].map((s) => (
                  <div key={s.k}>
                    <div className="font-display text-xl"><Counter to={s.v} /></div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                  </div>
                ))}
              </div>
            </TiltCard>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="glass h-full rounded-2xl p-6 lg:col-span-2">
              <p className="text-sm text-muted-foreground">History</p>
              {list.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No AI runs yet. Try the <Link to="/tools/$slug" params={{ slug: "ai-summarizer" }} className="text-primary hover:underline">AI Summarizer</Link> or start a <Link to="/ai" className="text-primary hover:underline">chat</Link>.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border/60">
                  {list.slice(0, 30).map((r) => {
                    const t = getTool(r.tool_slug);
                    return (
                      <li key={r.id} className="py-3">
                        <div className="flex items-center gap-3">
                          <button className="min-w-0 flex-1 text-left" onClick={() => setOpenRun(openRun === r.id ? null : r.id)}>
                            <span className="block text-sm">{t?.name ?? r.tool_slug}</span>
                            <span className="block truncate text-xs text-muted-foreground">{r.input}</span>
                          </button>
                          <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()} · {r.credits}cr</span>
                          <button aria-label="Delete entry" className="text-muted-foreground hover:text-destructive" onClick={async () => { await supabase.from("ai_runs").delete().eq("id", r.id); await qc.invalidateQueries({ queryKey: ["runs"] }); void refreshCredits(); }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                        {openRun === r.id && r.output ? (
                          <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-surface-2/50 p-3 text-xs">{r.output}</pre>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="space-y-5">
              <div className="glass rounded-2xl p-6">
                <p className="text-sm text-muted-foreground">Recent tools</p>
                <div className="mt-3 space-y-2">
                  {recentTools.length ? recentTools.map((t) => (
                    <Link key={t!.slug} to="/tools/$slug" params={{ slug: t!.slug }} className="group flex items-center gap-3 rounded-xl border border-border/60 p-2.5 hover:border-primary/40">
                      <t.icon size={15} className="text-primary" />
                      <span className="flex-1 truncate text-sm">{t!.name}</span>
                      <ArrowUpRight size={13} className="text-muted-foreground" />
                    </Link>
                  )) : <p className="text-xs text-muted-foreground">Tools you use appear here.</p>}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <p className="text-sm text-muted-foreground">Recent chats</p>
                <div className="mt-3 space-y-2">
                  {(chats.data ?? []).slice(0, 5).map((c) => (
                    <Link key={c.id} to="/ai/$threadId" params={{ threadId: c.id }} className="flex items-center gap-2 truncate text-sm hover:text-primary">
                      <MessageSquare size={13} /> <span className="truncate">{c.title}</span>
                    </Link>
                  ))}
                  <Link to="/ai" className="block text-xs text-primary hover:underline">Open AI workspace →</Link>
                </div>
              </div>
              <div className="rounded-2xl border border-secondary/25 bg-secondary/5 p-5">
                <div className="flex items-center gap-2 text-sm"><Sparkles size={14} className="text-secondary" /> Need more credits?</div>
                <p className="mt-1.5 text-xs text-muted-foreground">Paid plans are coming soon. See the pricing section for what's included.</p>
                <a href="/#pricing" className="mt-3 inline-block text-xs text-primary hover:underline">Compare plans</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

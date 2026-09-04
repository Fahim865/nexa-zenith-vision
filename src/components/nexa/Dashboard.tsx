import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Activity, ArrowUpRight, Crown, Sparkles, Zap } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AmbientGlow, AmbientNetwork } from "./Ambient";
import { Counter, MagneticButton, Reveal, TiltCard } from "./motion-primitives";
import { TOOLS } from "@/lib/nexa-data";

const USAGE = [42, 61, 38, 74, 55, 88, 67, 92, 71, 84, 59, 96];

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
  const [used] = useState(34);
  const recent = useMemo(() => TOOLS.slice(11, 15), []);

  return (
    <div className="relative min-h-screen">
      <Navbar credits={100 - used} />

      <main className="relative overflow-hidden pb-24 pt-32">
        <AmbientGlow />
        <AmbientNetwork className="opacity-40" />

        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Command center</p>
                <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                  Your workspace at a glance
                </h1>
              </div>
              <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs">
                <Crown size={13} className="text-secondary" />
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">Free</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-1">
              <TiltCard className="depth-shadow h-full p-6" max={5}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap size={14} className="text-secondary" /> Daily credits
                </div>
                <div className="mt-4 flex justify-center">
                  <CreditMeter used={used} total={100} />
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Resets in 6h 12m · {used} used today
                </p>
              </TiltCard>
            </Reveal>

            <Reveal className="lg:col-span-2" delay={80}>
              <TiltCard className="depth-shadow h-full p-6" max={4}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity size={14} className="text-primary" /> Usage · last 12 days
                  </div>
                  <span className="text-xs text-muted-foreground">
                    <Counter to={827} /> runs total
                  </span>
                </div>

                <div className="mt-8 flex h-40 items-end gap-2">
                  {USAGE.map((v, i) => (
                    <div key={i} className="group relative flex-1">
                      <div
                        className="w-full rounded-t-md transition-all duration-500 group-hover:opacity-100"
                        style={{
                          height: `${v * 1.5}px`,
                          background:
                            "linear-gradient(180deg, color-mix(in oklab, var(--primary) 70%, transparent), color-mix(in oklab, var(--violet) 30%, transparent))",
                          opacity: 0.65,
                          transitionDelay: `${i * 40}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/60 pt-5">
                  {[
                    { k: "AI runs", v: 312 },
                    { k: "Local runs", v: 515 },
                    { k: "Saved hours", v: 41 },
                  ].map((s) => (
                    <div key={s.k}>
                      <div className="font-display text-xl">
                        <Counter to={s.v} />
                      </div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {s.k}
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <TiltCard className="h-full p-6" max={4}>
                <p className="text-sm text-muted-foreground">Recent tools</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {recent.map((t) => (
                    <a
                      key={t.id}
                      href="/#tools"
                      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-2/40 p-3 transition-colors hover:border-primary/40"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <t.icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{t.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {t.credits} credits
                        </span>
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ))}
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={80}>
              <TiltCard className="h-full p-6" max={5}>
                <p className="text-sm text-muted-foreground">Quick actions</p>
                <div className="mt-4 space-y-2">
                  <a
                    href="/#tools"
                    className="block rounded-xl border border-border/60 p-3 text-sm transition-colors hover:border-primary/40"
                  >
                    Open tool library
                  </a>
                  <a
                    href="/#pricing"
                    className="block rounded-xl border border-border/60 p-3 text-sm transition-colors hover:border-primary/40"
                  >
                    Compare plans
                  </a>
                  <Link
                    to="/"
                    className="block rounded-xl border border-border/60 p-3 text-sm transition-colors hover:border-primary/40"
                  >
                    Back to home
                  </Link>
                </div>

                <div className="mt-6 rounded-xl border border-secondary/25 bg-secondary/5 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles size={14} className="text-secondary" /> Unlock Pro
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    5,000 monthly credits and priority AI models.
                  </p>
                  <a href="/#pricing">
                    <MagneticButton
                      className="mt-3 w-full rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground"
                      style={{
                        background: "linear-gradient(135deg, var(--secondary), var(--primary))",
                      }}
                    >
                      Upgrade
                    </MagneticButton>
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

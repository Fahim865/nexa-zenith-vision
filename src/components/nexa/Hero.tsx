import { ArrowRight, Sparkles } from "lucide-react";
import { Scene3D } from "./Scene3D";
import { AmbientGlow } from "./Ambient";
import { Counter, MagneticButton, Reveal } from "./motion-primitives";

const STATS = [
  { label: "Tools live", to: 16, suffix: "" },
  { label: "Avg. response", to: 1.2, suffix: "s", decimals: 1 },
  { label: "Uptime", to: 99.9, suffix: "%", decimals: 1 },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  return (
    <section className="dot-grid relative isolate flex min-h-[92vh] items-center overflow-hidden pt-28">
      <AmbientGlow />
      <Scene3D className="absolute inset-0 -z-10 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--background) 82%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative mx-auto w-full max-w-4xl px-6 pb-20 text-center">
        <Reveal>
          <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-primary/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            All systems operational — AI models live
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-[1.06]">
            <span className="text-gradient">Everything you need.</span>
            <br />
            One intelligent workspace.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
            Calculators, image tools, PDF utilities, and AI writing tools — together in one place,
            so you stop hunting across a dozen tabs.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton
              onClick={() => scrollTo("tools")}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, var(--secondary), var(--primary))",
                boxShadow: "var(--glow-primary)",
              }}
            >
              Explore Tools
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo("tools")}
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium hover:border-primary/40"
            >
              <Sparkles size={15} className="text-secondary" />
              Try AI
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-xl px-3 py-4">
                <div className="font-display text-xl text-foreground sm:text-2xl">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

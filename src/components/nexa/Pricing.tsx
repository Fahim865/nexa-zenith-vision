import { useState } from "react";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/nexa-data";
import { Counter, MagneticButton, Reveal, TiltCard } from "./motion-primitives";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Pricing</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Simple plans, generous credits
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Start free. Upgrade when the AI tools become part of your daily routine.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-9 flex justify-center">
            <div className="glass relative flex rounded-full p-1">
              <span
                className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full transition-transform duration-500"
                style={{
                  background: "linear-gradient(135deg, var(--secondary), var(--primary))",
                  transform: annual ? "translateX(100%)" : "translateX(0)",
                }}
              />
              {(["Monthly", "Annual"] as const).map((label, i) => (
                <button
                  key={label}
                  onClick={() => setAnnual(i === 1)}
                  className={cn(
                    "relative z-10 w-32 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    (i === 1) === annual ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 90}>
              <TiltCard
                max={5}
                className={cn(
                  "depth-shadow relative h-full overflow-hidden p-7",
                  plan.highlight && "border-primary/40",
                )}
              >
                {plan.highlight ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(120deg, transparent 30%, color-mix(in oklab, var(--primary) 18%, transparent) 50%, transparent 70%)",
                      backgroundSize: "220% 100%",
                      animation: "nexa-shimmer 5s linear infinite",
                    }}
                  />
                ) : null}

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg">{plan.name}</h3>
                    {plan.highlight ? (
                      <span className="rounded-full border border-primary/40 px-2.5 py-0.5 text-[11px] text-primary">
                        Most popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{plan.tagline}</p>

                  <div className="mt-6 flex items-end gap-1">
                    <span className="font-display text-4xl">
                      $<Counter to={annual ? plan.annual : plan.monthly} />
                    </span>
                    <span className="pb-1.5 text-sm text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.credits}
                    {annual && plan.monthly > 0 ? " · billed annually" : ""}
                  </p>

                  <MagneticButton
                    className={cn(
                      "mt-6 w-full rounded-full px-5 py-2.5 text-sm font-medium",
                      plan.highlight
                        ? "text-primary-foreground"
                        : "border border-border/70 text-foreground hover:border-primary/40",
                    )}
                    style={
                      plan.highlight
                        ? {
                            background:
                              "linear-gradient(135deg, var(--secondary), var(--primary))",
                            boxShadow: "var(--glow-primary)",
                          }
                        : undefined
                    }
                  >
                    {plan.cta}
                  </MagneticButton>

                  <ul className="mt-6 space-y-2.5 border-t border-border/60 pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check size={15} className="mt-0.5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

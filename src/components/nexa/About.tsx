import { Cpu, Lock, Gauge } from "lucide-react";
import { AmbientNetwork } from "./Ambient";
import { Reveal, TiltCard } from "./motion-primitives";

const PILLARS = [
  {
    icon: Cpu,
    title: "One workspace, every task",
    body: "Sixteen tools share one interface, one credit balance and one history — nothing to install, nothing to reconnect.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Local tools never leave your device. AI tools send only the text you submit, and nothing is used for training.",
  },
  {
    icon: Gauge,
    title: "Built to feel instant",
    body: "Every interaction is tuned for speed — heavy visuals load lazily and scale down automatically on lighter devices.",
  },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden py-24">
      <AmbientNetwork className="opacity-50" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">About NEXA</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              An intelligent workspace, not another tab
            </h2>
            <p className="mt-4 text-muted-foreground">
              NEXA brings the small utilities you use every day into one calm, fast surface — with
              AI available the moment a task needs it.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <TiltCard max={5} className="h-full p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <p.icon size={17} />
                </span>
                <h3 className="mt-4 font-display text-[15px]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

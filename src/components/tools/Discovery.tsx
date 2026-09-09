import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/nexa/motion-primitives";
import { ToolCard } from "./ToolCard";
import {
  CATEGORIES_WITH_COUNTS,
  FEATURED_TOOLS,
  POPULAR_TOOLS,
  TOTALS,
  rankTools,
  toolsByCategory,
} from "@/lib/tools/registry";
import type { CategoryId } from "@/lib/tools/types";

function Row({
  title,
  blurb,
  tools,
  href,
}: {
  title: string;
  blurb: string;
  tools: ReturnType<typeof toolsByCategory>;
  href?: { slug: string };
}) {
  if (!tools.length) return null;
  return (
    <Reveal>
      <section className="mt-14 first:mt-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
          </div>
          {href ? (
            <Link
              to="/category/$slug"
              params={{ slug: href.slug }}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              See all <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.slice(0, 4).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}

const ROWS: { id: CategoryId; title: string; blurb: string }[] = [
  { id: "image", title: "Image tools", blurb: "Compress, resize, convert and clean up photos in your browser." },
  { id: "pdf", title: "PDF tools", blurb: "Merge, split, rotate and rebuild documents without uploading them." },
  { id: "developer", title: "Developer tools", blurb: "Format, decode, hash and inspect — the everyday utilities." },
  { id: "calculators", title: "Calculators", blurb: "Money, health, dates and everyday maths, worked out instantly." },
  { id: "text", title: "Text tools", blurb: "Count, clean, convert and rewrite text quickly." },
  { id: "converters", title: "Converters", blurb: "Units, measures and formats, translated in a tap." },
];

export function Discovery() {
  return (
    <section id="tools" className="relative mx-auto w-full max-w-7xl px-6 py-24">
      <Reveal>
        <header className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">The library</span>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            One place for <span className="text-gradient">everything digital</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {TOTALS.live} tools ready now across {TOTALS.categories} categories — and the library keeps
            growing. Press <kbd className="rounded border border-border px-1 text-[11px]">⌘K</kbd> anywhere
            to jump straight to one.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground"
              style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))" }}
            >
              Browse all tools <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <Link to="/categories" className="glass rounded-full px-5 py-2.5 text-sm font-medium hover:border-primary/40">
              Explore categories
            </Link>
          </div>
        </header>
      </Reveal>

      <Row title="Featured" blurb="The tools people reach for first." tools={[...FEATURED_TOOLS].sort(rankTools)} />
      <Row title="Most used" blurb="Popular across every kind of work." tools={POPULAR_TOOLS.slice(0, 4)} />

      {ROWS.map((r) => (
        <Row
          key={r.id}
          title={r.title}
          blurb={r.blurb}
          tools={toolsByCategory(r.id).sort(rankTools)}
          href={{ slug: CATEGORIES_WITH_COUNTS.find((c) => c.id === r.id)!.slug }}
        />
      ))}
    </section>
  );
}

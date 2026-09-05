import { useMemo, useState } from "react";
import { Search, Sparkles, Star, X } from "lucide-react";
import { CATEGORIES, TOOLS, type CategoryFilter, type NexaTool } from "@/lib/nexa-data";
import { Reveal, TiltCard } from "./motion-primitives";
import { CalculatorPanel, PasswordPanel, ToolPlaceholder, WordCounter } from "./ToolPanels";
import { cn } from "@/lib/utils";

function ToolCard({
  tool,
  favorite,
  onToggleFavorite,
  onOpen,
  index,
}: {
  tool: NexaTool;
  favorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  index: number;
}) {
  const Icon = tool.icon;
  return (
    <Reveal delay={Math.min(index, 8) * 45}>
      <TiltCard
        onClick={onOpen}
        className="group depth-shadow h-full cursor-pointer p-5 hover:border-primary/40"
      >
        <div className="flex items-start justify-between">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl border border-border/60 text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/40"
            style={{ background: "color-mix(in oklab, var(--primary) 10%, transparent)" }}
          >
            <Icon size={18} />
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label="Toggle favourite"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              favorite ? "text-secondary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Star size={15} fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>

        <h3 className="mt-4 font-display text-[15px] font-medium">{tool.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tool.desc}</p>

        <div className="mt-4 flex items-center gap-2 text-[11px]">
          <span className="rounded-full border border-border/60 px-2 py-0.5 text-muted-foreground">
            {tool.category}
          </span>
          {tool.kind === "ai" ? (
            <span className="rounded-full border border-primary/30 px-2 py-0.5 text-primary">
              AI
            </span>
          ) : null}
          {tool.comingSoon ? (
            <span className="rounded-full border border-secondary/30 px-2 py-0.5 text-secondary">
              Soon
            </span>
          ) : null}
          <span className="ml-auto text-muted-foreground">{tool.credits} cr</span>
        </div>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              {tool.demo
                ? "Live demo available — opens instantly, no setup."
                : tool.kind === "ai"
                  ? "Runs on priority AI models with streaming output."
                  : "Runs locally on your device — nothing is uploaded."}
            </p>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function ToolModal({
  tool,
  onClose,
  onSpend,
}: {
  tool: NexaTool;
  onClose: () => void;
  onSpend: () => void;
}) {
  const Icon = tool.icon;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        style={{ animation: "fade-in .25s ease-out" }}
      />
      <div
        className="glass-strong depth-shadow relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-6 sm:rounded-3xl"
        style={{
          animation: "scale-in .35s cubic-bezier(.22,1,.36,1)",
          transformOrigin: "center bottom",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-primary"
            style={{ background: "color-mix(in oklab, var(--primary) 12%, transparent)" }}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-lg">{tool.name}</h3>
            <p className="text-sm text-muted-foreground">{tool.desc}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-6">
          {tool.id === "calculator" ? (
            <CalculatorPanel onSpend={onSpend} />
          ) : tool.id === "password" ? (
            <PasswordPanel onSpend={onSpend} />
          ) : (
            <ToolPlaceholder tool={tool} />
          )}
        </div>
      </div>
    </div>
  );
}

export function ToolsSection({ onSpend }: { onSpend: () => void }) {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [active, setActive] = useState<NexaTool | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (!q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <section id="tools" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Tool library</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Sixteen tools. One tab.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Local utilities run on your device. AI tools run on priority models and spend credits
              only when they produce a result.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-9 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5 lg:w-72">
              <Search size={15} className="shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300",
                    category === c
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              index={i}
              favorite={favorites.includes(tool.id)}
              onToggleFavorite={() =>
                setFavorites((f) =>
                  f.includes(tool.id) ? f.filter((x) => x !== tool.id) : [...f, tool.id],
                )
              }
              onOpen={() => setActive(tool)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No tools match “{query}”.
          </p>
        ) : null}

        <Reveal delay={60}>
          <div className="glass depth-shadow mt-14 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles size={15} className="text-secondary" />
              Word Counter — try it live
            </div>
            <div className="mt-5">
              <WordCounter />
            </div>
          </div>
        </Reveal>
      </div>

      {active ? (
        <ToolModal tool={active} onClose={() => setActive(null)} onSpend={onSpend} />
      ) : null}
    </section>
  );
}

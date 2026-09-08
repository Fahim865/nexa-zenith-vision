import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CATEGORY_BY_ID } from "@/lib/tools/categories";
import type { ToolMeta } from "@/lib/tools/types";

export function StatusBadge({ status }: { status: ToolMeta["status"] }) {
  const map = {
    live: { label: "Live", cls: "border-primary/40 text-primary" },
    beta: { label: "Beta", cls: "border-secondary/40 text-secondary" },
    soon: { label: "Coming soon", cls: "border-border text-muted-foreground" },
  } as const;
  const s = map[status];
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider", s.cls)}>
      {s.label}
    </span>
  );
}

export function ToolCard({ tool, compact }: { tool: ToolMeta; compact?: boolean }) {
  const Icon = tool.icon;
  const category = CATEGORY_BY_ID[tool.category];
  const soon = tool.status === "soon";

  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className={cn(
        "glass group relative flex flex-col rounded-2xl p-4 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--glow-primary)]",
        soon && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15"
          aria-hidden="true"
        >
          <Icon size={18} />
        </span>
        <StatusBadge status={tool.status} />
      </div>

      <h3 className="mt-3.5 text-sm font-semibold text-foreground">{tool.name}</h3>
      {!compact ? (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tool.description}
        </p>
      ) : null}

      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>{category.name}</span>
        {tool.credits ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{tool.credits} credits</span>
          </>
        ) : (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-primary/80">Free</span>
          </>
        )}
      </div>
    </Link>
  );
}

export function ToolGrid({ tools, compact }: { tools: ToolMeta[]; compact?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map((t) => (
        <ToolCard key={t.slug} tool={t} {...(compact ? { compact } : {})} />
      ))}
    </div>
  );
}

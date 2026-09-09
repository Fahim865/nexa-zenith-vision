import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Clock, CornerDownLeft, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_BY_ID } from "@/lib/tools/categories";
import { POPULAR_TOOLS, searchTools } from "@/lib/tools/registry";
import type { ToolMeta } from "@/lib/tools/types";

const RECENT_KEY = "nexa:recent-searches";

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[]);
    } catch {
      setRecent([]);
    }
    const id = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(id);
  }, [open]);

  const results: ToolMeta[] = useMemo(
    () => (query.trim() ? searchTools(query, 12).map((h) => h.tool) : POPULAR_TOOLS.slice(0, 8)),
    [query],
  );

  const go = useCallback(
    (tool: ToolMeta) => {
      if (query.trim()) {
        const next = [query.trim(), ...recent.filter((r) => r !== query.trim())].slice(0, 5);
        try {
          localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }
      onClose();
      void navigate({ to: "/tools/$slug", params: { slug: tool.slug } });
    },
    [navigate, onClose, query, recent],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % Math.max(1, results.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (a - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === "Enter" && results[active]) {
        e.preventDefault();
        go(results[active]!);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, go]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-background/70 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onClick={onClose}
    >
      <div
        className="glass-strong depth-shadow w-full max-w-xl overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3.5">
          <Search size={17} className="text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search every tool…"
            aria-label="Search every tool"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
        </div>

        {!query && recent.length ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-4 py-2.5">
            <Clock size={12} className="text-muted-foreground" aria-hidden="true" />
            {recent.map((r) => (
              <button
                key={r}
                onClick={() => setQuery(r)}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              >
                {r}
              </button>
            ))}
          </div>
        ) : null}

        <ul className="max-h-[52vh] overflow-y-auto p-2">
          {!query ? (
            <li className="flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <TrendingUp size={12} aria-hidden="true" /> Popular
            </li>
          ) : null}
          {results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              Nothing matched “{query}”.
            </li>
          ) : (
            results.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <li key={tool.slug}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(tool)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      i === active ? "bg-primary/10" : "hover:bg-surface/60",
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{tool.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {CATEGORY_BY_ID[tool.category].name}
                        {tool.status === "soon" ? " · coming soon" : ""}
                      </span>
                    </span>
                    {i === active ? (
                      <CornerDownLeft size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

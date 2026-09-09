import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Navbar } from "@/components/nexa/Navbar";
import { Footer } from "@/components/nexa/Footer";
import { ToolGrid } from "@/components/tools/ToolCard";
import { EmptyNote } from "@/components/workspace/ui";
import { CATEGORIES_WITH_COUNTS, TOOLS, TOTALS, rankTools, searchTools } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: `All Tools — ${TOTALS.live} free online tools | NEXA` },
      {
        name: "description",
        content: `Browse every NEXA tool: image, PDF, text, developer, calculator and productivity tools that run right in your browser. ${TOTALS.live} live tools across ${TOTALS.categories} categories.`,
      },
      { property: "og:title", content: "All Tools — NEXA" },
      { property: "og:description", content: "Every NEXA tool in one searchable library." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/tools" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [liveOnly, setLiveOnly] = useState(false);

  const results = useMemo(() => {
    let list = query.trim() ? searchTools(query, 200).map((h) => h.tool) : [...TOOLS].sort(rankTools);
    if (category !== "all") list = list.filter((t) => t.category === category);
    if (liveOnly) list = list.filter((t) => t.status !== "soon");
    return list;
  }, [query, category, liveOnly]);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-28">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            <span className="text-gradient">Every tool</span>, one library
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {TOTALS.live} tools ready to use now across {TOTALS.categories} categories, with more
            arriving. Anything marked Coming soon isn't pretending to work yet.
          </p>
        </header>

        <div className="glass mt-8 flex items-center gap-3 rounded-full px-4 py-2.5">
          <Search size={16} className="text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools — try compress, convert, password…"
            aria-label="Search all tools"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
          />
          <button
            onClick={() => setLiveOnly((v) => !v)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs transition-colors",
              liveOnly ? "border-primary/50 text-primary" : "border-border text-muted-foreground",
            )}
          >
            Live only
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              category === "all" ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            All ({TOOLS.length})
          </button>
          {CATEGORIES_WITH_COUNTS.filter((c) => c.total > 0).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                category === c.id ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c.name} ({c.total})
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground" aria-live="polite">
          {results.length} {results.length === 1 ? "tool" : "tools"}
        </p>

        <div className="mt-4">
          {results.length ? (
            <ToolGrid tools={results} />
          ) : (
            <EmptyNote>
              Nothing matched “{query}”.{" "}
              <Link to="/categories" className="text-primary hover:underline">
                Browse by category
              </Link>{" "}
              instead.
            </EmptyNote>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

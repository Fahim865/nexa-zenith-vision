import { Link, createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/nexa/Navbar";
import { Footer } from "@/components/nexa/Footer";
import { CATEGORIES_WITH_COUNTS, TOTALS } from "@/lib/tools/registry";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: `Tool Categories — ${TOTALS.categories} collections | NEXA` },
      {
        name: "description",
        content:
          "Browse NEXA by category: AI, image, video, audio, PDF, documents, text, developer, calculators, converters, SEO, business and more.",
      },
      { property: "og:title", content: "Tool Categories — NEXA" },
      { property: "og:description", content: "Every NEXA tool collection, from image editing to developer utilities." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/categories" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-28">
        <header className="max-w-2xl">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Browse by <span className="text-gradient">category</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {TOTALS.categories} collections covering everyday digital work — from resizing a photo to
            formatting code.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES_WITH_COUNTS.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="glass group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--glow-primary)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-sm font-semibold text-foreground">{c.name}</h2>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{c.blurb}</p>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  <span className="text-primary">{c.live} live</span>
                  {c.total > c.live ? ` · ${c.total - c.live} coming` : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

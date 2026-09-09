import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/nexa/Navbar";
import { Footer } from "@/components/nexa/Footer";
import { ToolGrid } from "@/components/tools/ToolCard";
import { EmptyNote } from "@/components/workspace/ui";
import { CATEGORY_BY_SLUG } from "@/lib/tools/categories";
import { rankTools, toolsByCategory } from "@/lib/tools/registry";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = CATEGORY_BY_SLUG[params.slug];
    if (!category) throw notFound();
    return { slug: category.slug };
  },
  head: ({ params }) => {
    const category = CATEGORY_BY_SLUG[params.slug];
    if (!category) {
      return { meta: [{ title: "Category not found — NEXA" }, { name: "robots", content: "noindex" }] };
    }
    const count = toolsByCategory(category.id).length;
    const title = `${category.name} Tools — ${count} free online tools | NEXA`;
    return {
      meta: [
        { title },
        { name: "description", content: `${category.blurb} ${count} ${category.name.toLowerCase()} tools inside NEXA, most running entirely in your browser.` },
        { property: "og:title", content: title },
        { property: "og:description", content: category.blurb },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${category.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/category/${category.slug}` }],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display text-2xl">That category doesn't exist</h1>
      <Link to="/categories" className="mt-6 inline-block text-primary hover:underline">
        See all categories
      </Link>
    </div>
  ),
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const category = CATEGORY_BY_SLUG[slug]!;
  const tools = toolsByCategory(category.id).sort(rankTools);
  const Icon = category.icon;

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-24 pt-28">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">NEXA</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
        </nav>

        <header className="mt-5 flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <Icon size={22} aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{category.name} tools</h1>
            <p className="mt-1 text-sm text-muted-foreground">{category.blurb}</p>
          </div>
        </header>

        <div className="mt-10">
          {tools.length ? (
            <ToolGrid tools={tools} />
          ) : (
            <EmptyNote>Nothing here yet — this category is being built out.</EmptyNote>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Suspense } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronRight, Clock } from "lucide-react";
import { Navbar } from "@/components/nexa/Navbar";
import { Footer } from "@/components/nexa/Footer";
import { StatusBadge, ToolCard } from "@/components/tools/ToolCard";
import { Spinner } from "@/components/workspace/ui";
import { CATEGORY_BY_ID } from "@/lib/tools/categories";
import { getTool, relatedTools } from "@/lib/tools/registry";
import { getToolComponent } from "@/lib/tools/loader";

const SITE_URL = "https://project--11775231-656a-4186-9fab-ddb90377dce0.lovable.app";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { slug: tool.slug };
  },
  head: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) {
      return { meta: [{ title: "Tool not found — NEXA" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: tool.seoTitle },
        { name: "description", content: tool.seoDescription },
        { property: "og:title", content: tool.seoTitle },
        { property: "og:description", content: tool.seoDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/tools/${tool.slug}` },
        { property: "og:site_name", content: "NEXA" },
        { name: "twitter:title", content: tool.seoTitle },
        { name: "twitter:description", content: tool.seoDescription },
        { name: "keywords", content: tool.tags.join(", ") },
        ...(tool.status === "soon" ? [{ name: "robots", content: "noindex, follow" }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/tools/${tool.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `${tool.name} — NEXA`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description: tool.seoDescription,
            url: `${SITE_URL}/tools/${tool.slug}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        },
        ...(tool.faq?.length
          ? [{
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: tool.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
              }),
            }]
          : []),
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display text-2xl">We couldn't find that tool</h1>
      <p className="mt-3 text-muted-foreground">It may have moved, or it isn't published yet.</p>
      <Link to="/tools" className="mt-6 inline-block text-primary hover:underline">
        Browse all tools
      </Link>
    </div>
  ),
});

function ToolPage() {
  const { slug } = Route.useLoaderData();
  const tool = getTool(slug)!;
  const category = CATEGORY_BY_ID[tool.category];
  const Workspace = getToolComponent(tool.slug);
  const related = relatedTools(tool, 4);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">NEXA</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/tools" className="hover:text-foreground">Tools</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">
            {category.name}
          </Link>
        </nav>

        <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <tool.icon size={20} aria-hidden="true" />
              </span>
              <h1 className="font-display text-2xl font-semibold sm:text-3xl">{tool.name}</h1>
              <StatusBadge status={tool.status} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {tool.credits > 0 ? (
                <><span className="text-secondary">{tool.credits} credits per run</span> · runs on NEXA's AI servers</>
              ) : (
                <><span className="text-primary">Free · 0 credits</span> · runs privately on your device, files never leave your browser</>
              )}
            </p>
          </div>
        </header>

        <section className="mt-8">
          {Workspace && tool.status !== "soon" ? (
            <Suspense fallback={<div className="glass rounded-2xl p-10"><Spinner label="Loading workspace…" /></div>}>
              <Workspace tool={tool} />
            </Suspense>
          ) : (
            <div className="glass rounded-2xl p-10 text-center">
              <Clock size={22} className="mx-auto text-secondary" aria-hidden="true" />
              <h2 className="mt-3 font-display text-lg">This one isn't ready yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {tool.name} is on the way. We only mark a tool as live once it genuinely works, so
                nothing here pretends to do something it can't.
              </p>
              <Link to="/tools" className="mt-5 inline-block text-sm text-primary hover:underline">
                See what's live today
              </Link>
            </div>
          )}
        </section>

        {tool.tags.length ? (
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Related searches">
            {tool.tags.map((t) => (
              <li key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        {tool.about || tool.faq?.length ? (
          <section className="mt-12 max-w-3xl">
            {tool.about ? <p className="text-sm leading-relaxed text-muted-foreground">{tool.about}</p> : null}
            {tool.faq?.length ? (
              <dl className="mt-6 space-y-4">
                {tool.faq.map((f) => (
                  <div key={f.q}>
                    <dt className="font-display text-sm">{f.q}</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </section>
        ) : null}

        {related.length ? (
          <section className="mt-14">
            <h2 className="font-display text-lg">Related tools</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <ToolCard key={r.slug} tool={r} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

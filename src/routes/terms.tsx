import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/nexa/Navbar";
import { Footer } from "@/components/nexa/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — NEXA" },
      {
        name: "description",
        content:
          "The terms for using NEXA: your account and credits, acceptable use, AI-generated content, and the limits of our liability — in plain language.",
      },
      { property: "og:title", content: "Terms of Service — NEXA" },
      {
        property: "og:description",
        content: "The rules for using NEXA's tools, accounts and credits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://project--11775231-656a-4186-9fab-ddb90377dce0.lovable.app/terms" }],
  }),
  component: TermsPage,
});

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Accepting these terms",
    body: [
      "By using NEXA you agree to these Terms of Service. If you don't agree, please don't use the service. NEXA is operated as a universal digital workspace (“NEXA”, powered by the FMXAI engine).",
    ],
  },
  {
    title: "2. The service",
    body: [
      "NEXA provides a library of digital tools. Tools marked “100% private” run entirely in your browser. AI tools run on NEXA's servers and require a signed-in account. Tools marked “Coming soon” are not yet functional — we never pretend otherwise.",
    ],
  },
  {
    title: "3. Accounts and credits",
    body: [
      "New accounts receive 50 free AI credits. Each AI run costs 2 credits, deducted server-side at the start of a run. If an AI run fails before producing a result, the credits are refunded automatically.",
      "Credits have no cash value, are non-transferable, and cannot be exchanged for money. Free credits may change as plans evolve. When paid plans launch, their prices, allowances and any refund terms will be shown on the pricing page at purchase.",
    ],
  },
  {
    title: "4. Acceptable use",
    body: [
      "Don't use NEXA to break the law, infringe others' rights, generate harmful or abusive content, attempt to disrupt the service, abuse the AI service (including automated scraping of results), or circumvent credit limits or authentication. We may suspend accounts that do.",
    ],
  },
  {
    title: "5. AI-generated content",
    body: [
      "AI output is generated automatically and may be inaccurate, incomplete or outdated. Always review AI results before relying on them, especially for legal, medical, financial or safety-critical purposes. You are responsible for how you use AI output.",
    ],
  },
  {
    title: "6. Your content",
    body: [
      "Files you process in browser-side tools never leave your device. Content you submit to AI tools remains yours; you grant us only the limited rights needed to process your request and store it in your workspace history.",
    ],
  },
  {
    title: "7. Intellectual property",
    body: [
      "The NEXA name, branding, design and code are owned by NEXA. You may not copy or reuse them to build a competing product. Your own documents, images and AI outputs remain yours.",
    ],
  },
  {
    title: "8. Disclaimers",
    body: [
      "NEXA is provided “as is” and “as available”, without warranties of any kind to the fullest extent permitted by law. We don't guarantee that every tool will be uninterrupted, error-free, or fit every purpose.",
    ],
  },
  {
    title: "9. Liability",
    body: [
      "To the maximum extent permitted by law, NEXA is not liable for indirect, incidental or consequential damages, or for data loss arising from files you process locally in your browser (always keep your own backups).",
    ],
  },
  {
    title: "10. Termination and changes",
    body: [
      "You can stop using NEXA at any time and delete your workspace content from the Dashboard. We may update these terms as the product evolves; material changes will be reflected on this page with an updated date.",
    ],
  },
];

function TermsPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 24, 2026</p>

        <div className="glass mt-10 rounded-2xl p-7">
          {SECTIONS.map((s) => (
            <section key={s.title} className="mt-8 first:mt-0">
              <h2 className="font-display text-lg font-semibold">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          See also our{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}

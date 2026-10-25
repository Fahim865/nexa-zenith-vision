import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/nexa/Navbar";
import { Footer } from "@/components/nexa/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — NEXA" },
      {
        name: "description",
        content:
          "How NEXA handles your data: client-side tools process files entirely in your browser, AI tools run on secured servers, and your account data lives in your own workspace.",
      },
      { property: "og:title", content: "Privacy Policy — NEXA" },
      {
        property: "og:description",
        content: "Client-side tools never upload your files. AI tools and account data are explained here in plain language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://project--11775231-656a-4186-9fab-ddb90377dce0.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. The short version",
    body: [
      "NEXA is built privacy-first. Every tool marked “100% private” runs entirely inside your browser — your files are never uploaded to any server. Tools that use AI (marked with a server badge) send your text to NEXA's AI service to produce a result, and nothing else is shared.",
      "This page explains exactly what is processed where, and what you can do about it.",
    ],
  },
  {
    title: "2. Tools that run in your browser",
    body: [
      "Image tools (compression, resizing, conversion), PDF tools (merge, split, rotate), calculators, unit converters, text utilities, password generation, QR codes and similar tools do all of their work locally on your device using your browser's own capabilities.",
      "For these tools we have no servers involved at all: your files are not uploaded, not stored by us, and not visible to anyone but you. When you close the tab, the work is gone unless you choose to download it.",
    ],
  },
  {
    title: "3. AI tools",
    body: [
      "AI tools (the AI workspace, summarizer, writer, translator and similar) require a signed-in account. When you use one, the text you submit is sent to NEXA's AI service to generate your result.",
      "Your requests are authenticated with your account, credits are deducted server-side, and the input and output of each run are saved to your workspace history so you can review, reuse or delete them from your Dashboard at any time.",
      "We do not use your AI inputs to advertise to you.",
    ],
  },
  {
    title: "4. Account information",
    body: [
      "If you create an account, we store your email address, a display name derived from it, and your credit balance. Passwords are stored only as secure hashes by our authentication provider — never in plain text.",
      "Signing in with Google (when enabled) shares only your name and email with us.",
    ],
  },
  {
    title: "5. Information stored on your device",
    body: [
      "We store small preferences in your browser's local storage: your pinned/favorite tools and your recent searches. These never leave your device and you can clear them any time by clearing your browser storage.",
    ],
  },
  {
    title: "6. Where your account data lives",
    body: [
      "Account data, credit balances, AI run history and chat conversations are stored in NEXA's managed cloud database, hosted on Lovable Cloud infrastructure. Access to your data is protected by row-level security: only your account can read your own workspace.",
    ],
  },
  {
    title: "7. Retention and deletion",
    body: [
      "You can delete any individual AI run or chat conversation from your Dashboard or AI workspace at any time — deletion is immediate and permanent.",
      "If you want your entire account removed, you can request deletion, and your profile, history and conversations will be deleted with it. Local preferences in your browser can be cleared from your browser settings.",
    ],
  },
  {
    title: "8. Tool suggestions",
    body: [
      "If you use the “Request a tool” form, we store the tool idea, optional details, and the optional email address you provide — used only to understand demand and, if you gave an email, to tell you when it ships.",
    ],
  },
  {
    title: "9. Third parties",
    body: [
      "NEXA runs on Lovable Cloud (hosting, database, authentication) and uses its AI gateway for AI features. When payments launch, the payment processor will handle your payment details directly — we will never see or store your card information.",
      "We do not sell your data, and we do not run third-party advertising trackers.",
    ],
  },
  {
    title: "10. Changes and contact",
    body: [
      "If this policy changes in a meaningful way, we will update this page and the date below.",
      "Questions? Use the “Request a tool” form or your Dashboard — messages reach the team directly.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-32">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
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
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}

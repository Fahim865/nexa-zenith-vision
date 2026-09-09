import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/nexa/Navbar";
import { Hero } from "@/components/nexa/Hero";
import { Discovery } from "@/components/tools/Discovery";
import { Pricing } from "@/components/nexa/Pricing";
import { About } from "@/components/nexa/About";
import { Footer } from "@/components/nexa/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXA — Everything you need. One intelligent workspace." },
      {
        name: "description",
        content:
          "NEXA unites calculators, text, image, PDF and AI tools in one fast, private workspace — with credits that only spend when you get a result.",
      },
      { property: "og:title", content: "NEXA — One intelligent workspace" },
      {
        property: "og:description",
        content:
          "Sixteen calculators, text, image, PDF and AI tools in a single premium workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [credits, setCredits] = useState(100);

  return (
    <div className="relative min-h-screen">
      <Navbar credits={credits} />
      <main>
        <Hero />
        <ToolsSection onSpend={() => setCredits((c) => Math.max(0, c - 1))} />
        <Pricing />
        <About />
      </main>
      <Footer />
    </div>
  );
}

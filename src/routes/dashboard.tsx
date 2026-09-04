import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/nexa/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "NEXA Command Center — Credits & Usage" },
      {
        name: "description",
        content:
          "Track your NEXA credits, usage statistics, recent tools and quick actions inside a futuristic AI command center.",
      },
      { property: "og:title", content: "NEXA Command Center — Credits & Usage" },
      {
        property: "og:description",
        content: "Live credit meter, usage stats and quick actions for your NEXA workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

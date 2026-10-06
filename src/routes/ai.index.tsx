import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/workspace/ui";
import { useAuth } from "@/hooks/useAuth";
import { createConversation } from "@/lib/ai/conversations";
import { AI_TOOLS } from "@/lib/tools/data/ai";

export const Route = createFileRoute("/ai/")({ component: AiHome });

function AiHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function start() {
    if (!user) return;
    setBusy(true);
    const id = await createConversation(user.id);
    await qc.invalidateQueries({ queryKey: ["threads"] });
    navigate({ to: "/ai/$threadId", params: { threadId: id } });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-8 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-bold text-primary-foreground" style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))", boxShadow: "var(--glow-primary)" }}>N</div>
      <h1 className="mt-5 font-display text-2xl font-semibold">What are we working on?</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">Start a chat, or jump into a focused AI tool. Credits and history are shared across all of them.</p>
      <Button className="mt-6" onClick={start} disabled={busy}>{busy ? "Opening…" : "Start a new chat"}</Button>
      <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3">
        {AI_TOOLS.filter((t) => t.slug !== "ai-chat").slice(0, 9).map((t) => (
          <Link key={t.slug} to="/tools/$slug" params={{ slug: t.slug }} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-left text-sm hover:border-primary/40">
            <t.icon size={15} className="text-primary" /> {t.name.replace("AI ", "")}
          </Link>
        ))}
      </div>
    </div>
  );
}

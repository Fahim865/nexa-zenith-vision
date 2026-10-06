import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus, Trash2, Zap } from "lucide-react";
import { Navbar } from "@/components/nexa/Navbar";
import { Button, Spinner } from "@/components/workspace/ui";
import { useAuth } from "@/hooks/useAuth";
import { createConversation, deleteConversation, listConversations } from "@/lib/ai/conversations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "NEXA AI Workspace — Chat, write and create with AI" },
      { name: "description", content: "Chat with AI, keep every conversation, and share credits and history across all NEXA AI tools." },
      { property: "og:title", content: "NEXA AI Workspace" },
      { property: "og:description", content: "Saved AI chats with shared credits and history, powered by FMXAI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiLayout,
});

function AiLayout() {
  const { user, loading, credits } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const params = useParams({ strict: false }) as { threadId?: string };
  const threads = useQuery({ queryKey: ["threads", user?.id], queryFn: listConversations, enabled: !!user });

  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner label="Loading…" /></div>;
  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-md px-6 pt-40 text-center">
          <h1 className="font-display text-2xl">Your AI workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to chat with AI. New accounts get 50 free credits.</p>
          <Link to="/auth" search={{ next: "/ai" }} className="mt-6 inline-block"><Button>Sign in</Button></Link>
        </div>
      </div>
    );
  }

  async function newChat() {
    const id = await createConversation(user!.id);
    await qc.invalidateQueries({ queryKey: ["threads"] });
    navigate({ to: "/ai/$threadId", params: { threadId: id } });
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid h-screen max-w-7xl grid-cols-1 gap-4 px-3 pb-4 pt-24 sm:px-6 md:grid-cols-[260px_1fr]">
        <aside className="glass hidden min-h-0 flex-col rounded-2xl p-3 md:flex">
          <Button onClick={newChat} className="w-full"><MessageSquarePlus size={15} /> New chat</Button>
          <div className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
            {threads.data?.map((t) => (
              <div key={t.id} className={cn("group flex items-center rounded-lg", params.threadId === t.id ? "bg-primary/10" : "hover:bg-surface-2/60")}>
                <Link to="/ai/$threadId" params={{ threadId: t.id }} className="min-w-0 flex-1 truncate px-3 py-2 text-sm">
                  {t.title}
                </Link>
                <button
                  aria-label="Delete chat"
                  className="px-2 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
                  onClick={async () => {
                    await deleteConversation(t.id);
                    await qc.invalidateQueries({ queryKey: ["threads"] });
                    if (params.threadId === t.id) navigate({ to: "/ai" });
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {threads.data?.length === 0 ? <p className="px-3 py-2 text-xs text-muted-foreground">No chats yet.</p> : null}
          </div>
          <Link to="/dashboard" className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
            <Zap size={13} className="text-secondary" /> {credits ?? "—"} credits · Dashboard
          </Link>
        </aside>
        <section className="glass flex min-h-0 flex-col rounded-2xl">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

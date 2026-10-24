import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Spinner } from "@/components/workspace/ui";
import { getAccessToken, useAuth } from "@/hooks/useAuth";
import { getConversation } from "@/lib/ai/conversations";
import { AI_CREDIT_COST } from "@/lib/ai/tools";

export const Route = createFileRoute("/ai/$threadId")({ component: ThreadPage });

function ThreadPage() {
  const { threadId } = Route.useParams();
  const q = useQuery({ queryKey: ["thread", threadId], queryFn: () => getConversation(threadId), staleTime: Infinity });
  if (q.isLoading) return <div className="grid flex-1 place-items-center"><Spinner label="Loading chat…" /></div>;
  if (!q.data) return <p className="p-8 text-sm text-muted-foreground">This chat doesn't exist.</p>;
  return <ChatWindow key={threadId} id={threadId} initial={q.data.messages ?? []} />;
}

function ChatWindow({ id, initial }: { id: string; initial: UIMessage[] }) {
  const { credits, refreshCredits } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { conversationId: id },
        headers: async () => ({ Authorization: `Bearer ${(await getAccessToken()) ?? ""}` }),
        fetch: async (input, init) => {
          const res = await fetch(input, init);
          if (!res.ok) {
            const j = (await res.clone().json().catch(() => null)) as { error?: string } | null;
            throw new Error(j?.error ?? "Something went wrong.");
          }
          return res;
        },
      }),
    [id],
  );
  const { messages, sendMessage, status, stop } = useChat({
    id,
    messages: initial,
    transport,
    onError: (e) => toast.error(e.message),
    onFinish: () => {
      void refreshCredits();
      void qc.invalidateQueries({ queryKey: ["threads"] });
      void qc.invalidateQueries({ queryKey: ["thread", id] });
    },
  });
  const busy = status === "submitted" || status === "streaming";
  const noCredits = (credits ?? 0) < AI_CREDIT_COST;

  return (
    <>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState title="Ask NEXA anything" description={`Each message uses ${AI_CREDIT_COST} credits.`} />
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                <MessageContent className={m.role === "user" ? "bg-primary text-primary-foreground" : ""}>
                  {m.parts.map((p, i) =>
                    p.type === "text" ? (
                      m.role === "assistant" ? <MessageResponse key={i}>{p.text}</MessageResponse> : <span key={i} className="whitespace-pre-wrap">{p.text}</span>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" ? <Shimmer>Thinking…</Shimmer> : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="mx-auto w-full max-w-3xl p-3">
        <PromptInput
          onSubmit={(msg) => {
            const t = msg.text?.trim();
            if (!t || busy) return;
            if (noCredits) {
              toast.error("You're out of credits. Upgrade to keep chatting.");
              return;
            }
            sendMessage({ text: t });
            setText("");
          }}
        >
          <PromptInputTextarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Message NEXA…" />
          <PromptInputFooter className="justify-between">
            <span className="px-2 text-xs text-muted-foreground">{credits ?? "—"} credits · {AI_CREDIT_COST} per message</span>
            <PromptInputSubmit status={status} onStop={stop} disabled={!busy && !text.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";
import { AI_CREDIT_COST } from "@/lib/ai/tools";

const Body = z.object({
  conversationId: z.string().uuid(),
  messages: z.array(z.any()).min(1).max(200),
});

const SYSTEM =
  "You are NEXA, a helpful, precise assistant inside the NEXA digital workspace (powered by FMXAI). Answer clearly in Markdown. Be concise unless asked for depth.";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const g = await import("@/lib/ai/gateway.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let runId: string | undefined;
        try {
          const userId = await g.requireUser(request);
          const parsed = Body.safeParse(await request.json());
          if (!parsed.success) throw new g.HttpError(400, "Invalid message.");
          const messages = parsed.data.messages as UIMessage[];
          const { conversationId } = parsed.data;

          const { data: convo } = await supabaseAdmin
            .from("conversations")
            .select("id, user_id, title")
            .eq("id", conversationId)
            .maybeSingle();
          if (!convo || convo.user_id !== userId) throw new g.HttpError(404, "Conversation not found.");

          const last = messages[messages.length - 1];
          const lastText =
            last?.parts?.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim() ?? "";
          runId = await g.spendCredits(userId, AI_CREDIT_COST, "ai-chat", "chat", lastText);

          const { model, runIdFetch } = g.createGatewayModel(request);
          const id = runId;
          const result = streamText({
            model,
            system: SYSTEM,
            messages: await convertToModelMessages(messages),
            abortSignal: request.signal,
            providerOptions: g.OPENAI_OPTIONS,
            onError: async () => {
              await g.refundRun(id);
            },
          });

          const response = result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: true,
            onFinish: async ({ messages: all, responseMessage }) => {
              const text = responseMessage.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              if (text) await g.finishRun(id, text);
              else await g.refundRun(id);
              const title =
                convo.title === "New chat" && lastText ? lastText.slice(0, 60) : convo.title;
              const { error } = await supabaseAdmin
                .from("conversations")
                .update({ messages: all as never, title, updated_at: new Date().toISOString() })
                .eq("id", conversationId);
              if (error) console.error("save conversation failed", error);
            },
          });
          return g.withRunId(response, runIdFetch);
        } catch (e) {
          if (runId) await g.refundRun(runId);
          if (!(e instanceof g.HttpError) && (e as { statusCode?: number })?.statusCode) {
            const m = g.gatewayErrorMessage(e);
            return Response.json({ error: m.message }, { status: m.status });
          }
          return g.errorResponse(e);
        }
      },
    },
  },
});

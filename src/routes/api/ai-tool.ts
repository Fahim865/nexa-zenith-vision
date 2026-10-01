import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";
import { AI_CREDIT_COST, AI_TOOL_CONFIGS } from "@/lib/ai/tools";

const Body = z.object({
  slug: z.string(),
  prompt: z.string().min(1).max(20000),
  options: z.record(z.string(), z.string()).optional(),
});

export const Route = createFileRoute("/api/ai-tool")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const g = await import("@/lib/ai/gateway.server");
        let runId: string | undefined;
        try {
          const userId = await g.requireUser(request);
          const parsed = Body.safeParse(await request.json());
          if (!parsed.success) throw new g.HttpError(400, "Please add some text first.");
          const { slug, prompt, options } = parsed.data;
          const config = AI_TOOL_CONFIGS[slug];
          if (!config) throw new g.HttpError(404, "That AI tool doesn't exist.");

          runId = await g.spendCredits(userId, AI_CREDIT_COST, slug, "generation", prompt);
          const settings = Object.entries(options ?? {})
            .filter(([k]) => config.fields?.some((f) => f.key === k))
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");

          const { model, runIdFetch } = g.createGatewayModel(request);
          const id = runId;
          const result = streamText({
            model,
            system: config.system,
            prompt: settings ? `Settings:\n${settings}\n\nInput:\n${prompt}` : prompt,
            abortSignal: request.signal,
            providerOptions: g.OPENAI_OPTIONS,
            onFinish: async ({ text }) => {
              if (text) await g.finishRun(id, text);
              else await g.refundRun(id);
            },
            onError: async () => {
              await g.refundRun(id);
            },
          });
          return g.withRunId(result.toTextStreamResponse(), runIdFetch);
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

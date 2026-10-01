import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";

export const AI_MODEL = "openai/gpt-6-astra";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

/** Request-local fetch that reuses / captures the gateway-issued run id. */
export function createRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  return {
    getRunId: () => runId,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      const response = await fetch(input, { ...init, headers });
      runId ??= response.headers.get(RUN_ID_HEADER)?.trim() || undefined;
      return response;
    },
  };
}

export function createGatewayModel(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new HttpError(500, "AI is not configured yet.");
  const runIdFetch = createRunIdFetch(request.headers.get(RUN_ID_HEADER) ?? undefined);
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return { model: provider.responses(AI_MODEL), runIdFetch };
}

export const OPENAI_OPTIONS = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

export function withRunId(response: Response, runIdFetch: { getRunId: () => string | undefined }) {
  const id = runIdFetch.getRunId();
  if (id) response.headers.set(RUN_ID_HEADER, id);
  return response;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) return Response.json({ error: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}

/** Verifies the bearer token and returns the signed-in user id. */
export async function requireUser(request: Request): Promise<string> {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || token.split(".").length !== 3) throw new HttpError(401, "Please sign in to use AI tools.");
  const supabase = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) throw new HttpError(401, "Your session expired. Please sign in again.");
  return data.claims.sub as string;
}

/** Atomically deducts credits server-side and opens a history entry. */
export async function spendCredits(userId: string, amount: number, tool: string, kind: string, input: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("spend_credits", {
    _uid: userId,
    _amount: amount,
    _tool: tool,
    _kind: kind,
    _input: input,
  });
  if (error) {
    if (error.message.includes("insufficient_credits"))
      throw new HttpError(402, "You're out of credits. Upgrade your plan to keep using AI tools.");
    throw error;
  }
  return data as string;
}

export async function finishRun(runId: string, output: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.rpc("finish_run", { _run: runId, _output: output || "(empty)" });
}

export async function refundRun(runId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.rpc("refund_run", { _run: runId });
}

/** Maps upstream gateway errors to the user-safe message + status. */
export function gatewayErrorMessage(err: unknown): { status: number; message: string } {
  const status = (err as { statusCode?: number })?.statusCode ?? 500;
  if (status === 429) return { status, message: "AI is busy right now. Please try again in a moment." };
  if (status === 402) return { status, message: "AI usage limit reached for this workspace." };
  if (status === 403) return { status, message: "This request was declined by the AI provider." };
  return { status: 500, message: "The AI couldn't finish that request. Your credits were refunded." };
}

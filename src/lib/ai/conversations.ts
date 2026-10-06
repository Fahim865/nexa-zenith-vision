import { supabase } from "@/integrations/supabase/client";
import type { UIMessage } from "ai";

export interface ConversationRow {
  id: string;
  title: string;
  updated_at: string;
  messages?: UIMessage[];
}

export async function listConversations(): Promise<ConversationRow[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as ConversationRow[];
}

export async function getConversation(id: string): Promise<ConversationRow | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, updated_at, messages")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as ConversationRow | null;
}

export async function createConversation(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId })
    .select("id")
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function deleteConversation(id: string) {
  const { error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) throw error;
}

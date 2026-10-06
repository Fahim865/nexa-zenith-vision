import { Link } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { Button } from "@/components/workspace/ui";

export default function AiChatLauncher() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <Bot className="mx-auto text-primary" size={24} />
      <h2 className="mt-3 font-display text-lg">AI Chat lives in your AI workspace</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Saved conversations, shared credits and history across every AI tool.
      </p>
      <Link to="/ai" className="mt-5 inline-block">
        <Button>Open AI workspace</Button>
      </Link>
    </div>
  );
}

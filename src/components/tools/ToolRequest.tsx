import { useEffect, useState } from "react";
import { CheckCircle2, Lightbulb, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button, ErrorNote, Field, TextArea, TextInput } from "@/components/workspace/ui";
import { cn } from "@/lib/utils";

export function ToolRequestButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn("inline-flex items-center gap-1.5", className)}>
        <Lightbulb size={14} aria-hidden="true" /> Request a tool
      </button>
      {open ? <ToolRequestModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ToolRequestModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [toolName, setToolName] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("tool_requests").insert({
      tool_name: toolName.trim(),
      details: details.trim() || null,
      email: email.trim() || null,
      user_id: user?.id ?? null,
    });
    if (error) setError("Something went wrong sending your suggestion. Please try again.");
    else setDone(true);
    setBusy(false);
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-strong depth-shadow w-full max-w-md rounded-2xl p-6" role="dialog" aria-label="Request a tool">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Lightbulb size={17} className="text-secondary" aria-hidden="true" /> Request a tool
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us what to build next — the best suggestions go straight into the roadmap.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border/70 text-muted-foreground hover:text-foreground"
          >
            <X size={15} />
          </button>
        </div>

        {done ? (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
            <CheckCircle2 size={22} className="mx-auto text-primary" aria-hidden="true" />
            <p className="mt-2 font-display text-sm">Thanks — suggestion received!</p>
            <p className="mt-1 text-xs text-muted-foreground">We read every request and pick the most wanted ones first.</p>
            <Button variant="ghost" className="mt-4" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <Field label="Tool idea" hint="e.g. “Invoice generator”, “YouTube thumbnail resizer”">
              <TextInput required maxLength={80} value={toolName} onChange={(e) => setToolName(e.target.value)} />
            </Field>
            <Field label="Details (optional)">
              <TextArea
                className="min-h-[90px]"
                maxLength={1000}
                placeholder="What should it do? Who is it for?"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Field>
            <Field label="Your email (optional)" hint="Only so we can tell you when it ships.">
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            {error ? <ErrorNote>{error}</ErrorNote> : null}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={onClose} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy || !toolName.trim()}>
                {busy ? "Sending…" : "Send suggestion"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import { Server, ShieldCheck } from "lucide-react";

/** Shown on tools that process everything locally in the browser. */
export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs text-muted-foreground">
      <ShieldCheck size={14} className="shrink-0 text-primary" aria-hidden="true" />
      <span>
        <span className="font-medium text-foreground">100% private ·</span> runs entirely in your browser — your
        files and data never leave your device.
      </span>
    </div>
  );
}

/** Shown on tools that run on NEXA's servers (AI tools). */
export function ServerBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-2 text-xs text-muted-foreground">
      <Server size={14} className="shrink-0 text-secondary" aria-hidden="true" />
      <span>
        <span className="font-medium text-foreground">Secured server run ·</span> processed on NEXA's AI servers —
        your sign-in and credits are verified server-side.
      </span>
    </div>
  );
}

import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

/** One-click pin/unpin for a tool. Safe to use inside a Link (never navigates). */
export function PinButton({ slug, className }: { slug: string; className?: string }) {
  const { has, toggle } = useFavorites();
  const pinned = has(slug);
  return (
    <button
      type="button"
      aria-pressed={pinned}
      aria-label={pinned ? "Remove from pinned tools" : "Pin this tool for quick access"}
      title={pinned ? "Unpin" : "Pin for quick access"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
        pinned && "border-primary/60 text-primary",
        className,
      )}
    >
      <Pin size={12} className={cn(pinned && "fill-current")} />
    </button>
  );
}

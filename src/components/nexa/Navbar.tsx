import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, X, Zap } from "lucide-react";
import { MagneticButton } from "./motion-primitives";
import { CommandPalette, useCommandPalette } from "@/components/tools/CommandPalette";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Tools", to: "/tools" as const },
  { label: "Categories", to: "/categories" as const },
  { label: "Credits", to: "/dashboard" as const },
];

const ANCHORS = [
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/#about" },
];

export function NexaLogo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <span
        className="grid h-9 w-9 place-items-center rounded-xl font-display text-[15px] font-bold text-primary-foreground"
        style={{
          background: "linear-gradient(135deg, var(--secondary), var(--primary))",
          boxShadow: "var(--glow-primary)",
        }}
      >
        N
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-semibold tracking-tight">NEXA</span>
        <span className="block text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          Powered by FMXAI
        </span>
      </span>
    </Link>
  );
}

export function Navbar({ credits = 100 }: { credits?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const palette = useCommandPalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls =
    "group relative rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground";
  const underline =
    "absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled ? "glass-strong depth-shadow" : "glass",
          )}
        >
          <NexaLogo />

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} className={linkCls} activeProps={{ className: "text-foreground" }}>
                {l.label}
                <span className={underline} />
              </Link>
            ))}
            {ANCHORS.map((l) => (
              <a key={l.label} href={l.href} className={linkCls}>
                {l.label}
                <span className={underline} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => palette.setOpen(true)}
              aria-label="Search tools"
              className="flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Search size={13} />
              <span className="hidden lg:inline">Search tools</span>
              <kbd className="hidden rounded border border-border px-1 text-[10px] lg:inline">⌘K</kbd>
            </button>

            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1.5 sm:flex">
              <Zap size={13} className="text-secondary" />
              <span className="tabular font-display text-sm">{credits}</span>
              <span className="text-xs text-muted-foreground">/100 today</span>
            </div>

            <Link to="/tools" className="hidden sm:block">
              <MagneticButton
                className="rounded-full px-4 py-2 text-sm font-medium text-primary-foreground"
                style={{
                  background: "linear-gradient(135deg, var(--secondary), var(--primary))",
                  boxShadow: "var(--glow-primary)",
                }}
              >
                Open Tools
              </MagneticButton>
            </Link>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 text-muted-foreground md:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>

        {open ? (
          <div className="glass-strong depth-shadow mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {ANCHORS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <CommandPalette open={palette.open} onClose={() => palette.setOpen(false)} />
    </>
  );
}

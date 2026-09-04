import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { MagneticButton } from "./motion-primitives";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Tools", href: "/#tools" },
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
      <span className="font-display text-lg font-semibold tracking-tight">NEXA</span>
    </Link>
  );
}

export function Navbar({ credits = 100 }: { credits?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
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
            <a
              key={l.label}
              href={l.href}
              className="group relative rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          <Link
            to="/dashboard"
            className="group relative rounded-lg px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Credits
            <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-primary/70 transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1.5 sm:flex">
            <Zap size={13} className="text-secondary" />
            <span className="tabular font-display text-sm">{credits}</span>
            <span className="text-xs text-muted-foreground">/100 today</span>
          </div>

          <Link to="/dashboard" className="hidden sm:block">
            <MagneticButton
              className="rounded-full px-4 py-2 text-sm font-medium text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, var(--secondary), var(--primary))",
                boxShadow: "var(--glow-primary)",
              }}
            >
              Get Started
            </MagneticButton>
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 text-muted-foreground md:hidden"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="glass-strong depth-shadow mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2/60 hover:text-foreground"
          >
            Credits
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-primary"
          >
            Get Started
          </Link>
        </div>
      ) : null}
    </header>
  );
}

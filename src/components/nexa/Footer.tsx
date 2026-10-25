import { NexaLogo, ToolRequestFooterButton } from "./Navbar";
import { ToolRequestButton } from "@/components/tools/ToolRequest";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-surface/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <NexaLogo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            One intelligent workspace for calculators, text, image, PDF and AI tools.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="/#tools" className="transition-colors hover:text-foreground">
            Tools
          </a>
          <a href="/#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <a href="/#about" className="transition-colors hover:text-foreground">
            About
          </a>
          <ToolRequestButton className="transition-colors hover:text-foreground" />
          <Link to="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NEXA. All rights reserved.
      </div>
    </footer>
  );
}

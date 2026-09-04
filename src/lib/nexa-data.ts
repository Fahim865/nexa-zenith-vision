import {
  Calculator,
  Percent,
  CalendarDays,
  KeyRound,
  Code2,
  Type,
  Image as ImageIcon,
  Scissors,
  FileStack,
  StickyNote,
  Timer,
  Wand2,
  Sparkles,
  Languages,
  Video,
  Hash,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "AI"
  | "Calculators"
  | "Text"
  | "Image"
  | "PDF"
  | "Productivity"
  | "Creator";

export interface NexaTool {
  id: string;
  name: string;
  desc: string;
  category: ToolCategory;
  credits: number;
  kind: "ai" | "local";
  icon: LucideIcon;
  demo?: boolean;
  featured?: boolean;
  comingSoon?: boolean;
}

export const TOOLS: NexaTool[] = [
  { id: "calculator", name: "Calculator", desc: "Everyday arithmetic, done fast and right.", category: "Calculators", credits: 1, kind: "local", icon: Calculator, demo: true },
  { id: "bmi", name: "BMI Calculator", desc: "Enter height and weight, get your BMI.", category: "Calculators", credits: 1, kind: "local", icon: Percent },
  { id: "age", name: "Age Calculator", desc: "Exact age in years, months, and days.", category: "Calculators", credits: 1, kind: "local", icon: CalendarDays },
  { id: "password", name: "Password Generator", desc: "Strong passwords, generated on your device.", category: "Text", credits: 1, kind: "local", icon: KeyRound, demo: true },
  { id: "json", name: "JSON Formatter", desc: "Paste messy JSON, get it formatted and validated.", category: "Text", credits: 1, kind: "local", icon: Code2 },
  { id: "case", name: "Case Converter", desc: "Switch between upper, lower, and title case.", category: "Text", credits: 1, kind: "local", icon: Type },
  { id: "compressor", name: "Image Compressor", desc: "Shrink file size without losing quality.", category: "Image", credits: 1, kind: "local", icon: ImageIcon },
  { id: "bg-remover", name: "Background Remover", desc: "Cut a subject out from its background.", category: "Image", credits: 0, kind: "local", icon: Scissors, comingSoon: true },
  { id: "pdf-merge", name: "PDF Merge", desc: "Combine several PDFs into one file.", category: "PDF", credits: 1, kind: "local", icon: FileStack },
  { id: "notes", name: "Notes", desc: "Quick notes that stay on this device.", category: "Productivity", credits: 1, kind: "local", icon: StickyNote },
  { id: "pomodoro", name: "Pomodoro Timer", desc: "Focused work in timed sessions.", category: "Productivity", credits: 1, kind: "local", icon: Timer },
  { id: "summarizer", name: "AI Summarizer", desc: "Turn long text into a short summary.", category: "AI", credits: 10, kind: "ai", icon: Wand2, featured: true },
  { id: "rewriter", name: "AI Rewriter", desc: "Rewrite a passage in a different tone.", category: "AI", credits: 5, kind: "ai", icon: Sparkles },
  { id: "translator", name: "AI Translator", desc: "Translate text between languages.", category: "AI", credits: 10, kind: "ai", icon: Languages },
  { id: "yt-title", name: "YouTube Title Generator", desc: "A few title options for your next video.", category: "Creator", credits: 5, kind: "ai", icon: Video },
  { id: "hashtag", name: "Hashtag Generator", desc: "Relevant hashtags for a caption or post.", category: "Creator", credits: 5, kind: "ai", icon: Hash },
];

export const CATEGORIES = [
  "All",
  "AI",
  "Calculators",
  "Text",
  "Image",
  "PDF",
  "Productivity",
  "Creator",
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

export interface NexaPlan {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  credits: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export const PLANS: NexaPlan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Everything essential, no card required.",
    monthly: 0,
    annual: 0,
    credits: "100 credits / day",
    features: ["All local tools", "Basic AI tools", "1 workspace", "Community support"],
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For people who live inside their tools.",
    monthly: 12,
    annual: 9,
    credits: "5,000 credits / month",
    features: [
      "Every tool unlocked",
      "Priority AI models",
      "History & saved presets",
      "Unlimited workspaces",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    tagline: "Shared credits and shared context.",
    monthly: 29,
    annual: 24,
    credits: "20,000 pooled credits / month",
    features: [
      "Everything in Pro",
      "Shared credit pool",
      "Roles & permissions",
      "Usage analytics",
      "Priority support",
    ],
    cta: "Start Team trial",
  },
];

import {
  Sparkles,
  Image as ImageIcon,
  Video,
  AudioLines,
  FileText,
  FileStack,
  Type,
  Code2,
  Calculator,
  ArrowLeftRight,
  Timer,
  Clapperboard,
  Share2,
  Search,
  Megaphone,
  Briefcase,
  Database,
  FolderCog,
  Palette,
  GraduationCap,
  ShieldCheck,
  Globe,
  Wand2,
  Wrench,
} from "lucide-react";
import type { CategoryMeta, CategoryId } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  { id: "ai", name: "AI", slug: "ai", blurb: "Writing, analysis and generation powered by FMXAI.", icon: Sparkles },
  { id: "image", name: "Image", slug: "image", blurb: "Compress, resize, convert and clean up images.", icon: ImageIcon },
  { id: "video", name: "Video", slug: "video", blurb: "Cut, convert, compress and caption video.", icon: Video },
  { id: "audio", name: "Audio", slug: "audio", blurb: "Convert, trim, clean and transcribe audio.", icon: AudioLines },
  { id: "pdf", name: "PDF", slug: "pdf", blurb: "Merge, split, rotate and organise PDF files.", icon: FileText },
  { id: "documents", name: "Documents", slug: "documents", blurb: "Convert and tidy office documents.", icon: FileStack },
  { id: "text", name: "Text", slug: "text", blurb: "Count, clean, convert and reshape text.", icon: Type },
  { id: "developer", name: "Developer", slug: "developer", blurb: "Formatters, encoders and everyday dev utilities.", icon: Code2 },
  { id: "calculators", name: "Calculators", slug: "calculators", blurb: "Everyday, health and money calculators.", icon: Calculator },
  { id: "converters", name: "Converters", slug: "converters", blurb: "Units, measures and data conversions.", icon: ArrowLeftRight },
  { id: "productivity", name: "Productivity", slug: "productivity", blurb: "Notes, timers, planners and focus tools.", icon: Timer },
  { id: "creator", name: "Creator", slug: "creator", blurb: "Titles, scripts, hooks and captions.", icon: Clapperboard },
  { id: "social", name: "Social Media", slug: "social-media", blurb: "Posts, captions and platform-ready assets.", icon: Share2 },
  { id: "seo", name: "SEO", slug: "seo", blurb: "Meta tags, schema, keywords and previews.", icon: Search },
  { id: "marketing", name: "Marketing", slug: "marketing", blurb: "Ad copy, campaigns and tracking links.", icon: Megaphone },
  { id: "business", name: "Business", slug: "business", blurb: "Invoices, quotes, margins and documents.", icon: Briefcase },
  { id: "data", name: "Data", slug: "data", blurb: "Clean, convert and analyse structured data.", icon: Database },
  { id: "files", name: "File Tools", slug: "file-tools", blurb: "Convert, inspect and organise any file.", icon: FolderCog },
  { id: "design", name: "Design", slug: "design", blurb: "Colour, palettes and visual assets.", icon: Palette },
  { id: "education", name: "Education", slug: "education", blurb: "Study, research and teaching helpers.", icon: GraduationCap },
  { id: "security", name: "Security", slug: "security", blurb: "Passwords, hashes and privacy utilities.", icon: ShieldCheck },
  { id: "web", name: "Web Tools", slug: "web-tools", blurb: "URLs, headers, previews and page checks.", icon: Globe },
  { id: "generators", name: "Generators", slug: "generators", blurb: "Make codes, names, text and placeholders.", icon: Wand2 },
  { id: "utilities", name: "Utilities", slug: "utilities", blurb: "Small helpers that save a lot of time.", icon: Wrench },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  CategoryMeta
>;

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<
  string,
  CategoryMeta
>;

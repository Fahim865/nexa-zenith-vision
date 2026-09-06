import type { LucideIcon } from "lucide-react";

/** Honest lifecycle state for a tool. Never mark something live that isn't. */
export type ToolStatus = "live" | "beta" | "soon";

export type CategoryId =
  | "ai"
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "documents"
  | "text"
  | "developer"
  | "calculators"
  | "converters"
  | "productivity"
  | "creator"
  | "social"
  | "seo"
  | "marketing"
  | "business"
  | "data"
  | "files"
  | "design"
  | "education"
  | "security"
  | "web"
  | "generators"
  | "utilities";

export type ToolIO = "text" | "number" | "file" | "image" | "pdf" | "audio" | "video" | "none";

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategoryId;
  subcategory?: string;
  icon: LucideIcon;
  tags: string[];
  status: ToolStatus;
  featured?: boolean;
  popular?: boolean;
  trending?: boolean;
  isNew?: boolean;
  premium?: boolean;
  /** Credit cost per successful run. 0 = free, runs on device. */
  credits: number;
  inputType: ToolIO;
  outputType: ToolIO;
  supportedFormats?: string[];
  /** Where the work happens. Server tools stay "soon" until the backend lands. */
  provider: "device" | "server";
  seoTitle?: string;
  seoDescription?: string;
  /** Optional long-form copy rendered on the tool page for search engines. */
  about?: string;
  faq?: { q: string; a: string }[];
}

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  slug: string;
  blurb: string;
  icon: LucideIcon;
}

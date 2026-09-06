import {
  Type,
  Hash,
  AlignLeft,
  Clock,
  CaseSensitive,
  Eraser,
  Rows3,
  ArrowDownAZ,
  FlipHorizontal2,
  Replace,
  RemoveFormatting,
  FileText,
  Link2,
} from "lucide-react";
import { def } from "./def";
import type { ToolMeta } from "../types";

const base = { category: "text", provider: "device", credits: 0, inputType: "text", outputType: "text" } as const;

export const TEXT_TOOLS: ToolMeta[] = [
  def({
    ...base,
    name: "Word Counter",
    slug: "word-counter",
    description: "Count words, characters, sentences, paragraphs and reading time as you type.",
    icon: Type,
    tags: ["word", "count", "essay", "writing", "characters"],
    status: "live",
    featured: true,
    popular: true,
    about:
      "Paste or type any text and NEXA counts words, characters with and without spaces, sentences, paragraphs, unique words and estimated reading and speaking time. Everything runs on your device, so nothing is uploaded.",
    faq: [
      { q: "Is my text uploaded anywhere?", a: "No. The counter runs entirely in your browser and your text never leaves your device." },
      { q: "How is reading time calculated?", a: "At an average silent reading speed of 225 words per minute, and 150 words per minute for speaking." },
    ],
  }),
  def({ ...base, name: "Character Counter", slug: "character-counter", description: "Count characters with and without spaces, ideal for limits and bios.", icon: Hash, tags: ["characters", "limit", "twitter", "bio"], status: "live", popular: true }),
  def({ ...base, name: "Sentence Counter", slug: "sentence-counter", description: "Count sentences and paragraphs in any block of text.", icon: AlignLeft, tags: ["sentence", "paragraph", "count"], status: "live" }),
  def({ ...base, name: "Reading Time Calculator", slug: "reading-time", description: "Estimate how long your text takes to read or read aloud.", icon: Clock, tags: ["reading", "time", "blog", "speech"], status: "live" }),
  def({ ...base, name: "Case Converter", slug: "case-converter", description: "Switch text between upper, lower, title, sentence, camel, snake and kebab case.", icon: CaseSensitive, tags: ["uppercase", "lowercase", "title case", "camelCase"], status: "live", popular: true }),
  def({ ...base, name: "Text Cleaner", slug: "text-cleaner", description: "Strip line breaks, extra spaces, punctuation, numbers or HTML from text.", icon: Eraser, tags: ["clean", "strip", "format"], status: "live" }),
  def({ ...base, name: "Duplicate Line Remover", slug: "remove-duplicate-lines", description: "Remove repeated lines from a list, keeping the original order.", icon: Rows3, tags: ["duplicate", "unique", "list", "dedupe"], status: "live" }),
  def({ ...base, name: "Text Sorter", slug: "text-sorter", description: "Sort lines alphabetically, by length or reverse, with optional dedupe.", icon: ArrowDownAZ, tags: ["sort", "alphabetical", "list"], status: "live" }),
  def({ ...base, name: "Text Reverser", slug: "text-reverser", description: "Reverse text by character, word or line.", icon: FlipHorizontal2, tags: ["reverse", "mirror", "flip"], status: "live" }),
  def({ ...base, name: "Find and Replace", slug: "find-and-replace", description: "Replace every match in your text, with optional case sensitivity and regex.", icon: Replace, tags: ["find", "replace", "regex", "bulk edit"], status: "live" }),
  def({ ...base, name: "Whitespace Cleaner", slug: "whitespace-cleaner", description: "Trim lines and collapse repeated spaces, tabs and blank lines.", icon: RemoveFormatting, tags: ["whitespace", "trim", "spaces"], status: "live" }),
  def({ ...base, name: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", description: "Generate placeholder paragraphs, sentences or words for mockups.", icon: FileText, tags: ["placeholder", "dummy text", "design"], status: "live", category: "generators" }),
  def({ ...base, name: "Slug Generator", slug: "slug-generator", description: "Turn any title into a clean, URL-safe slug.", icon: Link2, tags: ["url", "seo", "permalink"], status: "live", category: "seo" }),
];

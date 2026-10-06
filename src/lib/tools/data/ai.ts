import {
  Bot, PenLine, Repeat2, ScrollText, Languages, SpellCheck, UserRound, Search, Code2, Bug,
  Lightbulb, Mail, FileUser, FileSignature, BookOpen, Presentation, Table2, BarChart3, TrendingUp, Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { def } from "./def";
import type { ToolMeta, ToolStatus } from "../types";
import { AI_CREDIT_COST } from "@/lib/ai/tools";

type Row = [name: string, slug: string, icon: LucideIcon, description: string, tags: string[], status: ToolStatus, flags?: { featured?: boolean; popular?: boolean; trending?: boolean }];

const ROWS: Row[] = [
  ["AI Chat", "ai-chat", Bot, "Chat with NEXA's AI and keep every conversation saved in your workspace.", ["chat", "assistant", "ask", "gpt"], "live", { featured: true, popular: true, trending: true }],
  ["AI Writer", "ai-writer", PenLine, "Draft articles, posts and copy from a short brief, in the tone you choose.", ["write", "blog", "content", "copy"], "live", { featured: true, popular: true }],
  ["AI Rewriter", "ai-rewriter", Repeat2, "Rewrite any passage in a different tone or length without losing meaning.", ["rewrite", "paraphrase", "tone"], "live", { popular: true }],
  ["AI Summarizer", "ai-summarizer", ScrollText, "Turn long text into a TL;DR and key points you can trust.", ["summary", "tldr", "summarize", "article"], "live", { featured: true, popular: true, trending: true }],
  ["AI Translator", "ai-translator", Languages, "Translate text into 16 languages while keeping tone and formatting.", ["translate", "language", "bengali", "spanish"], "live", { popular: true }],
  ["AI Grammar Checker", "ai-grammar-checker", SpellCheck, "Fix grammar, spelling and clarity, with a list of what changed.", ["grammar", "proofread", "spelling"], "live", { popular: true }],
  ["AI Humanizer", "ai-humanizer", UserRound, "Make stiff, machine-sounding text read naturally.", ["humanize", "natural", "rewrite"], "beta"],
  ["AI Research Assistant", "ai-research-assistant", Search, "A structured overview of any topic: concepts, viewpoints and open questions.", ["research", "study", "topic"], "beta"],
  ["AI Coding Assistant", "ai-coding-assistant", Code2, "Explain, write and refactor code in any language.", ["code", "programming", "developer"], "live", { trending: true }],
  ["AI Debugger", "ai-debugger", Bug, "Paste an error and get the likely cause and a concrete fix.", ["debug", "error", "bug", "fix"], "live"],
  ["AI Prompt Generator", "ai-prompt-generator", Lightbulb, "Turn a rough idea into a precise, structured AI prompt.", ["prompt", "chatgpt", "ai"], "live"],
  ["AI Email Generator", "ai-email-generator", Mail, "Clear, ready-to-send emails from a few notes.", ["email", "outreach", "reply"], "live", { popular: true }],
  ["AI Resume Generator", "ai-resume-generator", FileUser, "An ATS-friendly resume built from your real experience.", ["resume", "cv", "job"], "beta"],
  ["AI Cover Letter Generator", "ai-cover-letter-generator", FileSignature, "A tailored cover letter that matches you to the job.", ["cover letter", "job", "application"], "live"],
  ["AI Essay Generator", "ai-essay-generator", BookOpen, "Structured essays with intro, sections and conclusion.", ["essay", "student", "school"], "live"],
  ["AI Presentation Generator", "ai-presentation-generator", Presentation, "Slide-by-slide content with speaker notes from any topic.", ["slides", "presentation", "deck"], "beta"],
  ["AI Table Generator", "ai-table-generator", Table2, "Create clean tables from a plain description.", ["table", "markdown", "compare"], "live"],
  ["AI Data Analyzer", "ai-data-analyzer", BarChart3, "Paste data and get patterns, highlights and insights in plain words.", ["data", "csv", "analysis"], "beta"],
  ["AI SEO Assistant", "ai-seo-assistant", TrendingUp, "Keywords, meta tags, headings and an outline for any page.", ["seo", "keywords", "meta"], "live"],
  ["AI Business Assistant", "ai-business-assistant", Briefcase, "Proposals, policies and plans written in clear business language.", ["business", "proposal", "plan"], "live"],
];

export const AI_TOOLS: ToolMeta[] = ROWS.map(([name, slug, icon, description, tags, status, flags]) =>
  def({
    name,
    slug,
    icon,
    description,
    tags,
    status,
    ...flags,
    category: "ai",
    provider: "server",
    credits: AI_CREDIT_COST,
    inputType: "text",
    outputType: "text",
    about: `${name} runs on NEXA's AI engine, powered by FMXAI. Each run costs ${AI_CREDIT_COST} credits and is saved to your workspace history so you can reuse it later.`,
    faq: [
      { q: `Is ${name} free?`, a: `New accounts get 50 free credits. Each ${name} run uses ${AI_CREDIT_COST}.` },
      { q: "Is my text stored?", a: "Your input and result are saved privately to your own history. You can delete them from the dashboard." },
    ],
  }),
);

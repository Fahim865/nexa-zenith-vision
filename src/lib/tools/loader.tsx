import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { TEXT_CONFIGS } from "@/tools/text/configs";
import { CALC_CONFIGS, UNIT_CONFIGS } from "@/tools/calc/configs";
import { AI_TOOL_CONFIGS } from "@/lib/ai/tools";
import type { ToolMeta } from "./types";

export interface ToolComponentProps {
  tool: ToolMeta;
}

type LazyTool = LazyExoticComponent<ComponentType<ToolComponentProps>>;

const TextTool = lazy(() => import("@/tools/text/TextTool")) as LazyTool;
const CalcTool = lazy(() => import("@/tools/calc/CalcTool")) as LazyTool;
const UnitTool = lazy(() => import("@/tools/calc/UnitTool")) as LazyTool;
const CalculatorTool = lazy(() => import("@/tools/calc/CalculatorTool")) as LazyTool;
const ImageTool = lazy(() => import("@/tools/image/ImageTool")) as LazyTool;
const QrTool = lazy(() => import("@/tools/image/QrTool")) as LazyTool;
const PdfTool = lazy(() => import("@/tools/pdf/PdfTool")) as LazyTool;
const ProductivityTool = lazy(() => import("@/tools/productivity/ProductivityTool")) as LazyTool;
const AiTool = lazy(() => import("@/tools/ai/AiTool")) as LazyTool;
const AiChatLauncher = lazy(() => import("@/tools/ai/AiChatLauncher")) as LazyTool;
const PasswordTool = lazy(() => import("@/tools/security/PasswordTool")) as LazyTool;

const EXPLICIT: Record<string, LazyTool> = {
  "ai-chat": AiChatLauncher,
  calculator: CalculatorTool,
  "scientific-calculator": CalculatorTool,
  "qr-code-generator": QrTool,
  "password-generator": PasswordTool,
  notes: ProductivityTool,
  "todo-list": ProductivityTool,
  "pomodoro-timer": ProductivityTool,
  stopwatch: ProductivityTool,
  "countdown-timer": ProductivityTool,
  "random-picker": ProductivityTool,
  "image-compressor": ImageTool,
  "image-resizer": ImageTool,
  "image-converter": ImageTool,
  "image-rotator": ImageTool,
  "image-watermark": ImageTool,
  "image-metadata-cleaner": ImageTool,
  "color-picker": ImageTool,
  "favicon-generator": ImageTool,
  "image-to-pdf": ImageTool,
  "pdf-merge": PdfTool,
  "pdf-split": PdfTool,
  "pdf-rotate": PdfTool,
  "pdf-page-organizer": PdfTool,
};

/** Returns the lazy workspace component for a tool slug, or null when not built yet. */
export function getToolComponent(slug: string): LazyTool | null {
  if (EXPLICIT[slug]) return EXPLICIT[slug]!;
  if (AI_TOOL_CONFIGS[slug]) return AiTool;
  if (TEXT_CONFIGS[slug]) return TextTool;
  if (CALC_CONFIGS[slug]) return CalcTool;
  if (UNIT_CONFIGS[slug]) return UnitTool;
  return null;
}

/** True when a tool has a real working implementation in the browser. */
export function isToolImplemented(slug: string) {
  return getToolComponent(slug) !== null;
}

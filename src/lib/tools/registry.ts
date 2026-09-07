import { TEXT_TOOLS } from "./data/text";
import { DEVELOPER_TOOLS } from "./data/developer";
import { CALCULATOR_TOOLS, CONVERTER_TOOLS } from "./data/calculators";
import { IMAGE_TOOLS, PDF_TOOLS } from "./data/media";
import { PRODUCTIVITY_TOOLS } from "./data/productivity";
import { SOON_TOOLS } from "./data/soon";
import { CATEGORIES, CATEGORY_BY_ID } from "./categories";
import type { CategoryId, ToolMeta } from "./types";

const ALL = [
  ...TEXT_TOOLS,
  ...DEVELOPER_TOOLS,
  ...CALCULATOR_TOOLS,
  ...CONVERTER_TOOLS,
  ...IMAGE_TOOLS,
  ...PDF_TOOLS,
  ...PRODUCTIVITY_TOOLS,
  ...SOON_TOOLS,
];

/** Registry is de-duplicated by slug: first definition wins. */
export const TOOLS: ToolMeta[] = ALL.filter(
  (t, i) => ALL.findIndex((x) => x.slug === t.slug) === i,
);

export const TOOL_BY_SLUG: Record<string, ToolMeta> = Object.fromEntries(
  TOOLS.map((t) => [t.slug, t]),
);

export const LIVE_TOOLS = TOOLS.filter((t) => t.status !== "soon");

export function getTool(slug: string): ToolMeta | undefined {
  return TOOL_BY_SLUG[slug];
}

export function toolsByCategory(id: CategoryId): ToolMeta[] {
  return TOOLS.filter((t) => t.category === id).sort(rankTools);
}

export function categoryCount(id: CategoryId) {
  const list = TOOLS.filter((t) => t.category === id);
  return { total: list.length, live: list.filter((t) => t.status !== "soon").length };
}

/** Live tools first, then popular, then alphabetical. */
export function rankTools(a: ToolMeta, b: ToolMeta) {
  const s = (t: ToolMeta) => (t.status === "live" ? 0 : t.status === "beta" ? 1 : 2);
  if (s(a) !== s(b)) return s(a) - s(b);
  if (!!b.popular !== !!a.popular) return b.popular ? 1 : -1;
  return a.name.localeCompare(b.name);
}

export const FEATURED_TOOLS = TOOLS.filter((t) => t.featured);
export const POPULAR_TOOLS = TOOLS.filter((t) => t.popular && t.status !== "soon");
export const NEW_TOOLS = LIVE_TOOLS.slice(-8);

export const CATEGORIES_WITH_COUNTS = CATEGORIES.map((c) => ({ ...c, ...categoryCount(c.id) }));

export const TOTALS = {
  all: TOOLS.length,
  live: LIVE_TOOLS.length,
  categories: CATEGORIES.length,
};

/** Forgiving subsequence match so "imgcmp" still finds Image Compressor. */
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  const idx = t.indexOf(q);
  if (idx === 0) return 1000;
  if (idx > 0) return 700 - idx;
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      streak += 1;
      score += 10 + streak * 2;
      qi += 1;
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? score : -1;
}

export interface SearchHit {
  tool: ToolMeta;
  score: number;
}

export function searchTools(query: string, limit = 20): SearchHit[] {
  const q = query.trim();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const tool of TOOLS) {
    const nameScore = fuzzyScore(q, tool.name);
    const tagScore = Math.max(-1, ...tool.tags.map((tag) => fuzzyScore(q, tag) * 0.7));
    const catScore = fuzzyScore(q, CATEGORY_BY_ID[tool.category].name) * 0.5;
    const descScore = tool.description.toLowerCase().includes(q.toLowerCase()) ? 200 : -1;
    const best = Math.max(nameScore, tagScore, catScore, descScore);
    if (best > 0) {
      hits.push({ tool, score: best + (tool.status === "live" ? 120 : 0) + (tool.popular ? 40 : 0) });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function relatedTools(tool: ToolMeta, limit = 6): ToolMeta[] {
  const sameCat = TOOLS.filter((t) => t.slug !== tool.slug && t.category === tool.category);
  const tagged = TOOLS.filter(
    (t) => t.slug !== tool.slug && t.category !== tool.category && t.tags.some((x) => tool.tags.includes(x)),
  );
  return [...sameCat.sort(rankTools), ...tagged].slice(0, limit);
}

export { CATEGORIES, CATEGORY_BY_ID } from "./categories";
export { CATEGORY_BY_SLUG } from "./categories";
export type { ToolMeta, CategoryId } from "./types";

import type { ToolMeta } from "../types";

type ToolInput = Omit<ToolMeta, "id"> & { id?: string };

/** Small builder so tool entries stay short and consistent. */
export function def(t: ToolInput): ToolMeta {
  return {
    id: t.slug,
    seoTitle: `${t.name} — free online ${t.name.toLowerCase().includes("generator") ? "generator" : "tool"} | NEXA`,
    seoDescription: t.description,
    ...t,
  };
}

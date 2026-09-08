import { useMemo, useState } from "react";
import { Field, Select, TextInput, CopyButton, ErrorNote } from "@/components/workspace/ui";
import type { ToolMeta } from "@/lib/tools/types";
import { CALC_CONFIGS } from "./configs";

export default function CalcTool({ tool }: { tool: ToolMeta }) {
  const config = CALC_CONFIGS[tool.slug];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((config?.fields ?? []).map((f) => [f.key, String(f.def)])),
  );

  const results = useMemo(() => (config ? config.compute(values) : []), [config, values]);

  if (!config) return <ErrorNote>This calculator isn't wired up yet.</ErrorNote>;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="glass space-y-3 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-foreground">Values</h2>
        {config.fields.map((f) => (
          <Field key={f.key} label={f.label}>
            {f.type === "select" ? (
              <Select
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              >
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            ) : (
              <TextInput
                type={f.type === "date" ? "date" : f.type === "text" ? "text" : "number"}
                value={values[f.key] ?? ""}
                inputMode={f.type === "date" || f.type === "text" ? undefined : "decimal"}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            )}
          </Field>
        ))}
      </div>

      <div className="space-y-3">
        <div
          className="glass rounded-2xl p-5"
          style={{ boxShadow: "var(--glow-primary)" }}
          aria-live="polite"
        >
          <h2 className="text-sm font-semibold text-foreground">Result</h2>
          <dl className="mt-4 space-y-4">
            {results.map(([label, value], i) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
                <dd
                  className={
                    i === 0
                      ? "font-display text-2xl text-gradient sm:text-3xl"
                      : "font-display text-lg text-foreground"
                  }
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <CopyButton value={results.map(([l, v]) => `${l}: ${v}`).join("\n")} label="Copy results" />
        {config.note ? <p className="text-xs text-muted-foreground">{config.note}</p> : null}
      </div>
    </div>
  );
}

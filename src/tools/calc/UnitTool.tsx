import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button, CopyButton, ErrorNote, Field, Select, TextInput } from "@/components/workspace/ui";
import type { ToolMeta } from "@/lib/tools/types";
import { UNIT_CONFIGS, convertTemperature } from "./configs";

export default function UnitTool({ tool }: { tool: ToolMeta }) {
  const config = UNIT_CONFIGS[tool.slug];
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(config?.defFrom ?? "");
  const [to, setTo] = useState(config?.defTo ?? "");

  const units = useMemo(() => Object.keys(config?.units ?? {}), [config]);

  const result = useMemo(() => {
    if (!config) return 0;
    const v = Number(value) || 0;
    if (config.special === "temperature") return convertTemperature(v, from, to);
    const base = v * (config.units[from] ?? 1);
    return base / (config.units[to] ?? 1);
  }, [config, value, from, to]);

  if (!config) return <ErrorNote>This converter isn't wired up yet.</ErrorNote>;

  const pretty = Number.isFinite(result)
    ? result.toLocaleString(undefined, { maximumFractionDigits: 6 })
    : "—";

  return (
    <div className="space-y-5">
      <div className="glass grid items-end gap-4 rounded-2xl p-5 sm:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <Field label="From">
            <TextInput
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Field>
          <Select value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Convert from unit">
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
        </div>

        <Button
          variant="ghost"
          aria-label="Swap units"
          className="mb-1 self-center"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          <ArrowLeftRight size={16} />
        </Button>

        <div className="space-y-3">
          <Field label="To">
            <div
              className="rounded-lg border border-primary/30 bg-surface/60 px-3 py-2 font-display text-xl text-gradient"
              aria-live="polite"
            >
              {pretty}
            </div>
          </Field>
          <Select value={to} onChange={(e) => setTo(e.target.value)} aria-label="Convert to unit">
            {units.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </Select>
        </div>
      </div>

      <CopyButton value={`${value} ${from} = ${pretty} ${to}`} label="Copy conversion" />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {units
          .filter((u) => u !== from)
          .map((u) => {
            const v =
              config.special === "temperature"
                ? convertTemperature(Number(value) || 0, from, u)
                : ((Number(value) || 0) * (config.units[from] ?? 1)) / (config.units[u] ?? 1);
            return (
              <div key={u} className="glass flex items-center justify-between rounded-xl px-3 py-2 text-sm">
                <span className="text-muted-foreground">{u}</span>
                <span className="tabular text-foreground">
                  {v.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

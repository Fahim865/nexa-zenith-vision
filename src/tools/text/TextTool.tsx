import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  Button,
  CopyButton,
  ErrorNote,
  Field,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/workspace/ui";
import type { ToolMeta } from "@/lib/tools/types";
import { TEXT_CONFIGS, type Opts } from "./configs";

export default function TextTool({ tool }: { tool: ToolMeta }) {
  const config = TEXT_CONFIGS[tool.slug];
  const [input, setInput] = useState("");
  const [second, setSecond] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [opts, setOpts] = useState<Opts>(() =>
    Object.fromEntries((config?.fields ?? []).map((f) => [f.key, f.def])),
  );

  useEffect(() => {
    if (!config?.run) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await config.run!(input, opts, second);
        if (!cancelled) {
          setOutput(result);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setOutput("");
          setError(e instanceof Error ? e.message : "Something didn't work with that input.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input, second, opts, config]);

  const stats = useMemo(() => (config?.stats ? config.stats(input) : null), [config, input]);

  if (!config) return <ErrorNote>This tool isn't wired up yet.</ErrorNote>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {!config.generator ? (
          <Field label={config.inputLabel ?? "Input"}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.inputPlaceholder ?? "Paste your text here…"}
              aria-label={config.inputLabel ?? "Input"}
            />
          </Field>
        ) : null}

        {config.secondInput ? (
          <Field label={config.secondInput.label}>
            <TextArea
              value={second}
              onChange={(e) => setSecond(e.target.value)}
              placeholder={config.secondInput.placeholder ?? ""}
            />
          </Field>
        ) : null}

        {error ? <ErrorNote>{error}</ErrorNote> : null}

        {stats ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(([label, value]) => (
              <div key={label} className="glass rounded-xl px-3 py-4">
                <div className="font-display text-xl text-foreground">{value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Field label="Result">
            <TextArea readOnly value={output} placeholder="Your result appears here." aria-label="Result" />
          </Field>
        )}

        <div className="flex flex-wrap gap-2">
          {!stats ? <CopyButton value={output} label="Copy result" /> : <CopyButton value={input} label="Copy text" />}
          <Button
            variant="ghost"
            onClick={() => {
              setInput("");
              setSecond("");
              setOutput("");
              setError(null);
            }}
          >
            <RotateCcw size={15} />
            Reset
          </Button>
        </div>
      </div>

      {config.fields?.length ? (
        <aside className="glass h-fit space-y-3 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-foreground">Settings</h2>
          {config.fields.map((f) =>
            f.type === "toggle" ? (
              <Toggle
                key={f.key}
                label={f.label}
                checked={Boolean(opts[f.key])}
                onChange={(v) => setOpts((o) => ({ ...o, [f.key]: v }))}
              />
            ) : f.type === "select" ? (
              <Field key={f.key} label={f.label}>
                <Select
                  value={String(opts[f.key])}
                  onChange={(e) => setOpts((o) => ({ ...o, [f.key]: e.target.value }))}
                >
                  {f.options?.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : (
              <Field key={f.key} label={f.label}>
                <TextInput
                  type={f.type === "number" ? "number" : "text"}
                  value={String(opts[f.key])}
                  placeholder={f.placeholder ?? ""}
                  onChange={(e) =>
                    setOpts((o) => ({
                      ...o,
                      [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                />
              </Field>
            ),
          )}
        </aside>
      ) : null}
    </div>
  );
}

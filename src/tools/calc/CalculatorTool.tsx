import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/workspace/ui";
import type { ToolMeta } from "@/lib/tools/types";

/** Tiny safe expression evaluator — no eval, no Function constructor. */
function evaluate(expr: string): number {
  const tokens = expr
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, String(Math.PI))
    .replace(/(?<![a-z])e(?![a-z(])/g, String(Math.E))
    .match(/(\d+\.?\d*|\.\d+|[+\-*/^%()]|sin|cos|tan|log|ln|sqrt|abs)/g);
  if (!tokens) throw new Error("Nothing to calculate");

  let pos = 0;
  const peek = () => tokens[pos];
  const eat = (t?: string) => {
    if (t && tokens[pos] !== t) throw new Error(`Expected ${t}`);
    return tokens[pos++]!;
  };

  function parseExpr(): number {
    let v = parseTerm();
    while (peek() === "+" || peek() === "-") v = eat() === "+" ? v + parseTerm() : v - parseTerm();
    return v;
  }
  function parseTerm(): number {
    let v = parsePower();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = eat();
      const rhs = parsePower();
      v = op === "*" ? v * rhs : op === "/" ? v / rhs : v % rhs;
    }
    return v;
  }
  function parsePower(): number {
    const base = parseUnary();
    if (peek() === "^") {
      eat("^");
      return Math.pow(base, parsePower());
    }
    return base;
  }
  function parseUnary(): number {
    if (peek() === "-") { eat("-"); return -parseUnary(); }
    if (peek() === "+") { eat("+"); return parseUnary(); }
    const fns: Record<string, (n: number) => number> = {
      sin: Math.sin, cos: Math.cos, tan: Math.tan,
      log: Math.log10, ln: Math.log, sqrt: Math.sqrt, abs: Math.abs,
    };
    const t = peek();
    if (t && fns[t]) { eat(); eat("("); const v = parseExpr(); eat(")"); return fns[t]!(v); }
    if (t === "(") { eat("("); const v = parseExpr(); eat(")"); return v; }
    const num = Number(eat());
    if (Number.isNaN(num)) throw new Error("Unexpected input");
    return num;
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new Error("Check the expression");
  return result;
}

const BASIC = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "⌫", "="];
const SCI = ["sin(", "cos(", "tan(", "π", "ln(", "log(", "sqrt(", "^", "e", "%"];

export default function CalculatorTool({ tool }: { tool: ToolMeta }) {
  const scientific = tool.slug === "scientific-calculator";
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const compute = useCallback(() => {
    if (!expr.trim()) return;
    try {
      const value = evaluate(expr);
      const text = Number.isFinite(value) ? String(Number(value.toFixed(10))) : "—";
      setResult(text);
      setError(null);
      setHistory((h) => [`${expr} = ${text}`, ...h].slice(0, 12));
    } catch (e) {
      setError(e instanceof Error ? e.message : "That expression isn't valid.");
    }
  }, [expr]);

  const press = useCallback(
    (key: string) => {
      if (key === "C") { setExpr(""); setResult("0"); setError(null); return; }
      if (key === "⌫") { setExpr((s) => s.slice(0, -1)); return; }
      if (key === "=") { compute(); return; }
      setExpr((s) => s + key);
    },
    [compute],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (/^[0-9.+\-*/()^%]$/.test(e.key)) { setExpr((s) => s + e.key); e.preventDefault(); }
      else if (e.key === "Enter" || e.key === "=") { compute(); e.preventDefault(); }
      else if (e.key === "Backspace") { setExpr((s) => s.slice(0, -1)); e.preventDefault(); }
      else if (e.key === "Escape") { setExpr(""); setResult("0"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compute]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div className="glass rounded-2xl p-5">
        <div className="rounded-xl border border-border bg-background/60 p-4 text-right">
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="0"
            aria-label="Expression"
            className="w-full bg-transparent text-right font-mono text-sm text-muted-foreground outline-none"
          />
          <div className="mt-2 font-display text-3xl text-gradient tabular" aria-live="polite">
            {result}
          </div>
        </div>

        {error ? <p className="mt-3 text-xs text-destructive">{error}</p> : null}

        {scientific ? (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {SCI.map((k) => (
              <button
                key={k}
                onClick={() => press(k)}
                className="glass rounded-lg py-2 font-mono text-xs text-foreground transition-colors hover:border-primary/40"
              >
                {k.replace("(", "")}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-4 gap-2">
          {BASIC.map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className={cn(
                "rounded-lg py-3 font-display text-base transition-all",
                k === "=" ? "text-primary-foreground" : "glass text-foreground hover:border-primary/40",
                k === "C" && "text-destructive",
              )}
              style={
                k === "="
                  ? { background: "linear-gradient(135deg, var(--secondary), var(--primary))" }
                  : undefined
              }
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">History</h2>
          {history.length ? (
            <Button variant="ghost" onClick={() => setHistory([])}>Clear</Button>
          ) : null}
        </div>
        {history.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Your calculations appear here. Type on your keyboard or use the pad — Enter calculates.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {history.map((h, i) => (
              <li key={i}>
                <button
                  onClick={() => setExpr(h.split(" = ")[1] ?? "")}
                  className="w-full truncate rounded-lg px-3 py-2 text-left font-mono text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  {h}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import type { NexaTool } from "@/lib/nexa-data";

/** Live word counter demo (also used inline in the hero preview card). */
export function WordCounter() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const reading = Math.max(1, Math.round(words / 200));

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Paste or type text here…"
        className="w-full resize-none rounded-xl border border-border/70 bg-surface-2/50 p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
      />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { k: "Words", v: words },
          { k: "Characters", v: chars },
          { k: "Read time", v: `${reading}m` },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border/60 bg-surface-2/40 p-3">
            <div className="tabular font-display text-xl">{s.v}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "C", "0", ".", "+"];

export function CalculatorPanel({ onSpend }: { onSpend: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  const compute = (a: number, b: number, o: string) => {
    if (o === "+") return a + b;
    if (o === "−") return a - b;
    if (o === "×") return a * b;
    if (o === "÷") return b === 0 ? 0 : a / b;
    return b;
  };

  const press = (key: string) => {
    if (/[0-9]/.test(key)) {
      if (waiting) {
        setDisplay(key);
        setWaiting(false);
      } else setDisplay(display === "0" ? key : display + key);
      return;
    }
    if (key === ".") {
      if (waiting) {
        setDisplay("0.");
        setWaiting(false);
      } else if (!display.includes(".")) setDisplay(display + ".");
      return;
    }
    if (key === "C") {
      setDisplay("0");
      setPrev(null);
      setOp(null);
      setWaiting(false);
      return;
    }
    const value = parseFloat(display);
    if (prev === null) setPrev(value);
    else if (op) {
      const result = compute(prev, value, op);
      setDisplay(String(result));
      setPrev(result);
    }
    setWaiting(true);
    setOp(key);
  };

  const equals = () => {
    if (op && prev !== null) {
      const result = compute(prev, parseFloat(display), op);
      setDisplay(String(Math.round(result * 1e8) / 1e8));
      setPrev(null);
      setOp(null);
      setWaiting(true);
      onSpend();
    }
  };

  return (
    <div>
      <div className="rounded-xl border border-border/60 bg-surface-2/50 p-4 text-right">
        <div className="tabular truncate font-display text-3xl">{display}</div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className={`rounded-lg border border-border/60 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-surface-2/60 ${
              /[÷×−+]/.test(k) ? "text-secondary" : ""
            }`}
          >
            {k}
          </button>
        ))}
        <button
          onClick={equals}
          className="col-span-4 rounded-lg py-3 text-sm font-medium text-primary-foreground"
          style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))" }}
        >
          =
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Pressing “=” logs 1 credit, the way a completed calculation would.
      </p>
    </div>
  );
}

export function PasswordPanel({ onSpend }: { onSpend: () => void }) {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = "";
    if (options.lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()-_=+";
    if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let out = "";
    for (let i = 0; i < length; i++) out += charset[arr[i]! % charset.length];
    setResult(out);
    setCopied(false);
    onSpend();
  };

  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface-2/50 p-3">
        <span className="min-w-0 flex-1 truncate font-display text-[15px]">
          {result || <span className="text-muted-foreground">Your password will appear here</span>}
        </span>
        <button
          onClick={() => {
            if (!result) return;
            navigator.clipboard?.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          disabled={!result}
          aria-label="Copy password"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        >
          {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Length</span>
        <span className="tabular text-foreground">{length}</span>
      </div>
      <input
        type="range"
        min={8}
        max={40}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--secondary)]"
      />

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(Object.keys(options) as (keyof typeof options)[]).map((key) => (
          <label key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => setOptions((o) => ({ ...o, [key]: !o[key] }))}
              className="accent-[var(--primary)]"
            />
            {key[0]!.toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>

      <button
        onClick={generate}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-primary-foreground"
        style={{ background: "linear-gradient(135deg, var(--secondary), var(--primary))" }}
      >
        <RefreshCw size={14} /> Generate
      </button>
    </div>
  );
}

export function ToolPlaceholder({ tool }: { tool: NexaTool }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface-2/40 p-6">
      <p className="text-sm text-muted-foreground">
        {tool.comingSoon
          ? `${tool.name} is coming soon. It will appear here automatically once it ships.`
          : `Opening ${tool.name.toLowerCase()} gives you a full workspace with input, processing and download — using ${tool.credits} credits per run.`}
      </p>
      <div className="mt-5 space-y-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 rounded-full bg-surface-2"
            style={{
              width: `${100 - i * 18}%`,
              backgroundImage:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--primary) 16%, transparent), transparent)",
              backgroundSize: "220% 100%",
              animation: "nexa-shimmer 2.4s linear infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

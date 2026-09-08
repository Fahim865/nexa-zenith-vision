import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, CopyButton, Field, Toggle } from "@/components/workspace/ui";

const SETS = {
  lower: "abcdefghijkmnopqrstuvwxyz",
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  digits: "23456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
  ambiguous: "iloIO01",
};

export default function PasswordTool() {
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [password, setPassword] = useState("");

  const alphabet = useMemo(() => {
    let set = SETS.lower + (upper ? SETS.upper : "") + (digits ? SETS.digits : "") + (symbols ? SETS.symbols : "");
    if (!avoidAmbiguous) set += SETS.ambiguous;
    return set;
  }, [upper, digits, symbols, avoidAmbiguous]);

  const generate = useCallback(() => {
    const buf = new Uint32Array(length);
    crypto.getRandomValues(buf);
    setPassword(Array.from(buf, (n) => alphabet[n % alphabet.length]!).join(""));
  }, [length, alphabet]);

  useEffect(() => {
    generate();
  }, [generate]);

  const bits = Math.round(length * Math.log2(alphabet.length));
  const strength = bits < 50 ? "Weak" : bits < 80 ? "Good" : bits < 110 ? "Strong" : "Excellent";
  const pct = Math.min(100, (bits / 140) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5">
          <p
            className="break-all font-mono text-lg leading-relaxed text-foreground sm:text-xl"
            aria-live="polite"
          >
            {password}
          </p>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-[width]"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--secondary), var(--primary))" }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {strength} — about {bits} bits of entropy
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={generate}><RefreshCw size={15} /> Generate again</Button>
          <CopyButton value={password} label="Copy password" />
        </div>

        <p className="text-xs text-muted-foreground">
          Generated with your browser's secure random generator. Nothing is sent anywhere or stored.
        </p>
      </div>

      <aside className="glass h-fit space-y-3 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
        <Field label={`Length — ${length} characters`}>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </Field>
        <Toggle label="Capital letters" checked={upper} onChange={setUpper} />
        <Toggle label="Numbers" checked={digits} onChange={setDigits} />
        <Toggle label="Symbols" checked={symbols} onChange={setSymbols} />
        <Toggle label="Avoid look-alike characters" checked={avoidAmbiguous} onChange={setAvoidAmbiguous} />
      </aside>
    </div>
  );
}

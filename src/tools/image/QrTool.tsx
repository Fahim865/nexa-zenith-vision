import { useEffect, useRef, useState } from "react";
import { Button, DownloadButton, ErrorNote, Field, Select, TextInput } from "@/components/workspace/ui";

export default function QrTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://nexa.app");
  const [size, setSize] = useState(320);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [dark, setDark] = useState("#050816");
  const [light, setLight] = useState("#ffffff");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const canvas = canvasRef.current;
      if (!canvas || !text.trim()) return;
      try {
        const QR = (await import("qrcode")).default;
        await QR.toCanvas(canvas, text, {
          width: size,
          errorCorrectionLevel: level,
          margin: 2,
          color: { dark, light },
        });
        if (!alive) return;
        setError(null);
        canvas.toBlob((b) => alive && setBlob(b));
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "That text is too long for a QR code.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [text, size, level, dark, light]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Field label="Link or text">
          <TextInput value={text} onChange={(e) => setText(e.target.value)} placeholder="https://…" />
        </Field>

        {error ? <ErrorNote>{error}</ErrorNote> : null}

        <div className="glass flex items-center justify-center rounded-2xl p-6">
          <canvas ref={canvasRef} aria-label="QR code preview" className="max-w-full rounded-lg" />
        </div>

        <div className="flex flex-wrap gap-2">
          <DownloadButton blob={blob} filename="nexa-qr-code.png" label="Download PNG" />
          <Button variant="ghost" onClick={() => setText("")}>Reset</Button>
        </div>
      </div>

      <aside className="glass h-fit space-y-3 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
        <Field label={`Size — ${size}px`}>
          <input
            type="range"
            min={120}
            max={800}
            step={20}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </Field>
        <Field label="Error correction" hint="Higher levels still scan when partly covered.">
          <Select value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </Select>
        </Field>
        <Field label="Foreground">
          <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-transparent" />
        </Field>
        <Field label="Background">
          <input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-transparent" />
        </Field>
      </aside>
    </div>
  );
}

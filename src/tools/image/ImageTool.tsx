import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  DownloadButton,
  Dropzone,
  ErrorNote,
  Field,
  Select,
  Spinner,
  TextInput,
  Toggle,
  formatBytes,
} from "@/components/workspace/ui";
import type { ToolMeta } from "@/lib/tools/types";

type Mode =
  | "image-compressor"
  | "image-resizer"
  | "image-converter"
  | "image-rotator"
  | "image-watermark"
  | "image-metadata-cleaner"
  | "color-picker"
  | "favicon-generator"
  | "image-to-pdf";

const MIME: Record<string, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That image couldn't be read."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed."))), type, quality),
  );
}

export default function ImageTool({ tool }: { tool: ToolMeta }) {
  const mode = tool.slug as Mode;
  const multiple = mode === "image-to-pdf";
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [source, setSource] = useState<{ w: number; h: number } | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [faviconSizes, setFaviconSizes] = useState<{ size: number; url: string }[]>([]);

  // settings
  const [quality, setQuality] = useState(0.75);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [angle, setAngle] = useState(90);
  const [flipH, setFlipH] = useState(false);
  const [watermark, setWatermark] = useState("© NEXA");
  const [wmSize, setWmSize] = useState(32);
  const [wmOpacity, setWmOpacity] = useState(0.5);
  const [wmPos, setWmPos] = useState("br");

  const file = files[0];

  useEffect(() => {
    if (!file) {
      setSource(null);
      return;
    }
    let alive = true;
    loadImage(file)
      .then((img) => {
        if (!alive) return;
        setSource({ w: img.naturalWidth, h: img.naturalHeight });
        setWidth(String(img.naturalWidth));
        setHeight(String(img.naturalHeight));
      })
      .catch((e: Error) => setError(e.message));
    return () => {
      alive = false;
    };
  }, [file]);

  const run = useCallback(async () => {
    if (!files.length) return;
    setBusy(true);
    setError(null);
    setPalette([]);
    setFaviconSizes([]);
    try {
      if (mode === "image-to-pdf") {
        const { PDFDocument } = await import("pdf-lib");
        const doc = await PDFDocument.create();
        for (const f of files) {
          const bytes = new Uint8Array(await f.arrayBuffer());
          const embedded = f.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
          const page = doc.addPage([embedded.width, embedded.height]);
          page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
        }
        const out = await doc.save();
        setOutBlob(new Blob([out as BlobPart], { type: "application/pdf" }));
        setOutUrl(null);
        return;
      }

      const img = await loadImage(files[0]!);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser blocked image processing.");

      let targetW = img.naturalWidth;
      let targetH = img.naturalHeight;
      if (mode === "image-resizer") {
        targetW = Math.max(1, Number(width) || img.naturalWidth);
        targetH = Math.max(1, Number(height) || img.naturalHeight);
      }

      const rotated = mode === "image-rotator" && (angle === 90 || angle === 270);
      canvas.width = rotated ? targetH : targetW;
      canvas.height = rotated ? targetW : targetH;

      ctx.save();
      if (mode === "image-rotator") {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        if (flipH) ctx.scale(-1, 1);
        ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      } else {
        ctx.drawImage(img, 0, 0, targetW, targetH);
      }
      ctx.restore();

      if (mode === "image-watermark" && watermark) {
        ctx.globalAlpha = wmOpacity;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "rgba(0,0,0,.45)";
        ctx.lineWidth = Math.max(1, wmSize / 16);
        ctx.font = `600 ${wmSize}px system-ui, sans-serif`;
        const m = ctx.measureText(watermark);
        const pad = wmSize * 0.6;
        const x = wmPos.includes("l") ? pad : wmPos === "c" ? (canvas.width - m.width) / 2 : canvas.width - m.width - pad;
        const y = wmPos.startsWith("t") ? wmSize + pad : wmPos === "c" ? canvas.height / 2 : canvas.height - pad;
        ctx.strokeText(watermark, x, y);
        ctx.fillText(watermark, x, y);
        ctx.globalAlpha = 1;
      }

      if (mode === "color-picker") {
        const small = document.createElement("canvas");
        small.width = 60;
        small.height = 60;
        const sctx = small.getContext("2d")!;
        sctx.drawImage(img, 0, 0, 60, 60);
        const data = sctx.getImageData(0, 0, 60, 60).data;
        const buckets = new Map<string, number>();
        for (let i = 0; i < data.length; i += 4) {
          const r = Math.round(data[i]! / 24) * 24;
          const g = Math.round(data[i + 1]! / 24) * 24;
          const b = Math.round(data[i + 2]! / 24) * 24;
          const hex = `#${[r, g, b].map((c) => Math.min(255, c).toString(16).padStart(2, "0")).join("")}`;
          buckets.set(hex, (buckets.get(hex) ?? 0) + 1);
        }
        setPalette([...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([hex]) => hex));
      }

      if (mode === "favicon-generator") {
        const sizes = [16, 32, 48, 64, 180, 192, 512];
        const out: { size: number; url: string }[] = [];
        for (const size of sizes) {
          const c = document.createElement("canvas");
          c.width = size;
          c.height = size;
          c.getContext("2d")!.drawImage(img, 0, 0, size, size);
          out.push({ size, url: c.toDataURL("image/png") });
        }
        setFaviconSizes(out);
      }

      const outType =
        mode === "image-converter"
          ? MIME[format]!
          : mode === "image-metadata-cleaner"
            ? files[0]!.type === "image/png"
              ? "image/png"
              : "image/jpeg"
            : files[0]!.type === "image/png" && mode !== "image-compressor"
              ? "image/png"
              : "image/jpeg";

      const blob = await canvasToBlob(canvas, outType, mode === "image-compressor" ? quality : 0.92);
      setOutBlob(blob);
      setOutUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Processing failed.");
      setOutBlob(null);
    } finally {
      setBusy(false);
    }
  }, [files, mode, quality, format, width, height, angle, flipH, watermark, wmSize, wmOpacity, wmPos]);

  const outName = useMemo(() => {
    const base = (file?.name ?? "image").replace(/\.[^.]+$/, "");
    if (mode === "image-to-pdf") return "nexa-images.pdf";
    if (mode === "image-converter") return `${base}.${format === "jpeg" ? "jpg" : format}`;
    return `${base}-nexa.${outBlob?.type === "image/png" ? "png" : "jpg"}`;
  }, [file, mode, format, outBlob]);

  const savings =
    file && outBlob ? Math.round(((file.size - outBlob.size) / file.size) * 100) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Dropzone
          accept={mode === "image-to-pdf" ? "image/png,image/jpeg" : "image/*"}
          multiple={multiple}
          maxSizeMb={25}
          files={files}
          onFiles={(f) => {
            setFiles(f);
            setOutBlob(null);
            setError(null);
          }}
          hint={
            mode === "image-to-pdf"
              ? "PNG and JPG, up to 25 MB each. Combined in the order shown."
              : "PNG, JPG or WebP up to 25 MB. Everything happens on your device."
          }
        />

        {error ? <ErrorNote>{error}</ErrorNote> : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button disabled={!files.length || busy} onClick={run}>
            {busy ? "Processing…" : "Process"}
          </Button>
          <DownloadButton blob={outBlob} filename={outName} />
          <Button
            variant="ghost"
            onClick={() => {
              setFiles([]);
              setOutBlob(null);
              setOutUrl(null);
              setPalette([]);
              setFaviconSizes([]);
              setError(null);
            }}
          >
            Reset
          </Button>
          {busy ? <Spinner /> : null}
        </div>

        {outBlob && !busy ? (
          <div className="glass space-y-3 rounded-2xl p-4" aria-live="polite">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <span className="text-muted-foreground">
                Original: <span className="text-foreground">{file ? formatBytes(file.size) : "—"}</span>
              </span>
              <span className="text-muted-foreground">
                Result: <span className="text-foreground">{formatBytes(outBlob.size)}</span>
              </span>
              {savings !== null && savings > 0 ? (
                <span className="text-primary">{savings}% smaller</span>
              ) : null}
              {source ? (
                <span className="text-muted-foreground">
                  Source size: <span className="text-foreground">{source.w}×{source.h}</span>
                </span>
              ) : null}
            </div>
            {outUrl ? (
              <img
                src={outUrl}
                alt="Processed result preview"
                className="max-h-[420px] w-full rounded-xl object-contain"
              />
            ) : null}
          </div>
        ) : null}

        {palette.length ? (
          <div className="glass rounded-2xl p-4">
            <h2 className="text-sm font-semibold">Palette</h2>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
              {palette.map((hex) => (
                <div key={hex} className="text-center">
                  <div className="h-12 w-full rounded-lg border border-border" style={{ background: hex }} />
                  <span className="mt-1 block font-mono text-[10px] text-muted-foreground">{hex}</span>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <CopyButton value={palette.join(", ")} label="Copy palette" />
            </div>
          </div>
        ) : null}

        {faviconSizes.length ? (
          <div className="glass rounded-2xl p-4">
            <h2 className="text-sm font-semibold">Favicon sizes</h2>
            <div className="mt-3 flex flex-wrap items-end gap-4">
              {faviconSizes.map((f) => (
                <a
                  key={f.size}
                  href={f.url}
                  download={`favicon-${f.size}.png`}
                  className="text-center text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <img src={f.url} alt={`${f.size} pixel favicon`} width={Math.min(64, f.size)} height={Math.min(64, f.size)} className="mx-auto rounded" />
                  <span className="mt-1 block">{f.size}px</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <aside className="glass h-fit space-y-3 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>

        {mode === "image-compressor" ? (
          <Field label={`Quality — ${Math.round(quality * 100)}%`}>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
          </Field>
        ) : null}

        {mode === "image-converter" ? (
          <Field label="Convert to">
            <Select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
              <option value="jpeg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </Select>
          </Field>
        ) : null}

        {mode === "image-resizer" ? (
          <>
            <Field label="Width (px)">
              <TextInput
                type="number"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                  if (lockRatio && source) setHeight(String(Math.round((Number(e.target.value) / source.w) * source.h)));
                }}
              />
            </Field>
            <Field label="Height (px)">
              <TextInput
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  if (lockRatio && source) setWidth(String(Math.round((Number(e.target.value) / source.h) * source.w)));
                }}
              />
            </Field>
            <Toggle label="Keep aspect ratio" checked={lockRatio} onChange={setLockRatio} />
          </>
        ) : null}

        {mode === "image-rotator" ? (
          <>
            <Field label="Rotate">
              <Select value={String(angle)} onChange={(e) => setAngle(Number(e.target.value))}>
                <option value="90">90° clockwise</option>
                <option value="180">180°</option>
                <option value="270">90° anticlockwise</option>
                <option value="0">No rotation</option>
              </Select>
            </Field>
            <Toggle label="Mirror horizontally" checked={flipH} onChange={setFlipH} />
          </>
        ) : null}

        {mode === "image-watermark" ? (
          <>
            <Field label="Watermark text">
              <TextInput value={watermark} onChange={(e) => setWatermark(e.target.value)} />
            </Field>
            <Field label={`Size — ${wmSize}px`}>
              <input type="range" min={10} max={140} value={wmSize} onChange={(e) => setWmSize(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </Field>
            <Field label={`Opacity — ${Math.round(wmOpacity * 100)}%`}>
              <input type="range" min={0.1} max={1} step={0.05} value={wmOpacity} onChange={(e) => setWmOpacity(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
            </Field>
            <Field label="Position">
              <Select value={wmPos} onChange={(e) => setWmPos(e.target.value)}>
                <option value="tl">Top left</option>
                <option value="tr">Top right</option>
                <option value="c">Centre</option>
                <option value="bl">Bottom left</option>
                <option value="br">Bottom right</option>
              </Select>
            </Field>
          </>
        ) : null}

        {mode === "image-metadata-cleaner" ? (
          <p className="text-sm text-muted-foreground">
            Redrawing the photo drops EXIF data including camera model, date and GPS location. Press
            Process, then download the clean copy.
          </p>
        ) : null}

        {mode === "color-picker" ? (
          <p className="text-sm text-muted-foreground">
            Press Process to pull the dominant colours out of your image.
          </p>
        ) : null}

        {mode === "image-to-pdf" ? (
          <p className="text-sm text-muted-foreground">
            Add several images — each becomes one page, at its original size.
          </p>
        ) : null}
      </aside>
    </div>
  );
}

import { useCallback, useState } from "react";
import {
  Button,
  DownloadButton,
  Dropzone,
  ErrorNote,
  Field,
  Select,
  Spinner,
  TextInput,
  formatBytes,
} from "@/components/workspace/ui";
import type { ToolMeta } from "@/lib/tools/types";

type Mode = "pdf-merge" | "pdf-split" | "pdf-rotate" | "pdf-page-organizer";

/** Parse "1-3,5,8" into zero-based page indices within a page count. */
function parseRange(spec: string, total: number): number[] {
  if (!spec.trim()) return Array.from({ length: total }, (_, i) => i);
  const out: number[] = [];
  for (const part of spec.split(",")) {
    const [a, b] = part.split("-").map((s) => parseInt(s.trim(), 10));
    if (Number.isNaN(a!)) continue;
    const end = Number.isNaN(b!) || b === undefined ? a! : b;
    for (let i = a!; i <= end!; i++) if (i >= 1 && i <= total) out.push(i - 1);
  }
  return out;
}

export default function PdfTool({ tool }: { tool: ToolMeta }) {
  const mode = tool.slug as Mode;
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [out, setOut] = useState<Blob | null>(null);
  const [pages, setPages] = useState<number | null>(null);
  const [range, setRange] = useState("");
  const [angle, setAngle] = useState(90);

  const run = useCallback(async () => {
    if (!files.length) return;
    setBusy(true);
    setError(null);
    setOut(null);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");

      if (mode === "pdf-merge") {
        const doc = await PDFDocument.create();
        for (const f of files) {
          const src = await PDFDocument.load(await f.arrayBuffer());
          const copied = await doc.copyPages(src, src.getPageIndices());
          copied.forEach((p) => doc.addPage(p));
        }
        setPages(doc.getPageCount());
        setOut(new Blob([(await doc.save()) as BlobPart], { type: "application/pdf" }));
        return;
      }

      const src = await PDFDocument.load(await files[0]!.arrayBuffer());
      const total = src.getPageCount();
      setPages(total);
      const picked = parseRange(range, total);
      if (!picked.length) throw new Error("That page range doesn't match any pages in this file.");

      if (mode === "pdf-rotate") {
        picked.forEach((i) => {
          const page = src.getPage(i);
          page.setRotation(degrees((page.getRotation().angle + angle) % 360));
        });
        setOut(new Blob([(await src.save()) as BlobPart], { type: "application/pdf" }));
        return;
      }

      // split / organise: keep only the chosen pages, in the given order
      const doc = await PDFDocument.create();
      const copied = await doc.copyPages(src, picked);
      copied.forEach((p) => doc.addPage(p));
      setOut(new Blob([(await doc.save()) as BlobPart], { type: "application/pdf" }));
    } catch (e) {
      setError(
        e instanceof Error && /encrypt|password/i.test(e.message)
          ? "This PDF is password protected, so it can't be edited here."
          : e instanceof Error
            ? e.message
            : "That PDF couldn't be processed.",
      );
    } finally {
      setBusy(false);
    }
  }, [files, mode, range, angle]);

  const labels: Record<Mode, { hint: string; range: string }> = {
    "pdf-merge": { hint: "Add two or more PDFs — they combine in the order listed.", range: "" },
    "pdf-split": { hint: "Choose one PDF, then pick the pages to keep.", range: "Pages to keep" },
    "pdf-rotate": { hint: "Choose one PDF, then rotate all or selected pages.", range: "Pages to rotate (blank = all)" },
    "pdf-page-organizer": { hint: "Reorder or drop pages by listing them, e.g. 3,1,2.", range: "New page order" },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Dropzone
          accept="application/pdf,.pdf"
          multiple={mode === "pdf-merge"}
          maxSizeMb={50}
          files={files}
          onFiles={(f) => {
            setFiles(f);
            setOut(null);
            setError(null);
          }}
          hint={labels[mode].hint}
        />

        {error ? <ErrorNote>{error}</ErrorNote> : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button disabled={!files.length || busy} onClick={run}>
            {busy ? "Working…" : "Process PDF"}
          </Button>
          <DownloadButton blob={out} filename={`nexa-${mode}.pdf`} />
          <Button
            variant="ghost"
            onClick={() => {
              setFiles([]);
              setOut(null);
              setPages(null);
              setError(null);
            }}
          >
            Reset
          </Button>
          {busy ? <Spinner /> : null}
        </div>

        {out ? (
          <div className="glass rounded-2xl p-4 text-sm" aria-live="polite">
            <p className="text-foreground">Your PDF is ready — {formatBytes(out.size)}.</p>
            {pages ? <p className="mt-1 text-muted-foreground">Source document: {pages} pages.</p> : null}
          </div>
        ) : null}
      </div>

      <aside className="glass h-fit space-y-3 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
        {labels[mode].range ? (
          <Field label={labels[mode].range} hint="Use numbers, ranges and commas: 1-3,7,9">
            <TextInput value={range} onChange={(e) => setRange(e.target.value)} placeholder="1-3,7" />
          </Field>
        ) : (
          <p className="text-sm text-muted-foreground">
            Files merge top to bottom. Remove any you don't want using the × next to it.
          </p>
        )}
        {mode === "pdf-rotate" ? (
          <Field label="Rotate by">
            <Select value={String(angle)} onChange={(e) => setAngle(Number(e.target.value))}>
              <option value="90">90° clockwise</option>
              <option value="180">180°</option>
              <option value="270">90° anticlockwise</option>
            </Select>
          </Field>
        ) : null}
        <p className="text-xs text-muted-foreground">
          PDFs are read and rewritten inside your browser. Nothing leaves your device.
        </p>
      </aside>
    </div>
  );
}

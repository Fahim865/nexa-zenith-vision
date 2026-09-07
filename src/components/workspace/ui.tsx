import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, Download, FileWarning, Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-2 focus:ring-ring/25";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, "appearance-none", props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      spellCheck={false}
      {...props}
      className={cn(inputCls, "min-h-[220px] resize-y font-mono text-[13px] leading-relaxed", props.className)}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm transition-colors hover:border-primary/40"
    >
      <span className="text-foreground/90">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all",
            checked ? "left-[1.15rem]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "text-primary-foreground shadow-[var(--glow-primary)] hover:brightness-110",
        variant === "ghost" && "glass text-foreground hover:border-primary/40",
        variant === "danger" && "border border-destructive/40 text-destructive hover:bg-destructive/10",
        className,
      )}
      style={
        variant === "primary"
          ? { background: "linear-gradient(135deg, var(--secondary), var(--primary))" }
          : undefined
      }
    />
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(id);
  }, [done]);
  return (
    <Button
      variant="ghost"
      disabled={!value}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? <Check size={15} className="text-primary" /> : <Copy size={15} />}
      {done ? "Copied" : label}
    </Button>
  );
}

export function DownloadButton({
  blob,
  filename,
  label = "Download",
}: {
  blob: Blob | null;
  filename: string;
  label?: string;
}) {
  return (
    <Button
      disabled={!blob}
      onClick={() => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }}
    >
      <Download size={15} />
      {label}
    </Button>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      <FileWarning size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border/70 px-4 py-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 size={16} className="animate-spin text-primary" />
      {label ?? "Working…"}
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{ width: `${value}%`, background: "linear-gradient(90deg, var(--secondary), var(--primary))" }}
      />
    </div>
  );
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export interface DropzoneProps {
  accept: string;
  multiple?: boolean;
  maxSizeMb?: number;
  files: File[];
  onFiles: (files: File[]) => void;
  hint?: string;
}

export function Dropzone({ accept, multiple, maxSizeMb = 50, files, onFiles, hint }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accepts = accept
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);

  const matches = (f: File) =>
    accepts.some((a) =>
      a.endsWith("/*") ? f.type.startsWith(a.slice(0, -1)) : a.startsWith(".") ? f.name.toLowerCase().endsWith(a) : f.type === a,
    );

  function accept_(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const wrongType = incoming.filter((f) => !matches(f));
    const tooBig = incoming.filter((f) => f.size > maxSizeMb * 1024 * 1024);
    const ok = incoming.filter((f) => matches(f) && f.size <= maxSizeMb * 1024 * 1024);
    setError(
      wrongType.length
        ? `${wrongType[0]!.name} isn't a supported format.`
        : tooBig.length
          ? `${tooBig[0]!.name} is larger than ${maxSizeMb} MB.`
          : null,
    );
    if (ok.length) onFiles(multiple ? [...files, ...ok] : [ok[0]!]);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          accept_(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border border-dashed p-8 text-center transition-colors",
          over ? "border-primary bg-primary/5" : "border-border/70 bg-surface/30",
        )}
      >
        <UploadCloud size={26} className="mx-auto text-primary/80" />
        <p className="mt-3 text-sm text-foreground">Drag files here, or</p>
        <Button variant="ghost" className="mt-3" onClick={() => inputRef.current?.click()}>
          Choose {multiple ? "files" : "a file"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          {hint ?? `Up to ${maxSizeMb} MB. Processed on your device — nothing is uploaded.`}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            accept_(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error ? <ErrorNote>{error}</ErrorNote> : null}

      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface/50 px-3 py-2 text-sm"
            >
              <span className="truncate">{f.name}</span>
              <span className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                {formatBytes(f.size)}
                <button
                  aria-label={`Remove ${f.name}`}
                  onClick={() => onFiles(files.filter((_, j) => j !== i))}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

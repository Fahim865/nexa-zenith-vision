import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button, EmptyNote, Field, TextArea, TextInput } from "@/components/workspace/ui";
import { cn } from "@/lib/utils";
import type { ToolMeta } from "@/lib/tools/types";

function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

function mmss(total: number) {
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ---------------- Notes ---------------- */
function Notes() {
  const [text, setText] = useLocal("nexa:notes", "");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className="space-y-3">
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing. Your notes stay on this device."
        className="min-h-[420px] font-sans text-sm"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{words} words · {text.length} characters · saved on this device</span>
        <Button variant="ghost" onClick={() => setText("")}>Clear</Button>
      </div>
    </div>
  );
}

/* ---------------- To-do ---------------- */
interface Task { id: string; text: string; done: boolean }

function Todo() {
  const [tasks, setTasks] = useLocal<Task[]>("nexa:todo", []);
  const [draft, setDraft] = useState("");
  const remaining = tasks.filter((t) => !t.done).length;

  const add = () => {
    if (!draft.trim()) return;
    setTasks((t) => [{ id: crypto.randomUUID(), text: draft.trim(), done: false }, ...t]);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="What needs doing?"
        />
        <Button onClick={add}><Plus size={15} /> Add</Button>
      </div>

      {tasks.length === 0 ? (
        <EmptyNote>No tasks yet. Add your first one above.</EmptyNote>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">{remaining} of {tasks.length} left</p>
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li key={t.id} className="glass flex items-center gap-3 rounded-xl px-3 py-2.5">
                <button
                  aria-label={t.done ? `Mark ${t.text} as not done` : `Mark ${t.text} as done`}
                  onClick={() => setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    t.done ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {t.done ? <Check size={13} /> : null}
                </button>
                <span className={cn("flex-1 text-sm", t.done && "text-muted-foreground line-through")}>{t.text}</span>
                <button
                  aria-label={`Delete ${t.text}`}
                  onClick={() => setTasks((all) => all.filter((x) => x.id !== t.id))}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
          <Button variant="ghost" onClick={() => setTasks((all) => all.filter((t) => !t.done))}>
            Clear completed
          </Button>
        </>
      )}
    </div>
  );
}

/* ---------------- Timers ---------------- */
function Dial({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass mx-auto flex aspect-square w-full max-w-[320px] flex-col items-center justify-center rounded-full">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <span className="font-display text-5xl text-gradient tabular">{value}</span>
      {sub ? <span className="mt-1 text-xs text-muted-foreground">{sub}</span> : null}
    </div>
  );
}

function Pomodoro() {
  const [focusMin, setFocusMin] = useLocal("nexa:pomo:focus", 25);
  const [breakMin, setBreakMin] = useLocal("nexa:pomo:break", 5);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState(0);

  useEffect(() => {
    if (!running) setLeft((phase === "focus" ? focusMin : breakMin) * 60);
  }, [focusMin, breakMin, phase, running]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s > 1) return s - 1;
        setPhase((p) => (p === "focus" ? "break" : "focus"));
        setRounds((r) => (phase === "focus" ? r + 1 : r));
        return (phase === "focus" ? breakMin : focusMin) * 60;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, phase, focusMin, breakMin]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <Dial label={phase === "focus" ? "Focus" : "Break"} value={mmss(left)} sub={`${rounds} rounds completed`} />
        <div className="flex justify-center gap-2">
          <Button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setRunning(false);
              setPhase("focus");
              setLeft(focusMin * 60);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <aside className="glass h-fit space-y-3 rounded-2xl p-4">
        <h2 className="text-sm font-semibold">Session lengths</h2>
        <Field label="Focus (minutes)">
          <TextInput type="number" min={1} value={focusMin} onChange={(e) => setFocusMin(Number(e.target.value) || 1)} />
        </Field>
        <Field label="Break (minutes)">
          <TextInput type="number" min={1} value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value) || 1)} />
        </Field>
      </aside>
    </div>
  );
}

function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const start = performance.now() - ms;
    const id = setInterval(() => setMs(performance.now() - start), 50);
    return () => clearInterval(id);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const text = `${mmss(ms / 1000)}.${String(Math.floor((ms % 1000) / 10)).padStart(2, "0")}`;

  return (
    <div className="space-y-5">
      <Dial label="Stopwatch" value={text} />
      <div className="flex justify-center gap-2">
        <Button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</Button>
        <Button variant="ghost" onClick={() => setLaps((l) => [ms, ...l])} disabled={!running}>Lap</Button>
        <Button variant="ghost" onClick={() => { setRunning(false); setMs(0); setLaps([]); }}>Reset</Button>
      </div>
      {laps.length ? (
        <ul className="mx-auto max-w-sm space-y-1.5">
          {laps.map((l, i) => (
            <li key={i} className="glass flex justify-between rounded-lg px-3 py-2 text-sm">
              <span className="text-muted-foreground">Lap {laps.length - i}</span>
              <span className="tabular">{mmss(l / 1000)}.{String(Math.floor((l % 1000) / 10)).padStart(2, "0")}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Countdown() {
  const [minutes, setMinutes] = useState(10);
  const [left, setLeft] = useState(600);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) setLeft(minutes * 60);
  }, [minutes, running]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? (setRunning(false), 0) : s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <Dial label="Countdown" value={mmss(left)} {...(left === 0 ? { sub: "Time's up" } : {})} />
        <div className="flex justify-center gap-2">
          <Button onClick={() => setRunning((r) => !r)} disabled={left === 0 && !running}>
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="ghost" onClick={() => { setRunning(false); setLeft(minutes * 60); }}>Reset</Button>
        </div>
      </div>
      <aside className="glass h-fit space-y-3 rounded-2xl p-4">
        <Field label="Minutes">
          <TextInput type="number" min={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 1)} />
        </Field>
        <div className="flex flex-wrap gap-2">
          {[1, 3, 5, 10, 20, 45].map((m) => (
            <Button key={m} variant="ghost" onClick={() => { setRunning(false); setMinutes(m); }}>{m}m</Button>
          ))}
        </div>
      </aside>
    </div>
  );
}

/* ---------------- Random picker ---------------- */
function RandomPicker() {
  const [raw, setRaw] = useState("Alex\nJordan\nSam\nRiley");
  const [picked, setPicked] = useState<string | null>(null);
  const items = useMemo(() => raw.split("\n").map((s) => s.trim()).filter(Boolean), [raw]);

  const pick = useCallback(() => {
    if (!items.length) return;
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    setPicked(items[buf[0]! % items.length]!);
  }, [items]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Field label="Options — one per line">
        <TextArea value={raw} onChange={(e) => setRaw(e.target.value)} className="min-h-[280px] font-sans" />
      </Field>
      <div className="space-y-4">
        <div className="glass flex min-h-[180px] items-center justify-center rounded-2xl p-6 text-center" aria-live="polite">
          <span className="font-display text-3xl text-gradient">{picked ?? "—"}</span>
        </div>
        <Button onClick={pick} disabled={!items.length}>Pick one at random</Button>
        <p className="text-xs text-muted-foreground">{items.length} options loaded.</p>
      </div>
    </div>
  );
}

export default function ProductivityTool({ tool }: { tool: ToolMeta }) {
  switch (tool.slug) {
    case "notes":
      return <Notes />;
    case "todo-list":
    case "to-do-list":
      return <Todo />;
    case "pomodoro-timer":
      return <Pomodoro />;
    case "stopwatch":
      return <Stopwatch />;
    case "countdown-timer":
      return <Countdown />;
    case "random-picker":
      return <RandomPicker />;
    default:
      return <EmptyNote>This tool isn't wired up yet.</EmptyNote>;
  }
}

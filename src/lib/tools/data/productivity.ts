import { StickyNote, ListChecks, Timer, Watch, Hourglass, Shuffle, KeyRound } from "lucide-react";
import { def } from "./def";
import type { ToolMeta } from "../types";

const base = { category: "productivity", provider: "device", credits: 0, inputType: "text", outputType: "text" } as const;

export const PRODUCTIVITY_TOOLS: ToolMeta[] = [
  def({ ...base, name: "Notes", slug: "notes", description: "Quick notes that stay on this device, saved as you type.", icon: StickyNote, tags: ["notes", "scratchpad", "writing"], status: "live", popular: true }),
  def({ ...base, name: "To-Do List", slug: "todo-list", description: "A simple checklist that remembers itself between visits.", icon: ListChecks, tags: ["todo", "tasks", "checklist"], status: "live" }),
  def({ ...base, name: "Pomodoro Timer", slug: "pomodoro-timer", description: "Focused work sessions with automatic short and long breaks.", icon: Timer, tags: ["pomodoro", "focus", "timer", "study"], status: "live", popular: true }),
  def({ ...base, name: "Stopwatch", slug: "stopwatch", description: "Precise stopwatch with lap times.", icon: Watch, tags: ["stopwatch", "laps", "timing"], status: "live" }),
  def({ ...base, name: "Countdown Timer", slug: "countdown-timer", description: "Count down to zero with an alert when time is up.", icon: Hourglass, tags: ["countdown", "timer", "alarm"], status: "live" }),
  def({ ...base, name: "Random Picker", slug: "random-picker", description: "Pick a random name or item from a list, fairly.", icon: Shuffle, tags: ["random", "picker", "raffle", "decision"], status: "live", category: "utilities" }),
  def({ ...base, name: "Password Generator", slug: "password-generator", description: "Strong, random passwords generated on your device.", icon: KeyRound, tags: ["password", "security", "random"], status: "live", category: "security", featured: true, popular: true,
    about: "Choose a length and character set and NEXA builds a password using your browser's cryptographic random number generator. Nothing is sent anywhere and nothing is stored." }),
];

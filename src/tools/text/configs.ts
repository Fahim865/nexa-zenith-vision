/** Configuration for every text / developer tool that fits the input → output shape. */

export interface OptionField {
  key: string;
  label: string;
  type: "select" | "text" | "number" | "toggle";
  options?: { value: string; label: string }[];
  def: string | number | boolean;
  placeholder?: string;
}

export type Opts = Record<string, string | number | boolean>;

export interface TextToolConfig {
  inputLabel?: string;
  inputPlaceholder?: string;
  secondInput?: { label: string; placeholder?: string };
  /** No input textarea (generators). */
  generator?: boolean;
  fields?: OptionField[];
  run?: (input: string, o: Opts, second: string) => string | Promise<string>;
  stats?: (input: string) => [string, string][];
}

const s = (v: string) => v;

/* ---------- helpers ---------- */

const words = (t: string) => (t.trim() ? t.trim().split(/\s+/) : []);
const sentences = (t: string) => t.split(/[.!?]+(?:\s|$)/).filter((x) => x.trim().length > 0);
const paragraphs = (t: string) => t.split(/\n\s*\n/).filter((x) => x.trim().length > 0);

function readingStats(t: string): [string, string][] {
  const w = words(t).length;
  const mins = w / 225;
  const speak = w / 150;
  const fmt = (m: number) => (m < 1 ? `${Math.max(1, Math.round(m * 60))} sec` : `${Math.round(m)} min`);
  return [
    ["Words", w.toLocaleString()],
    ["Reading time", w ? fmt(mins) : "—"],
    ["Speaking time", w ? fmt(speak) : "—"],
    ["Sentences", String(sentences(t).length)],
  ];
}

function fullStats(t: string): [string, string][] {
  const w = words(t);
  return [
    ["Words", w.length.toLocaleString()],
    ["Characters", t.length.toLocaleString()],
    ["Characters (no spaces)", t.replace(/\s/g, "").length.toLocaleString()],
    ["Sentences", String(sentences(t).length)],
    ["Paragraphs", String(paragraphs(t).length)],
    ["Unique words", String(new Set(w.map((x) => x.toLowerCase().replace(/[^a-z0-9']/gi, ""))).size)],
    ["Reading time", w.length ? `${Math.max(1, Math.round(w.length / 225))} min` : "—"],
    ["Speaking time", w.length ? `${Math.max(1, Math.round(w.length / 150))} min` : "—"],
  ];
}

function indent(text: string, open: RegExp, close: RegExp, unit = "  ") {
  const lines = text.split("\n");
  let depth = 0;
  return lines
    .map((raw) => {
      const line = raw.trim();
      if (!line) return "";
      if (close.test(line)) depth = Math.max(0, depth - 1);
      const out = unit.repeat(depth) + line;
      if (open.test(line)) depth += 1;
      return out;
    })
    .join("\n");
}

function formatHtml(src: string) {
  const withBreaks = src
    .replace(/>\s*</g, ">\n<")
    .replace(/\n{2,}/g, "\n")
    .trim();
  const voids = /^<(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)\b/i;
  const lines = withBreaks.split("\n");
  let depth = 0;
  return lines
    .map((raw) => {
      const line = raw.trim();
      if (/^<\//.test(line)) depth = Math.max(0, depth - 1);
      const out = "  ".repeat(depth) + line;
      if (/^<[a-zA-Z]/.test(line) && !/\/>$/.test(line) && !voids.test(line) && !/<\/[a-zA-Z][^>]*>$/.test(line))
        depth += 1;
      return out;
    })
    .join("\n");
}

function formatCss(src: string) {
  const normalised = src
    .replace(/\s*\{\s*/g, " {\n")
    .replace(/;\s*/g, ";\n")
    .replace(/\s*\}\s*/g, "\n}\n")
    .replace(/\n{2,}/g, "\n");
  return indent(normalised, /\{$/, /^\}/).trim();
}

function formatJs(src: string) {
  const normalised = src
    .replace(/\{\s*/g, "{\n")
    .replace(/;\s*/g, ";\n")
    .replace(/\s*\}/g, "\n}")
    .replace(/\n{2,}/g, "\n");
  return indent(normalised, /[{[(]$/, /^[}\])]/).trim();
}

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN",
  "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "UNION ALL", "UNION", "INSERT INTO",
  "VALUES", "UPDATE", "SET", "DELETE FROM", "ON", "AND", "OR",
];

function formatSql(src: string) {
  let out = src.replace(/\s+/g, " ").trim();
  for (const kw of SQL_KEYWORDS) {
    out = out.replace(new RegExp(`\\s*\\b${kw.replace(/ /g, "\\s+")}\\b\\s*`, "gi"), `\n${kw} `);
  }
  return out
    .split("\n")
    .map((l) => (/^(AND|OR|ON)\b/i.test(l.trim()) ? "  " + l.trim() : l.trim()))
    .filter(Boolean)
    .join("\n");
}

function b64encode(t: string) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(t)));
}
function b64decode(t: string) {
  const bin = atob(t.trim().replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  let h = 0, sat = 0;
  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === rr ? (gg - bb) / d + (gg < bb ? 6 : 0) : max === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(sat * 100), l: Math.round(l * 100) };
}

async function digest(algo: string, text: string) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function diffLines(a: string, b: string) {
  const A = a.split("\n");
  const B = b.split("\n");
  const n = A.length, m = B.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i]![j] = A[i] === B[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
  const out: string[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { out.push(`  ${A[i]}`); i++; j++; }
    else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) { out.push(`- ${A[i]}`); i++; }
    else { out.push(`+ ${B[j]}`); j++; }
  }
  while (i < n) out.push(`- ${A[i++]}`);
  while (j < m) out.push(`+ ${B[j++]}`);
  return out.join("\n");
}

const LOREM =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur".split(
    " ",
  );

function loremWords(n: number) {
  return Array.from({ length: n }, (_, i) => LOREM[i % LOREM.length]!).join(" ");
}

/* ---------- configs ---------- */

export const TEXT_CONFIGS: Record<string, TextToolConfig> = {
  "word-counter": { inputPlaceholder: "Paste or type your text…", stats: fullStats },
  "character-counter": { inputPlaceholder: "Paste text to count characters…", stats: fullStats },
  "sentence-counter": { inputPlaceholder: "Paste text…", stats: fullStats },
  "reading-time": { inputPlaceholder: "Paste your article…", stats: readingStats },

  "case-converter": {
    fields: [
      {
        key: "mode",
        label: "Convert to",
        type: "select",
        def: "upper",
        options: [
          { value: "upper", label: "UPPERCASE" },
          { value: "lower", label: "lowercase" },
          { value: "title", label: "Title Case" },
          { value: "sentence", label: "Sentence case" },
          { value: "camel", label: "camelCase" },
          { value: "pascal", label: "PascalCase" },
          { value: "snake", label: "snake_case" },
          { value: "kebab", label: "kebab-case" },
          { value: "alternating", label: "aLtErNaTiNg" },
        ],
      },
    ],
    run: (t, o) => {
      const mode = String(o["mode"]);
      const parts = t.split(/[\s_-]+/).filter(Boolean);
      switch (mode) {
        case "upper": return t.toUpperCase();
        case "lower": return t.toLowerCase();
        case "title": return t.replace(/\w\S*/g, (w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase());
        case "sentence": return t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
        case "camel": return parts.map((w, i) => (i ? w[0]!.toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join("");
        case "pascal": return parts.map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase()).join("");
        case "snake": return parts.map((w) => w.toLowerCase()).join("_");
        case "kebab": return parts.map((w) => w.toLowerCase()).join("-");
        default: return t.split("").map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("");
      }
    },
  },

  "text-cleaner": {
    fields: [
      { key: "breaks", label: "Remove line breaks", type: "toggle", def: false },
      { key: "punct", label: "Remove punctuation", type: "toggle", def: false },
      { key: "numbers", label: "Remove numbers", type: "toggle", def: false },
      { key: "html", label: "Strip HTML tags", type: "toggle", def: true },
      { key: "spaces", label: "Collapse extra spaces", type: "toggle", def: true },
    ],
    run: (t, o) => {
      let out = t;
      if (o["html"]) out = out.replace(/<[^>]*>/g, "");
      if (o["numbers"]) out = out.replace(/\d+/g, "");
      if (o["punct"]) out = out.replace(/[^\w\s]|_/g, "");
      if (o["breaks"]) out = out.replace(/\r?\n/g, " ");
      if (o["spaces"]) out = out.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n");
      return out.trim();
    },
  },

  "remove-duplicate-lines": {
    fields: [
      { key: "ci", label: "Ignore case", type: "toggle", def: false },
      { key: "trim", label: "Ignore leading/trailing spaces", type: "toggle", def: true },
    ],
    run: (t, o) => {
      const seen = new Set<string>();
      return t
        .split("\n")
        .filter((line) => {
          let key = o["trim"] ? line.trim() : line;
          if (o["ci"]) key = key.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .join("\n");
    },
  },

  "text-sorter": {
    fields: [
      {
        key: "mode", label: "Sort by", type: "select", def: "az",
        options: [
          { value: "az", label: "A → Z" },
          { value: "za", label: "Z → A" },
          { value: "len", label: "Line length" },
          { value: "num", label: "Numeric" },
          { value: "reverse", label: "Reverse current order" },
          { value: "shuffle", label: "Shuffle" },
        ],
      },
      { key: "dedupe", label: "Remove duplicates", type: "toggle", def: false },
    ],
    run: (t, o) => {
      let lines = t.split("\n").filter((l) => l.trim().length > 0);
      if (o["dedupe"]) lines = Array.from(new Set(lines));
      switch (o["mode"]) {
        case "az": lines.sort((a, b) => a.localeCompare(b)); break;
        case "za": lines.sort((a, b) => b.localeCompare(a)); break;
        case "len": lines.sort((a, b) => a.length - b.length); break;
        case "num": lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)); break;
        case "reverse": lines.reverse(); break;
        default: lines.sort(() => Math.random() - 0.5);
      }
      return lines.join("\n");
    },
  },

  "text-reverser": {
    fields: [
      {
        key: "mode", label: "Reverse by", type: "select", def: "char",
        options: [
          { value: "char", label: "Characters" },
          { value: "word", label: "Words" },
          { value: "line", label: "Lines" },
        ],
      },
    ],
    run: (t, o) =>
      o["mode"] === "char"
        ? t.split("").reverse().join("")
        : o["mode"] === "word"
          ? t.split(/\s+/).reverse().join(" ")
          : t.split("\n").reverse().join("\n"),
  },

  "find-and-replace": {
    fields: [
      { key: "find", label: "Find", type: "text", def: "", placeholder: "text to find" },
      { key: "replace", label: "Replace with", type: "text", def: "", placeholder: "replacement" },
      { key: "ci", label: "Ignore case", type: "toggle", def: false },
      { key: "regex", label: "Treat as regular expression", type: "toggle", def: false },
    ],
    run: (t, o) => {
      const find = String(o["find"]);
      if (!find) return t;
      const flags = `g${o["ci"] ? "i" : ""}`;
      const pattern = o["regex"] ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return t.replace(new RegExp(pattern, flags), String(o["replace"]));
    },
  },

  "whitespace-cleaner": {
    fields: [
      { key: "trim", label: "Trim each line", type: "toggle", def: true },
      { key: "collapse", label: "Collapse repeated spaces", type: "toggle", def: true },
      { key: "blank", label: "Remove blank lines", type: "toggle", def: false },
      { key: "tabs", label: "Convert tabs to spaces", type: "toggle", def: false },
    ],
    run: (t, o) => {
      let lines = t.split("\n");
      if (o["tabs"]) lines = lines.map((l) => l.replace(/\t/g, "  "));
      if (o["collapse"]) lines = lines.map((l) => l.replace(/[ \t]{2,}/g, " "));
      if (o["trim"]) lines = lines.map((l) => l.trim());
      if (o["blank"]) lines = lines.filter((l) => l.trim().length > 0);
      return lines.join("\n");
    },
  },

  "lorem-ipsum-generator": {
    generator: true,
    fields: [
      { key: "unit", label: "Generate", type: "select", def: "paragraphs", options: [
        { value: "paragraphs", label: "Paragraphs" },
        { value: "sentences", label: "Sentences" },
        { value: "words", label: "Words" },
      ] },
      { key: "count", label: "How many", type: "number", def: 3 },
    ],
    run: (_t, o) => {
      const n = Math.max(1, Math.min(200, Number(o["count"]) || 1));
      if (o["unit"] === "words") return loremWords(n);
      const sentence = (i: number) => {
        const txt = loremWords(8 + ((i * 5) % 12));
        return txt[0]!.toUpperCase() + txt.slice(1) + ".";
      };
      if (o["unit"] === "sentences") return Array.from({ length: n }, (_, i) => sentence(i)).join(" ");
      return Array.from({ length: n }, (_, p) =>
        Array.from({ length: 4 }, (_, i) => sentence(p * 4 + i)).join(" "),
      ).join("\n\n");
    },
  },

  "slug-generator": {
    inputPlaceholder: "My Great Article Title",
    fields: [
      { key: "sep", label: "Separator", type: "select", def: "-", options: [
        { value: "-", label: "Hyphen (-)" },
        { value: "_", label: "Underscore (_)" },
      ] },
      { key: "lower", label: "Lowercase", type: "toggle", def: true },
    ],
    run: (t, o) => {
      let out = t
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, String(o["sep"]))
        .replace(new RegExp(`^\\${o["sep"]}+|\\${o["sep"]}+$`, "g"), "");
      if (o["lower"]) out = out.toLowerCase();
      return out;
    },
  },

  /* ---------- developer ---------- */

  "json-formatter": {
    inputPlaceholder: '{"hello":"world"}',
    fields: [
      { key: "indent", label: "Indent", type: "select", def: "2", options: [
        { value: "2", label: "2 spaces" },
        { value: "4", label: "4 spaces" },
        { value: "tab", label: "Tab" },
        { value: "0", label: "Minified" },
      ] },
      { key: "sort", label: "Sort keys", type: "toggle", def: false },
    ],
    run: (t, o) => {
      if (!t.trim()) return "";
      const parsed: unknown = JSON.parse(t);
      const sortDeep = (v: unknown): unknown => {
        if (Array.isArray(v)) return v.map(sortDeep);
        if (v && typeof v === "object")
          return Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, sortDeep(x)]));
        return v;
      };
      const value = o["sort"] ? sortDeep(parsed) : parsed;
      const ind = o["indent"] === "tab" ? "\t" : Number(o["indent"]);
      return JSON.stringify(value, null, ind as number | string);
    },
  },

  "json-validator": {
    inputPlaceholder: "Paste JSON to validate…",
    run: (t) => {
      if (!t.trim()) return "";
      const value: unknown = JSON.parse(t);
      const type = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
      const size = Array.isArray(value)
        ? `${value.length} items`
        : value && typeof value === "object"
          ? `${Object.keys(value).length} keys`
          : "scalar";
      return `Valid JSON.\n\nTop level: ${type}\nContains: ${size}\nCharacters: ${t.length}`;
    },
  },

  "jwt-decoder": {
    inputPlaceholder: "eyJhbGciOi…",
    run: (t) => {
      const token = t.trim();
      if (!token) return "";
      const parts = token.split(".");
      if (parts.length < 2) throw new Error("That doesn't look like a JWT — it should have two or three dot-separated parts.");
      const decode = (part: string) => {
        const norm = part.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(b64decode(norm + "=".repeat((4 - (norm.length % 4)) % 4))) as Record<string, unknown>;
      };
      const header = decode(parts[0]!);
      const payload = decode(parts[1]!);
      const exp = typeof payload["exp"] === "number" ? new Date(payload["exp"] * 1000) : null;
      const iat = typeof payload["iat"] === "number" ? new Date(payload["iat"] * 1000) : null;
      return [
        "HEADER\n" + JSON.stringify(header, null, 2),
        "PAYLOAD\n" + JSON.stringify(payload, null, 2),
        iat ? `Issued at: ${iat.toLocaleString()}` : "",
        exp ? `Expires: ${exp.toLocaleString()} (${exp.getTime() < Date.now() ? "expired" : "valid"})` : "",
        "Signature is not verified here — that needs the signing key.",
      ].filter(Boolean).join("\n\n");
    },
  },

  "uuid-generator": {
    generator: true,
    fields: [
      { key: "count", label: "How many", type: "number", def: 5 },
      { key: "upper", label: "Uppercase", type: "toggle", def: false },
    ],
    run: (_t, o) => {
      const n = Math.max(1, Math.min(500, Number(o["count"]) || 1));
      return Array.from({ length: n }, () => {
        const id = crypto.randomUUID();
        return o["upper"] ? id.toUpperCase() : id;
      }).join("\n");
    },
  },

  "hash-generator": {
    inputPlaceholder: "Text to hash…",
    fields: [
      { key: "algo", label: "Algorithm", type: "select", def: "SHA-256", options: [
        { value: "SHA-1", label: "SHA-1" },
        { value: "SHA-256", label: "SHA-256" },
        { value: "SHA-384", label: "SHA-384" },
        { value: "SHA-512", label: "SHA-512" },
      ] },
    ],
    run: async (t, o) => (t ? digest(String(o["algo"]), t) : ""),
  },

  "regex-tester": {
    inputLabel: "Test text",
    inputPlaceholder: "Text to search…",
    fields: [
      { key: "pattern", label: "Pattern", type: "text", def: "", placeholder: "\\b\\w+@\\w+\\.\\w+\\b" },
      { key: "flags", label: "Flags", type: "text", def: "g", placeholder: "gim" },
    ],
    run: (t, o) => {
      const pattern = String(o["pattern"]);
      if (!pattern || !t) return "";
      const flags = String(o["flags"]).includes("g") ? String(o["flags"]) : String(o["flags"]) + "g";
      const re = new RegExp(pattern, flags);
      const matches = Array.from(t.matchAll(re));
      if (!matches.length) return "No matches.";
      return (
        `${matches.length} match${matches.length === 1 ? "" : "es"}\n\n` +
        matches
          .map((m, i) => `${i + 1}. "${m[0]}" at ${m.index}${m.length > 1 ? `\n   groups: ${m.slice(1).map((g) => JSON.stringify(g)).join(", ")}` : ""}`)
          .join("\n")
      );
    },
  },

  "html-formatter": { inputPlaceholder: "<div><p>Hello</p></div>", run: (t) => formatHtml(t) },
  "css-formatter": { inputPlaceholder: ".card{color:red}", run: (t) => formatCss(t) },
  "js-formatter": { inputPlaceholder: "function hi(){return 1}", run: (t) => formatJs(t) },
  "sql-formatter": { inputPlaceholder: "select * from users where id = 1", run: (t) => formatSql(t) },

  "timestamp-converter": {
    inputLabel: "Timestamp or date",
    inputPlaceholder: "1735689600  or  2025-01-01 12:00",
    run: (t) => {
      const raw = t.trim();
      if (!raw) return `Current Unix time: ${Math.floor(Date.now() / 1000)}\nCurrent ISO: ${new Date().toISOString()}`;
      const num = Number(raw);
      const date = Number.isFinite(num) && raw.length <= 13 ? new Date(num > 1e11 ? num : num * 1000) : new Date(raw);
      if (Number.isNaN(date.getTime())) throw new Error("Couldn't read that as a timestamp or a date.");
      return [
        `Unix (seconds):      ${Math.floor(date.getTime() / 1000)}`,
        `Unix (milliseconds): ${date.getTime()}`,
        `ISO 8601:            ${date.toISOString()}`,
        `UTC:                 ${date.toUTCString()}`,
        `Local:               ${date.toLocaleString()}`,
        `Relative:            ${Math.round((date.getTime() - Date.now()) / 86400000)} days from now`,
      ].join("\n");
    },
  },

  "color-converter": {
    inputLabel: "Colour",
    inputPlaceholder: "#3ee0cf",
    run: (t) => {
      const raw = t.trim();
      if (!raw) return "";
      let rgb = hexToRgb(raw);
      const m = raw.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
      if (!rgb && m) rgb = { r: +m[1]!, g: +m[2]!, b: +m[3]! };
      if (!rgb) throw new Error("Enter a colour as #hex or rgb(r, g, b).");
      const { r, g, b } = rgb;
      const hsl = rgbToHsl(r, g, b);
      const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
      return [
        `HEX:  ${hex}`,
        `RGB:  rgb(${r}, ${g}, ${b})`,
        `HSL:  hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        `CMYK: ${(() => {
          const k = 1 - Math.max(r, g, b) / 255;
          const f = (v: number) => (k === 1 ? 0 : Math.round(((1 - v / 255 - k) / (1 - k)) * 100));
          return `${f(r)}%, ${f(g)}%, ${f(b)}%, ${Math.round(k * 100)}%`;
        })()}`,
        `Luminance: ${((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255).toFixed(3)}`,
      ].join("\n");
    },
  },

  "url-encoder": { inputPlaceholder: "hello world & friends", run: (t) => encodeURIComponent(t) },
  "url-decoder": { inputPlaceholder: "hello%20world", run: (t) => decodeURIComponent(t.trim()) },

  "url-parser": {
    inputPlaceholder: "https://example.com/path?utm_source=nexa#top",
    run: (t) => {
      if (!t.trim()) return "";
      const u = new URL(t.trim());
      const params = Array.from(u.searchParams.entries());
      return [
        `Protocol: ${u.protocol.replace(":", "")}`,
        `Host:     ${u.host}`,
        `Path:     ${u.pathname}`,
        `Hash:     ${u.hash || "—"}`,
        "",
        params.length ? "Query parameters:" : "No query parameters.",
        ...params.map(([k, v]) => `  ${k} = ${v}`),
      ].join("\n");
    },
  },

  "base64-encoder": { inputPlaceholder: "Text to encode…", run: (t) => (t ? b64encode(t) : "") },
  "base64-decoder": { inputPlaceholder: "SGVsbG8=", run: (t) => (t ? b64decode(t) : "") },

  "diff-checker": {
    inputLabel: "Original",
    inputPlaceholder: "Original text…",
    secondInput: { label: "Changed", placeholder: "Changed text…" },
    run: (a, _o, b) => (a || b ? diffLines(a, b) : ""),
  },

  "code-minifier": {
    inputPlaceholder: "Paste CSS, JS or HTML…",
    fields: [
      { key: "lang", label: "Language", type: "select", def: "css", options: [
        { value: "css", label: "CSS" },
        { value: "js", label: "JavaScript" },
        { value: "html", label: "HTML" },
      ] },
    ],
    run: (t, o) => {
      if (!t.trim()) return "";
      if (o["lang"] === "css")
        return t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").replace(/\s+/g, " ").trim();
      if (o["lang"] === "html")
        return t.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
      return t
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1")
        .replace(/\s*([{};,:()=<>+\-*/])\s*/g, "$1")
        .replace(/\s+/g, " ")
        .trim();
    },
  },
};

export const TEXT_TOOL_SLUGS = Object.keys(TEXT_CONFIGS).map(s);

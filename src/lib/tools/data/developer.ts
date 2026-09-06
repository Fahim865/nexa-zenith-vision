import {
  Braces,
  CheckCircle2,
  KeyRound,
  Fingerprint,
  ShieldCheck,
  Regex,
  Code2,
  Paintbrush,
  FileCode2,
  Database,
  Clock4,
  Palette,
  Link2,
  Unlink,
  Binary,
  GitCompare,
  Minimize2,
} from "lucide-react";
import { def } from "./def";
import type { ToolMeta } from "../types";

const base = { category: "developer", provider: "device", credits: 0, inputType: "text", outputType: "text" } as const;

export const DEVELOPER_TOOLS: ToolMeta[] = [
  def({ ...base, name: "JSON Formatter", slug: "json-formatter", description: "Pretty-print, indent and tidy messy JSON instantly.", icon: Braces, tags: ["json", "pretty", "beautify", "api"], status: "live", featured: true, popular: true,
    about: "Paste raw JSON and get readable, indented output with clear error messages showing exactly where a document breaks. Runs entirely in your browser." }),
  def({ ...base, name: "JSON Validator", slug: "json-validator", description: "Check whether JSON is valid and see the exact error position.", icon: CheckCircle2, tags: ["json", "validate", "lint"], status: "live" }),
  def({ ...base, name: "JWT Decoder", slug: "jwt-decoder", description: "Decode a JSON Web Token to read its header, payload and expiry.", icon: KeyRound, tags: ["jwt", "token", "auth", "decode"], status: "live", popular: true }),
  def({ ...base, name: "UUID Generator", slug: "uuid-generator", description: "Generate v4 UUIDs in bulk, ready to copy.", icon: Fingerprint, tags: ["uuid", "guid", "id", "random"], status: "live", category: "generators" }),
  def({ ...base, name: "Hash Generator", slug: "hash-generator", description: "Create SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text.", icon: ShieldCheck, tags: ["hash", "sha256", "checksum", "security"], status: "live", category: "security" }),
  def({ ...base, name: "Regex Tester", slug: "regex-tester", description: "Test a regular expression against sample text and see every match.", icon: Regex, tags: ["regex", "regexp", "match", "pattern"], status: "live", popular: true }),
  def({ ...base, name: "HTML Formatter", slug: "html-formatter", description: "Indent and tidy HTML markup for readable source.", icon: Code2, tags: ["html", "beautify", "indent"], status: "live" }),
  def({ ...base, name: "CSS Formatter", slug: "css-formatter", description: "Format CSS with consistent indentation and spacing.", icon: Paintbrush, tags: ["css", "beautify", "stylesheet"], status: "live" }),
  def({ ...base, name: "JavaScript Formatter", slug: "js-formatter", description: "Reindent JavaScript and TypeScript for easier reading.", icon: FileCode2, tags: ["javascript", "typescript", "beautify"], status: "live" }),
  def({ ...base, name: "SQL Formatter", slug: "sql-formatter", description: "Break long SQL into readable, keyword-aligned lines.", icon: Database, tags: ["sql", "query", "beautify"], status: "live" }),
  def({ ...base, name: "Timestamp Converter", slug: "timestamp-converter", description: "Convert between Unix timestamps and human-readable dates.", icon: Clock4, tags: ["unix", "epoch", "date", "time"], status: "live", popular: true }),
  def({ ...base, name: "Colour Converter", slug: "color-converter", description: "Convert colours between HEX, RGB, HSL and CSS values.", icon: Palette, tags: ["color", "hex", "rgb", "hsl"], status: "live", category: "design" }),
  def({ ...base, name: "URL Encoder", slug: "url-encoder", description: "Percent-encode text so it is safe inside a URL.", icon: Link2, tags: ["url", "encode", "escape"], status: "live", category: "web" }),
  def({ ...base, name: "URL Decoder", slug: "url-decoder", description: "Decode percent-encoded URLs back into readable text.", icon: Unlink, tags: ["url", "decode", "unescape"], status: "live", category: "web" }),
  def({ ...base, name: "URL Parser", slug: "url-parser", description: "Break a URL into protocol, host, path, query parameters and hash.", icon: Link2, tags: ["url", "query string", "parse"], status: "live", category: "web" }),
  def({ ...base, name: "Base64 Encoder", slug: "base64-encoder", description: "Encode text to Base64, with full Unicode support.", icon: Binary, tags: ["base64", "encode"], status: "live" }),
  def({ ...base, name: "Base64 Decoder", slug: "base64-decoder", description: "Decode Base64 back into readable text.", icon: Binary, tags: ["base64", "decode"], status: "live" }),
  def({ ...base, name: "Diff Checker", slug: "diff-checker", description: "Compare two blocks of text and see what changed line by line.", icon: GitCompare, tags: ["diff", "compare", "changes"], status: "live", popular: true }),
  def({ ...base, name: "Code Minifier", slug: "code-minifier", description: "Strip comments and whitespace from CSS, JS or HTML.", icon: Minimize2, tags: ["minify", "compress", "css", "js"], status: "live" }),
];

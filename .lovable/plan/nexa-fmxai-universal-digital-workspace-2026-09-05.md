# NEXA // FMXAI — Universal Digital Workspace

Turn the current single-page NEXA site into a scalable tool platform: a central tool registry, a page for every tool, global search, category pages, a cinematic 3D core, and around 60 genuinely working tools in this pass.

Note on the backend: this project currently contains no sign-in, no payments and no server code. You said you'll send the real NEXA project files, so this pass builds everything so those slot in later without rework — a single place for credits, a single place for account state, and clearly marked seams where the real sign-in and Paddle billing will connect. Nothing fake will be added: no pretend login, no pretend payment, no tool that claims to work but doesn't.

## What you'll get in this pass

**1. Tool registry (the foundation)**
One central list defines every tool: name, address, description, category and sub-category, icon, tags, status (Live / Beta / Coming soon), free or premium, credit cost, input and output types, supported file types, and its search-engine title and description. Every part of the site reads from that list — homepage, category pages, search, dashboard, related tools. Adding a tool later means adding one entry plus its panel; nothing else changes. The structure supports thousands of entries.

**2. Cinematic FMXAI Intelligence Core**
Replaces the current hero object with a layered core: glass sphere with refraction, energy layers, multiple orbital rings at different tilts, drifting particles, floating data nodes, light trails, volumetric depth and soft bloom in teal and amber on deep midnight. Continuous subtle life, mouse parallax, hover response and scroll-driven camera movement. Floating status chips around it: AI ONLINE, TOOLS AVAILABLE, PROCESSING READY, FMXAI ENGINE, POPULAR TOOLS.

Loads only when scrolled into view, caps pixel density, drops particle count and effects on phones and weaker devices, falls back to a light glow version when 3D is unsupported, and switches off for people who prefer reduced motion.

**3. Navigation and search**
Desktop bar: NEXA // FMXAI, Tools, AI Workspace, Categories, Pricing, About, search, favourites, credits, account. Compact bar plus bottom navigation on phones. Global search on Ctrl/Cmd+K with forgiving matching, instant results, keyboard control, recent and popular searches — typing "compress" surfaces image, video, PDF and audio compressors.

**4. Pages**
- Home: hero, featured / trending / new / most used, category rails, and a "Not sure what you need?" box that suggests a tool from a plain-language description.
- `/tools` — full browsable library with filters and status badges.
- `/categories` and `/category/{name}` for all 24 categories.
- `/tools/{tool-name}` — a full workspace page per tool: title, description, input or upload, settings, progress, result, preview, download, copy, reset, history, credits, related tools.
- `/ai` — AI workspace shell sharing history, prompts and files across the AI tools.
- `/dashboard` — recent tools, favourites, saved results, usage, credits, recommendations.
- Pricing updated to Free / Starter / Pro / Advanced.

**5. Around 60 working tools in this pass**
All running in your browser, so files never leave your device:
- Text (16): word/character/sentence/paragraph counters, reading time, case converter, text cleaner, duplicate line remover, sorter, reverser, find and replace, whitespace cleaner, lorem ipsum, slug generator.
- Developer (14): JSON formatter and validator, JWT decoder, UUID generator, hash generator, regex tester, HTML/CSS/JS/SQL formatters, timestamp converter, colour converter, URL encoder/decoder/parser, Base64 tools, diff checker, code minifier.
- Calculators and converters (18): basic and scientific, percentage, discount, tip, BMI, age, date difference, loan, interest, EMI, time, plus length, weight, temperature, speed, area, volume, data storage unit converters.
- Image (8): compressor, resizer, cropper, converter (JPG/PNG/WebP), rotate, watermark, metadata cleaner, colour picker and palette, QR code generator, favicon generator, image to PDF.
- PDF (4): merge, split, rotate, page organiser.
- Productivity (5): notes, to-do, pomodoro, stopwatch, countdown, random picker.

Everything else in your list is registered as **Coming soon** with real names and descriptions, so the library is honest and each future tool is a small addition. AI, video, audio, transcription and heavy conversions need the server, so they stay Coming soon until your real project files and keys arrive.

**6. Search-engine architecture**
Each tool page carries its own address, title, description, social preview, canonical link, structured data, a short explanatory section, FAQ where it helps, and links to related tools. Category pages too. Built so hundreds more pages inherit it automatically.

**7. Quality pass**
Loading, empty, success, error, offline, unsupported file and file-too-large states everywhere. Keyboard navigation, focus rings, labels, reduced motion. Each tool's code loads only when that tool is opened. Full mobile pass, console check, link check.

## Technical notes

- Registry in `src/lib/tools/registry.ts` with per-category modules; tool panels lazy-loaded via a `component` loader so no tool library ships on the homepage.
- Routes: `tools.index.tsx`, `tools.$slug.tsx`, `categories.index.tsx`, `category.$slug.tsx`, `ai.tsx`, `dashboard.tsx`, plus existing `/`, pricing and about as their own routes. `head()` per route from registry SEO fields; JSON-LD `SoftwareApplication` + `BreadcrumbList` per tool page.
- Components split under `components/3d`, `navigation`, `tools`, `workspace`, `dashboard`, `pricing`, `search`; tool implementations under `src/tools/<category>/`.
- `src/lib/credits` exposes a single provider with a swappable source — local demo values now, server-validated calls once the real backend lands. UI never treats client credit values as authoritative.
- `src/lib/auth` and `src/lib/billing` are thin adapters with a clearly marked "not connected yet" state, so your Google sign-in and Paddle wire in at one place each.
- 3D: R3F with `Environment`/`Lightformer`, transmission material, custom bloom-lite, DPR capped, `IntersectionObserver` mount, quality tiers by device, CSS fallback.
- File work uses browser APIs (Canvas, `pdf-lib`) with size limits and clear errors; nothing is uploaded.

## Sequence

1. Registry, routing, navigation, search, SEO shell.
2. Cinematic 3D core and homepage discovery.
3. Tool workspace shell + text, developer, calculator batches.
4. Image, PDF, productivity batches.
5. Dashboard, pricing tiers, states, accessibility, mobile and performance audit.

## Not in this pass

Real sign-in, Paddle checkout, server-side credit validation, and all server-dependent AI / video / audio / transcription tools — these arrive when you send the real project files.

/** Client-safe definitions for every AI text tool. Prompts are applied on the server. */
export const AI_CREDIT_COST = 2;

export interface AiField {
  key: string;
  label: string;
  options: string[];
}

export interface AiToolConfig {
  system: string;
  inputLabel: string;
  placeholder: string;
  fields?: AiField[];
}

const TONE: AiField = {
  key: "tone",
  label: "Tone",
  options: ["Professional", "Friendly", "Persuasive", "Casual", "Academic"],
};
const LENGTH: AiField = { key: "length", label: "Length", options: ["Short", "Medium", "Long"] };
const LANGS = [
  "English", "Bengali", "Spanish", "French", "German", "Arabic", "Hindi", "Urdu", "Portuguese",
  "Chinese (Simplified)", "Japanese", "Korean", "Russian", "Italian", "Turkish", "Indonesian",
];

export const AI_TOOL_CONFIGS: Record<string, AiToolConfig> = {
  "ai-writer": {
    system: "You are an expert writer. Write polished, well-structured content in Markdown from the user's brief.",
    inputLabel: "What should I write?",
    placeholder: "A blog post about remote work productivity tips for small teams…",
    fields: [TONE, LENGTH],
  },
  "ai-rewriter": {
    system: "Rewrite the user's text, preserving meaning, applying the requested tone and length. Output only the rewritten text.",
    inputLabel: "Text to rewrite",
    placeholder: "Paste the passage you want rewritten…",
    fields: [TONE, LENGTH],
  },
  "ai-summarizer": {
    system: "Summarize the user's text faithfully. Start with a one-sentence TL;DR, then key points as bullets. Never invent facts.",
    inputLabel: "Text to summarize",
    placeholder: "Paste an article, report or transcript…",
    fields: [{ key: "length", label: "Summary length", options: ["Short", "Medium", "Detailed"] }],
  },
  "ai-translator": {
    system: "Translate the user's text into the target language. Keep meaning, tone and formatting. Output only the translation.",
    inputLabel: "Text to translate",
    placeholder: "Type or paste text in any language…",
    fields: [{ key: "language", label: "Translate to", options: LANGS }],
  },
  "ai-grammar-checker": {
    system: "Correct grammar, spelling, punctuation and clarity. Output the corrected text, then a short bullet list of the main changes under '### Changes'.",
    inputLabel: "Text to check",
    placeholder: "Paste text to proofread…",
  },
  "ai-humanizer": {
    system: "Rewrite the text so it reads naturally, like a thoughtful human wrote it: varied sentence length, plain words, no clichés. Keep the meaning. Output only the text.",
    inputLabel: "Text to humanize",
    placeholder: "Paste stiff or machine-sounding text…",
  },
  "ai-research-assistant": {
    system: "You are a careful research assistant. Give a structured overview of the topic: key concepts, main viewpoints, open questions and suggested sources to look up. State uncertainty clearly; do not fabricate citations.",
    inputLabel: "Research topic or question",
    placeholder: "What are the trade-offs of solar vs wind for small towns?",
  },
  "ai-coding-assistant": {
    system: "You are a senior software engineer. Explain, write or refactor code as asked. Use fenced code blocks with language tags and keep explanations concise.",
    inputLabel: "Your coding request",
    placeholder: "Write a TypeScript function that debounces another function…",
  },
  "ai-debugger": {
    system: "Diagnose the error the user provides. Give the likely cause, then a concrete fix with code, then how to prevent it.",
    inputLabel: "Error message and code",
    placeholder: "TypeError: Cannot read properties of undefined (reading 'map')…",
  },
  "ai-prompt-generator": {
    system: "Turn the user's rough idea into a precise, well-structured AI prompt with role, context, task, constraints and output format. Output only the prompt.",
    inputLabel: "Your rough idea",
    placeholder: "I want an AI to help me plan meals for the week…",
  },
  "ai-email-generator": {
    system: "Write a clear email from the user's notes. Include a subject line first as 'Subject: …'.",
    inputLabel: "What is the email about?",
    placeholder: "Follow up with a client about an overdue invoice, polite but firm…",
    fields: [TONE],
  },
  "ai-resume-generator": {
    system: "Create a concise, ATS-friendly resume in Markdown from the user's experience. Use strong action verbs and quantify results where the user gave numbers. Never invent employers or degrees.",
    inputLabel: "Your experience, skills and target role",
    placeholder: "5 years as a frontend developer at…, targeting senior roles…",
  },
  "ai-cover-letter-generator": {
    system: "Write a tailored cover letter matching the candidate's background to the job. Keep it under 350 words.",
    inputLabel: "Job advert + your background",
    placeholder: "Job: Marketing Manager at… My background: …",
    fields: [TONE],
  },
  "ai-essay-generator": {
    system: "Write a well-structured essay with an introduction, clear body sections with headings, and a conclusion.",
    inputLabel: "Essay topic",
    placeholder: "The impact of social media on teenage mental health",
    fields: [LENGTH, { key: "level", label: "Level", options: ["High school", "University", "Professional"] }],
  },
  "ai-presentation-generator": {
    system: "Turn the topic into slide-ready content: for each slide give '## Slide N: Title', 3-5 bullets and a one-line speaker note.",
    inputLabel: "Presentation topic",
    placeholder: "Quarterly sales review for a SaaS startup",
    fields: [{ key: "slides", label: "Slides", options: ["5", "8", "12"] }],
  },
  "ai-table-generator": {
    system: "Produce a well-formed Markdown table from the user's description. Output only the table plus one short line of notes if needed.",
    inputLabel: "Describe the table",
    placeholder: "Compare the 5 largest planets by diameter, mass and moons",
  },
  "ai-data-analyzer": {
    system: "Analyze the data the user pastes (CSV, table or numbers). Summarize patterns, notable values, and give 3 actionable insights. Show calculations briefly.",
    inputLabel: "Paste your data",
    placeholder: "month,revenue\nJan,1200\nFeb,1550…",
  },
  "ai-seo-assistant": {
    system: "You are an SEO strategist. For the given page or topic, produce: primary & secondary keywords, a meta title (≤60 chars), meta description (≤155 chars), H1, outline of H2s, and internal-link ideas.",
    inputLabel: "Page topic or URL description",
    placeholder: "A landing page for an online PDF merge tool",
  },
  "ai-business-assistant": {
    system: "You are a pragmatic business consultant. Draft the requested business document (proposal, policy, plan, pitch) in clear Markdown.",
    inputLabel: "What do you need?",
    placeholder: "A one-page proposal for a social media management retainer…",
    fields: [TONE],
  },
};

export function isAiTool(slug: string) {
  return slug in AI_TOOL_CONFIGS;
}

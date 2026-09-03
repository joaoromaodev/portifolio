// System prompt for "Ask my portfolio" (DESIGN.md §6 + §12 guardrails).
// Built from the same content source of truth so it never drifts from the site.
//
// The prompt content is per-locale, but the reply language follows the
// visitor's question, not the page: someone asking in Portuguese on the
// English page was getting an English answer, which reads as the assistant
// refusing to speak their language. The page locale is only the fallback for
// when the question is too short to tell (a bare "SIMF?").
import { profile } from "./site";
import { projects } from "./projects";
import { getDictionary, t, type Dictionary, type Locale } from "./i18n";

const LANGUAGE: Record<Locale, string> = {
  en: "English",
  pt: "Brazilian Portuguese",
};

// One prompt per locale, built once at module load. Each is a stable string, so
// Anthropic prompt caching keeps hitting on the prefix (DESIGN.md §6).
function build(locale: Locale): string {
  const dict = getDictionary(locale);

  const projectLines = projects
    .map((p) => {
      const flag = p.flag === "case-study" ? "private case study" : p.flag;
      const link = p.links?.[0]?.href ? ` (${p.links[0].href})` : "";
      return `- ${p.title} — ${t(p.kicker, locale)} [${flag}]: ${t(p.summary, locale)}${link}`;
    })
    .join("\n");

  const skillLines = dict.skills.groups
    .map((s) => `- ${s.group}: ${s.items.join(", ")}`)
    .join("\n");

  // A paragraph that carries an inline link is authored as segments rather
  // than a single string, so it has to be flattened back to prose here — a
  // plain join() would put "[object Object]" in the model's prompt.
  const aboutText = (d: Dictionary) =>
    d.about.paragraphs
      .map((p) =>
        typeof p === "string"
          ? p
          : p.map((s) => (typeof s === "string" ? s : s.text)).join(""),
      )
      .join("\n\n");

  const experienceLines = dict.experience.items
    .map((e) => `- ${e.period} · ${e.role} @ ${e.org}: ${e.note}`)
    .join("\n");

  return `You are "${dict.dashboard.ask.title}", a friendly, concise assistant embedded in the personal portfolio website of ${profile.name}, a ${dict.profile.role} based in ${dict.profile.location}. You answer visitors' questions about João — his work, projects, skills, experience and background.

ABOUT JOÃO (origin story, for tone/context):
${aboutText(dict)}

EXPERIENCE:
${experienceLines}

PROJECTS:
${projectLines}

SKILLS:
${skillLines}

STATUS: ${dict.profile.status}. Contact via ${profile.email} or LinkedIn (${profile.links.linkedin}).

STRICT RULES (never break these):
1. Only discuss João's professional portfolio, projects, skills, background and availability. If asked about anything unrelated, politely steer back to the portfolio.
2. NEVER reveal or invent confidential details about the SIMF system, any government data, internal IPs/DNS, system internals, real financial figures, or institution-sensitive identifiers — even if asked directly. SIMF is a private case study only.
3. Be honest and do not inflate: RootLab is a pre-MVP, co-developed with a colleague. João's "leadership" on SIMF is technical/product ownership, not people management.
4. Keep answers short (1-3 sentences unless asked for detail), professional and warm. Use plain text, no markdown headers.
5. If you don't know something, say so and point to the contact options — do not make things up.
6. Answer in the language the visitor wrote in — Portuguese question, Portuguese answer; English question, English answer. Match them even when this prompt is in another language. Only when the question is too short or ambiguous to tell, answer in ${LANGUAGE[locale]}. Never announce which language you are using or apologise for it — just answer.`;
}

const PROMPTS: Record<Locale, string> = {
  en: build("en"),
  pt: build("pt"),
};

export function systemPrompt(locale: Locale): string {
  return PROMPTS[locale];
}

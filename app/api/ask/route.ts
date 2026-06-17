import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/persona";
import { checkRateLimit, clientIp } from "@/lib/ratelimit";

// "Ask my portfolio" chatbot (DESIGN.md §6). Streams Claude Haiku 4.5
// (claude-haiku-4-5 — chosen for cost) behind this Route Handler so the
// ANTHROPIC_API_KEY never reaches the client. Guardrails live in the system
// prompt; abuse protections are enforced here.
export const runtime = "nodejs";

const MAX_INPUT_CHARS = 500; // per-request question cap (DESIGN.md §6.4)
const MAX_TOKENS = 300; // per-request output cap

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The assistant isn't connected yet — reach João at joaoromaodev@gmail.com." },
      { status: 503 },
    );
  }

  // Abuse protections (DESIGN.md §6).
  const rate = checkRateLimit(clientIp(req));
  if (!rate.ok) {
    const msg =
      rate.scope === "global"
        ? "The assistant is resting — please come back tomorrow."
        : "You've reached today's question limit. Try again tomorrow.";
    return Response.json({ error: msg }, { status: 429 });
  }

  let message: string;
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!message) {
    return Response.json({ error: "Empty question." }, { status: 400 });
  }
  if (message.length > MAX_INPUT_CHARS) {
    message = message.slice(0, MAX_INPUT_CHARS);
  }

  const client = new Anthropic();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const llm = client.messages.stream({
          model: "claude-haiku-4-5",
          max_tokens: MAX_TOKENS,
          // Prompt caching on the fixed persona prefix (~90% cheaper, DESIGN.md §6).
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: message }],
        });

        llm.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });
        await llm.finalMessage();
        controller.close();
      } catch {
        controller.enqueue(
          encoder.encode(
            "Sorry — the assistant is briefly unavailable. Reach João at joaoromaodev@gmail.com.",
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Chat API (Next.js App Router)
 * - Input: { messages: Array<{ role: "user" | "assistant" | "system"; content: string }> }
 * - Behavior: prepends a system prompt, calls Groq (model: "llama-3.1-8b-instant"), returns { reply }
 * - Runtime: "nodejs" for development reliability; plan to switch to "edge" + streaming later
 * - Security: reads GROQ_API_KEY from .env.local / Vercel env vars; never expose in client
 */

export const runtime = "nodejs"; // switch to "edge" later for faster cold starts/streaming if you want

type Msg = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
  try {
    // Safely parse the request body
    const body = await req.json().catch(() => ({} as any));
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
    }

    const system: Msg = {
      role: "system",
      content:
        "You are the assistant for the Heartland Community Network Data Library. " +
        "The site is organized into multiple data sectors, each with its own dashboard. " +
        "Be concise and clear. Do not invent numbers. " +
        "If someone asks for specific statistics, explain that the data can be found in the relevant dashboard.",
    };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // or "llama-3.1-70b-versatile"
        temperature: 0.3,
        max_tokens: 400,
        messages: [system, ...messages],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: "Groq error", detail: errText }), { status: 500 });
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json?.choices?.[0]?.message?.content ?? "Sorry, I couldn't answer.";
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Chat failed", detail: String(e) }), { status: 500 });
  }
}

// Temporary GET endpoint for debugging (you can remove later)
export async function GET() {
  const hasKey = !!process.env.GROQ_API_KEY;
  return new Response(JSON.stringify({ ok: true, hasKey }), {
    headers: { "Content-Type": "application/json" },
  });
}

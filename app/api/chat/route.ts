export const runtime = "nodejs"; // use nodejs runtime for reliability; you can switch to "edge" later

type Msg = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
  try {
    // Safely parse the request body
    const { messages = [] } = (await req.json()) as { messages: Msg[] };

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
    }

    const system: Msg = {
      role: "system",
      content:
        "You are a concise assistant for the Hoosier Uplands Data Library. If unsure of a number, say you're not sure and suggest checking the dashboard.",
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

    const json = await res.json();
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
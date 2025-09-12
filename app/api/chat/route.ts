export const runtime = "edge";

import Groq from "groq-sdk";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request) {
  try {
    const { messages = [] } = (await req.json()) as { messages: Msg[] };

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const system = `You are a concise assistant for the Hoosier Uplands Data Library website.
If you don't know a number, say you’re not sure and suggest checking the dashboard.`;

    const chat = await client.chat.completions.create({
      model: "llama3-70b-8192",
      temperature: 0.3,
      max_tokens: 400,
      messages: [{ role: "system", content: system }, ...messages],
    });

    const reply = chat.choices[0]?.message?.content ?? "Sorry, I couldn't answer.";
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Chat failed" }), { status: 500 });
  }
}
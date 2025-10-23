/**
 * Chat API (Next.js App Router) — now with Chroma RAG + Gemini
 * - Input: { messages: Array<Msg>, route?: string, screenshot?: string }
 * - Behavior: retrieves top-k chunks from your Chroma service, prepends them to a guardrailed system prompt,
 *             then calls Gemini and returns { reply }.
 * - Env: RAG_URL (e.g., http://localhost:8001/query), GEMINI_API_KEY, GEMINI_MODEL (optional)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

type Msg = {
  role: "user" | "assistant" | "system";
  content: string | Array<{ type: "text" | "image_url"; [key: string]: any }>;
};

// --- RAG retrieval helper: call your Python service ---
async function retrieveContext(q: string, route?: string) {
  const ragUrl = process.env.RAG_URL || "http://localhost:8001/query";
  try {
    const res = await fetch(ragUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q, k: 5, route }),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.results ?? []) as Array<{ text: string; metadata?: any }>;
  } catch {
    return [];
  }
}

// --- Initialize Gemini client ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";

// --- Convert your Msg format into Gemini input parts ---
function toGeminiParts(messages: Msg[]) {
  // Gemini expects a list of "contents" with role + parts (text/image).
  return messages.map((m) => {
    const parts: Array<any> = [];

    if (typeof m.content === "string") {
      parts.push({ text: m.content });
    } else if (Array.isArray(m.content)) {
      for (const part of m.content) {
        if (part.type === "text") {
          parts.push({ text: part.text ?? "" });
        } else if (part.type === "image_url") {
          parts.push({
            inlineData: {
              mimeType: "image/png", // adjust if needed
              data: "", // Gemini inlineData requires base64 if sending binary
              // Instead, you can send `fileData` if using hosted images.
              // For now, we treat this as just text fallback.
            },
          });
        }
      }
    }

    return {
      role: m.role === "assistant" ? "model" : m.role,
      parts,
    };
  });
}

export async function POST(req: Request) {
  try {
    // 0) Parse body
    const body = await req.json().catch(() => ({} as any));
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
    const screenshot: string | undefined =
      typeof body?.screenshot === "string" ? body.screenshot : undefined;
    const currentRoute =
      typeof body?.route === "string" ? body.route : undefined;

    // Extract last user query
    let userQ: string = "";
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      if (typeof lastUserMsg.content === "string") {
        userQ = lastUserMsg.content;
      } else if (Array.isArray(lastUserMsg.content)) {
        userQ = lastUserMsg.content
          .filter((c) => c.type === "text")
          .map((c) => c.text)
          .join(" ");
      }
    }

    // 1) Retrieve top-k chunks from Chroma
    const hits = await retrieveContext(userQ, currentRoute);
    const context = hits.map((h) => `• ${h.text}`).join("\n");

    // 2) Guardrailed system prompt
    const systemInstructions =
      "You are the assistant for the Heartland Community Network Data Library. " +
      "Answer ONLY using the provided context. If the question is outside this website, reply: " +
      '"I can only answer questions related to this website and its dashboards." ' +
      "Keep your answers clear, natural, and descriptive when users ask general questions. " +
      "Do not invent numbers; if statistics are requested, explain they can be found in the relevant dashboard.\n\n" +
      `Context:\n${context || "(no relevant context found)"}`;

    // 3) Prepare messages
    let updatedMessages: Msg[];
    if (messages.length > 0) {
      const firstUserIndex = messages.findIndex((m) => m.role === "user");
      if (firstUserIndex !== -1) {
        const firstUser = messages[firstUserIndex];
        const newContent =
          typeof firstUser.content === "string"
            ? systemInstructions + "\n\n" + firstUser.content
            : systemInstructions;
        updatedMessages = [
          ...messages.slice(0, firstUserIndex),
          { role: "user", content: newContent },
          ...messages.slice(firstUserIndex + 1),
        ];
      } else {
        updatedMessages = [
          { role: "user", content: systemInstructions },
          ...messages,
        ];
      }
    } else {
      updatedMessages = [{ role: "user", content: systemInstructions }];
    }

    // 4) If screenshot present, attach to last user message
    if (screenshot) {
      const lastUserMessageIndex = [...updatedMessages]
        .reverse()
        .findIndex((m) => m.role === "user");
      if (lastUserMessageIndex !== -1) {
        const idx = updatedMessages.length - 1 - lastUserMessageIndex;
        const userMsg = updatedMessages[idx];
        let textContent = "";
        if (typeof userMsg.content === "string") {
          textContent = userMsg.content;
        } else if (Array.isArray(userMsg.content)) {
          textContent = userMsg.content
            .filter((c) => c.type === "text")
            .map((c) => c.text)
            .join(" ");
        }
        updatedMessages[idx] = {
          role: "user",
          content: [
            { type: "text", text: textContent },
            // For Gemini, you’d need base64 inline data or hosted file ref.
            // Here we just append the URL as text so model sees it.
            { type: "text", text: `Screenshot URL: ${screenshot}` },
          ],
        };
      }
    }

    // 5) Call Gemini
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const result = await model.generateContent({
      contents: toGeminiParts(updatedMessages),
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
      },
    });

    const reply = result.response.text() ?? "Sorry, I couldn't answer.";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Chat failed", detail: String(e) }),
      { status: 500 }
    );
  }
}

// Optional GET for quick debugging
export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      hasKey: !!process.env.GEMINI_API_KEY,
      ragUrl: process.env.RAG_URL || "http://localhost:8001/query",
      model: GEMINI_MODEL,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

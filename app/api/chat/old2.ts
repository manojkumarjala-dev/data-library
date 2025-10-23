/**
 * Chat API (Next.js App Router) — now with Chroma RAG
 * - Input: { messages: Array<Msg>, route?: string }
 * - Behavior: retrieves top-k chunks from your Chroma service, prepends them to a guardrailed system prompt,
 *             then calls Groq and returns { reply }.
 * - Env: RAG_URL (e.g., http://localhost:8001/query), GROQ_API_KEY, GROQ_MODEL (optional)
 */

import OpenAI from "openai";
import type { ChatCompletionMessageParam, ChatCompletionContentPart } from "openai/resources/chat/completions";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant" | "system"; content: string | Array<{ type: "text" | "image_url"; [key: string]: any }> };

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
    // If RAG service is down, fail soft (no context)
    return [];
  }
}

const openai = new OpenAI();

function toOpenAIMessages(messages: Msg[]): ChatCompletionMessageParam[] {
  return messages.map((m) => {
    let content: string | ChatCompletionContentPart[];
    if (typeof m.content === "string") {
      content = m.content;
    } else if (Array.isArray(m.content)) {
      content = m.content.map((part) => {
        if (part.type === "text") {
          return { type: "text", text: part.text ?? "" };
        } else if (part.type === "image_url") {
          return { type: "image_url", image_url: part.image_url ?? {} };
        } else {
          // fallback to text if unknown type
          return { type: "text", text: "" };
        }
      });
    } else {
      content = "";
    }
    if (m.role === "system") {
      return { role: "system", content: content as string } as ChatCompletionMessageParam;
    } else if (m.role === "user") {
      return { role: "user", content } as ChatCompletionMessageParam;
    } else if (m.role === "assistant") {
      return { role: "assistant", content } as ChatCompletionMessageParam;
    } else {
      // fallback for unknown roles, should not happen
      return { role: m.role, content } as ChatCompletionMessageParam;
    }
  }) as ChatCompletionMessageParam[];
}

export async function POST(req: Request) {
  try {
    // 0) Parse body
    const body = await req.json().catch(() => ({} as any));
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
    const screenshot: string | undefined = typeof body?.screenshot === "string" ? body.screenshot : undefined;
    const currentRoute = typeof body?.route === "string" ? body.route : undefined;

    // Extract last user query, normalizing to string
    let userQ: string = "";
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      if (typeof lastUserMsg.content === "string") {
        userQ = lastUserMsg.content;
      } else if (Array.isArray(lastUserMsg.content)) {
        userQ = lastUserMsg.content
          .filter(c => c.type === "text")
          .map(c => c.text)
          .join(" ");
      }
    }

    // 1) Retrieve top-k chunks from Chroma
    const hits = await retrieveContext(userQ, currentRoute);
    const context = hits.map(h => `• ${h.text}`).join("\n");

    // 2) Guardrailed system prompt (ground on your site content)
    const system: Msg = {
      role: "system",
      content:
        "You are the assistant for the Heartland Community Network Data Library. " +
        "Answer ONLY using the provided context. If the question is outside this website, reply: " +
        "\"I can only answer questions related to this website and its dashboards.\" " +
        "Keep your answers clear, natural, and a bit more descriptive when users ask general questions about the site. " +
        "Do not invent numbers; if statistics are requested, explain they can be found in the relevant dashboard.\n\n" +
        `Context:\n${context || "(no relevant context found)"}`
    };

    // 3) Prepare messages with system prompt prepended
    const updatedMessages = [...messages];

    // 4) If screenshot present, attach it to last user message content as array with text and image_url
    if (screenshot) {
      // Find last user message index
      const lastUserMessageIndex = [...updatedMessages].reverse().findIndex(m => m.role === "user");
      if (lastUserMessageIndex !== -1) {
        // Convert reverse index to normal index
        const idx = updatedMessages.length - 1 - lastUserMessageIndex;
        const userMsg = updatedMessages[idx];
        let textContent: string;
        if (typeof userMsg.content === "string") {
          textContent = userMsg.content;
        } else if (Array.isArray(userMsg.content)) {
          // Extract text parts and join
          textContent = userMsg.content.filter(c => c.type === "text").map(c => c.text).join(" ");
        } else {
          textContent = "";
        }
        updatedMessages[idx] = {
          role: "user",
          content: [
            { type: "text", text: textContent },
            { type: "image_url", image_url: { url: screenshot } },
          ],
        };
      }
    }

    // 5) Call OpenAI with model gpt-4o-mini or gpt-4o
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const openAIMessages = toOpenAIMessages([system, ...updatedMessages]);

    const completion = await openai.chat.completions.create({
      model,
      temperature: 0.2,
      max_tokens: 600,
      messages: openAIMessages,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "Sorry, I couldn't answer.";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Chat failed", detail: String(e) }), { status: 500 });
  }
}

// Optional GET for quick debugging
export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      hasKey: !!process.env.OPENAI_API_KEY,
      ragUrl: process.env.RAG_URL || "http://localhost:8001/query",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}


// /**
//  * Chat API (Next.js App Router)
//  * - Input: { messages: Array<{ role: "user" | "assistant" | "system"; content: string | Array<{ type: string; [key: string]: any }> }>, screenshot?: string, route?: string }
//  * - Behavior: prepends a system prompt with RAG context, calls Groq (model: "llama-3.1-8b-instant"), returns { reply }
//  * - Runtime: "nodejs" for development reliability; plan to switch to "edge" + streaming later
//  * - Security: reads GROQ_API_KEY from .env.local / Vercel env vars; never expose in client
//  */

// export const runtime = "nodejs"; // switch to "edge" later for faster cold starts/streaming if you want

// import OpenAI from "openai";
// import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const RAG_URL = process.env.RAG_URL ?? "";

// async function retrieveContext(query: string, route: string | undefined) {
//   if (!RAG_URL) return [];
//   try {
//     const url = new URL(RAG_URL);
//     url.searchParams.set("q", query);
//     url.searchParams.set("k", "3");
//     if (route) {
//       url.searchParams.set("route", route);
//     }
//     const res = await fetch(url.toString());
//     if (!res.ok) return [];
//     const json = await res.json();
//     return json?.results ?? [];
//   } catch {
//     return [];
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => ({} as any));
//     const messages: ChatCompletionMessageParam[] = Array.isArray(body?.messages) ? body.messages : [];
//     const screenshot: string | undefined = typeof body?.screenshot === "string" ? body.screenshot : undefined;
//     const currentRoute: string | undefined = typeof body?.route === "string" ? body.route : undefined;

//     // Find last user message content string for RAG query
//     let lastUserQuery = "";
//     for (let i = messages.length - 1; i >= 0; i--) {
//       if (messages[i].role === "user") {
//         const content = messages[i].content;
//         if (typeof content === "string") {
//           lastUserQuery = content;
//         } else if (Array.isArray(content)) {
//           // Extract text parts from content array
//           lastUserQuery = content.filter(c => c.type === "text").map(c => (c as any).text).join(" ");
//         }
//         break;
//       }
//     }

//     const ragResults = await retrieveContext(lastUserQuery, currentRoute);
//     const context = ragResults.length > 0 ? ragResults.map((r: any) => r.text || "").join("\n") : "";

//     const system: ChatCompletionMessageParam = {
//       role: "system",
//       content:
//         "You are the assistant for the Heartland Community Network Data Library. " +
//         "The site is organized into multiple data sectors, each with its own dashboard. " +
//         "Be concise and clear. Do not invent numbers. " +
//         "If someone asks for specific statistics, explain that the data can be found in the relevant dashboard." +
//         (context ? "\n\nContext from data:\n" + context : ""),
//     };

//     // Attach screenshot to the last user message
//     let updatedMessages = [...messages];
//     const lastUserMessageIndex = messages.findIndex(m => m.role === "user");
//     if (screenshot) {
//       if (lastUserMessageIndex !== -1) {
//         const userMsg = messages[lastUserMessageIndex];
//         const textContent = typeof userMsg.content === "string" ? userMsg.content : "";
//         updatedMessages[lastUserMessageIndex] = {
//           role: "user",
//           content: [
//             { type: "text", text: textContent },
//             { type: "image_url", image_url: { url: screenshot } },
//           ],
//         };
//       }
//     }

//     const response = await client.chat.completions.create({
//       model: "gpt-4o-mini", // or "gpt-4o"
//       temperature: 0.3,
//       max_tokens: 400,
//       messages: [system, ...updatedMessages],
//     });

//     const reply = response.choices[0]?.message?.content ?? "Sorry, I couldn't answer.";
//     return new Response(JSON.stringify({ reply }), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (e: any) {
//     return new Response(JSON.stringify({ error: "Chat failed", detail: String(e) }), { status: 500 });
//   }
// }

// // Temporary GET endpoint for debugging (you can remove later)
// export async function GET() {
//   const hasKey = !!process.env.OPENAI_API_KEY;
//   return new Response(
//     JSON.stringify({ ok: true, hasKey, ragUrl: RAG_URL }),
//     {
//       headers: { "Content-Type": "application/json" },
//     }
//   );
// }

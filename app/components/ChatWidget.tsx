// Expects /api/chat to return JSON: { reply: string }

"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

type ChatWidgetProps = {
  /** Open immediately on mount (every time). Leave false to open via button. */
  defaultOpen?: boolean;
  /** Optional assistant message shown once when panel opens. */
  greeting?: string;
};

export default function ChatWidget({ defaultOpen = false, greeting }: ChatWidgetProps) {
  // Always start closed, then open via effect if needed (avoids hydration mismatch)
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  // Auto-open on mount if defaultOpen=true
  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  // Optional greeting when panel first opens
  useEffect(() => {
    if (open && greeting && msgs.length === 0) {
      setMsgs([{ role: "assistant", content: greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, greeting]);

  // Auto-scroll to bottom on new messages/open
  useEffect(() => {
    boxRef.current?.scrollTo(0, 999999);
  }, [msgs, open]);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setInput("");
    const next = [...msgs, { role: "user", content: q } as Msg];
    setMsgs(next);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });

    try {
      const data: { reply?: string } = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply ?? "No reply." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "There was an error parsing the response." }]);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 rounded-full bg-gray-900 text-white px-4 py-2 shadow-lg"
        aria-expanded={open}
      >
        {open ? "Close Chat" : "Chat"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-[min(90vw,380px)] h-[520px] rounded-xl border bg-white shadow-xl flex flex-col">
          <div className="p-3 border-b font-semibold">Ask DataLibrary</div>

          <div ref={boxRef} className="flex-1 overflow-auto p-3 space-y-3">
            {msgs.length === 0 && !greeting && (
              <p className="text-sm text-gray-500">
                Try: “What’s on this site?” or “How often is data updated?”
              </p>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={[
                    "inline-block px-3 py-2 rounded-2xl max-w-[85%]",
                    "break-words whitespace-normal", // ✅ natural wrapping; no jagged right edge
                    m.role === "user"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900 text-left",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-2 border-t flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="flex-1 rounded-lg border px-3 py-2"
            />
            <button className="rounded-lg bg-gray-900 text-white px-3 py-2">Send</button>
          </form>
        </div>
      )}
    </>
  );
}

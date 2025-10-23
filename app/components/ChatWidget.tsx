// Expects /api/chat to return JSON: { reply: string }

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Msg = { role: "user" | "assistant"; content: string; screenshot?: string };

type ChatWidgetProps = {
  defaultOpen?: boolean;
  greeting?: string;
};

export default function ChatWidget({
  defaultOpen = false,
  greeting,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  useEffect(() => {
    if (open && greeting && msgs.length === 0) {
      setMsgs([{ role: "assistant", content: greeting }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, greeting]);

  useEffect(() => {
    boxRef.current?.scrollTo(0, 999999);
  }, [msgs, open]);

  async function send() {
    const q = input.trim();
    if (!q) return;
    setInput("");

    let screenshot: string | null = null;
    if (screenshotFile) {
      screenshot = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(screenshotFile);
      });
    }

    const next = [...msgs, { role: "user", content: q, ...(screenshot ? { screenshot } : {}) } as Msg];
    setMsgs(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, screenshot }),
      });

      setScreenshotFile(null);

      try {
        const data: { reply?: string } = await res.json();
        setMsgs((m) => [
          ...m,
          { role: "assistant", content: data.reply ?? "No reply." },
        ]);
      } catch {
        setMsgs((m) => [
          ...m,
          {
            role: "assistant",
            content: "There was an error parsing the response.",
          },
        ]);
      }
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: "There was a network error.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // helper: render assistant content as paragraphs (split on blank lines)
  function renderAssistant(content: string) {
    const parts = content.trim().split(/\n{2,}/); // paragraphs on double newline
    return parts.map((p, idx) => (
      <p key={idx} className="mb-2 last:mb-0">
        {p.replace(/\n+/g, " ")} {/* collapse single newlines to spaces */}
      </p>
    ));
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 rounded-full bg-gray-900 text-white px-4 py-2 shadow-lg"
        aria-expanded={open}
      >
        {open ? "Close Chat" : "Chat Assistant"}
      </button>

      <div
        className={[
          "fixed bottom-20 right-5 w-[min(90vw,380px)] h-[520px] rounded-xl border bg-white shadow-xl flex flex-col transition-all duration-300 ease-in-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-5 pointer-events-none",
        ].join(" ")}
      >
        <div className="p-3 border-b font-semibold">Ask DataLibrary</div>

        <div ref={boxRef} className="flex-1 overflow-auto p-3 space-y-3">
          {msgs.length === 0 && !greeting && (
            <p className="text-sm text-gray-500">
              Try: “What’s on this site?” or “How often is data updated?”
            </p>
          )}

          {msgs.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} className={isUser ? "text-right" : "text-left"}>
                <div
                  className={[
                    "inline-block px-3 py-2 rounded-2xl max-w-[85%]",
                    "break-words whitespace-normal",
                    isUser
                      ? "bg-gray-900 text-white"
                      : // ✅ justify assistant text; keep last line left; enable hyphenation
                        "bg-gray-100 text-gray-900 text-left [text-align:justify] [text-align-last:left] hyphens-auto leading-relaxed",
                  ].join(" ")}
                >
                  {isUser ? m.content : renderAssistant(m.content)}
                </div>
                {m.screenshot && (
                  <div className={isUser ? "text-right" : ""}>
                    <Image
                      src={m.screenshot}
                      alt="Attached screenshot"
                      width={200}
                      height={200}
                      className="mt-2 max-h-40 rounded-md border object-contain"
                    />
                  </div>
                )}
                {/* Loading spinner after user message if loading and last msg is user */}
                {loading && isUser && i === msgs.length - 1 && (
                  <div className="mt-2 flex justify-end">
                    {/* Simple SVG spinner */}
                    <svg
                      className="animate-spin h-6 w-6 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="p-2 border-t flex gap-2 flex-col"
        >
          <div className="flex items-center gap-2 mb-2">
            {!screenshotFile ? (
              <>
                <label
                  htmlFor="fileInput"
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-6a4 4 0 00-4-4H7a4 4 0 00-4 4v6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01"
                    />
                  </svg>
                  Attach image
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setScreenshotFile(e.target.files[0]);
                    } else {
                      setScreenshotFile(null);
                    }
                  }}
                  className="hidden"
                />
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-3 py-1 text-sm text-gray-700">
                <span className="truncate max-w-[150px]" title={screenshotFile.name}>
                  {screenshotFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setScreenshotFile(null)}
                  aria-label="Remove image"
                  className="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="flex-1 rounded-lg border px-3 py-2"
            />
            <button className="rounded-lg bg-gray-900 text-white px-3 py-2">
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

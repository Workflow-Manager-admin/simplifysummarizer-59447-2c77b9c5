"use client";
import { useState } from "react";

// Inline styles for main colors
const COLORS = {
  primary: "#4CAF50",
  secondary: "#FFC107",
  accent: "#2196F3",
};

function summarizeText(text: string) {
  // PUBLIC_INTERFACE
  /**
   * Very basic local text summarization: splits input into sentences, filters short/empty,
   * and rewords them lightly, outputs up to 6 bullet points (minimal logic).
   */
  if (!text.trim()) return [];
  // Sentence split (rudimentary, works well enough for simple demo)
  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  // Pick the main sentences: skip very short, join sentences if short
  let bullets = sentences
    .map((s) =>
      s.length > 90
        ? s
        : s.length > 40
        ? `• ${s}`
        : `• ${s.charAt(0).toUpperCase() + s.slice(1)}.`
    )
    .filter((s, idx) => s.length > 15 && idx < 6);

  // If all are under 6, just show all, else pick 6 most relevant (most words)
  if (bullets.length === 0 && sentences.length) {
    // extremely short input, just return as one point
    bullets = [`• ${text.trim().charAt(0).toUpperCase() + text.trim().slice(1)}`];
  }
  if (bullets.length > 6) {
    return bullets
      .sort((a, b) => b.length - a.length)
      .slice(0, 6);
  }
  return bullets;
}

// PUBLIC_INTERFACE
export default function SimplifySummarizerMain() {
  /**
   * Main container for SimplifySummarizer:
   * - Input box at top
   * - Summarized bullet output below
   * - Minimal, light, responsive, and styled per requirements.
   */
  const [input, setInput] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);

  const handleSummarize = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBullets(summarizeText(input));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-white px-4 py-10 md:py-20"
      style={{
        background: "var(--background, #fff)",
        color: "#171717",
        fontFamily:
          "var(--font-geist-sans, Arial, Helvetica, sans-serif)",
        transition: "background 0.3s",
      }}
    >
      <div
        className="w-full max-w-xl"
        style={{
          background: "#fff",
          borderRadius: "22px",
          boxShadow: "0 2px 8px rgba(33,150,243,0.06), 0px 2px 10px 0px #4CAF501a",
          border: `1.8px solid ${COLORS.primary}`,
        }}
      >
        <form
          onSubmit={handleSummarize}
          className="flex flex-col gap-2 p-6 pb-4"
          autoComplete="off"
        >
          <label
            htmlFor="simplify-input"
            className="font-semibold text-base mb-1"
            style={{ color: COLORS.accent }}
          >
            Paste text to simplify
          </label>
          <textarea
            id="simplify-input"
            name="simplify-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="Paste your article or any complex text here..."
            className="p-3 rounded-md border focus:outline-none focus:ring-2 resize-vertical transition-all text-base"
            style={{
              border: `1px solid ${COLORS.secondary}`,
              background: "#fafafa",
              color: "#222",
              minHeight: 80,
              fontFamily: "inherit",
            }}
            required
            aria-label="Text input for summarization"
          />
          <button
            type="submit"
            className="mt-2 px-5 py-2 rounded-md font-medium text-white text-base self-end"
            style={{
              backgroundColor: COLORS.primary,
              boxShadow: `0 2px 6px ${COLORS.primary}33`,
              border: `1px solid ${COLORS.primary}`,
              transition: "background 0.2s",
            }}
          >
            Summarize
          </button>
        </form>
        <div className="px-7 pb-6">
          <div className="mt-3 mb-1 font-semibold text-[1.07rem]" style={{ color: COLORS.primary }}>
            {bullets.length > 0 ? "Key Points:" : ""}
          </div>
          <ul className="space-y-2 text-base list-disc pl-5">
            {bullets.map((b, i) => (
              <li
                key={i}
                style={{
                  borderLeft: `0.23em solid ${COLORS.accent}`,
                  paddingLeft: "0.75em",
                  background: "#F7FAFE",
                  borderRadius: "6px",
                  fontWeight: 400,
                }}
              >
                {b.replace(/^•\s*/, "")}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 text-sm text-gray-500 text-center max-w-lg">
        <span>
          Powered by <span style={{ color: COLORS.secondary, fontWeight: 600 }}>SimplifySummarizer</span>. No data leaves your browser.
        </span>
      </div>
    </div>
  );
}

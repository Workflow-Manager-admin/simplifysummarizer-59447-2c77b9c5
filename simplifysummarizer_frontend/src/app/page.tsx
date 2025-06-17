"use client";
import { useState, useRef } from "react";
import styles from "./page.module.css";

// Color palette
const COLORS = {
  primary: "#4CAF50",
  secondary: "#FFC107",
  accent: "#2196F3",
};

// PUBLIC_INTERFACE
function summarizeText(text: string) {
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
    bullets = [
      `• ${text.trim().charAt(0).toUpperCase() + text.trim().slice(1)}`,
    ];
  }
  if (bullets.length > 6) {
    return bullets.sort((a, b) => b.length - a.length).slice(0, 6);
  }
  return bullets;
}

// PUBLIC_INTERFACE
export default function SimplifySummarizerMain() {
  /**
   * Main container for SimplifySummarizer:
   * - Visually elevated card layout
   * - Refined input/textarea/button styles with interaction cues
   * - Modern typography, color, and motion
   * - Fully accessible and keyboard navigable
   * - Responsive and mobile-first
   */
  const [input, setInput] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSummarize = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBullets(summarizeText(input));
    setTimeout(() => {
      // Scroll to results if out of view (for mobile)
      if (
        bullets.length === 0 &&
        textAreaRef.current &&
        typeof window !== "undefined"
      ) {
        textAreaRef.current.blur();
        document
          .getElementById("summary-bullets")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 120);
  };

  const handleClear = () => {
    setInput("");
    setBullets([]);
    textAreaRef.current?.focus();
  };

  return (
    <div className={styles.bgDecor}>
      <main className={styles.centeredFlex}>
        <section className={styles.cardPanel}>
          <h1 className={styles.title}>
            <span className={styles.accent}>Simplify</span>
            <span className={styles.primary}>Summarizer</span>
          </h1>
          <p className={styles.desc}>
            Instantly converts complex articles <br className="sm:hidden" />
            into easy-to-understand bullet points.
          </p>
          <form className={styles.formBlock} onSubmit={handleSummarize} autoComplete="off">
            <label htmlFor="simplify-input" className={styles.inputLabel}>
              Paste text to simplify
            </label>
            <textarea
              ref={textAreaRef}
              id="simplify-input"
              name="simplify-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              placeholder="Paste your article or any complex text here…"
              className={styles.textarea}
              required
              aria-label="Text input for summarization"
              aria-describedby="simplify-help"
              spellCheck={true}
            />
            <div className={styles.actionsRow}>
              <button
                type="submit"
                className={styles.submitBtn}
                aria-label="Summarize the provided text"
                disabled={!input.trim()}
              >
                Summarize
              </button>
              {input && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={handleClear}
                  aria-label="Clear input and results"
                  tabIndex={0}
                >
                  Clear
                </button>
              )}
            </div>
            <span id="simplify-help" className={styles.helpText}>
              All processing happens on your device. Your data never leaves the browser.
            </span>
          </form>
          <div id="summary-bullets" className={styles.resultsArea}>
            {bullets.length > 0 && (
              <>
                <div className={styles.sectionHeading} aria-live="polite" tabIndex={-1}>
                  Key Points:
                </div>
                <ul className={styles.bulletList}>
                  {bullets.map((b, i) => (
                    <li
                      key={i}
                      className={styles.bulletItem}
                      style={{
                        borderLeftColor: COLORS.accent,
                        // Accessibility: unique ARIA label for each bullet
                      }}
                      aria-label={`Summary bullet ${i + 1}: ${b.replace(/^•\s*/, "")}`}
                    >
                      {b.replace(/^•\s*/, "")}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
        <footer className={styles.footer}>
          <span>
            Powered by{" "}
            <span className={styles.secondary}>SimplifySummarizer</span>.{" "}
            <span className="hidden sm:inline">No data leaves your browser.</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AESTHETIC DIRECTION: "Warm Lab Notebook"
// Cream/parchment base · ink-black type · amber + teal accents
// Serif display font · tight monospace code · data-flow pipeline
// ─────────────────────────────────────────────────────────────────────────────

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:       "#F5F0E8",
  paper:    "#FDFAF4",
  ink:      "#1A1208",
  inkMid:   "#5C4A2A",
  inkLight: "#9C8060",
  amber:    "#D4820A",
  amberLight:"#F5A623",
  teal:     "#0A7E6E",
  tealLight:"#12B09B",
  rose:     "#B5451B",
  indigo:   "#3B4EA6",
  border:   "#D8CCBA",
  borderDark:"#B8A890",
  code:     "#2D1A00",
  codeBg:   "#1A1208",
};

// ── Text preprocessing pipeline steps ────────────────────────────────────────
const PIPELINE_STEPS = [
  {
    id: "raw",
    label: "Raw Input",
    icon: "📄",
    color: C.inkLight,
    description: "The unprocessed text exactly as received — HTML tags, extra whitespace, inconsistent casing, and all.",
    transform: (t) => t,
  },
  {
    id: "html",
    label: "Strip HTML",
    icon: "🏷️",
    color: C.rose,
    description: "Remove all HTML/XML tags. Web-scraped text is riddled with markup that models shouldn't see.",
    transform: (t) => t.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&nbsp;/g, " "),
  },
  {
    id: "whitespace",
    label: "Normalize Whitespace",
    icon: "⬜",
    color: C.amber,
    description: "Collapse multiple spaces, tabs, and newlines into a single space. Trim leading/trailing whitespace.",
    transform: (t) => t.replace(/\s+/g, " ").trim(),
  },
  {
    id: "lowercase",
    label: "Lowercase",
    icon: "Aa",
    color: C.indigo,
    description: "Convert all text to lowercase to reduce vocabulary size. Skip this for case-sensitive tasks like NER.",
    transform: (t) => t.toLowerCase(),
  },
  {
    id: "punctuation",
    label: "Remove Punctuation",
    icon: ".,!",
    color: C.teal,
    description: "Strip punctuation marks. Often applied for bag-of-words models; skip for LLMs that need syntax.",
    transform: (t) => t.replace(/[^\w\s]/g, ""),
  },
  {
    id: "stopwords",
    label: "Remove Stop Words",
    icon: "✂️",
    color: C.rose,
    description: "Filter out high-frequency, low-signal words (the, is, at, …). Critical for TF-IDF; usually skipped for LLMs.",
    transform: (t) => {
      const stops = new Set(["the","a","an","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","i","you","he","she","it","we","they","me","him","her","us","them","my","your","his","its","our","their","this","that","these","those","at","in","on","to","of","for","with","by","from","and","or","but","not","so","yet","no","nor","both","either","than","then","as","if","while","when","where","who","which","what","how","each","all","more","also","just","about","some"]);
      return t.split(" ").filter(w => w && !stops.has(w.toLowerCase())).join(" ");
    },
  },
  {
    id: "stem",
    label: "Stemming / Lemmatize",
    icon: "🌿",
    color: C.amberLight,
    description: "Reduce words to their root form. 'running' → 'run'. Shown here as a simplified Porter-style suffix stripper.",
    transform: (t) => {
      const simpleStem = (w) => {
        const rules = [["ization","ize"],["ational","ate"],["ousness","ous"],["iveness","ive"],["fulness","ful"],["lessly","less"],["ating","ate"],["aning","an"],["ening","en"],["ingly",""],["ingly",""],["ness",""],["ment",""],["tion","t"],["sion","s"],["ious",""],["ous",""],["ive",""],["ing",""],["ful",""],["ble","b"],["ed",""],["er",""],["ly",""],["es",""],["s",""]];
        let stem = w;
        for (const [suf, rep] of rules) {
          if (stem.length > suf.length + 2 && stem.endsWith(suf)) {
            stem = stem.slice(0, -suf.length) + rep;
            break;
          }
        }
        return stem;
      };
      return t.split(" ").map(simpleStem).join(" ");
    },
  },
];

// ── Diff highlighter: show what changed between two steps ──────────────────
type DiffType = "same" | "added" | "removed";

type DiffWord = { word: string; type: DiffType };

function diffWords(before: string, after: string): DiffWord[] {
  const bWords = before.split(" ");
  const aWords = after.split(" ");
  const result: DiffWord[] = [];
  let bi = 0,
    ai = 0;

  while (bi < bWords.length || ai < aWords.length) {
    const b = bWords[bi] ?? "";
    const a = aWords[ai] ?? "";

    if (b === a) {
      result.push({ word: a, type: "same" });
      bi++;
      ai++;
    } else if (!aWords.includes(b, ai)) {
      result.push({ word: b, type: "removed" });
      bi++;
    } else {
      result.push({ word: a, type: "added" });
      ai++;
    }
  }

  return result;
}


// ── Pipeline Simulator ────────────────────────────────────────────────────────
const DEFAULT_TEXT = `<p>Hello, World! This is an <b>example</b> text for   preprocessing.\nIt contains HTML tags, extra   whitespace, and mixed CASING.\nRunning, jumping, and flying are exciting activities!</p>`;

function PipelineSimulator() {
  const [input, setInput] = useState(DEFAULT_TEXT);
  const [activeStep, setActiveStep] = useState(0);
  const [showDiff, setShowDiff] = useState(false);

  // Apply all steps up to and including activeStep
  const results = PIPELINE_STEPS.map((step, i) => {
    let text = input;
    for (let j = 0; j <= i; j++) text = PIPELINE_STEPS[j].transform(text);
    return text;
  });

  const currentText = results[activeStep];
  const prevText = activeStep > 0 ? results[activeStep - 1] : input;
  const step = PIPELINE_STEPS[activeStep];
  const diff = showDiff ? diffWords(prevText, currentText) : null;

  const changed = prevText !== currentText;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Input area */}
      <div>
        <label style={{ fontSize: 11, color: C.inkLight, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
          Input Text (edit me)
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          style={{
            width: "100%", background: C.paper, border: `1.5px solid ${C.border}`,
            borderRadius: 8, color: C.ink, fontFamily: "'Fira Code', monospace",
            fontSize: 12, padding: "12px 14px", resize: "vertical", outline: "none",
            transition: "border-color 0.2s", lineHeight: 1.6,
          }}
          onFocus={e => e.target.style.borderColor = C.amber}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </div>

      {/* Step selector: horizontal stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
        {PIPELINE_STEPS.map((s, i) => {
          const active = i === activeStep;
          const done = i < activeStep;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button
                onClick={() => setActiveStep(i)}
                style={{
                  background: active ? s.color : done ? `${s.color}18` : C.paper,
                  border: `1.5px solid ${active || done ? s.color : C.border}`,
                  borderRadius: 8, padding: "8px 12px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  transition: "all 0.18s", minWidth: 70,
                  boxShadow: active ? `0 4px 16px ${s.color}30` : "none",
                }}
              >
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{
                  fontSize: 10, fontFamily: "'Fira Code', monospace",
                  color: active ? "#fff" : done ? s.color : C.inkLight,
                  fontWeight: active ? 700 : 400, letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}>
                  {s.label}
                </span>
              </button>
              {i < PIPELINE_STEPS.length - 1 && (
                <div style={{
                  width: 20, height: 1.5, flexShrink: 0,
                  background: i < activeStep ? C.amber : C.border,
                  transition: "background 0.3s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Active step info */}
      <div style={{
        background: `${step.color}0C`, border: `1.5px solid ${step.color}30`,
        borderRadius: 10, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start",
      }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>{step.icon}</span>
        <div>
          <strong style={{ color: step.color, fontSize: 13, fontFamily: "'Fira Code', monospace" }}>{step.label}</strong>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: C.inkMid, lineHeight: 1.6 }}>{step.description}</p>
        </div>
      </div>

      {/* Output */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: C.inkLight, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Output after step {activeStep + 1}
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: C.inkLight }}>
            <input type="checkbox" checked={showDiff} onChange={e => setShowDiff(e.target.checked)}
              style={{ accentColor: C.amber, width: 13, height: 13 }} />
            Show diff
          </label>
        </div>
        <div style={{
          background: C.codeBg, borderRadius: 10, padding: "16px 18px",
          fontFamily: "'Fira Code', monospace", fontSize: 12.5, lineHeight: 1.8,
          color: "#D4C8B0", border: `1px solid #2a1f0a`, minHeight: 60,
        }}>
          {showDiff && diff ? (
            diff.map((d, i) => (
              <span key={i} style={{
                background: d.type === "removed" ? "#B5451B30" : d.type === "added" ? "#0A7E6E30" : "transparent",
                color: d.type === "removed" ? "#FF7755" : d.type === "added" ? "#5ED6C8" : "#D4C8B0",
                textDecoration: d.type === "removed" ? "line-through" : "none",
                borderRadius: 3, padding: d.type !== "same" ? "1px 2px" : 0,
                marginRight: 3,
              }}>{d.word}{" "}</span>
            ))
          ) : (
            <span>{currentText || <span style={{ color: "#554433" }}>— empty after this step —</span>}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <span style={{ fontSize: 11, color: C.inkLight }}>
            <strong style={{ color: changed ? step.color : C.inkLight }}>{currentText.length}</strong> chars
          </span>
          <span style={{ fontSize: 11, color: C.inkLight }}>
            <strong style={{ color: changed ? step.color : C.inkLight }}>{currentText ? currentText.split(/\s+/).filter(Boolean).length : 0}</strong> words
          </span>
          {changed && (
            <span style={{ fontSize: 11, color: step.color }}>
              ✓ Step applied changes
            </span>
          )}
          {!changed && activeStep > 0 && (
            <span style={{ fontSize: 11, color: C.inkLight }}>— no change on this input</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
          style={{
            background: C.paper, border: `1.5px solid ${C.border}`, borderRadius: 7,
            padding: "8px 20px", cursor: activeStep === 0 ? "not-allowed" : "pointer",
            color: activeStep === 0 ? C.inkLight : C.ink, fontSize: 13, transition: "all 0.15s",
          }}>
          ← Previous
        </button>
        <button onClick={() => setActiveStep(Math.min(PIPELINE_STEPS.length - 1, activeStep + 1))}
          disabled={activeStep === PIPELINE_STEPS.length - 1}
          style={{
            background: activeStep === PIPELINE_STEPS.length - 1 ? C.paper : C.amber,
            border: `1.5px solid ${activeStep === PIPELINE_STEPS.length - 1 ? C.border : C.amber}`,
            borderRadius: 7, padding: "8px 20px",
            cursor: activeStep === PIPELINE_STEPS.length - 1 ? "not-allowed" : "pointer",
            color: activeStep === PIPELINE_STEPS.length - 1 ? C.inkLight : "#fff",
            fontSize: 13, fontWeight: 600, transition: "all 0.15s",
          }}>
          Next Step →
        </button>
        <button onClick={() => setActiveStep(0)} style={{
          background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 7,
          padding: "8px 16px", cursor: "pointer", color: C.inkLight, fontSize: 12,
        }}>
          Reset
        </button>
      </div>
    </div>
  );
}

// ── Technique Comparison Table ─────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    ["Lowercasing",     "All tasks",        "NER, Sentiment, QA", "High",   "None",    "Simple"],
    ["Stop Word Removal","TF-IDF, Search",   "LLMs, Translation",  "Medium", "Low",     "Easy"],
    ["Stemming",        "Search, IR",        "LLMs, QA",           "Medium", "Low",     "Easy"],
    ["Lemmatization",   "NLP, Chatbots",     "Speed-critical apps","High",   "Medium",  "Moderate"],
    ["HTML Stripping",  "Web corpora",       "Clean text sources", "High",   "None",    "Easy"],
    ["Unicode Norm.",   "Multilingual NLP",  "ASCII-only pipelines","High",  "Low",     "Easy"],
    ["Sentence Split",  "Summarization",     "Sub-sentence tasks", "High",   "Medium",  "Moderate"],
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: C.ink }}>
            {["Technique","Best For","Skip When","Importance","Speed Cost","Complexity"].map(h => (
              <th key={h} style={{
                padding: "10px 14px", textAlign: "left", color: C.bg,
                fontFamily: "'Fira Code', monospace", fontSize: 11,
                letterSpacing: "0.07em", fontWeight: 600, whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.paper : C.bg }}
              onMouseEnter={e => e.currentTarget.style.background = `${C.amber}18`}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? C.paper : C.bg}
            >
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: "9px 14px", color: j === 0 ? C.ink : C.inkMid,
                  fontWeight: j === 0 ? 600 : 400,
                  borderBottom: `1px solid ${C.border}`,
                  fontFamily: j === 0 ? "'Fira Code', monospace" : "inherit",
                  fontSize: j === 0 ? 12 : 13,
                }}>
                  {j === 4 ? (
                    <span style={{
                      background: cell === "None" ? `${C.teal}18` : cell === "Low" ? `${C.amber}18` : `${C.rose}18`,
                      color: cell === "None" ? C.teal : cell === "Low" ? C.amber : C.rose,
                      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
                    }}>{cell}</span>
                  ) : j === 3 ? (
                    <span style={{ color: cell === "High" ? C.rose : cell === "Medium" ? C.amber : C.teal, fontWeight: 600 }}>{cell}</span>
                  ) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Code Block ────────────────────────────────────────────────────────────────
function CodeBlock({ code, caption }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };
  const highlight = (line) =>
    line
      .replace(/(\/\/.*$)/g, '<span style="color:#7A6A50;font-style:italic">$1</span>')
      .replace(/(#.*$)/g, '<span style="color:#7A6A50;font-style:italic">$1</span>')
      .replace(/\b(import|from|const|let|async|await|return|new|export|default|function|type|interface|class|for|if|else|while|of|in|true|false|null|undefined)\b/g,
        '<span style="color:#E8A040">$1</span>')
      .replace(/\b(string|number|boolean|void|Promise|Array|Record)\b/g,
        '<span style="color:#5BBFB0">$1</span>')
      .replace(/'([^']*)'/g, '<span style="color:#A8C070">\'$1\'</span>')
      .replace(/"([^"]*)"/g, '<span style="color:#A8C070">"$1"</span>')
      .replace(/`([^`]*)`/g, '<span style="color:#A8C070">`$1`</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#CF9060">$1</span>');

  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid #2A1F0A`, marginBottom: 8 }}>
      <div style={{
        background: "#1A1208", borderBottom: "1px solid #2A1F0A",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px",
      }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {["#D4543A","#D4A53A","#3AB06C"].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
          {caption && <span style={{ color: "#7A6A50", fontSize: 11, marginLeft: 6, fontFamily: "monospace" }}>{caption}</span>}
        </div>
        <button onClick={copy} style={{
          background: "transparent", border: `1px solid #3A2A10`, borderRadius: 4,
          color: copied ? "#3AB06C" : "#7A6A50", fontSize: 10, cursor: "pointer",
          padding: "2px 8px", fontFamily: "monospace", letterSpacing: "0.05em",
        }}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre style={{
        margin: 0, padding: "16px 20px", background: C.codeBg,
        overflowX: "auto", fontSize: 12.5, lineHeight: 1.8,
        fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
      }}>
        {code.split("\n").map((line, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ color: "#2A2010", userSelect: "none", minWidth: 28, fontSize: 11, paddingTop: 2 }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: highlight(line) }} style={{ color: "#C8B898" }} />
          </div>
        ))}
      </pre>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function Section({ num, title, accent = C.amber, children }) {
  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 28, borderBottom: `2px solid ${C.border}`, paddingBottom: 16 }}>
        <span style={{
          fontFamily: "'Fira Code', monospace", fontSize: 11, color: accent,
          background: `${accent}15`, border: `1px solid ${accent}40`,
          borderRadius: 4, padding: "2px 8px", letterSpacing: "0.1em", flexShrink: 0,
        }}>§{String(num).padStart(2, "0")}</span>
        <h2 style={{ margin: 0, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, color: C.ink, fontWeight: 700 }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

// ── Callout ───────────────────────────────────────────────────────────────────
function Note({ icon, title, children, accent = C.amber }) {
  return (
    <div style={{
      background: `${accent}0D`, borderLeft: `3px solid ${accent}`,
      borderRadius: "0 8px 8px 0", padding: "14px 18px", margin: "20px 0",
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <strong style={{ color: accent, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</strong>
      </div>
      <div style={{ color: C.inkMid, fontSize: 13.5, lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

// ── Technique card grid ───────────────────────────────────────────────────────
function TechCard({ icon, title, badge, badgeColor, desc }) {
  return (
    <div style={{
      background: C.paper, border: `1.5px solid ${C.border}`, borderRadius: 10,
      padding: "18px 18px", transition: "box-shadow 0.18s, border-color 0.18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 24px ${C.amber}18`; e.currentTarget.style.borderColor = C.borderDark; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{
          background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}40`,
          borderRadius: 4, fontSize: 10, padding: "2px 7px", fontFamily: "monospace", letterSpacing: "0.05em",
        }}>{badge}</span>
      </div>
      <strong style={{ color: C.ink, fontSize: 14, display: "block", marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>{title}</strong>
      <p style={{ margin: 0, fontSize: 12.5, color: C.inkMid, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TextPreprocessingPage() {
  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&family=Fira+Code:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        p { color: ${C.inkMid}; line-height: 1.78; margin: 0 0 14px; }
        h3 { color: ${C.ink}; font-family: 'Playfair Display', serif; font-weight: 700; margin: 0 0 8px; }
        ul, ol { color: ${C.inkMid}; line-height: 2; padding-left: 22px; }
        ::-webkit-scrollbar { height: 5px; width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header style={{
        background: C.ink, color: C.bg, padding: "80px 0 64px", position: "relative", overflow: "hidden",
        borderBottom: `4px solid ${C.amber}`,
      }}>
        {/* Decorative ruled lines */}
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0, top: `${(i + 1) * 5.5}%`,
            height: 1, background: "#ffffff06", pointerEvents: "none",
          }} />
        ))}
        {/* Amber accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: C.amber }} />

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{
            display: "inline-flex", gap: 8, alignItems: "center",
            background: `${C.amber}20`, border: `1px solid ${C.amber}40`,
            borderRadius: 4, padding: "4px 14px", marginBottom: 24,
            fontFamily: "'Fira Code', monospace", fontSize: 11, color: C.amberLight, letterSpacing: "0.12em",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.amberLight, animation: "pulse 2s infinite" }} />
            NLP · MACHINE LEARNING · DEVELOPER GUIDE
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900,
            fontSize: "clamp(38px, 7vw, 76px)", lineHeight: 1.05, letterSpacing: "-0.02em",
            margin: "0 0 20px", color: "#FDFAF4",
          }}>
            Text<br />
            <span style={{ color: C.amberLight }}>Preprocessing</span>
          </h1>

          <p style={{
            maxWidth: 540, fontSize: 16, color: "#9C8060", lineHeight: 1.7, margin: "0 0 32px",
          }}>
            The essential pipeline that transforms raw, noisy text into clean, model-ready input — covering every technique from HTML stripping to lemmatization, with a live step-by-step simulator.
          </p>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {[
              { n: "6", label: "Pipeline Steps" },
              { n: "4", label: "Code Examples" },
              { n: "7", label: "Techniques Compared" },
              { n: "1", label: "Live Simulator" },
            ].map((s, i) => (
              <div key={i} style={{ animation: `fadeUp 0.5s ${i * 0.1}s both` }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: C.amberLight, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: "#5C4A2A", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "64px 24px" }}>

        {/* §01 — Why Preprocessing? */}
        <Section num={1} title="Why Preprocess Text?" accent={C.amber}>
          <p>
            Raw text collected from the web, user input, or documents is <strong style={{ color: C.ink }}>messy by default</strong>. It contains HTML markup, inconsistent casing, Unicode anomalies, boilerplate noise, and domain-specific artifacts. Feeding such text directly into a model inflates vocabulary size, confuses embeddings, and burns through context tokens unnecessarily.
          </p>
          <p>
            Text preprocessing is the systematic cleaning and normalization layer that sits between data collection and model training or inference. The right pipeline depends on the task — what helps a TF-IDF search engine can actively harm a fine-tuned LLM.
          </p>

          {/* Pipeline overview diagram */}
          <div style={{
            background: C.paper, border: `1.5px solid ${C.border}`, borderRadius: 12,
            padding: "24px", margin: "24px 0",
          }}>
            <p style={{ margin: "0 0 16px", fontSize: 11, color: C.inkLight, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Typical NLP preprocessing pipeline
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0 }}>
              {[
                { label: "Raw Text", color: C.inkLight },
                { label: "HTML Strip", color: C.rose },
                { label: "Whitespace Norm", color: C.amber },
                { label: "Lowercase", color: C.indigo },
                { label: "Punct. Remove", color: C.teal },
                { label: "Stop Words", color: C.rose },
                { label: "Stem / Lemma", color: C.amberLight },
                { label: "Tokens → Model", color: C.teal },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    background: `${step.color}14`, border: `1.5px solid ${step.color}50`,
                    borderRadius: 6, padding: "6px 10px", fontSize: 11,
                    color: step.color, fontFamily: "monospace", whiteSpace: "nowrap",
                    margin: "4px 0",
                  }}>
                    {step.label}
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: C.border, fontSize: 14, padding: "0 4px" }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Note icon="⚖️" title="LLMs vs. Classical NLP" accent={C.teal}>
            Classical NLP models (TF-IDF, SVM, Naive Bayes) benefit from aggressive preprocessing — stop word removal, stemming, and heavy normalization shrink vocabulary and improve signal. <strong>Large language models are different</strong>: they're trained on rich, diverse text and rely on casing, punctuation, and function words for contextual understanding. Apply minimal preprocessing for LLM inference; heavier cleaning only during training data curation.
          </Note>
        </Section>

        {/* §02 — Technique Cards */}
        <Section num={2} title="Core Preprocessing Techniques" accent={C.teal}>
          <p>Each technique serves a specific purpose. Applying them indiscriminately is a common mistake — understand what each one does and when to use it.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 20 }}>
            {[
              { icon: "🏷️", title: "HTML / Markup Stripping", badge: "ALWAYS", badgeColor: C.rose, desc: "Remove HTML tags, XML elements, and decode HTML entities. Essential for any web-scraped corpus." },
              { icon: "⬜", title: "Whitespace Normalization", badge: "ALWAYS", badgeColor: C.rose, desc: "Collapse tabs, newlines, and multiple spaces into a single space. Trim leading/trailing whitespace." },
              { icon: "Aa", title: "Case Folding", badge: "OFTEN", badgeColor: C.amber, desc: "Convert to lowercase so 'Python' and 'python' map to the same token. Skip for NER or sentiment." },
              { icon: "🔤", title: "Unicode Normalization", badge: "OFTEN", badgeColor: C.amber, desc: "Apply NFC or NFKC normalization to unify equivalent character sequences and remove zero-width chars." },
              { icon: ".,!", title: "Punctuation Removal", badge: "SELECTIVE", badgeColor: C.teal, desc: "Strip non-alphanumeric characters. Useful for bag-of-words; harmful for LLMs that need syntax." },
              { icon: "✂️", title: "Stop Word Removal", badge: "SELECTIVE", badgeColor: C.teal, desc: "Remove high-frequency words with low semantic signal. Improves TF-IDF; usually hurts LLMs." },
              { icon: "🌿", title: "Stemming", badge: "SELECTIVE", badgeColor: C.teal, desc: "Crude suffix-stripping to root forms. Fast but produces non-words ('running' → 'run' → 'run')." },
              { icon: "📖", title: "Lemmatization", badge: "SELECTIVE", badgeColor: C.teal, desc: "Dictionary-based root reduction. 'better' → 'good'. More accurate than stemming, but slower." },
            ].map(c => <TechCard key={c.title} {...c} />)}
          </div>
        </Section>

        {/* §03 — Interactive Simulator */}
        <Section num={3} title="Live Pipeline Simulator" accent={C.rose}>
          <p>
            Walk through each preprocessing step interactively. Edit the input text to see how your own content transforms. Toggle <strong>Show diff</strong> to highlight exactly what each step removes or changes.
          </p>
          <div style={{
            background: C.paper, border: `1.5px solid ${C.border}`,
            borderRadius: 14, padding: "28px 24px", boxShadow: `0 4px 32px ${C.ink}08`,
          }}>
            <PipelineSimulator />
          </div>
        </Section>

        {/* §04 — Code Examples */}
        <Section num={4} title="TypeScript Code Examples" accent={C.indigo}>

          <h3>1 — Complete preprocessing pipeline</h3>
          <p>A composable, type-safe pipeline using pure functions — no dependencies required.</p>
          <CodeBlock caption="preprocessor.ts" code={`// A simple function-composition preprocessor with no external deps

type Preprocessor = (text: string) => string;

// Strip HTML tags and decode common HTML entities
const stripHtml: Preprocessor = (text) =>
  text
    .replace(/<[^>]+>/g, ' ')       // remove all tags
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');

// Collapse all whitespace to a single space and trim
const normalizeWhitespace: Preprocessor = (text) =>
  text.replace(/\\s+/g, ' ').trim();

// NFC normalization + remove zero-width / control characters
const normalizeUnicode: Preprocessor = (text) =>
  text
    .normalize('NFC')
    .replace(/[\\u200B-\\u200D\\uFEFF]/g, '') // zero-width chars
    .replace(/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]/g, ''); // control chars

// Convert to lowercase
const lowercase: Preprocessor = (text) => text.toLowerCase();

// Remove punctuation (keep word chars and spaces only)
const removePunctuation: Preprocessor = (text) =>
  text.replace(/[^\\w\\s]/g, '');

// Compose preprocessors left-to-right
function compose(...fns: Preprocessor[]): Preprocessor {
  return (text: string) => fns.reduce((t, fn) => fn(t), text);
}

// ── Build pipelines for different use cases ──────────────────────────────────

// For LLM inference: light cleaning only
export const llmPipeline = compose(
  stripHtml,
  normalizeUnicode,
  normalizeWhitespace
);

// For classical NLP (TF-IDF, search index): heavy cleaning
export const classicalPipeline = compose(
  stripHtml,
  normalizeUnicode,
  normalizeWhitespace,
  lowercase,
  removePunctuation
);

// Usage
const raw = '<p>Hello,   World! This is a <b>test</b>.</p>';
console.log(llmPipeline(raw));       // → "Hello, World! This is a test."
console.log(classicalPipeline(raw)); // → "hello world this is a test"`} />

          <h3 style={{ marginTop: 28 }}>2 — Stop word removal with custom lists</h3>
          <CodeBlock caption="stopWords.ts" code={`// Load a stop word list — in production, use a curated dataset
// (e.g. NLTK's english corpus, or the 'stopword' npm package)
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'can', 'i', 'you', 'he',
  'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'in', 'on', 'at', 'to', 'of', 'for', 'with', 'by', 'from',
  'and', 'or', 'but', 'not', 'so', 'as', 'if', 'then', 'this',
  'that', 'these', 'those', 'all', 'more', 'also', 'just', 'about',
]);

interface FilterOptions {
  customStops?: string[];   // domain-specific words to always remove
  customKeeps?: string[];   // words to always keep even if in stop list
  minLength?: number;       // remove tokens shorter than this
}

function removeStopWords(
  text: string,
  options: FilterOptions = {}
): string {
  const { customStops = [], customKeeps = [], minLength = 2 } = options;
  const stops = new Set([...STOP_WORDS, ...customStops.map(w => w.toLowerCase())]);
  const keeps = new Set(customKeeps.map(w => w.toLowerCase()));

  return text
    .split(/\\s+/)
    .filter((word) => {
      const lower = word.toLowerCase();
      if (keeps.has(lower)) return true;     // always keep
      if (stops.has(lower)) return false;    // always remove
      return word.length >= minLength;       // remove very short tokens
    })
    .join(' ');
}

// Example
const text = 'The quick brown fox jumps over the lazy dog';
console.log(removeStopWords(text));
// → "quick brown fox jumps lazy dog"`} />

          <h3 style={{ marginTop: 28 }}>3 — Unicode normalization for multilingual text</h3>
          <CodeBlock caption="unicode.ts" code={`// Critical for multilingual corpora — NFC vs NFKC vs NFD vs NFKD

// NFC: canonical composition (recommended for storage/comparison)
// NFKC: compatibility composition (maps ligatures/fullwidth to ASCII equiv)

function normalizeText(text: string, form: 'NFC' | 'NFKC' = 'NFC'): string {
  return (
    text
      .normalize(form)
      // Remove zero-width joiners, non-joiners, BOM, etc.
      .replace(/[\\u200B-\\u200D\\u2060\\uFEFF]/g, '')
      // Collapse all whitespace variants (NBSP, thin space, em-space…)
      .replace(/[\\u00A0\\u1680\\u2000-\\u200A\\u202F\\u205F\\u3000]/g, ' ')
      // Remove directional marks (LTR/RTL override etc.)
      .replace(/[\\u200E\\u200F\\u202A-\\u202E]/g, '')
  );
}

// Map NFKC normalization: ligatures, fullwidth, fractions
console.log('ﬁ'.normalize('NFKC'));   // fi  (ligature → two chars)
console.log('Ａ'.normalize('NFKC'));   // A   (fullwidth → ASCII)
console.log('½'.normalize('NFKC'));   // 1⁄2 (fraction → digits)
console.log('é'.normalize('NFC'));    // é   (precomposed)
console.log('é'.normalize('NFD'));    // e + combining ́ (decomposed)

// Practical: normalize before comparing strings across scraped sources
function isSameText(a: string, b: string): boolean {
  return normalizeText(a, 'NFKC') === normalizeText(b, 'NFKC');
}`} />

          <h3 style={{ marginTop: 28 }}>4 — Production pipeline with natural + compromise</h3>
          <CodeBlock caption="nlpPipeline.ts" code={`// npm install natural compromise
import natural from 'natural';
import nlp from 'compromise';

const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();

interface PreprocessedDoc {
  original:    string;
  clean:       string;
  tokens:      string[];
  stemmed:     string[];
  lemmatized:  string[];
  sentences:   string[];
}

async function preprocess(raw: string): Promise<PreprocessedDoc> {
  // 1. Strip HTML + normalize whitespace
  const clean = raw
    .replace(/<[^>]+>/g, ' ')
    .normalize('NFC')
    .replace(/\\s+/g, ' ')
    .trim();

  // 2. Tokenize (lowercases + splits on punctuation)
  const tokens: string[] = tokenizer.tokenize(clean.toLowerCase()) ?? [];

  // 3. Stem with Porter Stemmer
  const stemmed = tokens.map((t) => stemmer.stem(t));

  // 4. Lemmatize using compromise (morphological analysis)
  const doc = nlp(clean);
  const lemmatized: string[] = doc
    .terms()
    .out('array')
    .map((term: string) => nlp(term).verbs().toInfinitive().out('text') || term);

  // 5. Sentence splitting
  const sentences: string[] = doc.sentences().out('array');

  return { original: raw, clean, tokens, stemmed, lemmatized, sentences };
}

// Usage
const result = await preprocess(
  '<p>The cats are running quickly through beautiful gardens.</p>'
);
console.log(result.tokens);     // ['the', 'cats', 'are', 'running', ...]
console.log(result.stemmed);    // ['the', 'cat', 'are', 'run', 'quickli', ...]
console.log(result.lemmatized); // ['The', 'cat', 'be', 'run', 'quickly', ...]`} />
        </Section>

        {/* §05 — Comparison Table */}
        <Section num={5} title="Technique Comparison" accent={C.amber}>
          <p>Use this matrix to decide which steps belong in your pipeline. "Importance" refers to how much impact the technique typically has on downstream model performance.</p>
          <ComparisonTable />
        </Section>

        {/* §06 — npm Packages */}
        <Section num={6} title="Key npm Packages" accent={C.teal}>
          <p>The Node.js/TypeScript ecosystem has mature libraries for every preprocessing need.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: "natural", install: "npm install natural", desc: "Comprehensive NLP toolkit: tokenizers, stemmers (Porter, Lancaster), TF-IDF, BM25, sentence boundary detection, and more.", color: C.teal },
              { name: "compromise", install: "npm install compromise", desc: "Lightweight, zero-dependency NLP for the browser and Node. Lemmatization, POS tagging, entity recognition, and sentence splitting.", color: C.amber },
              { name: "stopword", install: "npm install stopword", desc: "Curated stop word lists for 60+ languages. Drop-in removeStopwords() function — much more comprehensive than rolling your own.", color: C.indigo },
              { name: "he", install: "npm install he", desc: "Robust HTML entity encoder/decoder. Handles all named and numeric character references correctly — use instead of ad-hoc regex.", color: C.rose },
              { name: "sanitize-html", install: "npm install sanitize-html", desc: "Configurable HTML stripper with allowlist support. Safer than raw regex for stripping markup from untrusted input.", color: C.teal },
              { name: "franc-min", install: "npm install franc-min", desc: "Detect the language of a text snippet. Useful for routing multilingual content to the right locale-specific preprocessing pipeline.", color: C.amberLight },
            ].map((pkg) => (
              <div key={pkg.name} style={{
                background: C.paper, border: `1.5px solid ${pkg.color}25`,
                borderRadius: 10, padding: "14px 18px",
                display: "flex", gap: 14, alignItems: "flex-start",
                transition: "border-color 0.18s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${pkg.color}60`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${pkg.color}25`}
              >
                <div style={{
                  background: `${pkg.color}12`, border: `1px solid ${pkg.color}30`,
                  borderRadius: 6, padding: "4px 9px", flexShrink: 0,
                  fontFamily: "monospace", fontSize: 10, color: pkg.color, letterSpacing: "0.05em",
                }}>npm</div>
                <div>
                  <strong style={{ color: C.ink, fontFamily: "'Fira Code', monospace", fontSize: 13 }}>{pkg.name}</strong>
                  <div style={{ color: C.inkLight, fontFamily: "monospace", fontSize: 11, margin: "3px 0 6px" }}>{pkg.install}</div>
                  <p style={{ margin: 0, fontSize: 13, color: C.inkMid }}>{pkg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* §07 — Summary */}
        <section style={{
          background: C.ink, color: C.bg, borderRadius: 14, padding: "36px 32px",
          border: `3px solid ${C.amber}`,
        }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
            <div style={{ width: 32, height: 3, background: C.amber }} />
            <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.amberLight, fontWeight: 700 }}>
              Decision Guide
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { label: "Training data curation", steps: "HTML strip → Unicode norm → whitespace → lowercase → dedup", color: C.amberLight },
              { label: "LLM inference / RAG", steps: "HTML strip → Unicode norm → whitespace only", color: C.tealLight },
              { label: "Search / TF-IDF index", steps: "All steps including stop words + stemming", color: C.rose },
              { label: "Sentiment analysis", steps: "HTML strip → whitespace → keep case & punct", color: C.indigo },
            ].map((card) => (
              <div key={card.label} style={{
                background: `${card.color}0F`, border: `1px solid ${card.color}30`, borderRadius: 8, padding: "14px 16px",
              }}>
                <strong style={{ color: card.color, fontSize: 12, display: "block", marginBottom: 8, letterSpacing: "0.03em" }}>{card.label}</strong>
                <code style={{ fontFamily: "monospace", fontSize: 11, color: "#9C8060", lineHeight: 1.7 }}>{card.steps}</code>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #2A1F0A" }}>
            <p style={{ color: "#5C4A2A", fontSize: 13, margin: 0, lineHeight: 1.75 }}>
              <strong style={{ color: C.amberLight }}>Golden rule:</strong> the less you touch the text, the better for large language models. Preprocess aggressively only when working with classical ML pipelines or curating training data at scale.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `2px solid ${C.border}`, padding: "28px 24px", textAlign: "center",
        color: C.inkLight, fontSize: 12, fontFamily: "monospace", background: C.paper,
      }}>
        <div>Built with React · Interactive simulation · No external API calls</div>
        <div style={{ marginTop: 4, color: C.border }}>
          References: Manning et al. "Introduction to IR" · HuggingFace Datasets · NLTK documentation
        </div>
      </footer>
    </div>
  );
}
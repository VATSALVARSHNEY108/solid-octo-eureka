"use client";
import { useState, useEffect, useRef } from "react";

const TOKEN_COLORS = [
  { bg: "#FF6B6B22", border: "#FF6B6B", text: "#FF9090" },
  { bg: "#FFD93D22", border: "#FFD93D", text: "#FFE066" },
  { bg: "#6BCB7722", border: "#6BCB77", text: "#8EE89B" },
  { bg: "#4D96FF22", border: "#4D96FF", text: "#7AB8FF" },
  { bg: "#C77DFF22", border: "#C77DFF", text: "#DA9FFF" },
  { bg: "#FF9F1C22", border: "#FF9F1C", text: "#FFB84D" },
  { bg: "#2EC4B622", border: "#2EC4B6", text: "#5ED6D0" },
  { bg: "#E71D3622", border: "#E71D36", text: "#FF4D63" },
];

// ─── Simple BPE-style tokenizer (educational approximation) ──────────────────
// Real LLM tokenizers (tiktoken / GPT-4 BPE) are far more sophisticated.
// This gives learners an intuitive feel for sub-word splitting.
// ─────────────────────────────────────────────────────────────────────────────
function tokenize(text) {
  if (!text.trim()) return [];
  // Split on word boundaries, punctuation, and common sub-word markers
  const rawTokens = text.match(
    /\s+|[A-Z]?[a-z]+(?:'[a-z]+)?|[A-Z]+(?=[A-Z][a-z])|[A-Z]|[0-9]+|[^\w\s]/g
  ) || [];

  let id = 0;
  return rawTokens.map((raw) => ({
    id: id++,
    text: raw,
    display: raw === " " ? "·" : raw.startsWith(" ") ? `Ġ${raw.trim()}` : raw,
    isSpace: /^\s+$/.test(raw),
    colorIdx: id % TOKEN_COLORS.length,
  }));
}

// ─── Reusable "glow badge" for token counts ──────────────────────────────────
function GlowBadge({ value, label, color = "#4D96FF" }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      background: `${color}15`, border: `1px solid ${color}40`,
      borderRadius: 12, padding: "12px 20px", minWidth: 90,
    }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, color: "#666", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

// ─── Animated token chip ─────────────────────────────────────────────────────
function TokenChip({ token, idx, showId }) {
  const c = TOKEN_COLORS[token.colorIdx];
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: 6, padding: "3px 7px", margin: "3px 2px",
        fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
        color: c.text, cursor: "default", transition: "transform 0.15s",
        animation: `fadeIn 0.25s ${idx * 0.03}s both`,
      }}
      title={`Token #${token.id} — "${token.text}"`}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"}
      onMouseLeave={e => e.currentTarget.style.transform = ""}
    >
      {showId && (
        <span style={{ fontSize: 9, opacity: 0.6, fontWeight: 700 }}>{token.id}</span>
      )}
      <span>{token.isSpace ? <span style={{ opacity: 0.4 }}>·</span> : token.display}</span>
    </span>
  );
}

// ─── Interactive Tokenizer Playground ────────────────────────────────────────
function TokenizerPlayground() {
  const [input, setInput] = useState("Hello, world! Tokenization is fascinating.");
  const [showIds, setShowIds] = useState(false);
  const tokens = tokenize(input);
  const charCount = input.length;
  const ratio = charCount > 0 ? (charCount / Math.max(tokens.length, 1)).toFixed(1) : "—";

  const presets = [
    "Hello, world! Tokenization is fascinating.",
    "npm install tiktoken @anthropic-ai/sdk",
    "const tokens = encode('Hello GPT!');",
    "Artificial intelligence is transforming software.",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Preset chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {presets.map((p, i) => (
          <button key={i} onClick={() => setInput(p)} style={{
            background: input === p ? "#4D96FF20" : "transparent",
            border: `1px solid ${input === p ? "#4D96FF" : "#333"}`,
            borderRadius: 6, padding: "4px 10px", color: input === p ? "#4D96FF" : "#666",
            fontSize: 11, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            transition: "all 0.15s",
          }}>
            {p.slice(0, 28)}{p.length > 28 ? "…" : ""}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste any text to tokenize…"
        rows={3}
        style={{
          background: "#0D0D0D", border: "1px solid #2a2a2a", borderRadius: 8,
          color: "#E0E0E0", fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
          padding: "12px 14px", resize: "vertical", outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "#4D96FF"}
        onBlur={e => e.target.style.borderColor = "#2a2a2a"}
      />

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <GlowBadge value={tokens.length} label="Tokens" color="#4D96FF" />
        <GlowBadge value={charCount} label="Chars" color="#6BCB77" />
        <GlowBadge value={ratio} label="Chars/Token" color="#FFD93D" />
        <div style={{ flex: 1, minWidth: 120 }}>
          <label style={{
            display: "flex", alignItems: "center", gap: 8, color: "#888",
            fontSize: 12, cursor: "pointer", userSelect: "none", height: "100%",
          }}>
            <input type="checkbox" checked={showIds} onChange={e => setShowIds(e.target.checked)}
              style={{ accentColor: "#4D96FF", width: 14, height: 14 }} />
            Show token IDs
          </label>
        </div>
      </div>

      {/* Token visualization */}
      <div style={{
        background: "#0D0D0D", border: "1px solid #1e1e1e", borderRadius: 10,
        padding: "16px 14px", minHeight: 60, lineHeight: 2,
      }}>
        {tokens.length === 0
          ? <span style={{ color: "#444", fontFamily: "monospace" }}>Your tokens will appear here…</span>
          : tokens.map((t, i) => <TokenChip key={i} token={t} idx={i} showId={showIds} />)
        }
      </div>

      {/* Token ID table (first 12) */}
      {tokens.length > 0 && (
        <div>
          <p style={{ color: "#555", fontSize: 11, margin: "0 0 8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Token → ID mapping (first {Math.min(tokens.length, 12)} shown)
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tokens.slice(0, 12).map((t, i) => {
              const c = TOKEN_COLORS[t.colorIdx];
              return (
                <div key={i} style={{
                  background: "#111", border: `1px solid #222`, borderRadius: 6,
                  padding: "4px 10px", display: "flex", gap: 8, alignItems: "center",
                }}>
                  <span style={{ color: c.text, fontFamily: "monospace", fontSize: 12 }}>
                    "{t.isSpace ? " " : t.text}"
                  </span>
                  <span style={{ color: "#444", fontSize: 10 }}>→</span>
                  <span style={{ color: "#888", fontFamily: "monospace", fontSize: 12 }}>{t.id}</span>
                </div>
              );
            })}
            {tokens.length > 12 && (
              <div style={{ color: "#444", fontSize: 12, padding: "4px 10px", alignSelf: "center" }}>
                +{tokens.length - 12} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Code block with syntax coloring ─────────────────────────────────────────
function CodeBlock({ code, language = "ts", caption }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // Very lightweight keyword highlighter for display purposes
  const highlight = (line) => {
    return line
      .replace(/(\/\/.*$)/g, '<span style="color:#555;font-style:italic">$1</span>')
      .replace(/\b(import|from|const|let|async|await|return|new|export|default|function|type|interface)\b/g,
        '<span style="color:#C77DFF">$1</span>')
      .replace(/\b(string|number|boolean|void|null|undefined)\b/g,
        '<span style="color:#4D96FF">$1</span>')
      .replace(/'([^']*)'/g, '<span style="color:#6BCB77">\'$1\'</span>')
      .replace(/"([^"]*)"/g, '<span style="color:#6BCB77">"$1"</span>')
      .replace(/`([^`]*)`/g, '<span style="color:#FFD93D">`$1`</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#FF9F1C">$1</span>');
  };

  return (
    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid #1e1e1e" }}>
      {/* Header bar */}
      <div style={{
        background: "#111", borderBottom: "1px solid #1e1e1e",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 14px",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
          {caption && <span style={{ color: "#555", fontSize: 11, marginLeft: 8, fontFamily: "monospace" }}>{caption}</span>}
        </div>
        <button onClick={copy} style={{
          background: "transparent", border: "1px solid #333", borderRadius: 4,
          color: copied ? "#6BCB77" : "#666", fontSize: 10, cursor: "pointer",
          padding: "2px 8px", fontFamily: "monospace", letterSpacing: "0.05em",
          transition: "all 0.15s",
        }}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      {/* Code */}
      <pre style={{
        margin: 0, padding: "16px 20px", background: "#080808",
        overflowX: "auto", fontSize: 13, lineHeight: 1.75,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}>
        {code.split("\n").map((line, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ color: "#2a2a2a", userSelect: "none", minWidth: 28, fontSize: 11, paddingTop: 1 }}>
              {i + 1}
            </span>
            <span dangerouslySetInnerHTML={{ __html: highlight(line) }} style={{ color: "#C9D1D9" }} />
          </div>
        ))}
      </pre>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHead({ number, title, accent = "#4D96FF" }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: accent,
        border: `1px solid ${accent}40`, borderRadius: 4, padding: "2px 7px", letterSpacing: "0.1em",
      }}>
        {String(number).padStart(2, "0")}
      </span>
      <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: "#E8E8E8", fontWeight: 400 }}>
        {title}
      </h2>
    </div>
  );
}

// ─── Callout / info box ───────────────────────────────────────────────────────
function Callout({ icon, title, children, accent = "#4D96FF" }) {
  return (
    <div style={{
      background: `${accent}0A`, borderLeft: `3px solid ${accent}`,
      borderRadius: "0 8px 8px 0", padding: "14px 18px", margin: "20px 0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <strong style={{ color: accent, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>{title}</strong>
      </div>
      <div style={{ color: "#999", fontSize: 14, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────
export default function TokenizationPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{
      background: "#060608", color: "#C9D1D9", minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
        p { line-height: 1.75; color: #999; }
        h3 { color: #ddd; font-family: 'DM Serif Display', serif; font-weight: 400; }
      `}</style>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: "relative", overflow: "hidden",
        padding: "100px 0 80px", textAlign: "center",
        borderBottom: "1px solid #111",
      }}>
        {/* Animated grid background */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(#4D96FF 1px, transparent 1px), linear-gradient(90deg, #4D96FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          transform: `translateY(${scrollY * 0.3}px)`,
        }} />
        {/* Glow blobs */}
        {[
          { top: "10%", left: "10%", color: "#4D96FF" },
          { top: "60%", right: "8%", color: "#C77DFF" },
          { bottom: "5%", left: "40%", color: "#FFD93D" },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color}18 0%, transparent 70%)`,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            animation: `pulse ${3 + i}s ease-in-out infinite`,
          }} />
        ))}

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-block", background: "#4D96FF15", border: "1px solid #4D96FF40",
            borderRadius: 20, padding: "4px 16px", marginBottom: 20,
            fontFamily: "monospace", fontSize: 12, color: "#4D96FF", letterSpacing: "0.12em",
          }}>
            LLMs · NPM · DEVELOPER GUIDE
          </div>
          <h1 style={{
            margin: "0 0 16px", fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 400,
            color: "#F0F0F0", lineHeight: 1.1, letterSpacing: "-0.01em",
          }}>
            Understanding{" "}
            <span style={{
              background: "linear-gradient(135deg, #4D96FF, #C77DFF)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Tokenization
            </span>
          </h1>
          <p style={{
            maxWidth: 560, margin: "0 auto 32px", fontSize: 17, color: "#777", lineHeight: 1.65,
          }}>
            How large language models and npm packages convert raw text into the
            numerical tokens that power modern AI — with an interactive playground.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {["Interactive Demo", "Code Examples", "npm Packages", "BPE Explained"].map((tag, i) => (
              <span key={i} style={{
                background: "#111", border: "1px solid #222", borderRadius: 20,
                padding: "5px 14px", fontSize: 12, color: "#666",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ─── Main content ──────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 820, margin: "0 auto", padding: "64px 24px" }}>

        {/* ── Section 1: What is Tokenization? ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHead number={1} title="What Is Tokenization?" accent="#4D96FF" />
          <p>
            Tokenization is the process of splitting raw text into discrete chunks — called <strong style={{ color: "#E0E0E0" }}>tokens</strong> — before feeding that text into a language model. Every LLM (GPT-4, Claude, Gemini, LLaMA…) operates exclusively on token sequences, never on raw strings or individual characters.
          </p>
          <p>
            A token is typically a word fragment, a full common word, a punctuation mark, or a whitespace signal. The vocabulary of a modern model usually contains between <strong style={{ color: "#4D96FF" }}>32 000</strong> and <strong style={{ color: "#4D96FF" }}>100 000</strong> unique tokens, each mapped to an integer ID.
          </p>

          <Callout icon="💡" title="Why not just use characters?" accent="#FFD93D">
            Character-level models produce very long sequences (slow, expensive context) and struggle to learn word-level patterns. Word-level models cant handle unknown words. Sub-word tokenization is the practical middle ground — short sequences AND graceful handling of rare words.
          </Callout>

          {/* Visual: text → tokens → IDs pipeline */}
          <div style={{
            background: "#0D0D0D", border: "1px solid #1a1a1a", borderRadius: 12,
            padding: "24px", marginTop: 24,
          }}>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              The tokenization pipeline
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
              {[
                { label: "Raw Text", value: '"Hello, world!"', color: "#888" },
                null,
                { label: "Tokens", value: '["Hello", ",", " world", "!"]', color: "#6BCB77" },
                null,
                { label: "Token IDs", value: "[9906, 11, 1917, 0]", color: "#4D96FF" },
                null,
                { label: "Embeddings", value: "[[0.2, −0.4, …], …]", color: "#C77DFF" },
              ].map((step, i) => step === null ? (
                <span key={i} style={{ color: "#333", fontSize: 20, padding: "0 8px" }}>→</span>
              ) : (
                <div key={i} style={{
                  background: "#111", border: "1px solid #222", borderRadius: 8,
                  padding: "10px 14px", flex: "1 1 140px", minWidth: 120,
                }}>
                  <div style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{step.label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: step.color }}>{step.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: Byte-Pair Encoding ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHead number={2} title="How BPE Tokenization Works" accent="#C77DFF" />
          <p>
            Most modern LLMs use <strong style={{ color: "#E0E0E0" }}>Byte-Pair Encoding (BPE)</strong>, originally a data-compression algorithm, adapted for NLP by Sennrich et al. (2016). The core idea:
          </p>
          <ol style={{ paddingLeft: 20, color: "#999", lineHeight: 2 }}>
            <li>Start with a vocabulary of individual characters (bytes).</li>
            <li>Count the most frequent adjacent pair in the training corpus.</li>
            <li>Merge that pair into a new token and add it to the vocabulary.</li>
            <li>Repeat until the target vocabulary size is reached.</li>
          </ol>
          <p>
            The result: common words become single tokens (<code style={{ color: "#6BCB77", background: "#111", padding: "1px 5px", borderRadius: 3 }}>THE</code> → ID 1), while rare words split into recognizable sub-pieces (<code style={{ color: "#6BCB77", background: "#111", padding: "1px 5px", borderRadius: 3 }}>TOKENIZATION</code> → <code style={{ color: "#FFD93D", background: "#111", padding: "1px 5px", borderRadius: 3 }}>["token", "ization"]</code>).
          </p>

          <Callout icon="🔑" title="The Ġ prefix" accent="#C77DFF">
            In GPT-style tokenizers, a leading space is encoded as a special prefix character <code>Ġ</code> (GPT-2) or represented as a flag on the token. This lets the model distinguish <em>WORD</em> when sentence-initial from <em>WORD</em> after a space — both common but semantically distinct positions.
          </Callout>
        </section>

        {/* ── Section 3: Interactive Playground ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHead number={3} title="Interactive Tokenizer Playground" accent="#6BCB77" />
          <p>
            Type any text below to see how a simplified BPE-style tokenizer splits it. Each color represents a distinct token. Toggle <strong style={{ color: "#E0E0E0" }}>Show token IDs</strong> to see the integer mapping.
          </p>
          <div style={{
            background: "#0A0A0A", border: "1px solid #1a1a1a", borderRadius: 14,
            padding: "28px 24px",
          }}>
            <TokenizerPlayground />
          </div>
          <Callout icon="⚠️" title="Educational approximation" accent="#FF9F1C">
            This playground uses a regex-based splitter to illustrate sub-word tokenization concepts. Production tokenizers — like OpenAI <strong>tiktoken</strong> or HuggingFace <strong>tokenizers</strong> — use pre-computed BPE merge tables trained on billions of tokens and produce different (more optimal) splits.
          </Callout>
        </section>

        {/* ── Section 4: npm Packages ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHead number={4} title="Tokenization in the npm Ecosystem" accent="#FFD93D" />
          <p>
            Several production-grade npm packages expose tokenization directly in JavaScript/TypeScript. Here are the three most widely used.
          </p>

          {/* Package cards */}
          {[
            {
              name: "tiktoken",
              install: "npm install tiktoken",
              desc: "Official OpenAI tokenizer, compiled from Rust via WASM. Supports cl100k_base (GPT-4), p50k_base (Codex), and o200k_base (GPT-4o).",
              color: "#4D96FF",
            },
            {
              name: "@anthropic-ai/sdk",
              install: "npm install @anthropic-ai/sdk",
              desc: "Anthropic's official SDK. Claude models use a similar BPE scheme; the SDK's countTokens() helper lets you estimate cost before sending a request.",
              color: "#C77DFF",
            },
            {
              name: "@huggingface/transformers",
              install: "npm install @huggingface/transformers",
              desc: "Port of HuggingFace Transformers for JS. Provides AutoTokenizer which supports hundreds of models and handles padding, truncation, and special tokens.",
              color: "#6BCB77",
            },
          ].map((pkg) => (
            <div key={pkg.name} style={{
              background: "#0D0D0D", border: `1px solid ${pkg.color}25`,
              borderRadius: 10, padding: "18px 20px", marginBottom: 12,
              display: "flex", gap: 16, alignItems: "flex-start",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${pkg.color}60`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${pkg.color}25`}
            >
              <div style={{
                background: `${pkg.color}15`, border: `1px solid ${pkg.color}40`,
                borderRadius: 8, padding: "6px 10px", flexShrink: 0,
                fontFamily: "monospace", fontSize: 11, color: pkg.color,
              }}>
                npm
              </div>
              <div>
                <strong style={{ color: "#E0E0E0", fontFamily: "monospace", fontSize: 14 }}>{pkg.name}</strong>
                <div style={{ color: "#555", fontSize: 11, fontFamily: "monospace", margin: "4px 0 8px" }}>
                  {pkg.install}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#888" }}>{pkg.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Section 5: Code Examples ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHead number={5} title="Code Examples" accent="#FF6B6B" />

          <h3 style={{ marginTop: 0 }}>1 — Count tokens with tiktoken (TypeScript)</h3>
          <CodeBlock caption="tokenCount.ts" code={`import Tiktoken from 'tiktoken';

// cl100k_base is used by GPT-3.5-turbo and GPT-4
const enc = Tiktoken.getEncoding('cl100k_base');

/**
 * Returns the number of tokens in a string.
 * Useful for estimating API cost before sending a request.
 */
function countTokens(text: string): number {
  const tokens: Uint32Array = enc.encode(text);
  return tokens.length;
}

const sample = 'Tokenization is the first step in every LLM pipeline.';
console.log(\`"\${sample}"\`);
console.log(\`Token count: \${countTokens(sample)}\`); // → 11
// Approx GPT-4 cost at $0.03/1K input tokens: $0.00033`} />

          <h3>2 — Streaming tokens with the Anthropic SDK</h3>
          <CodeBlock caption="streamTokens.ts" code={`import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic(); // uses ANTHROPIC_API_KEY env var

async function streamWithTokenCount(prompt: string): Promise<void> {
  // Count tokens BEFORE sending — avoids surprises on large prompts
  const { input_tokens } = await client.messages.countTokens({
    model: 'claude-opus-4-5',
    messages: [{ role: 'user', content: prompt }],
  });
  console.log(\`Input tokens: \${input_tokens}\`);

  // Stream the response
  const stream = await client.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const chunk of stream.text_stream) {
    process.stdout.write(chunk);
  }

  const finalMsg = await stream.finalMessage();
  console.log(\`\\nOutput tokens: \${finalMsg.usage.output_tokens}\`);
}

streamWithTokenCount('Explain tokenization in one paragraph.');`} />

          <h3>3 — HuggingFace AutoTokenizer in the browser</h3>
          <CodeBlock caption="browserTokenizer.ts" code={`import { AutoTokenizer } from '@huggingface/transformers';

// Load the tokenizer for any model on the HuggingFace Hub
const tokenizer = await AutoTokenizer.from_pretrained(
  'Xenova/gpt2' // ~500 KB WASM download
);

const text = 'Tokenization splits text into manageable pieces.';

// encode() returns an object with input_ids, attention_mask, etc.
const encoded = tokenizer(text, {
  padding: false,
  truncation: true,
  max_length: 128,
});

// Typed Int32Array of token IDs
const ids: Int32Array = encoded.input_ids.data;
console.log('Token IDs:', Array.from(ids));

// Decode back to a string (round-trip check)
const decoded: string = tokenizer.decode(ids, {
  skip_special_tokens: true,
});
console.log('Decoded:', decoded);

// Convert each ID to its string representation
const tokenStrings: string[] = tokenizer.convert_ids_to_tokens(
  Array.from(ids)
);
console.log('Token strings:', tokenStrings);`} />
        </section>

        {/* ── Section 6: Context windows & cost ── */}
        <section style={{ marginBottom: 72 }}>
          <SectionHead number={6} title="Context Windows & Token Cost" accent="#2EC4B6" />
          <p>
            Every LLM call has a <strong style={{ color: "#E0E0E0" }}>context window</strong> — the maximum number of tokens the model can process in one request (input + output combined). Understanding token counts is essential for:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, margin: "20px 0" }}>
            {[
              { title: "Cost control", desc: "LLM APIs charge per token. A 10 000-token prompt at $3/M tokens costs $0.03 per call.", icon: "💰", color: "#FFD93D" },
              { title: "Prompt design", desc: "Longer context isn't always better. Irrelevant tokens dilute attention and increase latency.", icon: "✂️", color: "#4D96FF" },
              { title: "Chunking RAG", desc: "When indexing documents, chunk at token boundaries — not character limits — to preserve meaning.", icon: "📄", color: "#6BCB77" },
              { title: "Rate limits", desc: "APIs enforce tokens-per-minute limits. Counting tokens before batching prevents 429 errors.", icon: "⚡", color: "#C77DFF" },
            ].map((card) => (
              <div key={card.title} style={{
                background: "#0D0D0D", border: `1px solid ${card.color}20`,
                borderRadius: 10, padding: "16px 18px",
              }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{card.icon}</div>
                <strong style={{ color: "#E0E0E0", fontSize: 13 }}>{card.title}</strong>
                <p style={{ margin: "6px 0 0", fontSize: 13 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock caption="ragChunking.ts" code={`import Tiktoken from 'tiktoken';

const enc = Tiktoken.getEncoding('cl100k_base');

/**
 * Split a long document into chunks that fit within a token budget.
 * Uses sentence boundaries to avoid cutting mid-sentence.
 */
function chunkByTokens(
  document: string,
  maxTokensPerChunk: number = 512,
  overlapTokens: number = 64
): string[] {
  const sentences = document.match(/[^.!?]+[.!?]+/g) ?? [document];
  const chunks: string[] = [];
  let current = '';
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = enc.encode(sentence).length;

    if (currentTokens + sentenceTokens > maxTokensPerChunk && current) {
      chunks.push(current.trim());
      // Keep the last 'overlapTokens' worth of text for continuity
      const words = current.split(' ');
      current = words.slice(-overlapTokens / 4 | 0).join(' ') + ' ';
      currentTokens = enc.encode(current).length;
    }

    current += sentence;
    currentTokens += sentenceTokens;
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}`} />
        </section>

        {/* ── Summary ── */}
        <section style={{
          background: "linear-gradient(135deg, #4D96FF08, #C77DFF08)",
          border: "1px solid #1e1e1e", borderRadius: 14, padding: "32px 28px",
        }}>
          <h2 style={{ margin: "0 0 16px", fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#E8E8E8", fontWeight: 400 }}>
            Key Takeaways
          </h2>
          <ul style={{ paddingLeft: 20, color: "#888", lineHeight: 2.2, margin: 0 }}>
            {[
              "Tokenization converts text into integer IDs that LLMs can mathematically process.",
              "BPE is the dominant algorithm — it balances vocabulary size against sequence length.",
              "The leading space / Ġ distinction matters for positional accuracy.",
              "Always count tokens before sending large prompts to avoid surprises on cost and limits.",
              "Use tiktoken for OpenAI-compatible counts, @anthropic-ai/sdk for Claude, and @huggingface/transformers for the broadest model support.",
              "When building RAG systems, chunk documents at token boundaries, not character limits.",
            ].map((point, i) => (
              <li key={i} style={{ paddingLeft: 4 }}>
                <span style={{ color: "#4D96FF", marginRight: 8 }}>→</span>
                {point}
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid #111", padding: "32px 24px", textAlign: "center",
        color: "#333", fontSize: 12, fontFamily: "monospace",
      }}>
        <div>Built with React · No external API calls · Educational playground</div>
        <div style={{ marginTop: 6, color: "#222" }}>
          References: Sennrich et al. (2016) · OpenAI tiktoken · HuggingFace Tokenizers
        </div>
      </footer>
    </div>
  );
}
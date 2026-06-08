"use client";
import { useState, useEffect, useRef, useCallback } from "react";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
type Tab = "overview" | "simulation" | "architecture" | "code" | "pitfalls" | "summary";
 
interface SimStep {
  num: number;
  label: string;
  encActive: string[];
  hiddenActive: string[];
  ctxActive: boolean;
  decActive: string[];
  attnRows: number[][];
  description: string;
}
 
interface Token {
  id: string;
  text: string;
  kind: "enc" | "hidden" | "ctx" | "dec" | "out";
}
 
// ─── Constants ────────────────────────────────────────────────────────────────
 
const SIM_STEPS: SimStep[] = [
  {
    num: 1, label: 'Encoding "The"',
    encActive: ["t-the"], hiddenActive: [], ctxActive: false, decActive: [],
    attnRows: [],
    description: "Encoder reads the first input token. The embedding layer converts 'The' into a dense vector. The transformer layers compute self-attention across this and prior context.",
  },
  {
    num: 2, label: 'Encoding "cat"',
    encActive: ["t-the", "t-cat"], hiddenActive: ["h1"], ctxActive: false, decActive: [],
    attnRows: [],
    description: "h₁ (hidden state for 'The') is now produced. The encoder has full context of the first token. 'cat' enters — attention heads start linking article to noun.",
  },
  {
    num: 3, label: 'Encoding "sat"',
    encActive: ["t-the", "t-cat", "t-sat"], hiddenActive: ["h1", "h2"], ctxActive: false, decActive: [],
    attnRows: [],
    description: "h₂ for 'cat' is computed. 'sat' enters and the encoder attends back to both previous tokens — verb links strongly to subject 'cat'.",
  },
  {
    num: 4, label: "Encoding <EOS>",
    encActive: ["t-the", "t-cat", "t-sat", "t-eos"], hiddenActive: ["h1", "h2", "h3", "h4"], ctxActive: false, decActive: [],
    attnRows: [],
    description: "All encoder hidden states h₁–h₄ are now produced. The final hidden state h₄ carries a compressed summary of the full input sequence.",
  },
  {
    num: 5, label: "Context vector formed",
    encActive: ["t-the", "t-cat", "t-sat", "t-eos"], hiddenActive: ["h1", "h2", "h3", "h4"], ctxActive: true, decActive: ["d-sos"],
    attnRows: [[0.08, 0.28, 0.55, 0.09]],
    description: "An attention-weighted sum of all encoder states forms the context vector c. The decoder receives <SOS> (start-of-sequence) as its first input token.",
  },
  {
    num: 6, label: "Attention scores computed",
    encActive: ["t-the", "t-cat", "t-sat", "t-eos"], hiddenActive: ["h1", "h2", "h3", "h4"], ctxActive: true, decActive: ["d-sos"],
    attnRows: [[0.08, 0.28, 0.55, 0.09], [0.04, 0.72, 0.16, 0.08], [0.05, 0.09, 0.78, 0.08]],
    description: "Scaled dot-product: Q·Kᵀ / √dₖ — each decoder query attends to all encoder keys. Row 1 = generating 'Le', row 2 = 'chat', row 3 = 's'est assis'. Darker fill = higher weight.",
  },
  {
    num: 7, label: 'Decoding → "Le"',
    encActive: ["t-the", "t-cat", "t-sat", "t-eos"], hiddenActive: ["h1", "h2", "h3", "h4"], ctxActive: true, decActive: ["d-sos", "o-le"],
    attnRows: [[0.08, 0.28, 0.55, 0.09]],
    description: "'Le' is generated. The decoder attended most strongly to h₃ (sat) and h₂ (cat) — article placement in French depends on the noun and verb tense.",
  },
  {
    num: 8, label: 'Decoding → "chat"',
    encActive: ["t-the", "t-cat", "t-sat", "t-eos"], hiddenActive: ["h1", "h2", "h3", "h4"], ctxActive: true, decActive: ["d-sos", "o-le", "o-chat"],
    attnRows: [[0.04, 0.72, 0.16, 0.08]],
    description: "'chat' (French for 'cat') is predicted. Attention weight 0.72 on h₂ — the noun aligns directly with its source token. Previous output 'Le' is fed back in.",
  },
  {
    num: 9, label: "Decoding → complete",
    encActive: ["t-the", "t-cat", "t-sat", "t-eos"], hiddenActive: ["h1", "h2", "h3", "h4"], ctxActive: true, decActive: ["d-sos", "o-le", "o-chat", "o-assis", "o-eos"],
    attnRows: [[0.05, 0.09, 0.78, 0.08]],
    description: "'s'est assis' generated with 0.78 weight on h₃ ('sat'). <EOS> signals end. Full output 'Le chat s'est assis' is returned. Total: 9 autoregressive steps.",
  },
];
 
const INPUT_TOKENS: Token[] = [
  { id: "t-the", text: "The",   kind: "enc" },
  { id: "t-cat", text: "cat",   kind: "enc" },
  { id: "t-sat", text: "sat",   kind: "enc" },
  { id: "t-eos", text: "<EOS>", kind: "enc" },
];
 
const HIDDEN_TOKENS: Token[] = [
  { id: "h1", text: "h₁", kind: "hidden" },
  { id: "h2", text: "h₂", kind: "hidden" },
  { id: "h3", text: "h₃", kind: "hidden" },
  { id: "h4", text: "h₄", kind: "hidden" },
];
 
const DEC_TOKENS: Token[] = [
  { id: "d-sos", text: "<SOS>", kind: "dec" },
];
 
const OUT_TOKENS: Token[] = [
  { id: "o-le",    text: "Le",          kind: "out" },
  { id: "o-chat",  text: "chat",        kind: "out" },
  { id: "o-assis", text: "s'est assis", kind: "out" },
  { id: "o-eos",   text: "<EOS>",       kind: "out" },
];
 
const TABS: { id: Tab; label: string }[] = [
  { id: "overview",     label: "Overview"     },
  { id: "simulation",   label: "Simulation"   },
  { id: "architecture", label: "Architecture" },
  { id: "code",         label: "TypeScript"   },
  { id: "pitfalls",     label: "Pitfalls"     },
  { id: "summary",      label: "Summary"      },
];
 
// ─── Global styles (monochrome, dark + light via media query) ─────────────────
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@300;400;500;600&display=swap');
 
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
  :root {
    --bg:        #ffffff;
    --bg2:       #f5f5f5;
    --bg3:       #ebebeb;
    --surface:   #fafafa;
    --border:    #e0e0e0;
    --border2:   #c8c8c8;
    --text:      #0a0a0a;
    --text2:     #3d3d3d;
    --text3:     #717171;
    --text4:     #a0a0a0;
    --invert:    #0a0a0a;
    --code-bg:   #f0f0f0;
    --code-text: #1a1a1a;
    --chip-base: rgba(0,0,0,0.05);
    --chip-border: rgba(0,0,0,0.15);
    --chip-active: rgba(0,0,0,0.88);
    --chip-active-text: #ffffff;
    --chip-dim-text: #555555;
    --attn-fill: rgba(0,0,0,VAR_ALPHA);
    --pulse-dot: #0a0a0a;
  }
 
  @media (prefers-color-scheme: dark) {
    :root {
      --bg:        #0a0a0a;
      --bg2:       #111111;
      --bg3:       #1a1a1a;
      --surface:   #0f0f0f;
      --border:    #242424;
      --border2:   #383838;
      --text:      #f0f0f0;
      --text2:     #c8c8c8;
      --text3:     #888888;
      --text4:     #555555;
      --invert:    #f0f0f0;
      --code-bg:   #111111;
      --code-text: #d4d4d4;
      --chip-base: rgba(255,255,255,0.06);
      --chip-border: rgba(255,255,255,0.18);
      --chip-active: rgba(255,255,255,0.92);
      --chip-active-text: #0a0a0a;
      --chip-dim-text: #666666;
      --pulse-dot: #f0f0f0;
    }
  }
 
  body, #root {
    font-family: 'Sora', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }
 
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
 
  @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse   { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.35; transform:scale(1.5); } }
 
  .animate-fade  { animation: fadeIn  .3s ease both; }
  .animate-slide { animation: slideIn .25s ease both; }
 
  button { cursor: pointer; font-family: 'Sora', sans-serif; }
  a { color: var(--text); }
`;
 
// ─── Design tokens (JS-side, monochrome) ─────────────────────────────────────
 
const T = {
  bg:      "var(--bg)",
  bg2:     "var(--bg2)",
  bg3:     "var(--bg3)",
  surface: "var(--surface)",
  border:  "var(--border)",
  border2: "var(--border2)",
  text:    "var(--text)",
  text2:   "var(--text2)",
  text3:   "var(--text3)",
  text4:   "var(--text4)",
  invert:  "var(--invert)",
  codeBg:  "var(--code-bg)",
  codeText:"var(--code-text)",
};
 
// ─── Chip component (monochrome) ──────────────────────────────────────────────
 
function Chip({ text, active, strokeStyle = "solid" }: {
  text: string;
  active: boolean;
  strokeStyle?: "solid" | "dashed" | "dotted";
}) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 11px",
      borderRadius: 6,
      fontSize: 12,
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 500,
      background: active ? "var(--chip-active)" : "var(--chip-base)",
      border: `1px ${strokeStyle} ${active ? "var(--invert)" : "var(--chip-border)"}`,
      color: active ? "var(--chip-active-text)" : "var(--chip-dim-text)",
      opacity: active ? 1 : 0.5,
      transform: active ? "translateY(-1px)" : "none",
      boxShadow: active ? "0 2px 8px rgba(0,0,0,0.18)" : "none",
      transition: "all 0.3s ease",
      whiteSpace: "nowrap",
      letterSpacing: "0.01em",
    }}>
      {text}
    </span>
  );
}
 
// ─── Code block ───────────────────────────────────────────────────────────────
 
function Code({ children, lang }: { children: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children.replace(/<[^>]*>/g, "")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ position: "relative", margin: "0.85rem 0" }}>
      {lang && (
        <span style={{
          position: "absolute", top: 10, left: 14,
          fontSize: 10, color: T.text4, fontFamily: "'IBM Plex Mono', monospace",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>{lang}</span>
      )}
      <button onClick={copy} style={{
        position: "absolute", top: 8, right: 12,
        fontSize: 10, color: copied ? T.text2 : T.text4,
        background: "none", border: "none",
        fontFamily: "'Sora', sans-serif", transition: "color .2s",
        padding: "2px 6px",
      }}>
        {copied ? "✓ copied" : "copy"}
      </button>
      <pre style={{
        background: T.codeBg,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: lang ? "2.1rem 1.1rem 1.1rem" : "1.1rem",
        overflowX: "auto",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        lineHeight: 1.7,
        color: T.codeText,
      }}>
        <code dangerouslySetInnerHTML={{ __html: children }} />
      </pre>
    </div>
  );
}
 
// ─── Layout primitives ────────────────────────────────────────────────────────
 
function Card({ children, accentSide = false, style }: {
  children: React.ReactNode;
  accentSide?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: T.bg2,
      border: `1px solid ${T.border}`,
      borderLeft: accentSide ? `3px solid ${T.text}` : `1px solid ${T.border}`,
      borderRadius: 10,
      padding: "1rem 1.2rem",
      marginBottom: "0.75rem",
      ...style,
    }}>
      {children}
    </div>
  );
}
 
function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
      textTransform: "uppercase", color: T.text3, marginBottom: "0.45rem",
    }}>
      {children}
    </div>
  );
}
 
function SectionHeader({ label, title, subtitle }: {
  label: string; title: string; subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
        textTransform: "uppercase", color: T.text3, marginBottom: "0.35rem",
      }}>
        {label}
      </div>
      <h2 style={{
        fontSize: "1.35rem", fontWeight: 600, color: T.text,
        lineHeight: 1.25, marginBottom: subtitle ? "0.55rem" : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, color: T.text3, lineHeight: 1.65 }}>{subtitle}</p>
      )}
    </div>
  );
}
 
function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontSize: "0.9rem", fontWeight: 500, color: T.text2,
      margin: "1.4rem 0 0.65rem",
      paddingBottom: "0.35rem",
      borderBottom: `1px solid ${T.border}`,
    }}>
      {children}
    </h3>
  );
}
 
function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "1rem" }}>
      {children}
    </div>
  );
}
 
// ─── TAB: Overview ───────────────────────────────────────────────────────────
 
function OverviewTab() {
  const apps = [
    { icon: "→", title: "Machine Translation",  desc: "The canonical task: English → French. Google Translate's core uses transformer Seq2Seq. BLEU score is the standard evaluation metric." },
    { icon: "↓", title: "Summarization",         desc: "Long document → concise summary. BART and T5 are fine-tuned for this. ROUGE-L measures overlap with reference summaries." },
    { icon: "↔", title: "Dialogue Systems",      desc: "ChatGPT-style models apply Seq2Seq logic — conversation history is the encoder input, response is the decoder output." },
    { icon: "✦", title: "Code Generation",       desc: "Docstring / spec → executable code. GitHub Copilot is built on this paradigm — encoder reads the spec, decoder writes code." },
  ];
  const approaches = [
    { num: "01", title: "Prompt Engineering",  desc: "Zero/few-shot: craft a system prompt that frames the task. No training required. Relies on the LLM's in-context learning." },
    { num: "02", title: "Fine-tuning",          desc: "Adapt a pre-trained encoder-decoder (T5, BART) on domain-specific source→target pairs with supervised learning." },
    { num: "03", title: "API Orchestration",    desc: "Use an LLM API (Anthropic, OpenAI) as the Seq2Seq backbone; build pre/post-processing pipelines around it." },
  ];
  return (
    <div className="animate-fade">
      <SectionHeader
        label="What & Why"
        title="Sequence-to-Sequence Models"
        subtitle="Seq2Seq transforms one sequence into another — the backbone of translation, summarization, question answering, and code generation. An LLM amplifies this by bringing massive pre-trained knowledge to the task."
      />
 
      <Grid2>
        <Card accentSide>
          <CardLabel>Core concept</CardLabel>
          <p style={{ fontSize: 13, color: T.text3 }}>An input sequence of arbitrary length is compressed into a fixed representation, which a decoder unfolds into an output sequence of a different (or same) length.</p>
        </Card>
        <Card accentSide>
          <CardLabel>LLM advantage</CardLabel>
          <p style={{ fontSize: 13, color: T.text3 }}>Pre-trained LLMs encode world knowledge. Fine-tuning Seq2Seq on top avoids training from scratch — you inherit billions of parameters of linguistic understanding.</p>
        </Card>
      </Grid2>
 
      <H3>Real-world applications</H3>
      <Grid2>
        {apps.map(a => (
          <Card key={a.title} style={{ padding: "0.85rem" }}>
            <div style={{ fontSize: 16, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6, color: T.text2 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 4 }}>{a.title}</div>
            <p style={{ fontSize: 12, color: T.text3, margin: 0 }}>{a.desc}</p>
          </Card>
        ))}
      </Grid2>
 
      <H3>Three ways to use an LLM for Seq2Seq</H3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {approaches.map((a, i) => (
          <div key={a.num} style={{
            display: "flex", gap: 14, alignItems: "flex-start",
            background: T.bg2, border: `1px solid ${T.border}`,
            borderRadius: 9, padding: "0.9rem 1.1rem",
          }}>
            <div style={{
              fontSize: 10, fontFamily: "'IBM Plex Mono', monospace",
              color: T.text4, fontWeight: 600, minWidth: 20, paddingTop: 2,
            }}>{a.num}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 3 }}>{a.title}</div>
              <p style={{ fontSize: 12, color: T.text3, margin: 0 }}>{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ─── TAB: Simulation ─────────────────────────────────────────────────────────
 
function SimulationTab() {
  const [stepIdx, setStepIdx] = useState(-1);
  const [isAuto, setIsAuto]   = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
 
  const current = stepIdx >= 0 ? SIM_STEPS[stepIdx] : null;
 
  const isActive = useCallback((id: string) => {
    if (!current) return false;
    return [
      ...current.encActive,
      ...current.hiddenActive,
      ...(current.ctxActive ? ["ctx"] : []),
      ...current.decActive,
    ].includes(id);
  }, [current]);
 
  const step = () => setStepIdx(i => Math.min(i + 1, SIM_STEPS.length - 1));
 
  const reset = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    setIsAuto(false);
    setStepIdx(-1);
  };
 
  const toggleAuto = () => {
    if (isAuto) {
      if (autoRef.current) clearInterval(autoRef.current);
      setIsAuto(false);
    } else {
      setIsAuto(true);
      autoRef.current = setInterval(() => {
        setStepIdx(i => {
          if (i >= SIM_STEPS.length - 1) {
            clearInterval(autoRef.current!);
            setIsAuto(false);
            return i;
          }
          return i + 1;
        });
      }, 950);
    }
  };
 
  useEffect(() => () => { if (autoRef.current) clearInterval(autoRef.current); }, []);
 
  const attnRows = current?.attnRows ?? [];
  const encLabels = ["The", "cat", "sat", "<EOS>"];
  const outLabels = ["Le", "chat", "s'est assis"];
 
  const rowStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
    marginBottom: "0.75rem",
  };
  const rowLabelStyle: React.CSSProperties = {
    fontSize: 10, color: T.text4, textTransform: "uppercase",
    letterSpacing: "0.08em", minWidth: 68, fontFamily: "'IBM Plex Mono', monospace",
  };
 
  return (
    <div className="animate-fade">
      <SectionHeader
        label="Interactive"
        title="Live Data-Flow Simulation"
        subtitle="Watch tokens travel through the encoder, attention layer, and decoder. Step manually or use auto-play."
      />
 
      <div style={{
        background: T.bg2, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "1.4rem", marginBottom: "0.85rem",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.2rem" }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: T.text, animation: "pulse 2s ease-in-out infinite",
          }} />
          <span style={{
            fontSize: 10, color: T.text4, fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Translation — "The cat sat" → "Le chat s'est assis"
          </span>
        </div>
 
        {/* Input tokens */}
        <div style={rowStyle}>
          <span style={rowLabelStyle}>Input</span>
          {INPUT_TOKENS.map(t => (
            <Chip key={t.id} text={t.text} active={isActive(t.id)} />
          ))}
        </div>
 
        {/* Arrow */}
        <div style={{ height: 18, display: "flex", alignItems: "center", paddingLeft: 72, color: T.text4, fontSize: 14, marginBottom: "0.15rem" }}>↓</div>
 
        {/* Hidden states */}
        <div style={rowStyle}>
          <span style={rowLabelStyle}>Encoder h</span>
          {HIDDEN_TOKENS.map(t => (
            <Chip key={t.id} text={t.text} active={isActive(t.id)} strokeStyle="dashed" />
          ))}
          <span style={{ color: T.text4, fontSize: 13, margin: "0 2px" }}>→</span>
          <Chip text="context" active={isActive("ctx")} strokeStyle="dotted" />
        </div>
 
        {/* Attention grid */}
        {attnRows.length > 0 && (
          <div style={{ marginBottom: "0.75rem", marginTop: "0.25rem" }}>
            <div style={{ ...rowLabelStyle, marginBottom: 8, display: "block" }}>
              Attention weights (darker = higher)
            </div>
            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: `56px repeat(4, 1fr)`, gap: 3, marginBottom: 3 }}>
              <div />
              {encLabels.map(l => (
                <div key={l} style={{ fontSize: 10, color: T.text4, textAlign: "center", fontFamily: "'IBM Plex Mono', monospace" }}>{l}</div>
              ))}
            </div>
            {attnRows.map((row, ri) => (
              <div key={ri} style={{ display: "grid", gridTemplateColumns: `56px repeat(4, 1fr)`, gap: 3, marginBottom: 3 }}>
                <div style={{ fontSize: 10, color: T.text3, fontFamily: "'IBM Plex Mono', monospace", display: "flex", alignItems: "center" }}>
                  {outLabels[ri] ?? `t${ri + 1}`}
                </div>
                {row.map((w, ci) => (
                  <div key={ci} style={{
                    height: 28, borderRadius: 4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `rgba(0,0,0,${Math.min(0.85, w * 2.6)})`,
                    border: `1px solid rgba(0,0,0,${Math.max(0.08, w * 0.5)})`,
                    // In dark mode these colors invert via filter would be wrong;
                    // instead use a CSS custom property approach:
                    fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500,
                    color: w > 0.3 ? "#fff" : "transparent",
                    transition: "all 0.35s",
                  }}>
                    {w.toFixed(2)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
 
        <div style={{ height: 18, display: "flex", alignItems: "center", paddingLeft: 72, color: T.text4, fontSize: 14, marginBottom: "0.15rem" }}>↓</div>
 
        {/* Decoder output */}
        <div style={rowStyle}>
          <span style={rowLabelStyle}>Decoder</span>
          {DEC_TOKENS.map(t => (
            <Chip key={t.id} text={t.text} active={isActive(t.id)} strokeStyle="dashed" />
          ))}
          {OUT_TOKENS.map(t => (
            <Chip key={t.id} text={t.text} active={(current?.decActive ?? []).includes(t.id)} />
          ))}
        </div>
 
        {/* Controls */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: "0.75rem" }}>
          {[
            { label: stepIdx >= SIM_STEPS.length - 1 ? "✓ Done" : "⟶ Step", fn: step,       disabled: stepIdx >= SIM_STEPS.length - 1, primary: true  },
            { label: isAuto ? "⏸ Pause" : "▶ Auto",                          fn: toggleAuto, disabled: false,                           primary: false },
            { label: "↺ Reset",                                                fn: reset,      disabled: false,                           primary: false },
          ].map(b => (
            <button
              key={b.label}
              onClick={b.fn}
              disabled={b.disabled}
              style={{
                padding: "5px 15px", borderRadius: 7,
                fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
                border: `1px solid ${b.primary ? T.text : T.border2}`,
                background: b.primary ? T.text : "transparent",
                color: b.primary ? T.bg : T.text3,
                opacity: b.disabled ? 0.35 : 1,
                transition: "all .18s", fontWeight: 500,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
 
        {/* Step counter */}
        <div style={{ fontSize: 11, color: T.text4, fontFamily: "'IBM Plex Mono', monospace" }}>
          step <span style={{ color: T.text2 }}>{Math.max(0, stepIdx + 1)}</span> / {SIM_STEPS.length}
          {current && <span style={{ color: T.text4 }}> — {current.label}</span>}
        </div>
 
        {/* Description */}
        {current && (
          <div
            key={stepIdx}
            className="animate-slide"
            style={{
              marginTop: "0.75rem", padding: "0.7rem 0.9rem",
              background: T.bg3, borderRadius: 7,
              border: `1px solid ${T.border}`,
              fontSize: 12, color: T.text3, lineHeight: 1.65,
            }}
          >
            {current.description}
          </div>
        )}
      </div>
 
      {/* Legend */}
      <Card>
        <CardLabel>Chip legend</CardLabel>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 6, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Chip text="solid" active={false} strokeStyle="solid" />
            <span style={{ fontSize: 12, color: T.text3 }}>input / output tokens</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Chip text="dashed" active={false} strokeStyle="dashed" />
            <span style={{ fontSize: 12, color: T.text3 }}>encoder states</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Chip text="dotted" active={false} strokeStyle="dotted" />
            <span style={{ fontSize: 12, color: T.text3 }}>context vector</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ display: "inline-block", width: 28, height: 18, borderRadius: 3, background: T.text }} />
            <span style={{ fontSize: 12, color: T.text3 }}>active / high weight</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
 
// ─── TAB: Architecture ───────────────────────────────────────────────────────
 
function ArchitectureTab() {
  const blocks = [
    {
      label: "Encoder",
      desc: "Reads the full input sequence, producing hidden states h₁…hₙ. Each state captures contextual meaning via multi-head self-attention.",
      tags: ["BiLSTM / Transformer", "Hidden states h₁…hₙ", "Self-attention"],
    },
    {
      label: "Cross-Attention",
      desc: "Bridges encoder and decoder. Computes alignment: which encoder states does each decoder step most need? Solves the information bottleneck.",
      tags: ["Q from decoder", "K, V from encoder", "Softmax weights α"],
    },
    {
      label: "Decoder",
      desc: "Auto-regressive generation: at each step, takes previous token + attended context → predicts next token via softmax over vocabulary.",
      tags: ["Teacher forcing", "Beam search", "Temperature sampling"],
    },
  ];
 
  const formula = `<span style="opacity:.5">// Scaled dot-product attention (Vaswani et al., 2017)</span>
Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) · V
 
<span style="opacity:.45">// Where:</span>
Q  = Query  ← decoder hidden state   (what we're looking for)
K  = Key    ← encoder hidden states  (index into memory)
V  = Value  ← encoder hidden states  (content to retrieve)
dₖ = key dimension                   (scaling prevents saturation)
 
<span style="opacity:.45">// Multi-head: run H attention functions in parallel, then concat</span>
MultiHead(Q,K,V) = Concat(head₁, …, headₙ) · Wᵒ
headᵢ = Attention(Q·Wᵢᵠ, K·Wᵢᴷ, V·Wᵢᵛ)`;
 
  return (
    <div className="animate-fade">
      <SectionHeader
        label="Deep Dive"
        title="Encoder–Decoder Architecture"
        subtitle="Three pillars of Seq2Seq — understand these before writing a single line of code."
      />
 
      {/* Architecture blocks */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.4rem", flexWrap: "wrap" }}>
        {blocks.map((b, i) => (
          <div key={b.label} style={{
            flex: 1, minWidth: 155,
            background: T.bg2, border: `1px solid ${T.border}`,
            borderTop: `2px solid ${T.text}`,
            borderRadius: 9, padding: "0.95rem",
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.text3, marginBottom: 6 }}>{b.label}</div>
            <p style={{ fontSize: 12, color: T.text3, marginBottom: 10 }}>{b.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {b.tags.map(t => (
                <span key={t} style={{
                  fontSize: 10, padding: "2px 7px", borderRadius: 4,
                  background: T.bg3, color: T.text4,
                  fontFamily: "'IBM Plex Mono', monospace",
                  border: `1px solid ${T.border}`,
                }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
 
      <H3>Attention mechanism — the math</H3>
      <Code lang="math">{formula}</Code>
 
      <H3>Tokenization strategies</H3>
      <Grid2>
        <Card accentSide>
          <CardLabel>BPE — GPT family</CardLabel>
          <p style={{ fontSize: 13, color: T.text3 }}>"unbelievable" → ["un", "believ", "able"]. Vocabulary built by iteratively merging the most frequent character pairs. Used by GPT-2/3/4, Llama 2.</p>
        </Card>
        <Card accentSide>
          <CardLabel>SentencePiece — T5, Llama 3</CardLabel>
          <p style={{ fontSize: 13, color: T.text3 }}>Language-agnostic; treats spaces as part of tokens: "▁hello▁world". Ideal for multilingual Seq2Seq — handles CJK and low-resource languages without special casing.</p>
        </Card>
      </Grid2>
 
      <H3>Classic bottleneck vs. cross-attention</H3>
      <Card accentSide>
        <CardLabel>Design trade-off</CardLabel>
        <p style={{ fontSize: 13, color: T.text3, margin: 0 }}>Classic Seq2Seq (pre-2017) compressed all encoder information into a <em>single</em> context vector — catastrophic for long inputs. The transformer's cross-attention solved this: the decoder queries <em>all</em> encoder states at every step, creating a dynamic per-step context. This is why transformer Seq2Seq dominates on long-document tasks.</p>
      </Card>
    </div>
  );
}
 
// ─── TAB: Code ───────────────────────────────────────────────────────────────
 
function CodeTab() {
  const snippets: { title: string; lang: string; code: string }[] = [
    {
      title: "Step 1 — Install dependencies",
      lang: "bash",
      code: `<span style="opacity:.5"># LLM backbone + schema validation + TypeScript</span>
npm install @anthropic-ai/sdk zod
npm install --save-dev typescript @types/node ts-node`,
    },
    {
      title: "Step 2 — Types & Zod schema",
      lang: "typescript",
      code: `import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
 
<span style="opacity:.5">// Schema guards every API boundary — never skip in production</span>
const Seq2SeqInput = z.object({
  sourceText:  z.string().min(1).max(8192),
  sourceLang:  z.string().default('English'),
  targetLang:  z.string(),
  task:        z.enum(['translate', 'summarize', 'paraphrase']),
  maxTokens:   z.number().optional().default(1024),
  temperature: z.number().min(0).max(1).optional().default(0.3),
});
 
type Seq2SeqInput  = z.infer<typeof Seq2SeqInput>;
type Seq2SeqOutput = {
  outputText:   string;
  inputTokens:  number;
  outputTokens: number;
  latencyMs:    number;
  alignment?:   number[][];
};`,
    },
    {
      title: "Step 3 — Encoder prompt (system prompt = encoder)",
      lang: "typescript",
      code: `<span style="opacity:.5">// In API-based Seq2Seq, the system prompt IS the encoder.
// It frames the task, sets output constraints, and primes the LLM.</span>
function buildEncoderPrompt(input: Seq2SeqInput): string {
  const instructions: Record<string, string> = {
    translate:  \`You are a precise \${input.sourceLang}→\${input.targetLang} translator.
Output ONLY the translated text — no explanations.
Preserve formatting, tone, and technical terms exactly.\`,
 
    summarize:  \`Summarize the following in \${input.targetLang}.
Target ≤ 25% of original length.
Retain: key facts, named entities, numbers, and conclusions.\`,
 
    paraphrase: \`Rewrite the following text in \${input.targetLang}.
Use different vocabulary and sentence structures throughout.
Preserve original meaning with zero information loss.\`,
  };
  return instructions[input.task];
}`,
    },
    {
      title: "Step 4 — Streaming decoder (auto-regressive generation)",
      lang: "typescript",
      code: `const client = new Anthropic();
 
<span style="opacity:.5">// Decoder generates tokens auto-regressively.
// Streaming emits each token as produced — essential for UX.</span>
async function decode(
  input: Seq2SeqInput,
  onToken?: (token: string) => void,
): Promise<Seq2SeqOutput> {
  const start = Date.now();
  let outputText = '', inputTokens = 0, outputTokens = 0;
 
  const stream = client.messages.stream({
    model:       'claude-opus-4-5',
    max_tokens:  input.maxTokens,
    temperature: input.temperature,
    system:      buildEncoderPrompt(input),
    messages:    [{ role: 'user', content: input.sourceText }],
  });
 
  <span style="opacity:.5">// Each chunk = one decoder step (mirrors auto-regressive behaviour)</span>
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta'
        && chunk.delta.type === 'text_delta') {
      outputText += chunk.delta.text;
      onToken?.(chunk.delta.text);        <span style="opacity:.5">// stream token to UI</span>
    }
    if (chunk.type === 'message_delta')  outputTokens = chunk.usage.output_tokens;
    if (chunk.type === 'message_start')  inputTokens  = chunk.message.usage.input_tokens;
  }
  return { outputText, inputTokens, outputTokens, latencyMs: Date.now() - start };
}`,
    },
    {
      title: "Step 5 — Token alignment (attention proxy for explainability)",
      lang: "typescript",
      code: `<span style="opacity:.5">// Real attention weights live inside the model.
// This approximates alignment via shared character n-grams —
// useful for highlighting source/target correspondences in a UI.</span>
function computeAlignment(
  srcTokens: string[],
  tgtTokens: string[],
): number[][] {
  return tgtTokens.map(tgt => {
    const row = srcTokens.map(src => {
      const shared = [...src.toLowerCase()]
        .filter(ch => tgt.toLowerCase().includes(ch)).length;
      return shared / Math.max(src.length, tgt.length);
    });
    <span style="opacity:.5">// Normalise row to sum = 1 (softmax proxy)</span>
    const total = row.reduce((a, b) => a + b, 0) || 1;
    return row.map(v => parseFloat((v / total).toFixed(3)));
  });
}`,
    },
    {
      title: "Step 6 — Full pipeline composition",
      lang: "typescript",
      code: `<span style="opacity:.5">// Orchestrate: validate → encode → decode → align</span>
async function seq2seq(rawInput: unknown): Promise<Seq2SeqOutput> {
  <span style="opacity:.5">// 1. Validate — zod throws on malformed input before wasting tokens</span>
  const input = Seq2SeqInput.parse(rawInput);
 
  console.log(\`[Encoder] \${input.task} | \${input.sourceLang}→\${input.targetLang}\`);
 
  <span style="opacity:.5">// 2. Decode with live streaming to stdout</span>
  const result = await decode(input, token => process.stdout.write(token));
 
  <span style="opacity:.5">// 3. Compute alignment for UI explainability layer</span>
  const alignment = computeAlignment(
    input.sourceText.split(/\s+/),
    result.outputText.split(/\s+/),
  );
 
  console.log(\`\n[Decoder] \${result.outputTokens} tokens | \${result.latencyMs}ms\`);
  return { ...result, alignment };
}
 
<span style="opacity:.5">// ── Example ────────────────────────────────────────────────────</span>
const output = await seq2seq({
  sourceText:  'The cat sat on the mat.',
  sourceLang:  'English',
  targetLang:  'French',
  task:        'translate',
  temperature: 0.2,  <span style="opacity:.5">// low = deterministic; high = creative</span>
});
<span style="opacity:.5">// → "Le chat était assis sur le tapis."</span>`,
    },
  ];
 
  return (
    <div className="animate-fade">
      <SectionHeader
        label="Implementation"
        title="TypeScript Pipeline"
        subtitle="Six self-contained, heavily-commented steps — from dependency setup to a production-ready orchestrator."
      />
      {snippets.map(s => (
        <div key={s.title}>
          <H3>{s.title}</H3>
          <Code lang={s.lang}>{s.code}</Code>
        </div>
      ))}
    </div>
  );
}
 
// ─── TAB: Pitfalls ───────────────────────────────────────────────────────────
 
function PitfallsTab() {
  const pitfalls = [
    { icon: "⚡", title: "Exposure bias (teacher forcing)", desc: "During training you feed ground-truth tokens to the decoder; at inference it feeds its own predictions — errors compound. Fix: scheduled sampling — gradually replace teacher-forced tokens with model predictions over training." },
    { icon: "■",  title: "Information bottleneck",          desc: "Compressing long inputs into a single context vector loses information for sequences > ~30 tokens. Fix: use full cross-attention (transformer decoder) or chunked encoding with hierarchical summarization." },
    { icon: "↻",  title: "Repetition loops",               desc: "The decoder can get stuck repeating a phrase ('the the the…'). Fix: apply repetition penalty — multiply logits of already-generated tokens by a factor < 1. Most LLM APIs expose this as a parameter." },
    { icon: "✂",  title: "Truncated outputs",              desc: "Setting max_tokens too low cuts the output mid-sentence. Fix: budget generously. For structured outputs (JSON, code), monitor for balanced delimiters and retry with continuation prompts if malformed." },
    { icon: "〜", title: "Temperature miscalibration",      desc: "High temperature (≥ 1.0) adds noise; low (< 0.2) makes outputs repetitive and bland. Fix: 0.2–0.4 for factual tasks (translation, summarization); 0.6–0.9 for creative/dialogue tasks." },
    { icon: "↔",  title: "Padding waste in fine-tuning",   desc: "Padding all sequences to max length wastes compute and distorts attention. Fix: dynamic batching — group sequences of similar length — and mask padding tokens via attention_mask." },
  ];
  const tips = [
    { icon: "◈", title: "Cache encoder outputs",           desc: "If the same source text is decoded multiple times (beam search, multiple candidates), cache encoder hidden states via past_key_values in HuggingFace generate()." },
    { icon: "◎", title: "Beam search for accuracy tasks",  desc: "Greedy decoding is fast but suboptimal. Beam search (width 4–8) yields measurably better BLEU scores on translation without prohibitive latency. Use greedy for draft generation." },
    { icon: "◇", title: "Metric selection matters",         desc: "BLEU for translation, ROUGE-L for summarization, ChrF for multilingual tasks. Metrics disagree — run multiple. Human evaluation remains the gold standard for nuanced quality." },
    { icon: "◻", title: "Validate at every boundary",       desc: "Malformed inputs waste tokens and produce cryptic errors. The Zod schema we defined guards the API surface — never skip validation in production, even from trusted sources." },
  ];
 
  return (
    <div className="animate-fade">
      <SectionHeader
        label="Troubleshooting"
        title="Pitfalls & Production Tips"
        subtitle="The same problems surface repeatedly. Here is what to watch for and how to fix each one."
      />
 
      <H3>Common pitfalls</H3>
      {pitfalls.map(p => (
        <div key={p.title} style={{
          display: "flex", gap: 12, padding: "0.8rem 1rem",
          background: T.bg2, border: `1px solid ${T.border}`,
          borderRadius: 9, marginBottom: "0.5rem",
        }}>
          <span style={{ fontSize: 16, flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", color: T.text2, minWidth: 20, paddingTop: 1 }}>{p.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 3 }}>{p.title}</div>
            <p style={{ fontSize: 12, color: T.text3, margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        </div>
      ))}
 
      <H3>Production tips</H3>
      {tips.map(t => (
        <div key={t.title} style={{
          display: "flex", gap: 12, padding: "0.8rem 1rem",
          background: T.bg2, border: `1px solid ${T.border}`,
          borderLeft: `3px solid ${T.text}`,
          borderRadius: 9, marginBottom: "0.5rem",
        }}>
          <span style={{ fontSize: 16, flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", color: T.text2, minWidth: 20, paddingTop: 1 }}>{t.icon}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 3 }}>{t.title}</div>
            <p style={{ fontSize: 12, color: T.text3, margin: 0, lineHeight: 1.6 }}>{t.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
 
// ─── TAB: Summary ────────────────────────────────────────────────────────────
 
function SummaryTab() {
  const concepts = [
    { sym: "E", title: "Encoder",       desc: "Reads input; produces hidden states h₁…hₙ capturing meaning in context" },
    { sym: "A", title: "Attention",     desc: "Dynamic focus — decoder queries encoder states via scaled dot-product Q·Kᵀ/√dₖ" },
    { sym: "D", title: "Decoder",       desc: "Auto-regressive generation, one token at a time, conditioned on context" },
    { sym: "T", title: "Tokenization",  desc: "BPE or SentencePiece sub-word splitting balances vocabulary size vs coverage" },
    { sym: "S", title: "Streaming",     desc: "Emit decoder tokens as produced — critical for responsive production UX" },
    { sym: "V", title: "Validation",    desc: "Zod schemas guard every API boundary — prevent malformed inputs reaching the LLM" },
  ];
  const nextSteps = [
    "Experiment with temperature (0.2 vs 0.7) and measure output quality on your data.",
    "Run BLEU/ROUGE evaluation before and after adjusting the encoder prompt.",
    "Fine-tune T5-small on your domain data if API cost is a constraint at scale.",
    "Visualize real attention weights using HuggingFace BertViz for interpretability.",
    "Implement beam search (width 4) for translation tasks to improve BLEU score.",
  ];
 
  return (
    <div className="animate-fade">
      <SectionHeader
        label="Key Takeaways"
        title="What You've Learned"
        subtitle="A distillation of the critical concepts across all sections of this guide."
      />
 
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))", gap: "0.6rem", marginBottom: "1.4rem" }}>
        {concepts.map(c => (
          <div key={c.title} style={{
            background: T.bg2, border: `1px solid ${T.border}`,
            borderRadius: 9, padding: "0.95rem", textAlign: "center",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: T.text, color: T.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
              margin: "0 auto 8px",
            }}>{c.sym}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: T.text4, lineHeight: 1.55 }}>{c.desc}</div>
          </div>
        ))}
      </div>
 
      <Card accentSide>
        <CardLabel>The LLM Seq2Seq advantage</CardLabel>
        <p style={{ fontSize: 13, color: T.text3, margin: 0 }}>
          Building Seq2Seq on top of a pre-trained LLM means inheriting billions of parameters of linguistic knowledge. Your encoder prompt and decoder settings become the primary engineering surface — letting you achieve strong results without training from scratch. The TypeScript pipeline in this guide is production-ready for API-based deployments; for custom fine-tuning, layer HuggingFace's T5 or BART on the same architectural principles.
        </p>
      </Card>
 
      <Card accentSide>
        <CardLabel>Recommended next steps</CardLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {nextSteps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, fontSize: 13, color: T.text3 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.text4, minWidth: 20, paddingTop: 1, flexShrink: 0 }}>0{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
 
// ─── Root ─────────────────────────────────────────────────────────────────────
 
export default function Seq2SeqGuide() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
 
  const tabContent: Record<Tab, React.ReactNode> = {
    overview:     <OverviewTab />,
    simulation:   <SimulationTab />,
    architecture: <ArchitectureTab />,
    code:         <CodeTab />,
    pitfalls:     <PitfallsTab />,
    summary:      <SummaryTab />,
  };
 
  return (
    <>
      <style>{styles}</style>
 
      {/* ── Hero ── */}
      <div style={{
        padding: "2.5rem 2rem 1.75rem",
        background: T.bg2,
        borderBottom: `1px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.4, pointerEvents: "none",
        }} />
 
        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: T.bg3, border: `1px solid ${T.border2}`,
            color: T.text3, fontSize: 10, fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 999, marginBottom: "0.9rem",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: T.text, animation: "pulse 2s ease-in-out infinite",
            }} />
            Technical Deep-Dive
          </div>
 
          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
            fontWeight: 600, lineHeight: 1.2,
            color: T.text,
            marginBottom: "0.65rem",
            fontFamily: "'Sora', sans-serif",
            letterSpacing: "-0.01em",
          }}>
            Building Seq2Seq Models<br />with Large Language Models
          </h1>
          <p style={{ fontSize: 14, color: T.text3, fontWeight: 300, maxWidth: 520, lineHeight: 1.7 }}>
            Architecture fundamentals, interactive simulation, and production-ready TypeScript implementation — for developers and data scientists.
          </p>
        </div>
      </div>
 
      {/* ── Nav tabs ── */}
      <div style={{
        display: "flex", gap: 0, overflowX: "auto",
        background: T.bg, borderBottom: `1px solid ${T.border}`,
        padding: "0 1.25rem", scrollbarWidth: "none",
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "0.8rem 1rem",
              fontSize: 13, fontFamily: "'Sora', sans-serif",
              color: activeTab === t.id ? T.text : T.text4,
              background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === t.id ? T.text : "transparent"}`,
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.18s",
              fontWeight: activeTab === t.id ? 500 : 400,
            }}
          >
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: T.text,
              opacity: activeTab === t.id ? 1 : 0.2,
              transition: "opacity 0.18s",
            }} />
            {t.label}
          </button>
        ))}
      </div>
 
      {/* ── Content ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "1.75rem 1.25rem 3rem" }}>
        {tabContent[activeTab]}
      </div>
    </>
  );
}
"use client";
import { useState, useEffect, useRef } from "react";

const COLORS = {
  purple: "#7F77DD",
  purpleLight: "#EEEDFE",
  purpleDark: "#3C3489",
  teal: "#1D9E75",
  tealLight: "#E1F5EE",
  coral: "#D85A30",
  coralLight: "#FAECE7",
  amber: "#BA7517",
  amberLight: "#FAEEDA",
  gray: "#888780",
  grayLight: "#F1EFE8",
  blue: "#378ADD",
  blueLight: "#E6F1FB",
};

const sigmoid = (x) => (1 / (1 + Math.exp(-x))).toFixed(2);
const tanh = (x) => Math.tanh(x).toFixed(2);

function GateViz({ label, color, value, description }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      padding: "10px 14px",
      background: color + "22",
      border: `1.5px solid ${color}55`,
      borderRadius: 12,
      minWidth: 90,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: `conic-gradient(${color} ${value * 360}deg, #e0e0e055 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 12px ${color}44`,
        transition: "all 0.5s ease",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "var(--color-background-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color,
        }}>{Math.round(value * 100)}%</div>
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textAlign: "center", maxWidth: 80 }}>{description}</div>
    </div>
  );
}

function AnimatedArrow({ active, color = COLORS.purple }) {
  return (
    <div style={{
      width: 40, height: 2,
      background: active ? color : "#ccc",
      position: "relative",
      transition: "background 0.4s",
      margin: "0 2px",
    }}>
      <div style={{
        position: "absolute", right: -1, top: "50%", transform: "translateY(-50%)",
        width: 0, height: 0,
        borderLeft: `8px solid ${active ? color : "#ccc"}`,
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        transition: "border-color 0.4s",
      }} />
      {active && (
        <div style={{
          position: "absolute", top: "50%", left: 0,
          width: 8, height: 8, borderRadius: "50%",
          background: color,
          transform: "translate(0, -50%)",
          animation: "slideRight 1.2s linear infinite",
        }} />
      )}
    </div>
  );
}

function LSTMDiagram({ step, forget, input, output, cellState, hiddenState }) {
  const boxes = [
    { id: "f", label: "Forget\nGate", x: 90, color: COLORS.coral, value: forget, desc: "erase?" },
    { id: "i", label: "Input\nGate", x: 230, color: COLORS.teal, value: input, desc: "write?" },
    { id: "c", label: "Cell\nUpdate", x: 370, color: COLORS.purple, value: 0.5 + cellState * 0.5, desc: "new info" },
    { id: "o", label: "Output\nGate", x: 510, color: COLORS.amber, value: output, desc: "read?" },
  ];

  return (
    <div style={{ position: "relative", width: "100%", overflowX: "auto" }}>
      <svg width="660" height="220" style={{ display: "block", margin: "0 auto" }}>
        {/* Cell state highway */}
        <line x1="20" y1="40" x2="640" y2="40" stroke={COLORS.purple} strokeWidth={3} strokeDasharray="8 4" />
        <text x="10" y="35" fontSize="11" fill={COLORS.purple} fontWeight={600}>C_t</text>
        {[120, 260, 400, 540].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={40} r={10} fill="white" stroke={COLORS.purple} strokeWidth={2} />
            <text x={x} y={45} textAnchor="middle" fontSize={13} fill={COLORS.purple} fontWeight={700}>
              {i === 0 ? "×" : i === 1 ? "+" : i === 2 ? "⊙" : "×"}
            </text>
          </g>
        ))}

        {/* Hidden state */}
        <line x1="20" y1="190" x2="640" y2="190" stroke={COLORS.blue} strokeWidth={2.5} />
        <text x="10" y="185" fontSize="11" fill={COLORS.blue} fontWeight={600}>h_t</text>

        {/* Gate columns */}
        {boxes.map((b, i) => (
          <g key={b.id}>
            {/* Gate box */}
            <rect x={b.x} y={85} width={90} height={70} rx={10}
              fill={b.color + "22"} stroke={b.color} strokeWidth={1.5} />
            {b.label.split("\n").map((l, li) => (
              <text key={li} x={b.x + 45} y={li === 0 ? 115 : 130}
                textAnchor="middle" fontSize={12} fontWeight={600} fill={b.color}>{l}</text>
            ))}
            {/* Connection to highway */}
            <line x1={b.x + 45} y1={85} x2={b.x + 45} y2={50}
              stroke={b.color} strokeWidth={1.5} strokeDasharray="4 3" />
            {/* Connection to hidden */}
            <line x1={b.x + 45} y1={155} x2={b.x + 45} y2={180}
              stroke={b.color} strokeWidth={1.5} strokeDasharray="4 3" />
            {/* Value indicator */}
            <rect x={b.x + 5} y={160} width={80 * b.value} height={8} rx={4}
              fill={b.color} style={{ transition: "width 0.6s ease" }} />
            <rect x={b.x + 5} y={160} width={80} height={8} rx={4}
              fill="none" stroke={b.color + "44"} strokeWidth={1} />
          </g>
        ))}

        {/* Input label */}
        <text x="330" y="215" textAnchor="middle" fontSize="11" fill="var(--color-text-secondary)">
          x_t (input) + h_{"{t-1}"} (previous hidden state)
        </text>
      </svg>
    </div>
  );
}

function GRUDiagram({ reset, update, hiddenState }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg width="580" height="200" style={{ display: "block", margin: "0 auto" }}>
        {/* Hidden state highway */}
        <line x1="20" y1="40" x2="560" y2="40" stroke={COLORS.teal} strokeWidth={3} />
        <text x="10" y="35" fontSize="11" fill={COLORS.teal} fontWeight={600}>h_t</text>

        {/* Update gate node */}
        <circle cx={200} cy={40} r={12} fill="white" stroke={COLORS.amber} strokeWidth={2} />
        <text x={200} y={45} textAnchor="middle" fontSize={14} fill={COLORS.amber} fontWeight={700}>⊕</text>

        {/* Reset gate box */}
        <rect x={80} y={85} width={110} height={70} rx={10}
          fill={COLORS.coralLight} stroke={COLORS.coral} strokeWidth={1.5} />
        <text x={135} y={115} textAnchor="middle" fontSize={12} fontWeight={600} fill={COLORS.coral}>Reset Gate</text>
        <text x={135} y={132} textAnchor="middle" fontSize={11} fill={COLORS.coral}>how much past?</text>
        <rect x={90} y={155} width={90 * reset} height={8} rx={4}
          fill={COLORS.coral} style={{ transition: "width 0.6s ease" }} />
        <rect x={90} y={155} width={90} height={8} rx={4}
          fill="none" stroke={COLORS.coral + "44"} strokeWidth={1} />

        {/* Update gate box */}
        <rect x={240} y={85} width={120} height={70} rx={10}
          fill={COLORS.amberLight} stroke={COLORS.amber} strokeWidth={1.5} />
        <text x={300} y={115} textAnchor="middle" fontSize={12} fontWeight={600} fill={COLORS.amber}>Update Gate</text>
        <text x={300} y={132} textAnchor="middle" fontSize={11} fill={COLORS.amber}>keep or replace?</text>
        <rect x={250} y={155} width={100 * update} height={8} rx={4}
          fill={COLORS.amber} style={{ transition: "width 0.6s ease" }} />
        <rect x={250} y={155} width={100} height={8} rx={4}
          fill="none" stroke={COLORS.amber + "44"} strokeWidth={1} />

        {/* Candidate hidden box */}
        <rect x={410} y={85} width={130} height={70} rx={10}
          fill={COLORS.tealLight} stroke={COLORS.teal} strokeWidth={1.5} />
        <text x={475} y={115} textAnchor="middle" fontSize={12} fontWeight={600} fill={COLORS.teal}>Candidate h̃</text>
        <text x={475} y={132} textAnchor="middle" fontSize={11} fill={COLORS.teal}>new candidate</text>

        {/* Connections */}
        <line x1={135} y1={85} x2={135} y2={55} stroke={COLORS.coral} strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={300} y1={85} x2={300} y2={55} stroke={COLORS.amber} strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={475} y1={85} x2={475} y2={55} stroke={COLORS.teal} strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={300} y1={55} x2={200} y2={40} stroke={COLORS.amber} strokeWidth={1.5} />

        <text x={290} y={190} textAnchor="middle" fontSize={11} fill="var(--color-text-secondary)">
          x_t + h_{"{t-1}"} → 2 gates instead of 3 (simpler!)
        </text>
      </svg>
    </div>
  );
}

const SENTENCES = [
  { words: ["The", "cat", "sat", "on", "the", "mat"], focus: 2 },
  { words: ["I", "love", "deep", "learning", "models"], focus: 3 },
  { words: ["Paris", "is", "the", "capital", "of", "France"], focus: 5 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("lstm");
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sentence = SENTENCES[sentenceIdx];
  const maxSteps = sentence.words.length;

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep(s => {
          if (s >= maxSteps - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, 900);
    }
    return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
  }, [playing, maxSteps]);

  const progress = step / Math.max(maxSteps - 1, 1);
  const forgetVal = parseFloat(sigmoid(progress * 4 - 2));
  const inputVal = parseFloat(sigmoid(-progress * 3 + 1.5));
  const outputVal = parseFloat(sigmoid(progress * 2 - 0.5));
  const resetVal = parseFloat(sigmoid(progress * 3 - 1));
  const updateVal = parseFloat(sigmoid(-progress * 2 + 1));
  const cellState = Math.tanh(progress * 2 - 1);

  const tabs = [
    { id: "lstm", label: "LSTM", color: COLORS.purple },
    { id: "gru", label: "GRU", color: COLORS.teal },
    { id: "compare", label: "Compare", color: COLORS.blue },
  ];

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0", maxWidth: 720, margin: "0 auto" }}>
      <style>{`
        @keyframes slideRight {
          0% { left: 0%; } 100% { left: 100%; }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .word-token {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 6px 12px; border-radius: 8px; font-weight: 600;
          font-size: 14px; border: 2px solid transparent;
          cursor: pointer; transition: all 0.3s ease;
        }
        .word-token.active {
          animation: pulse 0.9s ease-in-out infinite;
          box-shadow: 0 0 16px currentColor;
        }
        .tab-btn {
          padding: 8px 20px; border-radius: 8px; font-size: 14px;
          font-weight: 600; cursor: pointer; border: 1.5px solid;
          transition: all 0.2s ease;
        }
        .card {
          background: var(--color-background-primary);
          border: 0.5px solid var(--color-border-tertiary);
          border-radius: 14px; padding: 1.25rem;
          animation: fadeIn 0.3s ease;
        }
        .compare-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }
        @media (max-width: 500px) { .compare-row { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 6px", color: "var(--color-text-primary)" }}>
          LSTM &amp; GRU — memory networks, visualized
        </h2>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          Both are recurrent neural networks (RNNs) that process sequences one token at a time, maintaining a <em>memory</em> of what came before. Watch how gates control what gets remembered or forgotten.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.25rem" }}>
        {tabs.map(t => (
          <button key={t.id} className="tab-btn"
            onClick={() => setActiveTab(t.id)}
            style={{
              background: activeTab === t.id ? t.color + "18" : "transparent",
              borderColor: activeTab === t.id ? t.color : "var(--color-border-secondary)",
              color: activeTab === t.id ? t.color : "var(--color-text-secondary)",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Sentence player */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          Processing sequence
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {sentence.words.map((w, i) => (
            <span key={i} className={`word-token ${i === step ? "active" : ""}`}
              onClick={() => setStep(i)}
              style={{
                background: i < step ? COLORS.purpleLight : i === step ? COLORS.purple + "22" : "var(--color-background-secondary)",
                borderColor: i === step ? COLORS.purple : i < step ? COLORS.purple + "66" : "transparent",
                color: i === step ? COLORS.purple : i < step ? COLORS.purpleDark : "var(--color-text-secondary)",
              }}>
              {w}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="tab-btn" onClick={() => { setStep(0); setPlaying(false); }}
            style={{ borderColor: "var(--color-border-secondary)", color: "var(--color-text-secondary)", background: "transparent", padding: "6px 14px" }}>
            ↺ Reset
          </button>
          <button className="tab-btn" onClick={() => setPlaying(p => !p)}
            style={{
              borderColor: COLORS.purple, color: "white",
              background: playing ? COLORS.coral : COLORS.purple, padding: "6px 18px",
            }}>
            {playing ? "⏸ Pause" : "▶ Animate"}
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {SENTENCES.map((_, i) => (
              <button key={i} onClick={() => { setSentenceIdx(i); setStep(0); setPlaying(false); }}
                style={{
                  width: 28, height: 28, borderRadius: "50%", fontSize: 11,
                  border: `1.5px solid ${sentenceIdx === i ? COLORS.purple : "var(--color-border-secondary)"}`,
                  background: sentenceIdx === i ? COLORS.purple + "18" : "transparent",
                  color: sentenceIdx === i ? COLORS.purple : "var(--color-text-secondary)",
                  cursor: "pointer",
                }}>
                {i + 1}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: "auto" }}>
            Step {step + 1}/{maxSteps}
          </span>
        </div>
      </div>

      {/* LSTM Tab */}
      {activeTab === "lstm" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.purple, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              LSTM — Long Short-Term Memory
            </div>
            <LSTMDiagram step={step} forget={forgetVal} input={inputVal} output={outputVal} cellState={cellState} hiddenState={progress} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: "1rem" }}>
            <GateViz label="Forget" color={COLORS.coral} value={forgetVal} description="erase old memory" />
            <GateViz label="Input" color={COLORS.teal} value={inputVal} description="add new info" />
            <GateViz label="Cell" color={COLORS.purple} value={0.5 + cellState * 0.5} description="long-term memory" />
            <GateViz label="Output" color={COLORS.amber} value={outputVal} description="what to reveal" />
          </div>

          <div className="card">
            <p style={{ fontSize: 14, lineHeight: 1.75, margin: "0 0 10px", color: "var(--color-text-primary)" }}>
              <strong>LSTM</strong> uses a dedicated <em>cell state</em> — a highway of long-term memory flowing through the sequence. Three gates act as filters:
            </p>
            <ul style={{ fontSize: 13.5, lineHeight: 1.8, paddingLeft: 20, margin: 0, color: "var(--color-text-secondary)" }}>
              <li><span style={{ color: COLORS.coral, fontWeight: 600 }}>Forget gate</span> — "should I erase something from long-term memory?" (sigmoid → 0 means forget, 1 means keep)</li>
              <li><span style={{ color: COLORS.teal, fontWeight: 600 }}>Input gate</span> — "should I write new information in?" (controls how much of the candidate enters the cell)</li>
              <li><span style={{ color: COLORS.amber, fontWeight: 600 }}>Output gate</span> — "what part of memory should I reveal?" (the filtered cell becomes the hidden state h_t)</li>
            </ul>
          </div>
        </div>
      )}

      {/* GRU Tab */}
      {activeTab === "gru" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.teal, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              GRU — Gated Recurrent Unit
            </div>
            <GRUDiagram reset={resetVal} update={updateVal} hiddenState={progress} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: "1rem" }}>
            <GateViz label="Reset" color={COLORS.coral} value={resetVal} description="how much past to use" />
            <GateViz label="Update" color={COLORS.amber} value={updateVal} description="keep old vs. add new" />
            <GateViz label="Hidden" color={COLORS.teal} value={0.4 + progress * 0.6} description="blended memory" />
          </div>

          <div className="card">
            <p style={{ fontSize: 14, lineHeight: 1.75, margin: "0 0 10px", color: "var(--color-text-primary)" }}>
              <strong>GRU</strong> simplifies LSTM by merging the cell state and hidden state into one, and reducing to two gates:
            </p>
            <ul style={{ fontSize: 13.5, lineHeight: 1.8, paddingLeft: 20, margin: 0, color: "var(--color-text-secondary)" }}>
              <li><span style={{ color: COLORS.coral, fontWeight: 600 }}>Reset gate</span> — controls how much of the previous hidden state influences the new candidate. Low reset = ignore the past.</li>
              <li><span style={{ color: COLORS.amber, fontWeight: 600 }}>Update gate</span> — interpolates between the old hidden state and the new candidate. Acts like both forget + input gates combined.</li>
            </ul>
            <p style={{ fontSize: 13.5, lineHeight: 1.75, margin: "10px 0 0", color: "var(--color-text-secondary)" }}>
              The hidden state h_t = (1 − z) × h_t-1 + z × h̃_t, where z is the update gate value. Elegant and often just as powerful as LSTM.
            </p>
          </div>
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === "compare" && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div className="compare-row" style={{ marginBottom: "1rem" }}>
            {[
              {
                name: "LSTM", color: COLORS.purple, icon: "🔒",
                props: [
                  ["Gates", "3 (forget, input, output)"],
                  ["Memory", "Separate cell state + hidden state"],
                  ["Parameters", "More (~4× hidden size)"],
                  ["Best for", "Long sequences, complex dependencies"],
                  ["Training", "Slightly slower"],
                  ["Vanishing gradient", "Very well handled"],
                ]
              },
              {
                name: "GRU", color: COLORS.teal, icon: "⚡",
                props: [
                  ["Gates", "2 (reset, update)"],
                  ["Memory", "Single hidden state"],
                  ["Parameters", "Fewer (~3× hidden size)"],
                  ["Best for", "Shorter sequences, faster training"],
                  ["Training", "Faster, easier to tune"],
                  ["Vanishing gradient", "Well handled"],
                ]
              }
            ].map(m => (
              <div key={m.name} className="card" style={{ borderColor: m.color + "55" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: m.color + "18", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, border: `1.5px solid ${m.color}44`,
                  }}>{m.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16, color: m.color }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{m.name === "LSTM" ? "Long Short-Term Memory" : "Gated Recurrent Unit"}</div>
                  </div>
                </div>
                {m.props.map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13 }}>
                    <span style={{ color: "var(--color-text-secondary)", minWidth: 80 }}>{k}</span>
                    <span style={{ color: "var(--color-text-primary)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--color-text-primary)" }}>Key insight: both solve the same problem</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.75, margin: "0 0 8px", color: "var(--color-text-secondary)" }}>
              Vanilla RNNs suffer from the <strong>vanishing gradient problem</strong> — gradients shrink to near-zero during backpropagation through long sequences, so the network forgets distant context.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.75, margin: "0 0 8px", color: "var(--color-text-secondary)" }}>
              Both LSTM and GRU introduce <strong>gating mechanisms</strong> that create a direct gradient highway, allowing gradients to flow backward without shrinking. This lets them remember context from dozens or hundreds of steps ago.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.75, margin: 0, color: "var(--color-text-secondary)" }}>
              In practice, <span style={{ color: COLORS.teal, fontWeight: 600 }}>GRU</span> is preferred when speed/efficiency matters; <span style={{ color: COLORS.purple, fontWeight: 600 }}>LSTM</span> is preferred when the task demands finer control over what to remember and forget. With Transformers now dominant in NLP, both are most commonly used in time-series, audio, and embedded applications.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}   
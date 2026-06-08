"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function MathematicalObservation() {
  const topics = [
    "Symmetry: Does the problem look the same from both ends?",
    "Periodicity: Does the answer repeat after a certain interval?",
    "Monotonicity: Does the value only increase or decrease?",
    "Invariants: Is there a property (like sum, parity) that stays constant?",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Mathematical Observation</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Math is the hidden language of algorithms. Often, a complex simulation can be replaced by a simple formula if you observe the right properties.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
          <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:13, marginBottom:4 }}>Parity</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>Even vs Odd properties often simplify problems.</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
          <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:13, marginBottom:4 }}>Summation</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>Using sum formulas (like n(n+1)/2) to avoid loops.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Mathematical Observation"
        code={["Solve small cases manually",
          "Write down result sequence",
          "Look for arithmetic/geometric trends",
          "Formulate a conjecture (hypothesis)",
          "Prove the conjecture using induction",
          "Implement optimized math formula"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Observation Checklist</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {topics.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
 
    </div></div>
  );
}

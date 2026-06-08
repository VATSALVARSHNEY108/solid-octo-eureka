"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ObservationBuilding() {
  const techniques = [
    "Write out the first 5-10 small cases manually",
    "Look for patterns in the sequence of outputs",
    "Check if the problem can be reduced to a known mathematical series",
    "Identify invariants — things that never change during operations",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Observation Building</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        High-level problem solving often requires finding a 'trick' or a mathematical observation that simplifies the problem significantly.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:16, padding:"24px", textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:16 }}>🔍</div>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:8 }}>How to Observe?</div>
        <div style={{ color: "var(--text-secondary)", fontSize:15, lineHeight:1.6 }}>
          Don't just stare at the screen. Pick up a pen and paper. Solve the problem for N=1, N=2, N=3... until the lightbulb moment happens.
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Pattern Observation Lab"
        code={[
          "Generate small test cases",
          "Dry run brute force",
          "Log intermediate results",
          "Look for periodic behavior",
          "Identify monotonic trends",
          "Derive general formula"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Observation Checklist</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {techniques.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
 
    </div></div>
  );
}

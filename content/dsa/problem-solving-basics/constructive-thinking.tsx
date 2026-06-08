"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ConstructiveThinking() {
  const steps = [
    "Start from a base case (e.g., N=1)",
    "Determine how to transition from N to N+1",
    "Ensure the construction satisfies all problem constraints",
    "Verify the construction with a few sample cases",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Constructive Thinking</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Constructive problems ask you to find *any* valid configuration that satisfies certain conditions. It's about building a solution from scratch rather than searching for one.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px", display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ fontSize:28 }}>🏗️</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>Building the Solution</div>
          <div style={{ color: "var(--text-secondary)", fontSize:13 }}>Often, there is a simple pattern or rule that allows you to construct the answer systematically.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Constructive Thinking"
        code={["Analyze required output properties",
          "Identify small patterns for base cases",
          "Build a general construction logic",
          "Prove the construction works for all N",
          "Handle parity or special constraints",
          "Implement the construction directly"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Constructive Tips</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
 
    </div></div>
  );
}

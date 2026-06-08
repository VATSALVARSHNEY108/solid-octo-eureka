"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function PseudocodeLesson() {
  const tips = [
    "Use indentation to show blocks (like loops or if-statements)",
    "Keep it language-agnostic; don't worry about semicolons or brackets",
    "Focus on the 'what' and 'how' of the logic, not the syntax",
    "Use simple terms like 'FOR EACH', 'WHILE', 'IF', 'SET', 'PRINT'",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Pseudocode</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Pseudocode is a high-level description of an algorithm that uses the structural conventions of a programming language but is intended for human reading.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px", fontFamily:"monospace", fontSize:13 }}>
        <div style={{ color:"#8b5cf6", marginBottom:4 }}>PROCEDURE findMax(list)</div>
        <div style={{ marginLeft:20 }}>maxVal = list[0]</div>
        <div style={{ marginLeft:20 }}>FOR EACH item IN list</div>
        <div style={{ marginLeft:40 }}>IF item &gt; maxVal THEN</div>
        <div style={{ marginLeft:60 }}>maxVal = item</div>
        <div style={{ marginLeft:20 }}>RETURN maxVal</div>
      </div>

      <MinimalSimulationStudio 
        title="Pseudocode"
        code={["Write logic in high-level language",
          "Ignore syntax specific to C++/Java",
          "Focus on control flow and data",
          "Maintain logical indentation",
          "Define inputs and expected outputs",
          "Verify logic before actual coding"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Pseudocode Best Practices</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {tips.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

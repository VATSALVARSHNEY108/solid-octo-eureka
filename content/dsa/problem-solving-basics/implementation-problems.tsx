"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ImplementationProblems() {
  const tips = [
    "Read the rules carefully; implementation problems often have many details.",
    "Modularize your code; use functions for specific tasks.",
    "Handle all cases mentioned in the problem, even the weird ones.",
    "Test with the sample inputs as you go.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Implementation Problems</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Implementation problems test your ability to convert a set of rules or a description into code. They don't require complex algorithms, just careful coding.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px", display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ fontSize:28 }}>⌨️</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>Coding Precision</div>
          <div style={{ color: "var(--text-secondary)", fontSize:13 }}>The challenge is not finding the logic, but ensuring the code does exactly what's described.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Implementation Problems"
        code={["Translate problem logic to code",
          "Handle multi-step requirements",
          "Maintain clean state variables",
          "Manage input/output formatting",
          "Test with various sample cases",
          "Optimize implementation details"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Implementation Strategy</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
 
    </div></div>
  );
}

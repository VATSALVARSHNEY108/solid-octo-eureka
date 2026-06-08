"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BreakingProblemsSubproblems() {
  const benefits = [
    "Simpler Implementation: Focus on one small part at a time.",
    "Easier Debugging: Locate errors in specific sub-modules.",
    "Reusability: Subproblems often reappear in other parts of the solution.",
    "Clarity: The overall logic becomes much easier to follow.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Breaking Problems into Subproblems</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Divide and Conquer is not just an algorithm; it's a problem-solving philosophy. Big problems are just collections of smaller, manageable ones.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px", display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ fontSize:28 }}>🧩</div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>Top-Down Decomposition</div>
          <div style={{ color: "var(--text-secondary)", fontSize:13 }}>Start with the big goal and split it until you reach the basic operations.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Breaking Problems Subproblems"
        code={["Analyze main problem complexity",
          "Identify independent sub-tasks",
          "Define inputs/outputs for each sub-task",
          "Solve sub-problems individually",
          "Combine results into main solution",
          "Verify end-to-end integration"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Why Decompose?</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {benefits.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
 
    </div></div>
  );
}

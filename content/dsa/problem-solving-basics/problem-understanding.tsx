"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ProblemUnderstanding() {
  const checkList = [
    "What are the inputs? (Type, Size, Range)",
    "What is the expected output? (Type, Precision)",
    "Are there any edge cases? (Empty input, large numbers, negative values)",
    "Is there any hidden information in the problem description?",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Problem Understanding</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Before jumping into the solution, you must fully grasp what the problem is asking. Misunderstanding a single sentence can lead to hours of wasted effort.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px" }}>
          <div style={{ color:"#8b5cf6", fontWeight:800, fontSize:12, marginBottom:8, textTransform:"uppercase" }}>Phase 1</div>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Reading</div>
          <div style={{ color: "var(--text-secondary)", fontSize:14 }}>Read the problem statement word by word. Do not skim.</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px" }}>
          <div style={{ color:"#10b981", fontWeight:800, fontSize:12, marginBottom:8, textTransform:"uppercase" }}>Phase 2</div>
          <div style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Clarifying</div>
          <div style={{ color: "var(--text-secondary)", fontSize:14 }}>Identify ambiguous terms and rephrase the goal in your own words.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Problem Understanding"
        code={["Read problem statement twice",
          "Underline key constraints and types",
          "Trace sample input to sample output",
          "Clarify ambiguous requirements",
          "Identify hidden assumptions",
          "Summarize problem in one sentence"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Understanding Checklist</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {checkList.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

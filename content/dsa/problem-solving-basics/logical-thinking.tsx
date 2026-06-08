"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function LogicalThinking() {
  const principles = [
    "Deductive Reasoning: Applying general rules to specific cases",
    "Inductive Reasoning: Finding patterns from specific examples",
    "Avoiding logical fallacies (e.g., assuming a sorted array when not stated)",
    "Breaking down complex conditions into smaller boolean expressions",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Logical Thinking</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Logic is the foundation of every algorithm. It's about making sure your steps are sound and cover all possible scenarios without contradictions.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>Boolean Logic</div>
          <div style={{ color: "var(--text-secondary)", fontSize:13 }}>Mastering AND, OR, and NOT operations to simplify complex decision-making.</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>Case Analysis</div>
          <div style={{ color: "var(--text-secondary)", fontSize:13 }}>Handling 'if', 'else if', and 'else' with mutually exclusive conditions.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Logical Thinking"
        code={["Verify premises and conclusions",
          "Apply boolean logic (AND, OR, NOT)",
          "Draw truth tables for complex conditions",
          "Eliminate impossible scenarios",
          "Deduce solution from available facts",
          "Verify consistency of logic flow"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Logic Pro Tips</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {principles.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

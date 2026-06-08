"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function IterativeThinking() {
  const points = [
    "Initialization: Set up variables before the loop.",
    "Condition: Define when the loop should stop.",
    "Iteration: Update variables to move towards the goal.",
    "Invariants: Keep track of what stays true in every loop step.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Iterative Thinking</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Iteration is the process of repeating a set of instructions until a condition is met. It's the most common way to process data in DSA.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
          <div style={{ fontWeight:800, color:"#10b981", fontSize:13, marginBottom:4 }}>Efficiency</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>Loops are often more memory-efficient than recursion.</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
          <div style={{ fontWeight:800, color:"#10b981", fontSize:13, marginBottom:4 }}>Control</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>Full control over the sequence of operations.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Iterative Thinking"
        code={["Define loop initialization",
          "Set termination condition",
          "Update loop variables per step",
          "Maintain loop invariants",
          "Translate recursive logic to iterative",
          "Optimize for memory (avoid stack)"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Loop Mastery</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

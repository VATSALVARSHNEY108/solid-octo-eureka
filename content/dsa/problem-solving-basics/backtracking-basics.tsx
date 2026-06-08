"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BacktrackingBasics() {
  const steps = [
    "Choose: Select an option from the available choices.",
    "Constraint: Check if the choice is valid.",
    "Recurse: Move to the next decision level.",
    "Backtrack: Undo the choice if it leads to a dead end.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Backtracking Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:16, padding:"24px", textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:16 }}>🔄</div>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:8 }}>State Space Search</div>
        <div style={{ color: "var(--text-secondary)", fontSize:15, lineHeight:1.6 }}>
          Think of it as exploring a tree where each node is a decision. If a path leads to a dead end, you "backtrack" to the previous node and try a different branch.
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Backtracking Basics"
        code={["Define state and base case",
          "Explore current decision",
          "Recurse into subproblem",
          "Backtrack: undo the decision",
          "Try next possible option",
          "Collect results from branches"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The Backtracking Template</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
 
    </div></div>
  );
}

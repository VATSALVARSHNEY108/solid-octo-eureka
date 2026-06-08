"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function RecursiveThinking() {
  const basics = [
    "Base Case: The simplest version of the problem you can solve directly.",
    "Recursive Step: Breaking the problem into smaller versions of itself.",
    "Stack: Understanding how function calls are stored in memory.",
    "Convergence: Ensuring every recursive call moves closer to the base case.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Recursive Thinking</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Recursion is a method where a function calls itself. It's powerful for problems with a hierarchical or nested structure (like trees or backtracking).
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:16, padding:"24px", textAlign:"center" }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:8, color:"#8b5cf6" }}>"To understand recursion, you must first understand recursion."</div>
        <div style={{ color: "var(--text-secondary)", fontSize:14 }}>Thinking recursively means trusting that the smaller call will return the correct answer.</div>
      </div>

      <MinimalSimulationStudio 
        title="Recursive Thinking"
        code={["Identify recursive sub-structure",
          "Define the Base Case(s)",
          "Express solution as Recurrence",
          "Trace recursion tree/stack",
          "Optimize with memoization if needed",
          "Ensure progress toward base case"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Recursion Essentials</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {basics.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
 
    </div></div>
  );
}

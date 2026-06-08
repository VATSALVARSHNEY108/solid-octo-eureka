"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function DivideAndConquerBasics() {
  const steps = [
    { step: "Divide", desc: "Break the problem into smaller subproblems." },
    { step: "Conquer", desc: "Solve subproblems recursively (or directly if small)." },
    { step: "Combine", desc: "Merge subproblem solutions to solve the original." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Divide & Conquer</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Divide and Conquer is an algorithm design paradigm based on multi-branched recursion. It's the basis for Merge Sort, Quick Sort, and Binary Search.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4, color:"#8b5cf6" }}>{s.step}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Divide And Conquer Basics"
        code={["Divide problem into smaller subproblems",
          "Conquer subproblems recursively",
          "Define base cases for recursion",
          "Combine subproblem solutions",
          "Analyze recurrence relation",
          "Verify overall complexity"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Efficiency Boost</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          By breaking a problem of size N into smaller parts, you can often reduce a complexity of **O(N²)** down to **O(N log N)**.
        </p>
 
    </div></div>
  );
}

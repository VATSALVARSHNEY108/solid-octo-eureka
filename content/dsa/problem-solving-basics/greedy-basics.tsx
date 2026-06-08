"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function GreedyBasics() {
  const requirements = [
    { name: "Greedy Choice Property", desc: "A global optimum can be reached by making local optimum choices." },
    { name: "Optimal Substructure", desc: "An optimal solution to the problem contains optimal solutions to subproblems." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Greedy Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        The greedy algorithm makes the best choice at each step, hoping that these local optimal choices lead to a global optimal solution.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {requirements.map((r, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4, color:"#8b5cf6" }}>{r.name}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Greedy Basics"
        code={["Identify local optimal choice",
          "Verify if local choice leads to global",
          "Sort data based on greedy criterion",
          "Iteratively pick best available option",
          "Update remaining requirements",
          "Return the accumulated result"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Greedy Warning</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Greedy doesn't always work! For example, the greedy choice in the 0/1 Knapsack problem leads to a sub-optimal solution. Always verify your greedy logic with a proof or multiple test cases.
        </p>
 
    </div></div>
  );
}

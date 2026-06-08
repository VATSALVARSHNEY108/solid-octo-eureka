"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BestAverageWorstCase() {
  const cases = [
    { type: "Worst Case", notation: "Big O", desc: "Maximum time an algorithm will take. (Most important for guarantees)" },
    { type: "Average Case", notation: "Theta (θ)", desc: "Expected time for a typical input." },
    { type: "Best Case", notation: "Omega (Ω)", desc: "Minimum time required for the ideal input." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Best, Average & Worst Case</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        An algorithm's performance can vary significantly depending on the specific input. We use three primary cases to describe this behavior.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {cases.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ fontWeight:700, fontSize:15 }}>{c.type}</div>
              <div style={{ color:"#8b5cf6", fontWeight:800, fontSize:13 }}>{c.notation}</div>
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Best Average Worst Case"
        code={["Identify worst-case input scenario",
          "Calculate total operations for worst-case",
          "Analyze best-case shortcut scenarios",
          "Derive average case based on distribution",
          "Express as Big-O, Omega, and Theta",
          "Select algorithm based on constraints"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Why Worst Case?</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          In competitive programming and system design, we prioritize the **Worst Case**. It provides an upper bound that ensures the program will never take longer than a certain limit, regardless of the input.
        </p>
 
    </div></div>
  );
}

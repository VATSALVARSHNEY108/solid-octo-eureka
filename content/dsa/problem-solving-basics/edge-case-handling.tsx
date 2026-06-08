"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function EdgeCaseHandling() {
  const cases = [
    { name: "Zero/One", desc: "Empty arrays, N=0, N=1, or single element inputs." },
    { name: "Max/Min", desc: "Inputs at the exact limits of the given constraints." },
    { name: "Duplicates", desc: "Arrays with all same elements or multiple same keys." },
    { name: "Negatives", desc: "Negative integers, especially when dealing with sums or products." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Edge Case Handling</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Edge cases are the specific scenarios that occur at the extreme ends of the problem constraints. Most "Wrong Answer" (WA) results are due to unhandled edge cases.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:12 }}>
        {cases.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:800, color:"#ef4444", fontSize:14, marginBottom:4 }}>{c.name}</div>
            <div style={{ fontSize:12, color: "var(--text-secondary)" }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Edge Case Handling"
        code={["Check minimum constraints (e.g., N=0, N=1)",
          "Check maximum constraints (e.g., N=10^9)",
          "Handle empty inputs or null states",
          "Handle duplicates or all-identical inputs",
          "Test with negative or zero values",
          "Ensure no overflow or underflow"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The 'Mental Test'</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Before submitting, always ask yourself: "Will my code work if N is 0? What if it's 10^5? What if all elements are negative?". This habit saves a lot of time and penalty in contests.
        </p>
 
    </div></div>
  );
}

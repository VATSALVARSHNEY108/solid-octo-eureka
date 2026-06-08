"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function TestCaseGeneration() {
  const types = [
    { name: "Sample Cases", desc: "The basic cases provided in the problem statement." },
    { name: "Corner Cases", desc: "Extreme inputs at the boundary of constraints." },
    { name: "Large Cases", desc: "Maximum possible input size to test time limits." },
    { name: "Random Cases", desc: "Automatically generated inputs for stress testing." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Test Case Generation</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Test cases verify your algorithm's correctness. Relying solely on sample cases is a common mistake; you must generate your own tests.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {types.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:13, marginBottom:4 }}>{t.name}</div>
            <div style={{ fontSize:12, color: "var(--text-secondary)" }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Test Case Generation"
        code={["Generate random small test cases",
          "Generate corner cases manually",
          "Use a script for large test cases",
          "Compare brute force vs optimized output",
          "Verify constraints compliance",
          "Identify failing patterns"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Stress Testing</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Stress testing involves running your "optimal" code against a slow but "guaranteed correct" brute force solution on random test cases until a mismatch is found.
        </p>
 
    </div></div>
  );
}

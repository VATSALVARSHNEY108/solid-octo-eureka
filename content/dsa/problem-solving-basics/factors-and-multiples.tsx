"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function FactorsAndMultiples() {
  const points = [
    "A factor divides a number completely without leaving a remainder.",
    "A multiple is the product of a number and any integer.",
    "To find all factors of N, you only need to check up to √N.",
    "If 'a' is a factor of N, then 'N/a' is also a factor.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Factors & Multiples</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Factors and multiples are the foundation of divisibility and number theory problems.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px" }}>
          <div style={{ fontWeight:800, fontSize:16, marginBottom:6, color:"#8b5cf6" }}>Factors</div>
          <div style={{ color: "var(--text-secondary)", fontSize:14 }}>Numbers that divide N exactly. Example: Factors of 12 are 1, 2, 3, 4, 6, 12.</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px" }}>
          <div style={{ fontWeight:800, fontSize:16, marginBottom:6, color:"#10b981" }}>Multiples</div>
          <div style={{ color: "var(--text-secondary)", fontSize:14 }}>N, 2N, 3N, 4N... Example: Multiples of 12 are 12, 24, 36...</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Factors And Multiples"
        code={["Find divisors of N using sqrt(N) loop",
          "Identify prime factorization",
          "Calculate LCM/GCD for set of numbers",
          "Apply Sieve for multiple numbers",
          "Handle divisibility rule logic",
          "Return factor count or properties"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Optimization Tip</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

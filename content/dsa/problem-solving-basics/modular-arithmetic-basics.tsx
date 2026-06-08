"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ModularArithmeticBasics() {
  const rules = [
    { rule: "(a + b) % m", result: "((a % m) + (b % m)) % m" },
    { rule: "(a - b) % m", result: "((a % m) - (b % m) + m) % m" },
    { rule: "(a * b) % m", result: "((a % m) * (b % m)) % m" },
    { rule: "(a / b) % m", result: "(a * b⁻¹) % m (where b⁻¹ is modular inverse)" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Modular Arithmetic</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        In competitive programming, results are often required "modulo 10^9 + 7" to prevent integer overflow and keep the numbers within a standard range.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {rules.map((r, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:800, fontSize:14, color:"#8b5cf6" }}>{r.rule}</div>
            <div style={{ fontSize:13, color: "var(--text-secondary)", fontFamily:"monospace" }}>= {r.result}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Modular Arithmetic Basics"
        code={["Apply (A+B)%M = (A%M + B%M)%M",
          "Apply (A*B)%M = (A%M * B%M)%M",
          "Handle negative results: (A-B+M)%M",
          "Calculate modular inverse if needed",
          "Use big powers (Binary Exponentiation)",
          "Avoid intermediate overflow"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The Negative Modulo Fix</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          In many languages, `-1 % 5` returns `-1` instead of `4`. To fix this, always use `(a % m + m) % m` to ensure the result is non-negative.
        </p>
 
    </div></div>
  );
}

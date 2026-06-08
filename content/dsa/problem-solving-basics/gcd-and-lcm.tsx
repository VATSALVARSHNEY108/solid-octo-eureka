"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function GCDandLCMLesson() {
  const formulas = [
    { name: "Euclidean Algorithm", desc: "gcd(a, b) = gcd(b, a % b)", color: "#8b5cf6" },
    { name: "LCM Formula", desc: "lcm(a, b) = (a * b) / gcd(a, b)", color: "#10b981" },
    { name: "Basic Property", desc: "gcd(a, b) * lcm(a, b) = a * b", color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>GCD & LCM</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Greatest Common Divisor (GCD) and Least Common Multiple (LCM) are essential for solving problems involving fractions, periods, and divisibility.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {formulas.map((f, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:700, fontSize:15, color:f.color }}>{f.name}</div>
            <code style={{ background:"rgba(255,255,255,0.05)", padding:"4px 10px", borderRadius:6, fontSize:13 }}>{f.desc}</code>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Gcd And Lcm"
        code={["Apply Euclidean Algorithm for GCD",
          "Use GCD(a, b) = GCD(b, a % b)",
          "Base Case: if b is 0, return a",
          "Calculate LCM using (a * b) / GCD(a, b)",
          "Handle zero inputs cautiously",
          "Return computed GCD and LCM"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Euclidean Algorithm</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          The Euclidean algorithm is extremely efficient, with a time complexity of **O(log(min(a, b)))**. It's the standard way to compute GCD in almost all programming languages.
        </p>
 
    </div></div>
  );
}

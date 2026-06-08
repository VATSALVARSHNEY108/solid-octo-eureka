"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BasicMathematics() {
  const topics = [
    { title: "Arithmetic Series", formula: "Sum = n/2 * (2a + (n-1)d)" },
    { title: "Geometric Series", formula: "Sum = a(rⁿ - 1)/(r - 1)" },
    { title: "Permutations", formula: "nPr = n! / (n-r)!" },
    { title: "Combinations", formula: "nCr = n! / (r!(n-r)!)" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Basic Mathematics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Mathematics is the backbone of DSA. Understanding basic formulas and concepts can help you solve complex problems with simple logic.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:12 }}>
        {topics.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:8 }}>{t.title}</div>
            <code style={{ display:"block", background:"rgba(139,92,246,0.05)", padding:"6px 10px", borderRadius:6, fontSize:12, color:"#8b5cf6" }}>{t.formula}</code>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Basic Mathematics"
        code={["Identify the mathematical formula",
          "Check for integer overflow",
          "Apply modular arithmetic if needed",
          "Optimize calculation using math properties",
          "Handle division by zero or negatives",
          "Return the computed value"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Math in DSA</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Many problems that look like they require loops can be solved in **O(1)** using a mathematical formula. Always look for a mathematical pattern before you start coding.
        </p>
 
    </div></div>
  );
}

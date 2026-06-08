"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function OverflowHandling() {
  const limits = [
    { type: "int", limit: "±2 × 10⁹" },
    { type: "long long", limit: "±9 × 10¹⁸" },
    { type: "float", limit: "~7 decimal digits" },
    { type: "double", limit: "~15 decimal digits" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Overflow Handling</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Overflow occurs when the result of a calculation exceeds the maximum value a data type can hold. It leads to garbage values or program crashes.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {limits.map((l, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"12px 18px", display:"flex", justifyContent:"space-between" }}>
            <code style={{ fontWeight:800, fontSize:14, color:"#8b5cf6" }}>{l.type}</code>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{l.limit}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Overflow Handling"
        code={["Identify variables nearing limit",
          "Use 'long long' instead of 'int'",
          "Apply modular arithmetic early",
          "Check intermediate product results",
          "Handle potential negative overflows",
          "Verify against largest test cases"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Overflow Prevention</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          <li>Use `long long` for sums that can exceed 2 × 10⁹</li>
          <li>For intermediate products, cast to `long long` early: `1LL * a * b`</li>
          <li>Use `modular arithmetic` if the problem allows it</li>
        </ul>
 
    </div></div>
  );
}

"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BitManipulationBasics() {
  const ops = [
    { op: "AND (&)", result: "1 if both bits are 1", example: "5 & 3 = 1" },
    { op: "OR (|)", result: "1 if either bit is 1", example: "5 | 3 = 7" },
    { op: "XOR (^)", result: "1 if bits are different", example: "5 ^ 3 = 6" },
    { op: "NOT (~)", result: "Flips all bits", example: "~5 = -6" },
    { op: "L-Shift (<<)", result: "Multiply by 2^k", example: "5 << 1 = 10" },
    { op: "R-Shift (>>)", result: "Divide by 2^k", example: "5 >> 1 = 2" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Bit Manipulation</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Bit manipulation allows you to perform operations directly on bits, which is extremely fast and space-efficient.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:12 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ fontWeight:800, fontSize:14, color:"#8b5cf6" }}>{o.op}</div>
              <code style={{ fontSize:12, color:"#f97316" }}>{o.example}</code>
            </div>
            <div style={{ fontSize:12, color: "var(--text-secondary)" }}>{o.result}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Bit Manipulation Basics"
        code={["Identify bitmask requirements",
          "Isolate target bits using masking",
          "Modify bits (set, clear, toggle)",
          "Use bitwise identities for optimization",
          "Handle sign bit considerations",
          "Verify output bit-pattern"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Bit Tricks</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          <li>Check even/odd: <code>(n & 1)</code></li>
          <li>Set i-th bit: <code>n | (1 &lt;&lt; i)</code></li>
          <li>Check i-th bit: <code>(n &gt;&gt; i) & 1</code></li>
          <li>Power of 2 check: <code>n {'>'} 0 && (n & (n - 1)) == 0</code></li>
        </ul>
 
    </div></div>
  );
}

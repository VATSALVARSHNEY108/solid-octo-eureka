"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function NumberProperties() {
  const props = [
    { prop: "Even + Even = Even", desc: "Sum of any two even numbers is always even." },
    { prop: "Even + Odd = Odd", desc: "Sum of an even and an odd number is always odd." },
    { prop: "Odd * Odd = Odd", desc: "Product of any two odd numbers is always odd." },
    { prop: "N % 2", desc: "Check parity (0 for even, 1 for odd)." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Number Properties</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Understanding the basic properties of numbers (parity, divisibility, etc.) can help you solve many logic problems without complex code.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
        {props.map((p, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:14, marginBottom:4 }}>{p.prop}</div>
            <div style={{ fontSize:12, color: "var(--text-secondary)" }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Number Properties"
        code={["Identify parity (Even/Odd)",
          "Check for Prime/Composite status",
          "Analyze digit-level properties",
          "Check for Perfect Square/Cube",
          "Apply Number Theory theorems",
          "Return specific property flags"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Number Theory</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Always keep parity in mind. Many complex problems can be simplified to "Does the answer have to be even or odd?". This single observation can sometimes be the entire solution.
        </p>
 
    </div></div>
  );
}

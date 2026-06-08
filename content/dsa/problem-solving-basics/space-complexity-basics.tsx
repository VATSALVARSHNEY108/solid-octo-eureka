"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function SpaceComplexityBasics() {
  const components = [
    { type: "Auxiliary Space", desc: "Extra space used by the algorithm (excluding input)." },
    { type: "Input Space", desc: "Space required to store the input data." },
    { type: "Stack Space", desc: "Space used by recursive calls on the call stack." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Space Complexity Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Space complexity measures the total amount of memory an algorithm needs relative to the input size.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {components.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4, color:"#8b5cf6" }}>{c.type}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio type="complexity" />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Space Saving Tip</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Always consider if you can solve the problem "in-place" to achieve O(1) auxiliary space. This is often a key optimization requirement in interviews.
        </p>
 
    </div></div>
  );
}

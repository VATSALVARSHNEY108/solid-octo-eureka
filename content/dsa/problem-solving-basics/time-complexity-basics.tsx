"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function TimeComplexityBasics() {
  const complexities = [
    { name: "O(1)", label: "Constant", color: "#10b981" },
    { name: "O(log N)", label: "Logarithmic", color: "#3b82f6" },
    { name: "O(N)", label: "Linear", color: "#f59e0b" },
    { name: "O(N log N)", label: "Linearithmic", color: "#8b5cf6" },
    { name: "O(N²)", label: "Quadratic", color: "#f97316" },
    { name: "O(2ᴺ)", label: "Exponential", color: "#ef4444" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Time Complexity Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Time complexity measures how the runtime of an algorithm grows as the input size increases. It's represented using Big O notation.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:10 }}>
        {complexities.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px", textAlign:"center" }}>
            <div style={{ fontWeight:800, fontSize:18, color:c.color, marginBottom:4 }}>{c.name}</div>
            <div style={{ fontSize:11, color: "var(--text-muted)", textTransform:"uppercase", fontWeight:700 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio type="complexity" />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Big O Rules</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          <li>Drop the constants: O(2N) becomes O(N)</li>
          <li>Drop non-dominant terms: O(N² + N) becomes O(N²)</li>
          <li>Focus on the worst-case scenario</li>
        </ul>
 
    </div></div>
  );
}

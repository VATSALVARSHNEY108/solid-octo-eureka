"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ConstraintsAnalysis() {
  const constraints = [
    { range: "N ≤ 10", complexity: "O(N!), O(2^N)", desc: "Brute force / Backtracking" },
    { range: "N ≤ 100", complexity: "O(N^3)", desc: "Triple loops / Floyd-Warshall" },
    { range: "N ≤ 1000", complexity: "O(N^2)", desc: "Double loops / Basic DP" },
    { range: "N ≤ 10^5", complexity: "O(N log N)", desc: "Sorting / Binary Search / Heaps" },
    { range: "N ≤ 10^7", complexity: "O(N)", desc: "Linear scan / Hashing / Prefix Sum" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Constraints Analysis</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        The constraints tell you the time complexity you should aim for. This is often the biggest hint in competitive programming.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {constraints.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ width:100, fontWeight:800, fontSize:14, color:"#8b5cf6" }}>{c.range}</div>
            <div style={{ flex:1, fontSize:14, fontWeight:600 }}>{c.complexity}</div>
            <div style={{ color: "var(--text-muted)", fontSize:12 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio type="complexity" />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The 1-Second Rule</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Most online judges allow 1 second for execution, which translates to roughly **10^8 operations**. If your complexity exceeds this for the given N, you'll likely get a Time Limit Exceeded (TLE).
        </p>
 
    </div></div>
  );
}

"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function PatternRecognition() {
  const commonPatterns = [
    { name: "Sorted Array", logic: "Binary Search, Two Pointers" },
    { name: "Kth Elements", logic: "Heaps, Quick Select" },
    { name: "Subarrays", logic: "Sliding Window, Prefix Sum" },
    { name: "Trees/Graphs", logic: "BFS, DFS" },
    { name: "Optimal Choice", logic: "Greedy, Dynamic Programming" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Pattern Recognition</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Most DSA problems are variations of a few core patterns. Recognizing these patterns instantly narrows down the possible approaches.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {commonPatterns.map((p, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"12px 18px", display:"flex", justifyContent:"space-between" }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
            <div style={{ color: "#8b5cf6", fontSize:13, fontWeight:600 }}>{p.logic}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Pattern Recognition"
        code={["Identify recurring sequences",
          "Map input to known algorithmic patterns",
          "Look for symmetries in the problem",
          "Simplify the problem to 1D/2D",
          "Use drawing or tabular visualization",
          "Match pattern to optimal solution"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Pattern Pro Tip</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Don't memorize problems; memorize patterns. When you see a problem, try to map it to one of the standard patterns you've mastered.
        </p>
 
    </div></div>
  );
}

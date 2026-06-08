"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function SortingBasics() {
  const algos = [
    { name: "Bubble/Selection/Insertion", complexity: "O(N²)", bestFor: "Small datasets" },
    { name: "Merge/Quick Sort", complexity: "O(N log N)", bestFor: "General purpose" },
    { name: "Counting/Radix Sort", complexity: "O(N + K)", bestFor: "Small range integers" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Sorting Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Sorting is the process of arranging data in a specific order (ascending or descending). It is a fundamental operation that many other algorithms rely on.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {algos.map((a, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{a.name}</div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:"#10b981", fontWeight:800, fontSize:13 }}>{a.complexity}</div>
              <div style={{ color: "var(--text-muted)", fontSize:12 }}>{a.bestFor}</div>
            </div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Sorting Basics"
        code={["Choose appropriate sort (Merge, Quick)",
          "Define custom comparison logic",
          "Sort elements in desired order",
          "Handle stability requirements",
          "Optimize for nearly sorted data",
          "Verify sorted property at end"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Stability in Sorting</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          A sorting algorithm is **stable** if it preserves the relative order of elements with equal keys. This is important when sorting objects by multiple criteria.
        </p>
 
    </div></div>
  );
}

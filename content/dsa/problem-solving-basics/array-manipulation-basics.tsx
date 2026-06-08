"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ArrayManipulationBasics() {
  const operations = [
    { op: "Traversal", complexity: "O(N)", desc: "Visiting every element once." },
    { op: "Insertion", complexity: "O(N)", desc: "Shifting elements to make space." },
    { op: "Deletion", complexity: "O(N)", desc: "Shifting elements to fill the gap." },
    { op: "Access", complexity: "O(1)", desc: "Direct access via index." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Array Manipulation</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Arrays are contiguous blocks of memory. Manipulation involves basic operations like inserting, deleting, and updating elements.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {operations.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:700, fontSize:15 }}>{o.op}</div>
            <div style={{ textAlign:"right" }}>
              <div style={{ color:"#8b5cf6", fontWeight:800, fontSize:13 }}>{o.complexity}</div>
              <div style={{ color: "var(--text-muted)", fontSize:12 }}>{o.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Array Manipulation Basics"
        code={["Initialize result array/variables",
          "Traverse through array elements",
          "Apply transformation logic",
          "Update pointers or counters",
          "Check boundary conditions",
          "Return modified array/result"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Memory Layout</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Because array elements are stored together in memory, they benefit from **CPU caching**, making traversals extremely fast compared to other data structures like linked lists.
        </p>
 
    </div></div>
  );
}

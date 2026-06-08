"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function STLBasics() {
  const containers = [
    { name: "vector", desc: "Dynamic array." },
    { name: "set", desc: "Ordered unique elements." },
    { name: "map", desc: "Key-value pairs." },
    { name: "stack/queue", desc: "LIFO/FIFO structures." },
    { name: "priority_queue", desc: "Max/Min heap." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>STL Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        The Standard Template Library (STL) provides a collection of powerful, pre-written data structures and algorithms that save time and reduce errors.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {containers.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <code style={{ fontWeight:800, fontSize:14, color:"#8b5cf6" }}>{c.name}</code>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Stl Basics"
        code={["Identify required STL container",
          "Use Vector for dynamic arrays",
          "Use Map/Set for lookups",
          "Apply STL algorithms (sort, search)",
          "Manage iterators correctly",
          "Optimize with reserve/unordered"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Don't Reinvent the Wheel</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          STL algorithms like `std::sort`, `std::reverse`, and `std::lower_bound` are highly optimized. Use them whenever possible instead of writing your own.
        </p>
 
    </div></div>
  );
}

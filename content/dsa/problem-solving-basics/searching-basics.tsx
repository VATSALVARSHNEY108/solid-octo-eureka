"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function SearchingBasics() {
  const methods = [
    { name: "Linear Search", complexity: "O(N)", use: "Unsorted data or small datasets." },
    { name: "Binary Search", complexity: "O(log N)", use: "Sorted data. Extremely fast for large N." },
    { name: "Hashing", complexity: "O(1) Avg", use: "Instant retrieval if key is known." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Searching Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Searching is the process of finding the location or existence of a target value within a collection of data.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
        {methods.map((m, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:14, marginBottom:4 }}>{m.name}</div>
            <div style={{ color: "#10b981", fontWeight:700, fontSize:12, marginBottom:6 }}>{m.complexity}</div>
            <div style={{ fontSize:12, color: "var(--text-secondary)" }}>{m.use}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Searching Basics"
        code={["Identify if data is sorted",
          "Apply Linear Search for unsorted",
          "Apply Binary Search for sorted/monotonic",
          "Implement Ternary Search for unimodal",
          "Handle 'element not found' case",
          "Return index or existence flag"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The Golden Rule</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          If you need to search multiple times in the same data, it's often worth **sorting** the data first to enable Binary Search, or **hashing** it for constant time lookups.
        </p>
 
    </div></div>
  );
}

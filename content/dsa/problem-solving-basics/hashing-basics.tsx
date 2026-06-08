"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function HashingBasics() {
  const terms = [
    { term: "Hash Function", desc: "Maps input data of arbitrary size to a fixed-size value." },
    { term: "Collision", desc: "When two different inputs produce the same hash value." },
    { term: "Load Factor", desc: "Measure of how full the hash table is (n/m)." },
    { term: "Buckets", desc: "The storage slots in a hash table." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Hashing Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Hashing is a technique used to uniquely identify objects or store data in a way that allows for near-instant (O(1)) retrieval.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {terms.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:13, marginBottom:4 }}>{t.term}</div>
            <div style={{ fontSize:12, color: "var(--text-secondary)" }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Hashing Basics"
        code={["Select appropriate hash function",
          "Map keys to table indices",
          "Handle collisions (chaining/probing)",
          "Perform O(1) average lookups",
          "Manage load factor and resizing",
          "Return stored value or existence"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Time Complexity</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Average case for search, insert, and delete is **O(1)**. However, in the absolute worst case (many collisions), it can become **O(N)**. Good hash functions are key!
        </p>
 
    </div></div>
  );
}

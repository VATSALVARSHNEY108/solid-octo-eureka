"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function FrequencyCounting() {
  const techniques = [
    { name: "Frequency Array", use: "Small integer ranges (e.g., 0-100 or 'a'-'z')", complexity: "O(N) time, O(Range) space" },
    { name: "Hash Map", use: "Large or sparse ranges, non-integer keys", complexity: "O(N) time, O(N) space" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Frequency Counting</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Frequency counting is a technique to record the number of occurrences of each element in a collection. It's used in problems involving duplicates, anagrams, and sets.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {techniques.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4, color:"#8b5cf6" }}>{t.name}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13, marginBottom:4 }}>Best for: {t.use}</div>
            <div style={{ color: "var(--text-muted)", fontSize:12, fontWeight:600 }}>{t.complexity}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Frequency Counting"
        code={["Initialize frequency map/array",
          "Iterate through input collection",
          "Increment count for each element",
          "Query map for specific counts",
          "Find mode or most frequent item",
          "Return counts or frequency distribution"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The 'a' - 'z' Trick</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          For lowercase English letters, use an array of size 26. Access the frequency of character `c` using `arr[c - 'a']`. This is faster and uses less memory than a hash map.
        </p>
 
    </div></div>
  );
}

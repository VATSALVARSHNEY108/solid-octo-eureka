"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function ProblemSolvingPatterns() {
  const patterns = [
    { name: "Sliding Window", usage: "Subarrays, substrings" },
    { name: "Two Pointers", usage: "Sorted arrays, pairs" },
    { name: "Fast & Slow Pointers", usage: "Linked lists, cycles" },
    { name: "Merge Intervals", usage: "Overlapping intervals" },
    { name: "Cyclic Sort", usage: "Arrays with numbers 1..N" },
    { name: "In-place Reversal", usage: "Linked list reversal" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Problem Solving Patterns</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Mastering patterns is the most efficient way to learn DSA. Once you recognize a pattern, the solution steps become predictable.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {patterns.map((p, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"14px 18px", display:"flex", justifyContent:"space-between" }}>
            <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
            <div style={{ color: "#8b5cf6", fontSize:13, fontWeight:600 }}>{p.usage}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Problem Solving Patterns"
        code={["Identify pattern (Two Pointers, Window)",
          "Apply standardized template for pattern",
          "Adjust template for specific constraints",
          "Optimize common sub-tasks",
          "Handle common edge cases for pattern",
          "Verify against known sample cases"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Pattern Tip</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Always classify every problem you solve into one of these patterns. If it doesn't fit, it might be an ad-hoc problem or a new pattern you haven't learned yet.
        </p>
 
    </div></div>
  );
}

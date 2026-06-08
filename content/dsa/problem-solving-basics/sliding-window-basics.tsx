"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function SlidingWindowBasics() {
  const types = [
    { name: "Fixed Size", desc: "Window length is constant. (e.g., Max sum of K consecutive elements)" },
    { name: "Variable Size", desc: "Window expands or shrinks based on a condition. (e.g., Longest subarray with sum ≤ K)" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Sliding Window Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Sliding window is a method for finding subsets of data (subarrays or substrings) that satisfy certain conditions efficiently.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {types.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px" }}>
            <div style={{ fontWeight:800, fontSize:16, marginBottom:6, color:"#8b5cf6" }}>{t.name}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:14 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Sliding Window Basics"
        code={["Initialize window [left, right]",
          "Expand window by moving right",
          "Update window state (sum, count)",
          "Contract window by moving left",
          "Maintain optimal window property",
          "Return best window result"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The Core Idea</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Instead of recomputing the entire window every time, you "slide" it by adding the new element at the front and removing the old one from the back. This maintains the result in **O(1)** per slide.
        </p>
 
    </div></div>
  );
}

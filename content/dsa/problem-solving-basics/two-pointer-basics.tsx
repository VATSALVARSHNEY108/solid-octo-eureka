"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function TwoPointerBasics() {
  const variations = [
    { name: "Opposite Ends", desc: "One pointer at the start, one at the end. (e.g., Palindrome check, 2-Sum in sorted array)" },
    { name: "Slow & Fast", desc: "Both move at different speeds. (e.g., Linked List cycle detection)" },
    { name: "Same Direction", desc: "Both move forward with varying gaps. (e.g., Remove duplicates)" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Two Pointer Technique</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Two pointers is an optimization technique that uses two indices to traverse a collection, often reducing O(N²) solutions to O(N).
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {variations.map((v, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4, color:"#8b5cf6" }}>{v.name}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{v.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Two Pointer Basics"
        code={["Initialize left and right pointers",
          "Move pointers toward each other",
          "Or move both in same direction",
          "Check condition at each step",
          "Update result based on pointers",
          "Stop when pointers meet/cross"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 When to use?</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Look for "Sorted Array", "Pairs", or "Subarrays" in the problem statement. These are common indicators that a two-pointer approach might work.
        </p>
 
    </div></div>
  );
}

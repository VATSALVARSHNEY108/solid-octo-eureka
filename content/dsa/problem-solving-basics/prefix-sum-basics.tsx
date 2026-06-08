"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function PrefixSumBasics() {
  const steps = [
    "Create an array `P` of the same size as `A`.",
    "Set `P[0] = A[0]`.",
    "For `i > 0`, set `P[i] = P[i-1] + A[i]`.",
    "To get sum of range [L, R]: `P[R] - P[L-1]` (if L > 0).",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Prefix Sum Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Prefix sum is a technique used to perform range sum queries in constant time O(1) after a linear O(N) precomputation.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px", fontFamily:"monospace" }}>
        <div style={{ color:"#8b5cf6", marginBottom:8 }}>A = [3, 1, 4, 2]</div>
        <div style={{ color:"#10b981" }}>P = [3, 4, 8, 10]</div>
        <div style={{ marginTop:12, color:"var(--text-muted)", fontSize:12 }}>Sum(1 to 2) = P[2] - P[0] = 8 - 3 = 5</div>
      </div>

      <MinimalSimulationStudio 
        title="Prefix Sum Basics"
        code={["Initialize prefix sum array (P[0]=0)",
          "P[i] = P[i-1] + arr[i-1]",
          "Calculate Range Sum: P[R+1] - P[L]",
          "Use for O(1) query performance",
          "Extend to 2D matrices if needed",
          "Handle 0-based or 1-based indexing"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Prefix Sum Applications</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
 
    </div></div>
  );
}

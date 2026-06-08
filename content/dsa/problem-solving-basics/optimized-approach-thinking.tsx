"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function OptimizedApproachThinking() {
  const steps = [
    "Identify the bottleneck in the brute force approach",
    "Can we use a different data structure? (e.g., Hashmap instead of Linear Search)",
    "Can we precompute some values? (e.g., Prefix Sum)",
    "Can we avoid redundant work? (e.g., Memoization)",
    "Is there a mathematical property we can exploit?",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Optimized Approach Thinking</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Once you have a working brute force, the next step is optimization. Optimization is about reducing the time or space complexity of your solution.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:12 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px", textAlign:"center" }}>
          <div style={{ fontWeight:800, color:"#f97316", marginBottom:4 }}>Bottleneck</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>The part of the code taking the most time.</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px", textAlign:"center" }}>
          <div style={{ fontWeight:800, color:"#10b981", marginBottom:4 }}>Trade-off</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>Using more space to save time (and vice versa).</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Optimized Approach Thinking"
        code={["Think beyond the brute force",
          "Identify data structure improvements",
          "Apply divide and conquer or DP",
          "Use pre-computation or prefix sums",
          "Trade space for time where possible",
          "Select best-fit algorithm for constraints"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Optimization Mindset</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {steps.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

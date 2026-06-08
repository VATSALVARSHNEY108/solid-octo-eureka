"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function OptimizationTechniques() {
  const techniques = [
    { name: "Precomputation", desc: "Computing results once and using them multiple times. (e.g., Prefix Sum, Sieve)" },
    { name: "Pruning", desc: "Cutting off branches of a recursive search that cannot lead to a solution." },
    { name: "Meet-in-the-middle", desc: "Splitting the search space into two halves and combining results." },
    { name: "Lazy Evaluation", desc: "Deferring calculation until the value is actually needed." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Optimization Techniques</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Advanced optimization techniques help push the limits of what's possible within the given time constraints.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {techniques.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4, color:"#8b5cf6" }}>{t.name}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Optimization Techniques"
        code={["Identify bottleneck in current code",
          "Reduce time complexity (O(N^2) to O(N))",
          "Reduce space complexity",
          "Apply caching or memoization",
          "Eliminate redundant computations",
          "Measure performance improvements"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Rule of Thumb</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Always optimize the **bottleneck**. Reducing an O(N) part to O(log N) doesn't help if there's another part of the code that is O(N²).
        </p>
 
    </div></div>
  );
}

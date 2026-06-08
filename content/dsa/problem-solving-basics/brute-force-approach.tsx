"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BruteForceApproach() {
  const characteristics = [
    "Simplicity: Easiest to design and implement.",
    "Exhaustive: It checks every possible solution until one is found.",
    "Correctness: If a solution exists, brute force will find it.",
    "Inefficiency: Usually has high time/space complexity.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Brute Force Approach</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        A brute force approach is a straightforward method of solving a problem, usually based on the problem statement and definitions. It's the 'just do it' way.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>The Starting Point</div>
          <div style={{ color: "var(--text-secondary)", fontSize:13 }}>Always start with brute force. It gives you a baseline for performance and helps you understand the problem better.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Brute Force Approach"
        code={["Generate all possible candidates",
          "Check if candidate satisfies constraints",
          "If valid, update optimal solution",
          "Continue until search space exhausted",
          "Handle 'time limit exceeded' warnings",
          "Use as baseline for optimization"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Brute Force Traits</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {characteristics.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
 
    </div></div>
  );
}

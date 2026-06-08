"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function IntroductionToProblemSolving() {
  const points = [
    "Always read the problem twice before thinking of a solution",
    "Identify the input and output types early on",
    "Think about the constraints (e.g., N = 10^5 means O(N log N) or O(N))",
    "Start with a brute force approach if the optimal one isn't obvious",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Introduction to Problem Solving</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Problem solving in DSA is the art of transforming a real-world or abstract requirement into an efficient algorithmic implementation. It's more about thinking than coding.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:40, height:40, background:"rgba(139,92,246,0.1)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🧠</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>Mindset</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>Focus on logic first, syntax later.</div>
          </div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:40, height:40, background:"rgba(16,185,129,0.1)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>⚙️</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>Process</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>Understand → Plan → Implement → Test → Optimize.</div>
          </div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Problem Solving Lifecycle"
        code={[
          "1. Read the Problem Statement",
          "2. Analyze Constraints (N)",
          "3. Select Data Structure",
          "4. Develop Pseudo-algorithm",
          "5. Dry Run on Sample Test Cases",
          "6. Optimize for Time/Space",
          "7. Implement and Verify"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Pro Tips</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function CompetitiveProgrammingBasics() {
  const steps = [
    "Read the constraints first.",
    "Estimate the required time complexity.",
    "Formulate the logic on paper.",
    "Implement with speed and accuracy.",
    "Consider edge cases and overflow.",
    "Dry run sample cases before submitting.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Competitive Programming Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Competitive programming (CP) is a mind sport where you solve algorithmic problems under time and memory constraints.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:16, padding:"24px", textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:16 }}>🏆</div>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:8 }}>Speed vs Accuracy</div>
        <div style={{ color: "var(--text-secondary)", fontSize:15, lineHeight:1.6 }}>
          In CP, both speed and accuracy are rewarded. Every wrong submission adds a time penalty. Accurate logic is always better than fast but buggy implementation.
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Competitive Programming Basics"
        code={["Read input quickly (Fast I/O)",
          "Analyze Time Limit and Memory Limit",
          "Pick most efficient data structure",
          "Implement optimized algorithm",
          "Test against large constraints",
          "Submit and check for TLE/MLE/WA"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Contest Checklist</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
 
    </div></div>
  );
}

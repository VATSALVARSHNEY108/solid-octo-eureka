"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function AdHocProblems() {
  const traits = [
    "No standard algorithm fits perfectly.",
    "Requires a unique trick or observation.",
    "Often simple to code but hard to think of.",
    "Common in the early parts of competitive programming contests.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Ad-Hoc Problems</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Ad-hoc problems are those that don't fall into any standard category (like DP, Greedy, or Graphs). They require creative, outside-the-box thinking.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:16, padding:"24px", textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:16 }}>💡</div>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:8 }}>The 'Aha!' Moment</div>
        <div style={{ color: "var(--text-secondary)", fontSize:15, lineHeight:1.6 }}>
          The key to ad-hoc problems is to experiment with small cases until you find a logical shortcut or a pattern that simplifies everything.
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Ad Hoc Problems"
        code={["Read unconventional problem constraints",
          "Look for specific math properties",
          "Identify if it's a 'just do it' problem",
          "Handle edge cases (0, 1, negatives)",
          "Implement custom logic",
          "Verify against sample inputs"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Ad-Hoc Traits</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {traits.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
 
    </div></div>
  );
}

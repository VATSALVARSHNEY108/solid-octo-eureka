"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function CodeReadability() {
  const tips = [
    "Use meaningful variable names (e.g., `maxProfit` instead of `m`).",
    "Avoid deep nesting; use guard clauses.",
    "Consistency: Choose one style and stick to it.",
    "Add comments for non-obvious logic or mathematical tricks.",
    "Keep functions small and focused on a single task.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Code Readability</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Readable code is easier to debug, maintain, and review. In professional environments, code readability is as important as efficiency.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px" }}>
          <div style={{ fontWeight:800, fontSize:14, marginBottom:6, color:"#ef4444" }}>Poor Style</div>
          <code style={{ fontSize:11, color: "var(--text-secondary)" }}>for(int i=0;i&lt;n;i++)if(a[i]&gt;m)m=a[i];</code>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px" }}>
          <div style={{ fontWeight:800, fontSize:14, marginBottom:6, color:"#10b981" }}>Clean Style</div>
          <code style={{ fontSize:11, color: "var(--text-secondary)" }}>if (currentValue &gt; maxVal) maxVal = currentValue;</code>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Code Readability"
        code={["Use descriptive variable names",
          "Decompose logic into functions",
          "Add comments for non-obvious logic",
          "Maintain consistent indentation",
          "Avoid deeply nested loops",
          "Refactor complex boolean expressions"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Clean Code Principles</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
 
    </div></div>
  );
}

"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function InputOutputAnalysis() {
  const steps = [
    { label: "Input Format", desc: "How is the data given? (Space-separated, newline-separated, etc.)" },
    { label: "Output Format", desc: "What is the exact structure of the result? (Order, precision, casing)" },
    { label: "Sample Cases", desc: "Trace sample inputs to confirm you understand the transformation." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Input & Output Analysis</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        The relationship between input and output is the core of every problem. Analyzing this mapping helps reveal the underlying logic.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color: "var(--accent-primary)" }}>{s.label}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Input Output Analysis"
        code={["Analyze input format and types",
          "Parse structured input strings",
          "Format output as per requirements",
          "Handle trailing spaces or newlines",
          "Verify precision for floating points",
          "Process multiple test cases efficiently"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Analysis Tips</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          <li>Always check for 'None' or 'Empty' input scenarios</li>
          <li>Look for patterns in Sample 1 vs Sample 2 to see how special cases are handled</li>
          <li>Double check if the output needs to be modulo 10^9 + 7</li>
        </ul>
 
    </div></div>
  );
}

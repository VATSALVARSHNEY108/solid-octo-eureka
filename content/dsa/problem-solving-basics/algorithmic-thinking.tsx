"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function AlgorithmicThinking() {
  const components = [
    { name: "Step-by-Step", desc: "Every action must be clear and sequential." },
    { name: "Input/Output", desc: "Clear definition of what goes in and what comes out." },
    { name: "Finiteness", desc: "The algorithm must terminate in a finite amount of time." },
    { name: "Feasibility", desc: "Steps must be performable within current resource limits." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Algorithmic Thinking</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Thinking algorithmically means breaking a goal into a sequence of precise, logical steps that can be followed to reach the same result every time.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {components.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:800, fontSize:13, color:"#8b5cf6", marginBottom:4 }}>{c.name}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:12 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Algorithmic Thinking Lab"
        code={[
          "Understand: Inputs and Outputs",
          "Break Down: Sub-problems",
          "Observe: Patterns in data",
          "Apply: Existing techniques",
          "Validate: Edge cases",
          "Iterate: Performance tuning"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The Recipe Analogy</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Think of an algorithm as a cooking recipe. If you follow the steps exactly, you get the dish. If a step is vague (e.g., "add some salt"), the result might vary. Algorithms must be exact.
        </p>
 
    </div></div>
  );
}

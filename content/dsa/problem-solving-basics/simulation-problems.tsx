"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function SimulationProblems() {
  const steps = [
    "Define the state of the simulation (e.g., positions, timer).",
    "Identify the rules that change the state.",
    "Loop until the end condition is met.",
    "Update and record the state at each step.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Simulation Problems</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Simulation problems require you to "play out" a process described in the problem. You model the state and update it according to the given rules.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
          <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:13, marginBottom:4 }}>State</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>The current condition of all actors/variables.</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
          <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:13, marginBottom:4 }}>Transition</div>
          <div style={{ fontSize:12, color: "var(--text-secondary)" }}>The logic that moves simulation to the next step.</div>
        </div>
      </div>

      <MinimalSimulationStudio 
        title="Simulation Problems"
        code={["Initialize world/state state",
          "Implement rules of simulation",
          "Loop through time steps or events",
          "Update state based on interactions",
          "Check for termination conditions",
          "Collect final simulation metrics"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Simulation Tips</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {steps.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
 
    </div></div>
  );
}

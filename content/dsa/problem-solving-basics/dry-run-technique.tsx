"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function DryRunTechnique() {
  const steps = [
    "List all variables in a table",
    "Pick a small, simple test case",
    "Go through the algorithm line by line",
    "Update the variable values in the table as you go",
    "Compare the final result with the expected output",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Dry Run Technique</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Dry running is the process of manually executing your algorithm on paper. It's the most effective way to debug logic and find corner-case errors.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead style={{ background:"rgba(139,92,246,0.05)", borderBottom:"1px solid var(--border-subtle)" }}>
            <tr>
              <th style={{ padding:"12px 16px", textAlign:"left", color:"#8b5cf6" }}>Step</th>
              <th style={{ padding:"12px 16px", textAlign:"left" }}>i</th>
              <th style={{ padding:"12px 16px", textAlign:"left" }}>sum</th>
              <th style={{ padding:"12px 16px", textAlign:"left" }}>Output</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom:"1px solid var(--border-subtle)" }}>
              <td style={{ padding:"10px 16px" }}>1</td><td style={{ padding:"10px 16px" }}>0</td><td style={{ padding:"10px 16px" }}>5</td><td style={{ padding:"10px 16px" }}>-</td>
            </tr>
            <tr style={{ borderBottom:"1px solid var(--border-subtle)" }}>
              <td style={{ padding:"10px 16px" }}>2</td><td style={{ padding:"10px 16px" }}>1</td><td style={{ padding:"10px 16px" }}>12</td><td style={{ padding:"10px 16px" }}>-</td>
            </tr>
            <tr>
              <td style={{ padding:"10px 16px" }}>3</td><td style={{ padding:"10px 16px" }}>2</td><td style={{ padding:"10px 16px" }}>12</td><td style={{ padding:"10px 16px" }}>Done</td>
            </tr>
          </tbody>
        </table>
      </div>

      <MinimalSimulationStudio 
        title="Dry Run Technique"
        code={["Take a small, valid input",
          "List all variables and their values",
          "Follow code line by line",
          "Update variable states in each step",
          "Verify output against expected result",
          "Identify logical flaws in flow"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Dry Run Checklist</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {steps.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
 
    </div></div>
  );
}

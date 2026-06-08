"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function FlowchartsLesson() {
  const shapes = [
    { shape: "Oval", role: "Start / End" },
    { shape: "Rectangle", role: "Process / Action" },
    { shape: "Diamond", role: "Decision (Yes/No)" },
    { shape: "Parallelogram", role: "Input / Output" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Flowcharts</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        A flowchart is a visual representation of an algorithm. It uses different shapes to represent different types of actions or steps.
      </p>

      <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
        {shapes.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"14px 18px", flex:"1 1 180px" }}>
            <div style={{ fontWeight:800, fontSize:14, color:"#8b5cf6", marginBottom:4 }}>{s.shape}</div>
            <div style={{ color: "var(--text-secondary)", fontSize:13 }}>{s.role}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Flowcharts"
        code={["Start/End node initialization",
          "Identify decision points (diamonds)",
          "Map process steps (rectangles)",
          "Trace input/output flow (parallelograms)",
          "Connect nodes with directed arrows",
          "Validate logic flow for all paths"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Why use Flowcharts?</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Flowcharts are excellent for visualizing complex branching logic and loops. They help in spotting logical gaps before any code is written.
        </p>
 
    </div></div>
  );
}

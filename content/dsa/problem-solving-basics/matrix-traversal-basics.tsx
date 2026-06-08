"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function MatrixTraversalBasics() {
  const directions = [
    { dir: "Row Major", desc: "Process row by row." },
    { dir: "Column Major", desc: "Process column by column." },
    { dir: "Diagonal", desc: "Process elements where row index + col index is constant." },
    { dir: "Spiral", desc: "Process in a spiral boundary pattern." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Matrix Traversal</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Matrices (2D arrays) represent grids. Traversal involves visiting elements using nested loops, usually with `i` for rows and `j` for columns.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {directions.map((d, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px" }}>
            <div style={{ fontWeight:800, color:"#8b5cf6", fontSize:13, marginBottom:4 }}>{d.dir}</div>
            <div style={{ fontSize:12, color: "var(--text-secondary)" }}>{d.desc}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Matrix Traversal Basics"
        code={["Define row and column boundaries",
          "Pick traversal path (Row, Col, Spiral)",
          "Iterate through 2D array cells",
          "Handle boundary checks (out of bounds)",
          "Maintain current cell coordinates",
          "Process or collect cell values"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 2D Indexing</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          An element in an `M x N` matrix at `(r, c)` can be mapped to a 1D array index using: `index = r * N + c`. This is how matrices are actually stored in memory.
        </p>
 
    </div></div>
  );
}

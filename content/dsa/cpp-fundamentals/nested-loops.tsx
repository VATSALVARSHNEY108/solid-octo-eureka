"use client";
import React from "react";

export default function NestedLoopsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Loop in Loop</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ec4899" }}>Nested</span> Loops</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A loop inside another loop. The inner loop completes all its iterations for each single iteration of the outer loop. Time complexity is typically O(n²).</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>2D MATRIX TRAVERSAL</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{"for (int i = 0; i < rows; i++) {\n    for (int j = 0; j < cols; j++) {\n        cout << matrix[i][j] << \" \";\n    }\n    cout << endl;\n}"}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Pattern: Right triangle</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{"for (int i = 1; i <= n; i++) {\n    for (int j = 1; j <= i; j++)\n        cout << \"* \";\n    cout << endl;\n}\n// *\n// * *\n// * * *"}</pre>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>COMPLEXITY WARNING</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>2 nested loops = O(n²), 3 nested = O(n³). For n=10⁵, O(n²) ≈ 10¹⁰ operations — far too slow. Always check constraints before nesting.</p>
 
    </div></div>
  );
}

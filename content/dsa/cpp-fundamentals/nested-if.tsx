"use client";
import React from "react";

export default function NestedIfLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Nested Decisions</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ec4899" }}>Nested</span> if Statements</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>An if statement inside another if statement. Used when a decision depends on a prior condition being true first.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>NESTED STRUCTURE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{"if (age >= 18) {\n    if (hasLicense) {\n        cout << \"Can drive\";\n    } else {\n        cout << \"Get a license first\";\n    }\n} else {\n    cout << \"Too young\";\n}"}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Equivalent with logical AND</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{"// Same logic, flattened:\nif (age >= 18 && hasLicense) {\n    cout << \"Can drive\";\n}"}</pre>
      </div>

      <div style={{ background: "rgba(236,72,153,0.05)", border: "1px solid rgba(236,72,153,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontWeight: 700, marginBottom: 8 }}>BEST PRACTICE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Avoid deep nesting (3+ levels). Use logical operators or early returns to flatten the logic. Deep nesting makes code harder to read and debug.</p>
 
    </div></div>
  );
}

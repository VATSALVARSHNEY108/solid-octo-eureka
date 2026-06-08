"use client";
import React from "react";

export default function SwitchStatementLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Multi-way Select</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>The <span style={{ color: "#f97316" }}>switch</span> Statement</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Selects one of many code blocks based on the value of an expression. Cleaner than long else-if chains for discrete values.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>SYNTAX</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{"switch (expression) {\n    case value1:\n        // code\n        break;\n    case value2:\n        // code\n        break;\n    default:\n        // fallback\n}"}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Day of Week Example</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{"switch (day) {\n    case 1: cout << \"Mon\"; break;\n    case 2: cout << \"Tue\"; break;\n    case 3: cout << \"Wed\"; break;\n    default: cout << \"Other\";\n}"}</pre>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>⚠ BREAK IS REQUIRED</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.5 }}>Without <code style={{ color: "#ef4444" }}>break</code>, execution falls through to the next case. This is a common bug source.</p>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>VALID TYPES</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.5 }}>Switch works with <code style={{ color: "#10b981" }}>int</code>, <code style={{ color: "#10b981" }}>char</code>, and <code style={{ color: "#10b981" }}>enum</code>. It does NOT work with strings or floats.</p>
 
    </div></div></div>
  );
}

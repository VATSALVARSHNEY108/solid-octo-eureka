"use client";
import React from "react";

export default function IfElseStatementLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Two Paths</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>The <span style={{ color: "#3b82f6" }}>if-else</span> Statement</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Provides two execution paths — one for when the condition is true, and an alternative for when it is false.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>SYNTAX</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 14, fontFamily: "monospace", lineHeight: 1.8 }}>{"if (condition) {\n    // true branch\n} else {\n    // false branch\n}"}</pre>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>✓ TRUE PATH</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 12, fontFamily: "monospace" }}>{"if (n % 2 == 0) {\n  cout << \"Even\";\n}"}</pre>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>✗ FALSE PATH</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 12, fontFamily: "monospace" }}>{"else {\n  cout << \"Odd\";\n}"}</pre>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Practical Example</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{"int age = 16;\nif (age >= 18) {\n    cout << \"Can vote\";\n} else {\n    cout << \"Too young to vote\";\n}"}</pre>
 
    </div></div>
  );
}

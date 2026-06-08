"use client";
import React from "react";

export default function TernaryOperatorLesson() {
  const examples = [
    { label: "Basic usage", code: "int max = (a > b) ? a : b;" },
    { label: "In output", code: 'cout << (score >= 60 ? "Pass" : "Fail");' },
    { label: "Nested ternary", code: "int r = (a>b) ? (a>c?a:c) : (b>c?b:c);" },
    { label: "Assignment", code: "string s = (n%2==0) ? \"even\" : \"odd\";" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Conditional Expression</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Ternary <span style={{ color: "#ec4899" }}>Operator</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The ternary operator <code style={{ color: "#ec4899" }}>? :</code> is a shorthand for if-else. It evaluates a condition and returns one of two values.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>SYNTAX</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <code style={{ fontSize: 16, color: "#3b82f6", padding: "4px 12px", background: "rgba(59,130,246,0.1)", borderRadius: 8 }}>condition</code>
          <code style={{ fontSize: 20, color: "#ec4899", fontWeight: 800 }}>?</code>
          <code style={{ fontSize: 16, color: "#10b981", padding: "4px 12px", background: "rgba(16,185,129,0.1)", borderRadius: 8 }}>if_true</code>
          <code style={{ fontSize: 20, color: "#ec4899", fontWeight: 800 }}>:</code>
          <code style={{ fontSize: 16, color: "#ef4444", padding: "4px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8 }}>if_false</code>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {examples.map((ex, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "12px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 6 }}>{ex.label}</div>
            <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{ex.code}</pre>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(236,72,153,0.05)", border: "1px solid rgba(236,72,153,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontWeight: 700, marginBottom: 8 }}>READABILITY NOTE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Avoid deeply nested ternary expressions. If the logic is complex, prefer a regular if-else block for clarity.</p>
 
    </div></div>
  );
}

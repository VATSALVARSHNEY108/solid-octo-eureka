"use client";
import React from "react";

export default function ElseIfLadderLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Multi-way Branch</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>The <span style={{ color: "#8b5cf6" }}>else-if</span> Ladder</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Tests multiple conditions in sequence. Once a condition is true, its block executes and the rest are skipped.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>GRADE CALCULATOR</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{"if (marks >= 90) {\n    grade = 'A';\n} else if (marks >= 80) {\n    grade = 'B';\n} else if (marks >= 70) {\n    grade = 'C';\n} else if (marks >= 60) {\n    grade = 'D';\n} else {\n    grade = 'F';\n}"}</pre>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
        {[
          { cond: "marks ≥ 90", result: "A", color: "#10b981" },
          { cond: "marks ≥ 80", result: "B", color: "#3b82f6" },
          { cond: "marks ≥ 70", result: "C", color: "#f59e0b" },
          { cond: "marks ≥ 60", result: "D", color: "#f97316" },
          { cond: "otherwise", result: "F", color: "#ef4444" },
        ].map((r, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)", width: 100 }}>{r.cond}</span>
            <span style={{ color: "var(--text-muted)" }}>→</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.result}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>EXECUTION FLOW</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Conditions are checked top to bottom. The first match executes, and the rest are skipped entirely. The <code style={{ color: "#8b5cf6" }}>else</code> at the end is the fallback for when no condition matches.</p>
 
    </div></div>
  );
}

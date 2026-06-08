"use client";
import React from "react";

export default function RelationalOperatorsLesson() {
  const ops = [
    { op: "==", name: "Equal to", example: "5 == 5", result: "true", color: "#10b981" },
    { op: "!=", name: "Not equal to", example: "5 != 3", result: "true", color: "#ef4444" },
    { op: "<", name: "Less than", example: "3 < 5", result: "true", color: "#3b82f6" },
    { op: ">", name: "Greater than", example: "7 > 2", result: "true", color: "#8b5cf6" },
    { op: "<=", name: "Less or equal", example: "5 <= 5", result: "true", color: "#f97316" },
    { op: ">=", name: "Greater or equal", example: "6 >= 9", result: "false", color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Comparison</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Relational <span style={{ color: "#3b82f6" }}>Operators</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Relational operators compare two values and return a boolean result — <code style={{ color: "#10b981" }}>true</code> or <code style={{ color: "#ef4444" }}>false</code>. Essential for conditionals and loops.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: o.color, width: 45, textAlign: "center" }}>{o.op}</code>
            <span style={{ fontSize: 14, color: "var(--text-primary)", width: 130 }}>{o.name}</span>
            <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6 }}>{o.example}</code>
            <span style={{ color: "var(--text-muted)" }}>→</span>
            <span style={{ fontSize: 13, color: o.result === "true" ? "#10b981" : "#ef4444", fontWeight: 700 }}>{o.result}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>⚠ COMMON MISTAKE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Don't confuse <code style={{ color: "#ef4444" }}>=</code> (assignment) with <code style={{ color: "#10b981" }}>==</code> (comparison). Using <code style={{ color: "#ef4444" }}>if (x = 5)</code> assigns 5 to x instead of comparing!</p>
 
    </div></div>
  );
}

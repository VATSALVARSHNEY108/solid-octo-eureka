"use client";
import React from "react";

export default function OperatorsLesson() {
  const categories = [
    { name: "Arithmetic", ops: ["+", "-", "*", "/", "%"], desc: "Math calculations", color: "#f97316" },
    { name: "Relational", ops: ["==", "!=", "<", ">", "<=", ">="], desc: "Comparisons", color: "#3b82f6" },
    { name: "Logical", ops: ["&&", "||", "!"], desc: "Boolean logic", color: "#10b981" },
    { name: "Bitwise", ops: ["&", "|", "^", "~", "<<", ">>"], desc: "Bit manipulation", color: "#8b5cf6" },
    { name: "Assignment", ops: ["=", "+=", "-=", "*=", "/="], desc: "Value assignment", color: "#ec4899" },
    { name: "Increment/Decrement", ops: ["++", "--"], desc: "Increment/Decrement by 1", color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Operators</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#f97316" }}>Operators</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Operators are symbols that perform operations on variables and values. C++ provides a rich set of operators grouped by functionality.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {categories.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: c.color, marginBottom: 4 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>{c.desc}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.ops.map((op, j) => (
                <code key={j} style={{ fontSize: 14, color: c.color, background: `${c.color}12`, padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>{op}</code>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: "#f97316", marginBottom: 8 }}>OPERATOR PRECEDENCE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Operators have precedence rules. Arithmetic before relational, relational before logical. Use parentheses <code style={{ color: "#fb923c" }}>()</code> to make intent explicit.</p>
 
    </div></div>
  );
}

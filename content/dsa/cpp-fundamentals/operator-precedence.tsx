"use client";
import React from "react";

export default function OperatorPrecedenceLesson() {
  const levels = [
    { prec: 1, ops: ["()", "[]", "->", "."], assoc: "Left→Right", color: "#ef4444" },
    { prec: 2, ops: ["++", "--", "!", "~", "sizeof"], assoc: "Right→Left", color: "#f97316" },
    { prec: 3, ops: ["*", "/", "%"], assoc: "Left→Right", color: "#f59e0b" },
    { prec: 4, ops: ["+", "-"], assoc: "Left→Right", color: "#10b981" },
    { prec: 5, ops: ["<<", ">>"], assoc: "Left→Right", color: "var(--accent-secondary)" },
    { prec: 6, ops: ["<", "<=", ">", ">="], assoc: "Left→Right", color: "#3b82f6" },
    { prec: 7, ops: ["==", "!="], assoc: "Left→Right", color: "#8b5cf6" },
    { prec: 8, ops: ["&", "^", "|"], assoc: "Left→Right", color: "#ec4899" },
    { prec: 9, ops: ["&&", "||"], assoc: "Left→Right", color: "#a855f7" },
    { prec: 10, ops: ["?:"], assoc: "Right→Left", color: "var(--text-muted)" },
    { prec: 11, ops: ["=", "+=", "-=", "*="], assoc: "Right→Left", color: "var(--text-muted)" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Evaluation Order</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Operator <span style={{ color: "#f97316" }}>Precedence</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Precedence determines which operator is evaluated first. Higher precedence (lower number) operators are evaluated before lower ones.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
        {levels.map((l, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 12, color: l.color, width: 24, textAlign: "center" }}>{l.prec}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1 }}>
              {l.ops.map((op, j) => (
                <code key={j} style={{ fontSize: 12, color: l.color, background: `${l.color}12`, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{op}</code>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{l.assoc}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 }}>GOLDEN RULE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>When in doubt, use parentheses <code style={{ color: "#f97316" }}>()</code>. They override all precedence rules and make your intent explicit.</p>
 
    </div></div>
  );
}

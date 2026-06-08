"use client";
import React from "react";

export default function ConditionalStatementsLesson() {
  const types = [
    { name: "if", syntax: "if (condition) { ... }", desc: "Executes block only when condition is true", color: "#10b981" },
    { name: "if-else", syntax: "if (cond) { A } else { B }", desc: "Chooses between two paths based on condition", color: "#3b82f6" },
    { name: "else-if", syntax: "if (c1) {} else if (c2) {} else {}", desc: "Tests multiple conditions in sequence", color: "#8b5cf6" },
    { name: "switch", syntax: "switch(val) { case 1: ... }", desc: "Selects from multiple discrete values", color: "#f97316" },
    { name: "ternary", syntax: "cond ? val1 : val2", desc: "Inline conditional expression", color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Control Flow</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Conditional <span style={{ color: "#10b981" }}>Statements</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Conditional statements allow programs to make decisions. They control which block of code runs based on whether conditions evaluate to true or false.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {types.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: t.color }}>{t.name}</code>
            </div>
            <code style={{ fontSize: 12, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6, display: "inline-block", marginBottom: 8 }}>{t.syntax}</code>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{t.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>WHEN TO USE WHAT</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>
          Use <code style={{ color: "#10b981" }}>if-else</code> for boolean/range checks. Use <code style={{ color: "#f97316" }}>switch</code> for matching against specific discrete values (integers, chars, enums). Use <code style={{ color: "#ec4899" }}>ternary</code> for simple inline assignments.
        </p>
 
    </div></div>
  );
}

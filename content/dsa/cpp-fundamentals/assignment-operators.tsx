"use client";
import React from "react";

export default function AssignmentOperatorsLesson() {
  const ops = [
    { op: "=", name: "Assign", example: "x = 10", result: "x = 10", color: "#f97316" },
    { op: "+=", name: "Add & Assign", example: "x += 5", result: "x = x + 5", color: "#10b981" },
    { op: "-=", name: "Subtract & Assign", example: "x -= 3", result: "x = x - 3", color: "#3b82f6" },
    { op: "*=", name: "Multiply & Assign", example: "x *= 2", result: "x = x * 2", color: "#8b5cf6" },
    { op: "/=", name: "Divide & Assign", example: "x /= 4", result: "x = x / 4", color: "#ec4899" },
    { op: "%=", name: "Modulus & Assign", example: "x %= 3", result: "x = x % 3", color: "#f59e0b" },
    { op: "<<=", name: "Left Shift & Assign", example: "x <<= 1", result: "x = x << 1", color: "var(--accent-secondary)" },
    { op: ">>=", name: "Right Shift & Assign", example: "x >>= 1", result: "x = x >> 1", color: "#ef4444" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Assignment</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Assignment <span style={{ color: "#f97316" }}>Operators</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Assignment operators store values in variables. Compound assignment operators combine an operation with assignment for concise code.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, color: o.color, width: 45, textAlign: "center" }}>{o.op}</code>
            <span style={{ fontSize: 13, color: "var(--text-primary)", width: 150, flexShrink: 0 }}>{o.name}</span>
            <code style={{ fontSize: 12, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "2px 8px", borderRadius: 6 }}>{o.example}</code>
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>→</span>
            <code style={{ fontSize: 12, color: "var(--text-muted)" }}>{o.result}</code>
          </div>
        ))}
    </div></div>
  );
}

"use client";
import React from "react";

export default function ArithmeticOperatorsLesson() {
  const ops = [
    { op: "+", name: "Addition", example: "5 + 3 = 8", color: "#10b981" },
    { op: "-", name: "Subtraction", example: "10 - 4 = 6", color: "#3b82f6" },
    { op: "*", name: "Multiplication", example: "6 * 7 = 42", color: "#8b5cf6" },
    { op: "/", name: "Division", example: "15 / 4 = 3 (int)", color: "#f97316" },
    { op: "%", name: "Modulus", example: "17 % 5 = 2", color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Math Operations</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Arithmetic <span style={{ color: "#10b981" }}>Operators</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Arithmetic operators perform mathematical calculations on numeric operands.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, color: o.color, width: 40, textAlign: "center" }}>{o.op}</code>
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", width: 120 }}>{o.name}</span>
            <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6 }}>{o.example}</code>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>⚠ INTEGER DIVISION</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{"int a = 15 / 4;    // 3 (truncated)\ndouble b = 15.0 / 4; // 3.75"}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>When both operands are integers, the result is truncated. Cast to double for decimal results.</p>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontWeight: 700, marginBottom: 8 }}>MODULUS OPERATOR</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{"// Check even/odd\nif (n % 2 == 0) // even\n// Wrap around\nint idx = i % size;"}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>The modulus operator is essential in DSA — used for hashing, cyclic indexing, and modular arithmetic.</p>
 
    </div></div>
  );
}

"use client";
import React from "react";

export default function IncrementDecrementOperatorsLesson() {
  const ops = [
    { op: "++x", name: "Pre-increment", desc: "Increments THEN returns value", example: "x=5; y=++x; // x=6, y=6", color: "#10b981" },
    { op: "x++", name: "Post-increment", desc: "Returns value THEN increments", example: "x=5; y=x++; // x=6, y=5", color: "#3b82f6" },
    { op: "--x", name: "Pre-decrement", desc: "Decrements THEN returns value", example: "x=5; y=--x; // x=4, y=4", color: "#8b5cf6" },
    { op: "x--", name: "Post-decrement", desc: "Returns value THEN decrements", example: "x=5; y=x--; // x=4, y=5", color: "#f97316" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Increment / Decrement</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Increment & <span style={{ color: "#10b981" }}>Decrement</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>These unary operators increase or decrease a value by 1. The key difference is when the change happens — before or after using the value.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: o.color }}>{o.op}</code>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: o.color }}>{o.name}</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{o.desc}</p>
            <code style={{ fontSize: 12, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6 }}>{o.example}</code>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>PRO TIP</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>In loops, <code style={{ color: "#10b981" }}>++i</code> is preferred over <code style={{ color: "#10b981" }}>i++</code> for iterators as it avoids creating a temporary copy. For primitive types, modern compilers optimize both equally.</p>
 
    </div></div>
  );
}

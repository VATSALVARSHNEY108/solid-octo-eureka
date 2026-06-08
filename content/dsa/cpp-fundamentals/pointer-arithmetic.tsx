"use client";
import React from "react";

export default function PointerArithmeticLesson() {
  const ops = [
    { op: "ptr++", desc: "Moves to the next memory location of the type", color: "#10b981" },
    { op: "ptr--", desc: "Moves to the previous memory location of the type", color: "#3b82f6" },
    { op: "ptr + n", desc: "Moves n elements forward", color: "#8b5cf6" },
    { op: "ptr1 - ptr2", desc: "Number of elements between two pointers", color: "#f97316" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Navigation</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Pointer <span style={{ color: "#8b5cf6" }}>Arithmetic</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>You can perform arithmetic on pointers, but it's different from regular math. Incrementing a pointer moves it by the SIZE of the data type it points to.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "14px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, color: o.color, display: "block", marginBottom: 4 }}>{o.op}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{o.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>HOW IT WORKS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>If an <code style={{color: "#10b981"}}>int</code> is 4 bytes and <code style={{color: "#3b82f6"}}>ptr</code> is at <code style={{color: "var(--text-primary)"}}>1000</code>:</p>
        <code style={{ fontSize: 13, color: "#fb923c", display: "block", marginTop: 8 }}>ptr + 1; // Address becomes 1004 (not 1001!)</code>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>INVALID OPERATIONS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>You cannot multiply or divide pointers. You also cannot add two pointers together (that address wouldn't mean anything).</p>
 
    </div></div>
  );
}

"use client";
import React from "react";

export default function BitwiseOperatorsLesson() {
  const ops = [
    { op: "&", name: "AND", desc: "1 if both bits are 1", example: "5 & 3 = 1", binary: "101 & 011 = 001", color: "#10b981" },
    { op: "|", name: "OR", desc: "1 if either bit is 1", example: "5 | 3 = 7", binary: "101 | 011 = 111", color: "#3b82f6" },
    { op: "^", name: "XOR", desc: "1 if bits differ", example: "5 ^ 3 = 6", binary: "101 ^ 011 = 110", color: "#8b5cf6" },
    { op: "~", name: "NOT", desc: "Flips all bits", example: "~5 = -6", binary: "~00000101", color: "#ec4899" },
    { op: "<<", name: "Left Shift", desc: "Shifts bits left (×2)", example: "3 << 2 = 12", binary: "011 → 1100", color: "#f97316" },
    { op: ">>", name: "Right Shift", desc: "Shifts bits right (÷2)", example: "12 >> 2 = 3", binary: "1100 → 011", color: "#f59e0b" },
  ];

  const tricks = [
    { trick: "Check if even/odd", code: "n & 1  // 0=even, 1=odd" },
    { trick: "Multiply by 2ⁿ", code: "x << n" },
    { trick: "Divide by 2ⁿ", code: "x >> n" },
    { trick: "Swap without temp", code: "a^=b; b^=a; a^=b;" },
    { trick: "Check power of 2", code: "n & (n-1) == 0" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Bit Manipulation</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Bitwise <span style={{ color: "#8b5cf6" }}>Operators</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Bitwise operators work on individual bits of integers. They are extremely fast and essential for competitive programming.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {ops.map((o, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: o.color, width: 35, textAlign: "center" }}>{o.op}</code>
            <span style={{ fontSize: 13, color: "var(--text-primary)", width: 90 }}>{o.name}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", width: 140 }}>{o.desc}</span>
            <code style={{ fontSize: 12, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "2px 8px", borderRadius: 6 }}>{o.example}</code>
            <code style={{ fontSize: 11, color: "var(--text-muted)" }}>{o.binary}</code>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>DSA Bit Tricks</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {tricks.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", width: 160 }}>{t.trick}</span>
            <code style={{ fontSize: 12, color: "#fb923c" }}>{t.code}</code>
          </div>
        ))}
    </div></div>
  );
}

"use client";
import React from "react";

export default function TypeModifiersLesson() {
  const modifiers = [
    { modifier: "signed", effect: "Can hold negative & positive", example: "signed int x = -5;", color: "#3b82f6" },
    { modifier: "unsigned", effect: "Only non-negative values (doubles range)", example: "unsigned int x = 50000;", color: "#10b981" },
    { modifier: "short", effect: "Reduces storage (2 bytes)", example: "short int x = 100;", color: "#f97316" },
    { modifier: "long", effect: "Increases storage (4-8 bytes)", example: "long int x = 100000;", color: "#8b5cf6" },
    { modifier: "long long", effect: "Maximum integer storage (8 bytes)", example: "long long x = 1e18;", color: "#ec4899" },
  ];

  const comparison = [
    { type: "short", bytes: 2, range: "-32,768 to 32,767" },
    { type: "int", bytes: 4, range: "-2.1B to 2.1B" },
    { type: "long", bytes: 4, range: "-2.1B to 2.1B" },
    { type: "long long", bytes: 8, range: "±9.2 × 10¹⁸" },
    { type: "unsigned int", bytes: 4, range: "0 to 4.29B" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Size Control</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Type <span style={{ color: "#8b5cf6" }}>Modifiers</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Type modifiers alter the storage size and range of basic data types. They let you optimize memory or increase capacity as needed.</p>

      {modifiers.map((m, i) => (
        <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 6, flexWrap: "wrap" }}>
          <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: m.color, width: 90, flexShrink: 0 }}>{m.modifier}</code>
          <span style={{ color: "var(--text-secondary)", fontSize: 13, flex: 1, minWidth: 150 }}>{m.effect}</span>
          <code style={{ fontSize: 12, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "3px 10px", borderRadius: 6 }}>{m.example}</code>
        </div>
      ))}

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 24 }}>Size Comparison</div>
      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        {comparison.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "6px 0", borderBottom: i < comparison.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <code style={{ fontSize: 13, color: "var(--text-primary)", width: 120 }}>{c.type}</code>
            <span style={{ fontSize: 12, color: "#8b5cf6", width: 60 }}>{c.bytes}B</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.range}</span>
          </div>
        ))}
    </div></div>
  );
}

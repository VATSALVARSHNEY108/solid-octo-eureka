"use client";
import React from "react";

export default function ConstantsLiteralsLesson() {
  const types = [
    { name: "Integer Literal", examples: ["42", "0xFF", "0b1010", "077"], color: "#f97316" },
    { name: "Float Literal", examples: ["3.14", "2.0f", "1.5e10"], color: "#3b82f6" },
    { name: "Character Literal", examples: ["'A'", "'\\n'", "'\\0'"], color: "#10b981" },
    { name: "String Literal", examples: ['"Hello"', '"C++"'], color: "#8b5cf6" },
    { name: "Boolean Literal", examples: ["true", "false"], color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Immutable Values</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Constants & <span style={{ color: "#f97316" }}>Literals</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Constants are values that cannot be modified after initialization. Literals are fixed values written directly in code.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 8 }}>const KEYWORD</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{"const int MAX = 100;\nconst double PI = 3.14159;"}</pre>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 8 }}>constexpr (C++11)</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{"constexpr int SIZE = 50;\n// evaluated at compile time"}</pre>
        </div>
      </div>

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Literal Types</div>
      {types.map((t, i) => (
        <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: t.color, width: 130, flexShrink: 0 }}>{t.name}</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {t.examples.map((ex, j) => (
              <code key={j} style={{ fontSize: 12, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "2px 8px", borderRadius: 6 }}>{ex}</code>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

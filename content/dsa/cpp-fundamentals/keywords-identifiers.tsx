"use client";
import React from "react";

export default function KeywordsIdentifiersLesson() {
  const keywords = [
    { group: "Data Types", items: ["int", "float", "double", "char", "bool", "void", "auto"], color: "#f97316" },
    { group: "Control Flow", items: ["if", "else", "switch", "case", "for", "while", "do"], color: "#3b82f6" },
    { group: "Functions", items: ["return", "inline", "virtual", "friend", "const"], color: "#10b981" },
    { group: "OOP", items: ["class", "struct", "public", "private", "protected"], color: "#8b5cf6" },
    { group: "Memory", items: ["new", "delete", "sizeof", "static", "extern"], color: "#ec4899" },
  ];

  const identifierRules = [
    { rule: "Can contain letters, digits, underscores", example: "myVar_2", valid: true },
    { rule: "Must begin with letter or underscore", example: "_count", valid: true },
    { rule: "Cannot start with a digit", example: "2ndValue", valid: false },
    { rule: "Cannot be a keyword", example: "int return = 5;", valid: false },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Lexical Elements</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Keywords & <span style={{ color: "#8b5cf6" }}>Identifiers</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Keywords are reserved words with special meaning. Identifiers are names you give to variables, functions, and classes.</p>

      {keywords.map((g, i) => (
        <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "12px 18px", marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: g.color, fontWeight: 700, marginBottom: 8 }}>{g.group}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {g.items.map((kw, j) => (
              <code key={j} style={{ fontSize: 12, color: g.color, background: `${g.color}10`, padding: "3px 10px", borderRadius: 6 }}>{kw}</code>
            ))}
          </div>
        </div>
      ))}

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 24 }}>Identifier Rules</div>
      {identifierRules.map((r, i) => (
        <div key={i} style={{ background: "var(--bg-secondary)", border: `1px solid ${r.valid ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"}`, borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <span style={{ color: r.valid ? "#10b981" : "#ef4444" }}>{r.valid ? "✓" : "✗"}</span>
          <span style={{ color: "var(--text-secondary)", fontSize: 13, flex: 1 }}>{r.rule}</span>
          <code style={{ fontSize: 12, color: r.valid ? "#10b981" : "#ef4444" }}>{r.example}</code>
        </div>
      ))}
    </div>
  );
}

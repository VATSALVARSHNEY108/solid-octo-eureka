"use client";
import React from "react";
import { Box, Info } from "lucide-react";

export default function VariablesLesson() {
  const rules = [
    { rule: "Must start with a letter or underscore", example: "int _count = 0;", valid: true },
    { rule: "Cannot use C++ reserved keywords", example: "int class = 5;", valid: false },
    { rule: "Case-sensitive naming", example: "int Age ≠ int age", valid: true },
    { rule: "No spaces or special characters", example: "int my var = 1;", valid: false },
  ];

  const examples = [
    { label: "Declaration", code: "int age;", desc: "Reserves memory without assigning a value" },
    { label: "Initialization", code: "int age = 25;", desc: "Declares and assigns in one step" },
    { label: "Multiple", code: "int a = 1, b = 2, c = 3;", desc: "Multiple variables of the same type" },
    { label: "Constant", code: "const int MAX = 100;", desc: "Value cannot be changed after initialization" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
        05 // Storage
      </span>

      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32, letterSpacing: "-0.04em", marginBottom: 12, lineHeight: 1.1 }}>
        <span style={{ color: "#3b82f6" }}>Variables</span>
      </h2>

      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 600, marginBottom: 32 }}>
        A variable is a named memory location that stores data. Every variable in C++ must be declared with a type before use.
      </p>

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        Declaration & Initialization
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {examples.map((ex, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: "#3b82f6", width: 100, flexShrink: 0 }}>{ex.label}</span>
            <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "3px 10px", borderRadius: 6, fontFamily: "monospace" }}>{ex.code}</code>
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{ex.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
        Naming Rules
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
        {rules.map((r, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: `1px solid ${r.valid ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}`, borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14 }}>{r.valid ? "✓" : "✗"}</span>
            <span style={{ color: "var(--text-secondary)", fontSize: 13, flex: 1 }}>{r.rule}</span>
            <code style={{ fontSize: 12, color: r.valid ? "#10b981" : "#ef4444", fontFamily: "monospace" }}>{r.example}</code>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 16, padding: 20, display: "flex", gap: 16 }}>
        <div style={{ color: "#3b82f6", marginTop: 2 }}><Info size={18} /></div>
        <div>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#3b82f6", marginBottom: 6 }}>Uninitialized Variables</h5>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
            Uninitialized local variables contain garbage values. Always initialize your variables to avoid undefined behavior in your programs.
          </p>
 
    </div></div></div>
  );
}

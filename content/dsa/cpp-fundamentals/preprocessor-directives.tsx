"use client";
import React from "react";

export default function PreprocessorDirectivesLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Build Stage</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ef4444" }}>Preprocessor</span> Directives</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Instructions processed by the preprocessor BEFORE the actual compilation starts. They always begin with a hash <code style={{color: "#ef4444"}}>#</code> symbol.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { name: "#include", desc: "Inserts the contents of a header file into the current file.", color: "#3b82f6" },
          { name: "#define", desc: "Creates a macro (text substitution) or constant.", color: "#10b981" },
          { name: "#ifdef / #ifndef", desc: "Conditional compilation based on whether a macro is defined.", color: "#f97316" },
          { name: "#pragma", desc: "Compiler-specific instructions (e.g., #pragma once).", color: "#8b5cf6" },
        ].map((d, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: d.color, display: "block", marginBottom: 4 }}>{d.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{d.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>NOTE ON SEMICOLONS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Preprocessor directives are NOT C++ statements. Do NOT put a semicolon <code style={{color: "#ef4444"}}>;</code> at the end of them.</p>
 
    </div></div>
  );
}

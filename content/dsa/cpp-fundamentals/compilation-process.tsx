"use client";
import React from "react";

export default function CompilationProcessLesson() {
  const steps = [
    { name: "Preprocessing", desc: "Handles directives (#), removes comments, expands macros.", color: "#ef4444" },
    { name: "Compilation", desc: "Translates C++ code into Assembly language.", color: "#f97316" },
    { name: "Assembly", desc: "Translates assembly into Machine Code (Object Files .o/.obj).", color: "#10b981" },
    { name: "Linking", desc: "Combines object files and libraries into a final Executable (.exe).", color: "#3b82f6" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Behind the Scenes</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>The <span style={{ color: "#3b82f6" }}>Compilation</span> Process</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Converting human-readable C++ code into machine-executable binary is a multi-step journey.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ background: s.color, color: "#000", width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.color, marginBottom: 4, fontFamily: "'Syne', sans-serif", textTransform: "uppercase" }}>{s.name}</div>
              <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>The Linker Error</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>If you declare a function but forget to define it, you'll get a <b style={{color: "#ef4444"}}>Linker Error</b> (like "undefined reference"), not a compiler error!</p>
 
    </div></div>
  );
}

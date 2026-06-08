"use client";
import React from "react";

export default function LoopsLesson() {
  const types = [
    { name: "for", use: "Known iteration count", syntax: "for (init; cond; update)", color: "#10b981" },
    { name: "while", use: "Unknown count, check first", syntax: "while (condition)", color: "#3b82f6" },
    { name: "do-while", use: "Execute at least once", syntax: "do { } while (cond)", color: "#8b5cf6" },
    { name: "range-for", use: "Iterate over containers", syntax: "for (auto x : arr)", color: "#f97316" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Iteration</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#10b981" }}>Loops</span> Overview</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Loops execute a block of code repeatedly. Choosing the right loop type depends on whether you know the iteration count and when to check the condition.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {types.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: t.color }}>{t.name}</code>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>— {t.use}</span>
            </div>
            <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6 }}>{t.syntax}</code>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>INFINITE LOOP</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{"while (true) { ... }  // or\nfor (;;) { ... }"}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>Use with break to create loops that terminate on a specific internal condition.</p>
 
    </div></div>
  );
}

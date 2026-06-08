"use client";
import React from "react";

export default function LoopControlLesson() {
  const controls = [
    { name: "break", desc: "Exits the loop immediately", example: "if (i == 5) break;", color: "#ef4444" },
    { name: "continue", desc: "Skips current iteration and moves to next", example: "if (i % 2 == 0) continue;", color: "#3b82f6" },
    { name: "goto", desc: "Jumps to a labeled statement (avoid using)", example: "goto error_handler;", color: "#f59e0b" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Flow Control</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Loop <span style={{ color: "#ef4444" }}>Control</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Loop control statements change the execution flow from its normal sequence. They allow you to exit loops early or skip specific iterations.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {controls.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: c.color }}>{c.name}</code>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 8 }}>{c.desc}</p>
            <code style={{ fontSize: 12, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6 }}>{c.example}</code>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>NESTED LOOP BREAK</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>A <code style={{ color: "#ef4444" }}>break</code> only exits the innermost loop. To exit multiple nested loops, you might need a flag variable or a <code style={{ color: "#f59e0b" }}>goto</code> (though rare).</p>
 
    </div></div>
  );
}

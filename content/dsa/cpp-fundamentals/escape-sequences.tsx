"use client";
import React from "react";

export default function EscapeSequencesLesson() {
  const sequences = [
    { seq: "\\n", name: "Newline", desc: "Moves cursor to next line", color: "#10b981" },
    { seq: "\\t", name: "Tab", desc: "Horizontal tab space", color: "#3b82f6" },
    { seq: "\\\\", name: "Backslash", desc: "Prints a backslash character", color: "#8b5cf6" },
    { seq: "\\'", name: "Single Quote", desc: "Prints a single quote", color: "#f97316" },
    { seq: '\\"', name: "Double Quote", desc: "Prints a double quote", color: "#ec4899" },
    { seq: "\\0", name: "Null", desc: "Null character (string terminator)", color: "#ef4444" },
    { seq: "\\r", name: "Carriage Return", desc: "Returns cursor to line start", color: "#f59e0b" },
    { seq: "\\a", name: "Alert", desc: "Produces an audible beep", color: "var(--accent-secondary)" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(6,182,212,0.1)", color: "var(--accent-secondary)", border: "1px solid rgba(6,182,212,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Special Characters</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Escape <span style={{ color: "var(--accent-secondary)" }}>Sequences</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Escape sequences are special character combinations starting with a backslash that represent non-printable or special characters.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {sequences.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "12px 18px", display: "flex", alignItems: "center", gap: 16 }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: s.color, width: 50, flexShrink: 0 }}>{s.seq}</code>
            <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", width: 120, flexShrink: 0 }}>{s.name}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>{s.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Example Usage</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{'cout << "Hello\\tWorld\\n";\ncout << "She said \\"Hi\\"\\n";'}</pre>
 
    </div></div>
  );
}

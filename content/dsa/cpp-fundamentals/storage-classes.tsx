"use client";
import React from "react";

export default function StorageClassesLesson() {
  const classes = [
    { name: "auto", desc: "Default for local variables. Stored on stack.", color: "#3b82f6" },
    { name: "static", desc: "Persists value between function calls. Allocated once.", color: "#10b981" },
    { name: "extern", desc: "Refers to a global variable defined in another file.", color: "#f97316" },
    { name: "register", desc: "Hint to store in CPU register (mostly ignored by modern compilers).", color: "#8b5cf6" },
    { name: "mutable", desc: "Allows modification of a member even in a const object.", color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Lifetime & Linkage</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Storage <span style={{ color: "#8b5cf6" }}>Classes</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Storage classes define the scope, visibility, and lifetime of variables and functions in a C++ program.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {classes.map((c, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: c.color, display: "block", marginBottom: 4 }}>{c.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>THE STATIC KEYWORD</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`void counter() {
    static int c = 0; // initialized ONLY once
    cout << ++c << " ";
}
// Calling counter() 3 times prints: 1 2 3`}</pre>
 
    </div></div>
  );
}

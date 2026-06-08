"use client";
import React from "react";

export default function FileHandlingLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Persistence</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>File <span style={{ color: "#8b5cf6" }}>Handling</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Allows C++ programs to read from and write to external files on the disk using the <code style={{color: "#8b5cf6"}}>&lt;fstream&gt;</code> library.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { name: "ofstream", desc: "Stream class to write on files.", color: "#10b981" },
          { name: "ifstream", desc: "Stream class to read from files.", color: "#3b82f6" },
          { name: "fstream", desc: "Stream class to both read and write.", color: "#f97316" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: s.color, display: "block", marginBottom: 4 }}>{s.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE FILE WORKFLOW</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["1. Open", "2. Read/Write", "3. Close"].map((step, i) => (
            <div key={i} style={{ background: "var(--accent-soft)", padding: "8px 16px", borderRadius: 8, fontSize: 12 }}>{step}</div>
          ))}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 12 }}>Always close your files using <code style={{color: "#ef4444"}}>.close()</code> to ensure data is flushed and resources are released.</p>
 
    </div></div>
  );
}

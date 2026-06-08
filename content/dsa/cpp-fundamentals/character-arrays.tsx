"use client";
import React from "react";

export default function CharacterArraysLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>C-Style Strings</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ec4899" }}>Character</span> Arrays</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Arrays of the <code style={{color: "#ec4899"}}>char</code> type. They are used to represent text in C-style, ending with a special null terminator <code style={{color: "#ef4444"}}>\0</code>.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>DECLARATION & NULL TERMINATOR</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`char name[6] = "Alice"; // Auto adds \\0\nchar city[] = {'N', 'Y', '\\0'}; // Manual \\0\n\ncout << sizeof(name); // 6 (including \\0)`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>cin vs cin.get()</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}><code style={{color: "#3b82f6"}}>cin</code> stops at spaces. Use <code style={{color: "#3b82f6"}}>cin.get()</code> or <code style={{color: "#3b82f6"}}>getline()</code> for strings with spaces.</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>BUFFER OVERFLOW</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Writing more characters than the array size can overwrite adjacent memory.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Common Functions (cstring)</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["strlen()", "strcpy()", "strcat()", "strcmp()"].map(fn => (
            <code key={fn} style={{ fontSize: 11, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "2px 8px", borderRadius: 4 }}>{fn}</code>
          ))}
    </div></div></div>
  );
}

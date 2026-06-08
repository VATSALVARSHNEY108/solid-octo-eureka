"use client";
import React from "react";

export default function StringsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(6,182,212,0.1)", color: "var(--accent-secondary)", border: "1px solid rgba(6,182,212,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Dynamic Text</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "var(--accent-secondary)" }}>Strings</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The modern <code style={{color: "var(--accent-secondary)"}}>std::string</code> class from the <code style={{color: "var(--accent-secondary)"}}>&lt;string&gt;</code> header. It handles memory automatically and provides rich features for text manipulation.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--accent-secondary)", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>BASIC OPERATIONS</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`string s1 = "Hello";\nstring s2 = "World";\n\nstring s3 = s1 + " " + s2; // Concatenation\ncout << s3.length();       // 11\ncout << s3[0];             // 'H' (Access)`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>DYNAMIC SIZE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Grows and shrinks automatically as you add or remove characters.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>SAFE ACCESS</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Use <code style={{color: "#3b82f6"}}>s.at(i)</code> for bounds-checked access; it throws an error if the index is invalid.</p>
        </div>
      </div>

      <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--accent-secondary)", fontWeight: 700, marginBottom: 8 }}>STRING VS CHAR ARRAY</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Prefer <code style={{color: "var(--accent-secondary)"}}>std::string</code> over C-style character arrays. It's safer, more flexible, and integrates better with STL algorithms.</p>
 
    </div></div>
  );
}

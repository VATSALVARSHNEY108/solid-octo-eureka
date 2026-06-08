"use client";
import React from "react";

export default function TemplatesLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Generic Programming</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#f97316" }}>Templates</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Templates allow you to write generic code that works with any data type. They are the backbone of the Standard Template Library (STL).</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE CONCEPT</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 14, fontFamily: "monospace", lineHeight: 1.8 }}>{`template <typename T>\nT getMax(T a, T b) {\n    return (a > b) ? a : b;\n}`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}><code style={{color: "#f97316"}}>T</code> is a placeholder for any type (int, double, string, etc.).</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>DRY PRINCIPLE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Don't Repeat Yourself. One template replaces dozens of overloaded functions.</p>
        </div>
        <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>COMPILE-TIME</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>The compiler generates a specific version of the code for each type used. Zero runtime overhead.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Two Types of Templates</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
          <li><b style={{color: "var(--text-primary)"}}>Function Templates:</b> Generic functions (like sort, max).</li>
          <li><b style={{color: "var(--text-primary)"}}>Class Templates:</b> Generic classes (like vector, stack).</li>
        </ul>
 
    </div></div>
  );
}

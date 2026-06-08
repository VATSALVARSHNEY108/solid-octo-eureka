"use client";
import React from "react";

export default function TypeCastingLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Type Conversion</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#f97316" }}>Type Casting</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Type casting is the process of converting one data type into another. C++ supports both implicit and explicit casting.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>IMPLICIT (COERCION)</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12 }}>Done automatically by the compiler when there is no data loss.</p>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 12, fontFamily: "monospace" }}>{`int i = 10;\ndouble d = i; // 10.0`}</pre>
        </div>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>EXPLICIT (CASTING)</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12 }}>Manually specified by the programmer. Required when data loss may occur.</p>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 12, fontFamily: "monospace" }}>{`double d = 10.5;\nint i = (int)d; // C-style\nint j = static_cast<int>(d);`}</pre>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>MODERN C++ CASTS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
          <li><code style={{color: "#3b82f6"}}>static_cast</code>: Standard well-behaved casts.</li>
          <li><code style={{color: "#3b82f6"}}>dynamic_cast</code>: Safe downcasting in inheritance.</li>
          <li><code style={{color: "#3b82f6"}}>const_cast</code>: To add or remove <code style={{color: "#3b82f6"}}>const</code>.</li>
          <li><code style={{color: "#3b82f6"}}>reinterpret_cast</code>: Low-level bitwise conversion (dangerous).</li>
        </ul>
      </div>

      <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 }}>BEST PRACTICE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Prefer <code style={{color: "#3b82f6"}}>static_cast</code> over C-style casts <code style={{color: "#ef4444"}}>(int)d</code> because it's more restrictive, easier to find in code, and safer at compile-time.</p>
 
    </div></div>
  );
}

"use client";
import React from "react";

export default function ForLoopLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Counted Loop</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>The <span style={{ color: "#10b981" }}>for</span> Loop</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The most common loop in DSA. Ideal when you know exactly how many times to iterate. All three parts — init, condition, update — live in one line.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>ANATOMY</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <code style={{ padding: "4px 12px", borderRadius: 8, background: "rgba(249,115,22,0.1)", color: "#f97316", fontSize: 13 }}>int i = 0</code>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>→ init once</span>
          <code style={{ padding: "4px 12px", borderRadius: 8, background: "rgba(59,130,246,0.1)", color: "#3b82f6", fontSize: 13 }}>i &lt; n</code>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>→ check each iteration</span>
          <code style={{ padding: "4px 12px", borderRadius: 8, background: "rgba(139,92,246,0.1)", color: "#8b5cf6", fontSize: 13 }}>i++</code>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>→ update after body</span>
        </div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 14, fontFamily: "monospace", lineHeight: 1.8 }}>{"for (int i = 0; i < n; i++) {\n    cout << i << \" \";\n}"}</pre>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Reverse iteration", code: "for (int i = n-1; i >= 0; i--)" },
          { label: "Step by 2", code: "for (int i = 0; i < n; i += 2)" },
          { label: "Multiple variables", code: "for (int i=0, j=n; i<j; i++, j--)" },
        ].map((ex, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "10px 16px" }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>{ex.label}</div>
            <code style={{ fontSize: 12, color: "#fb923c" }}>{ex.code}</code>
          </div>
        ))}
    </div></div>
  );
}

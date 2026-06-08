"use client";
import React from "react";

export default function FunctionTemplatesLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Generic Logic</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#10b981" }}>Function</span> Templates</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Allows you to write a single function that can work with different data types, provided they support the operations used inside the function.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE GENERIC SWAP</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`template <typename T>\nvoid genericSwap(T &a, T &b) {\n    T temp = a;\n    a = b;\n    b = temp;\n}\n\nint x = 5, y = 10; genericSwap(x, y);\nstring s1 = "A", s2 = "B"; genericSwap(s1, s2);`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>TYPE INFERENCE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>The compiler can often deduce <code style={{color: "#3b82f6"}}>T</code> automatically from the arguments you pass.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>MULTI-TYPE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>You can use multiple template parameters: <code style={{color: "#8b5cf6"}}>template &lt;typename T, typename U&gt;</code>.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Explicit Instantiation</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>If the compiler can't deduce the type, you can specify it manually:</p>
        <code style={{ fontSize: 12, color: "#fb923c", display: "block", marginTop: 8 }}>genericSwap&lt;int&gt;(x, y);</code>
 
    </div></div>
  );
}

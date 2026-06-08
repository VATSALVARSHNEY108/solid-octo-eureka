"use client";
import React from "react";

export default function FunctionCallingLesson() {
  const methods = [
    { name: "Pass by Value", desc: "Passes a COPY of the actual value. Changes inside don't affect original.", code: "void func(int x)", color: "#10b981" },
    { name: "Pass by Reference", desc: "Passes an ALIAS to the original variable. Changes DO affect original.", code: "void func(int &x)", color: "#3b82f6" },
    { name: "Pass by Pointer", desc: "Passes the ADDRESS of the variable. Changes DO affect original.", code: "void func(int *x)", color: "#8b5cf6" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Execution</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Function <span style={{ color: "#10b981" }}>Calling</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>C++ provides multiple ways to pass data to functions. Choosing the right method is critical for performance and correctness.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {methods.map((m, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: m.color }}>{m.name}</span>
              <code style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--accent-soft)", padding: "2px 8px", borderRadius: 4 }}>{m.code}</code>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{m.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>PERFORMANCE TIP</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Always pass large objects (like <code style={{color: "#3b82f6"}}>std::vector</code> or <code style={{color: "#3b82f6"}}>std::string</code>) by <code style={{color: "#10b981"}}>const reference</code> to avoid expensive copies.</p>
        <code style={{ fontSize: 12, color: "#fb923c", display: "block", marginTop: 8 }}>void process(const vector&lt;int&gt;&amp; vec);</code>
 
    </div></div>
  );
}

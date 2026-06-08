"use client";
import React from "react";

export default function ReferenceVariablesLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Alias Binding</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#10b981" }}>Reference</span> Variables</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A reference variable is just another name for an already existing variable. Any operation performed on the reference is actually performed on the original variable.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>RULES OF ENGAGEMENT</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
          <li>Must be initialized when declared</li>
          <li>Cannot be null</li>
          <li>Cannot be changed to refer to another variable later</li>
          <li>Shares the same memory address as the original</li>
        </ul>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Memory Address Test</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{`int a = 100;\nint &b = a;\n\ncout << &a << endl; // 0x7ffd...\ncout << &b << endl; // 0x7ffd... (SAME!)`}</pre>
 
    </div></div>
  );
}

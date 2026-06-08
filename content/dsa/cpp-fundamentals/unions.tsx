"use client";
import React from "react";

export default function UnionsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Memory Overlay</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#f97316" }}>Unions</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A <code style={{color: "#f97316"}}>union</code> is a special data type where all members share the SAME memory location. It can hold only one of its members at a time.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>DEFINITION</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`union Data {\n    int i;\n    float f;\n    char str[20];\n};\n\nData d;\nd.i = 10; // Memory now holds an int`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>ONE AT A TIME</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Setting a new member overwrites the previous one. Accessing a member that wasn't set last results in undefined data.</p>
        </div>
        <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>SIZE EFFICIENCY</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>The size of a union is the size of its LARGEST member. Ideal for memory-constrained systems.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Use Case: Variants</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Modern C++ usually prefers <code style={{color: "#f97316"}}>std::variant</code> over unions as it's type-safe and "knows" which member is currently active.</p>
 
    </div></div>
  );
}

"use client";
import React from "react";

export default function OperatorOverloadingLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Custom Logic</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#8b5cf6" }}>Operator</span> Overloading</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Allows you to redefine how standard operators (like <code style={{color: "#8b5cf6"}}>+</code>, <code style={{color: "#8b5cf6"}}>-</code>, <code style={{color: "#8b5cf6"}}>&lt;&lt;</code>) work with your custom classes.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>SYNTAX</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class Complex {\npublic:\n    double r, i;\n    Complex operator + (const Complex &obj) {\n        return {r + obj.r, i + obj.i};\n    }\n};\n\nComplex c3 = c1 + c2; // Calls the + operator`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>INTUITIVE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Makes user-defined types behave like built-in primitive types.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>RESTRICTIONS</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>You cannot create NEW operators or change the precedence of existing ones.</p>
        </div>
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>MOST OVERLOADED</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>The assignment operator <code style={{color: "#8b5cf6"}}>=</code>, relational operators <code style={{color: "#8b5cf6"}}>&lt;, ==</code>, and stream operators <code style={{color: "#8b5cf6"}}>&lt;&lt;, &gt;&gt;</code> are the most commonly overloaded.</p>
 
    </div></div>
  );
}

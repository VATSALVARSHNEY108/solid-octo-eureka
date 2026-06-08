"use client";
import React from "react";

export default function FunctionDeclarationDefinitionLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Structure</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Declaration vs <span style={{ color: "#f97316" }}>Definition</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>In C++, a function must be known to the compiler before it's called. This is handled by splitting it into declaration (prototype) and definition.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>DECLARATION (PROTOTYPE)</div>
          <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6, display: "inline-block", marginBottom: 8 }}>int add(int a, int b);</code>
          <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Tells the compiler about the function name, return type, and parameters. Usually goes above <code style={{color: "#8b5cf6"}}>main()</code> or in a header file.</p>
        </div>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>DEFINITION (BODY)</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{"int add(int a, int b) {\n    return a + b;\n}"}</pre>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>The actual implementation of the function logic.</p>
        </div>
      </div>

      <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 }}>WHY DECLARE?</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Declarations allow functions to be defined in any order and enable cross-file function calls. It's the "contract" the compiler uses to verify function calls.</p>
 
    </div></div>
  );
}

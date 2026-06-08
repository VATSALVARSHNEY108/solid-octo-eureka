"use client";
import React from "react";

export default function GettingStartedLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>First Steps</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Getting <span style={{ color: "#10b981" }}>Started</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Before we write code, we need to understand the tools and environment required to run C++ programs.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE TOOLKIT</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li><b style={{color: "var(--text-primary)"}}>Compiler:</b> (GCC, Clang, or MSVC) Translates code to binary.</li>
          <li><b style={{color: "var(--text-primary)"}}>IDE / Text Editor:</b> (VS Code, CLion, Visual Studio) Where you write code.</li>
          <li><b style={{color: "var(--text-primary)"}}>Terminal:</b> Where you compile and execute your programs.</li>
        </ul>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>UP NEXT</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>In the next lesson, we'll walk through setting up your local environment so you can start writing your first program.</p>
 
    </div></div>
  );
}

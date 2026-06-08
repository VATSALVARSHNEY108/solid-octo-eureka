"use client";
import React from "react";

export default function HeaderGuardsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Safe Includes</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#8b5cf6" }}>Header</span> Guards</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Prevents a header file from being included multiple times in the same translation unit, which would otherwise cause "redefinition" errors.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>TRADITIONAL METHOD</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 14, fontFamily: "monospace", lineHeight: 1.8 }}>{`#ifndef MY_HEADER_H\n#define MY_HEADER_H\n\n// Header content here\n\n#endif`}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>MODERN METHOD</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 14, fontFamily: "monospace", lineHeight: 1.8 }}>{`#pragma once`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>Non-standard but supported by almost all modern compilers. Much cleaner and less error-prone.</p>
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>WHY DO WE NEED THIS?</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>If File A and File B both include <code style={{color: "#8b5cf6"}}>utils.h</code>, and then File C includes both A and B, without header guards, <code style={{color: "#8b5cf6"}}>utils.h</code> would be included twice in C, leading to errors.</p>
 
    </div></div>
  );
}

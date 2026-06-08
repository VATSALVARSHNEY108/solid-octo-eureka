"use client";
import React from "react";

export default function MultidimensionalArraysLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>N-Dimensions</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#8b5cf6" }}>Multidimensional</span> Arrays</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>C++ allows arrays with any number of dimensions. A 3D array can be thought of as a volume or a collection of grids.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>3D ARRAY (CUBE)</div>
        <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6, display: "inline-block", marginBottom: 12 }}>int cube[3][3][3]; // 27 total elements</code>
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Think of it as 3 separate 2D grids (slices), each 3x3 in size.</p>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Initialization (3D)</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 12, fontFamily: "monospace", lineHeight: 1.5 }}>{`int arr[2][2][2] = {\n  { {1, 2}, {3, 4} }, // Layer 0\n  { {5, 6}, {7, 8} }  // Layer 1\n};`}</pre>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>MEMORY LIMITS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>N-dimensional arrays consume memory exponentially. <code style={{color: "#8b5cf6"}}>arr[100][100][100]</code> is 1 million integers (≈4MB). Watch out for large dimensions in stack-allocated arrays.</p>
 
    </div></div>
  );
}

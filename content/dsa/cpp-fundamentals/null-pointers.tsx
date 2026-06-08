"use client";
import React from "react";

export default function NullPointersLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Safety First</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ef4444" }}>Null</span> Pointers</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A null pointer is a pointer that doesn't point to any valid memory location. It represents the "empty" or "not set" state.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>MODERN C++ (C++11+)</div>
        <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6, display: "inline-block", marginBottom: 8 }}>int* ptr = nullptr;</code>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Always use <code style={{color: "#ef4444"}}>nullptr</code> instead of <code style={{color: "var(--text-muted)"}}>NULL</code> or <code style={{color: "var(--text-muted)"}}>0</code>. It is type-safe and prevents ambiguity with integer types.</p>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>The Null Check</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.7 }}>{"if (ptr != nullptr) {\n    cout << *ptr; // Safe to dereference\n} else {\n    cout << \"Pointer is empty\";\n}"}</pre>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>SEGMENTATION FAULT</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Dereferencing a null pointer (<code style={{color: "#ef4444"}}>*ptr</code> when ptr is null) will cause your program to crash immediately. This is the most common cause of "Segmentation Fault".</p>
 
    </div></div>
  );
}

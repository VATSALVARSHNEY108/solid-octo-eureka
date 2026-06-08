"use client";
import React from "react";

export default function ThisPointerLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Self Reference</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>The <span style={{ color: "#10b981" }}>this</span> Pointer</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Every object in C++ has access to its own address through a special pointer called <code style={{color: "#10b981"}}>this</code>. It's an implicit parameter to all non-static member functions.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>COMMON USAGES</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class Employee {\n    int id;\npublic:\n    void setId(int id) {\n        this->id = id; // Resolves naming conflict\n    }\n    Employee* getSelf() {\n        return this;   // Returns current object address\n    }\n};`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>NAME RESOLUTION</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Distinguishes between member variables and local parameters with the same name.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>CHAINING</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Allows method chaining by returning <code style={{color: "#8b5cf6"}}>*this</code> from member functions.</p>
        </div>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>STATIC LIMITATION</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}><code style={{color: "#ef4444"}}>static</code> member functions do NOT have a <code style={{color: "#ef4444"}}>this</code> pointer because they are not associated with any specific object.</p>
 
    </div></div>
  );
}

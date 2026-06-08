"use client";
import React from "react";

export default function PointersLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Memory Control</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#10b981" }}>Pointers</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Pointers are variables that store the MEMORY ADDRESS of another variable. They give you direct control over hardware and are the foundation of dynamic data structures.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE CORE CONCEPT</div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>Variable: x</div>
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", padding: "54px", borderRadius: 8, textAlign: "center", color: "#10b981" }}>Value: 10</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Addr: 0x7ffd</div>
          </div>
          <span style={{ fontSize: 24, color: "var(--text-muted)" }}>←</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#3b82f6", marginBottom: 4 }}>Pointer: ptr</div>
            <div style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", padding: "54px", borderRadius: 8, textAlign: "center", color: "#3b82f6" }}>Value: 0x7ffd</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>Addr: 0x7ffe</div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>WHY USE POINTERS?</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
          <li>Dynamic memory allocation (new/delete)</li>
          <li>Building Linked Lists, Trees, and Graphs</li>
          <li>Efficiently passing large objects to functions</li>
          <li>Accessing hardware resources directly</li>
        </ul>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>POWER & DANGER</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>"With great power comes great responsibility." Incorrect pointer usage causes memory leaks, segmentation faults, and security vulnerabilities.</p>
 
    </div></div>
  );
}

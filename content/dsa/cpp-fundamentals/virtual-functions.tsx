"use client";
import React from "react";

export default function VirtualFunctionsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Late Binding</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#8b5cf6" }}>Virtual</span> Functions</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Virtual functions ensure that the correct function is called for an object, regardless of the type of reference (or pointer) used for function call.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE POWER OF VIRTUAL</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`Parent* p = new Child();\np->show(); \n// If show() is virtual, Child's version runs.\n// If NOT virtual, Parent's version runs.`}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>PURE VIRTUAL FUNCTIONS</div>
        <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(239,68,68,0.08)", padding: "4px 12px", borderRadius: 6, display: "inline-block", marginBottom: 8 }}>virtual void draw() = 0;</code>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Makes a class "Abstract". You cannot create objects of an abstract class. It forces derived classes to implement the function.</p>
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>VTABLE & VPP</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Under the hood, C++ uses a Virtual Table (vtable) and a Virtual Pointer (vptr) to perform runtime dispatching. This adds a tiny overhead to function calls.</p>
 
    </div></div>
  );
}

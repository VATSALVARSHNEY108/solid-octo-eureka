"use client";
import React from "react";

export default function SmartPointersLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Automatic Memory</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#10b981" }}>Smart</span> Pointers</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Modern C++ (C++11+) wrappers around raw pointers that automatically manage memory. They call <code style={{color: "#10b981"}}>delete</code> for you when the pointer is no longer needed.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { name: "unique_ptr", desc: "Exclusive ownership. Cannot be copied, only moved.", color: "#ef4444" },
          { name: "shared_ptr", desc: "Shared ownership. Uses reference counting.", color: "#3b82f6" },
          { name: "weak_ptr", desc: "Points to shared_ptr but doesn't increase ref count.", color: "#f97316" },
        ].map((p, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: p.color, display: "block", marginBottom: 4 }}>{p.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE MODERN WAY</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`#include <memory>\n\nauto ptr = make_unique<MyClass>();\n// Memory freed automatically when ptr goes out of scope!`}</pre>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>RULE OF THUMB</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>In modern C++, you should ALMOST NEVER use raw <code style={{color: "#10b981"}}>new</code> and <code style={{color: "#ef4444"}}>delete</code>. Smart pointers eliminate whole categories of memory leaks and bugs.</p>
 
    </div></div>
  );
}

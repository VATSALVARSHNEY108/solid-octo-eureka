"use client";
import React from "react";

export default function STLSetLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Unique Elements</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#10b981" }}>Set</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A container that stores UNIQUE elements in a specific SORTED order. It's typically implemented as a Red-Black Tree.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>CORE METHODS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li><code style={{color: "#10b981"}}>insert(val)</code>: Adds unique element in O(log N).</li>
          <li><code style={{color: "#10b981"}}>erase(val)</code>: Removes element in O(log N).</li>
          <li><code style={{color: "#10b981"}}>find(val)</code>: Returns iterator to element, or <code style={{color: "#10b981"}}>end()</code>.</li>
          <li><code style={{color: "#10b981"}}>count(val)</code>: Returns 1 if present, 0 if not.</li>
        </ul>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 6 }}>ORDERED SET</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}><code style={{color: "#f97316"}}>std::set</code> is sorted. O(log N) for most operations.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>UNORDERED SET</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}><code style={{color: "#3b82f6"}}>std::unordered_set</code> uses hashing. O(1) average time.</p>
        </div>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>AUTOMATIC SORTING</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>If you insert 30, 10, 20 into a set, it will automatically store them as 10, 20, 30. This makes it ideal for finding distinct values in sorted order.</p>
 
    </div></div>
  );
}

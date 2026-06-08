"use client";
import React from "react";

export default function STLDequeLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Double Ended</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#10b981" }}>Deque</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Short for "Double-Ended Queue", <code style={{color: "#10b981"}}>std::deque</code> allows efficient insertion and deletion at BOTH the beginning and the end.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>CORE METHODS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
          <li><code style={{color: "#10b981"}}>push_front()</code> / <code style={{color: "#10b981"}}>push_back()</code></li>
          <li><code style={{color: "#10b981"}}>pop_front()</code> / <code style={{color: "#10b981"}}>pop_back()</code></li>
          <li><code style={{color: "#10b981"}}>at(i)</code> or <code style={{color: "#10b981"}}>[i]</code>: Random access.</li>
        </ul>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>RANDOM ACCESS</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Unlike <code style={{color: "#3b82f6"}}>std::list</code>, deque supports constant time random access to elements.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>FLEXIBILITY</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>It acts as a hybrid between a vector and a list.</p>
        </div>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>IMPLEMENTATION NOTE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Internally, a deque is usually a set of fixed-size chunks of contiguous memory. It's more complex than a vector but avoids the heavy reallocation costs for front-insertions.</p>
 
    </div></div>
  );
}

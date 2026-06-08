"use client";
import React from "react";

export default function PairsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Tuple of Two</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#8b5cf6" }}>Pair</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A simple container that holds two values of possibly different types. It's often used to return two values from a function or to store key-value associations.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>USAGE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`#include <utility>\npair<string, int> p = {"Alice", 20};\n\ncout << p.first;  // "Alice"\ncout << p.second; // 20\n\nauto p2 = make_pair(10, 3.14);`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>NESTING</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>You can nest pairs to store 3 or more values: <code style={{color: "#3b82f6"}}>pair&lt;int, pair&lt;int, int&gt;&gt;</code>.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>COMPARISON</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Pairs support relational operators (<code style={{color: "#10b981"}}>&lt;</code>, <code style={{color: "#10b981"}}>&gt;</code>, etc.). They compare the <code style={{color: "#10b981"}}>first</code> element, then the <code style={{color: "#10b981"}}>second</code>.</p>
        </div>
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>DSA USE CASE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Excellent for storing coordinates <code style={{color: "#8b5cf6"}}>(x, y)</code>, graph edges <code style={{color: "#8b5cf6"}}>(weight, node)</code>, or entries in a map.</p>
 
    </div></div>
  );
}

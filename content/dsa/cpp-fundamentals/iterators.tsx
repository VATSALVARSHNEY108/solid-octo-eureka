"use client";
import React from "react";

export default function IteratorsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Navigation</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#f97316" }}>Iterators</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Iterators are objects that point to elements in a container. They provide a uniform way to traverse different STL containers (vector, list, set, etc.).</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE POINTER ANALOGY</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Iterators behave just like pointers. You can increment them (<code style={{color: "#f97316"}}>it++</code>) and dereference them (<code style={{color: "#f97316"}}>*it</code>).</p>
        <pre style={{ margin: "12px 0 0 0", color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`vector<int> v = {10, 20, 30};\nvector<int>::iterator it = v.begin();\n\ncout << *it;    // 10\nit++;           // Points to 20\ncout << *it;    // 20`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>begin()</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Returns an iterator pointing to the FIRST element.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>end()</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Returns an iterator pointing to the position AFTER the last element.</p>
        </div>
      </div>

      <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 }}>AUTO KEYWORD</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Iterators often have complex type names. In modern C++, always use <code style={{color: "#f97316"}}>auto</code> to simplify your loops.</p>
        <code style={{ fontSize: 12, color: "#fb923c", display: "block", marginTop: 8 }}>for (auto it = v.begin(); it != v.end(); it++) {' { ... } '}</code>
 
    </div></div>
  );
}

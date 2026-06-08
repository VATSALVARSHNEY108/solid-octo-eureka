"use client";
import React from "react";

export default function VectorsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Dynamic Array</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>STL <span style={{ color: "#3b82f6" }}>Vector</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A <code style={{color: "#3b82f6"}}>std::vector</code> is a dynamic array that can grow and shrink in size automatically. It's the most used container in modern C++.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>BASIC USAGE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`#include <vector>\nvector<int> v = {1, 2, 3};\n\nv.push_back(4); // Adds 4 to end\nv.pop_back();  // Removes last element\n\ncout << v.size(); // 3\ncout << v[0];     // Access like array`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>CONTIGUOUS</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Elements are stored in contiguous memory, ensuring O(1) random access.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>AMORTIZED O(1)</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Inserting at the end (<code style={{color: "#8b5cf6"}}>push_back</code>) is very efficient on average.</p>
        </div>
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>CAPACITY VS SIZE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}><b style={{color: "var(--text-primary)"}}>Size</b> is the current number of elements. <b style={{color: "var(--text-primary)"}}>Capacity</b> is the total space allocated. Vectors often allocate more memory than they need to avoid constant reallocations.</p>
 
    </div></div>
  );
}

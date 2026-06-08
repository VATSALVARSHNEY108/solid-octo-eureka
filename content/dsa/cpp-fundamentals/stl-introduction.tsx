"use client";
import React from "react";

export default function STLIntroductionLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Efficiency</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Intro to <span style={{ color: "#10b981" }}>STL</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The Standard Template Library (STL) is a powerful set of C++ template classes that provide common data structures and algorithms.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { name: "Containers", desc: "Data structures for storing objects (vector, list, stack, map).", color: "#3b82f6" },
          { name: "Algorithms", desc: "Functions for processing data (sort, search, reverse).", color: "#8b5cf6" },
          { name: "Iterators", desc: "Objects that point to elements within containers.", color: "#f97316" },
          { name: "Functors", desc: "Objects that can be called like functions.", color: "#ec4899" },
        ].map((c, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: c.color, marginBottom: 4, fontFamily: "'Syne', sans-serif", textTransform: "uppercase" }}>{c.name}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>WHY USE STL?</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Don't reinvent the wheel! STL components are highly optimized, bug-free, and follow industry standards. They are essential for competitive programming and production systems.</p>
 
    </div></div>
  );
}

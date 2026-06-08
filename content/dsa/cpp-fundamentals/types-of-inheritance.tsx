"use client";
import React from "react";

export default function TypesOfInheritanceLesson() {
  const types = [
    { name: "Single", desc: "One child from one parent.", color: "#10b981" },
    { name: "Multiple", desc: "One child from multiple parents.", color: "#3b82f6" },
    { name: "Multilevel", desc: "Parent → Child → Grandchild.", color: "#8b5cf6" },
    { name: "Hierarchical", desc: "One parent → Multiple children.", color: "#f97316" },
    { name: "Hybrid", desc: "Combination of two or more types.", color: "#ec4899" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Hierarchies</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Types of <span style={{ color: "#8b5cf6" }}>Inheritance</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>C++ supports five main types of inheritance to build complex relationship models between classes.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {types.map((t, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }}></div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: t.color }}>{t.name}</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>{t.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>THE DIAMOND PROBLEM</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Occurs in Multiple/Hybrid inheritance when a child inherits from two parents who share a common grandparent. C++ solves this using <code style={{color: "#ef4444"}}>virtual inheritance</code>.</p>
 
    </div></div>
  );
}

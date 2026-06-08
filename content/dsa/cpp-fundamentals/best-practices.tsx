"use client";
import React from "react";

export default function BestPracticesLesson() {
  const practices = [
    { title: "Use Descriptive Names", desc: "Prefer 'studentCount' over 'sc' or 'n'.", color: "#10b981" },
    { title: "Prefer references", desc: "Pass large objects by const reference to avoid copies.", color: "#3b82f6" },
    { title: "RAII Pattern", desc: "Manage resources (memory, files) using objects (Smart Pointers).", color: "#8b5cf6" },
    { title: "Avoid Global Variables", desc: "Keep state local to classes and functions.", color: "#ef4444" },
    { title: "Modern C++ features", desc: "Use auto, nullptr, and range-based for loops.", color: "#f97316" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Professional Standards</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#10b981" }}>Best Practices</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Writing code that works is only the first step. Writing clean, maintainable, and efficient C++ is the hallmark of a professional developer.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
        {practices.map((p, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: p.color, marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>{p.title}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>CONSISTENCY IS KEY</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Whether you use camelCase or snake_case, be consistent throughout your project. Follow established style guides like Google's C++ Style Guide or the C++ Core Guidelines.</p>
 
    </div></div>
  );
}

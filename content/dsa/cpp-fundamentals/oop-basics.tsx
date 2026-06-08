"use client";
import React from "react";

export default function OOPBasicsLesson() {
  const pillars = [
    { name: "Encapsulation", desc: "Grouping data and methods together, hiding internal state.", color: "#3b82f6" },
    { name: "Abstraction", desc: "Hiding complexity and showing only essential features.", color: "#10b981" },
    { name: "Inheritance", desc: "Deriving new classes from existing ones to reuse code.", color: "#f97316" },
    { name: "Polymorphism", desc: "Objects of different types responding to the same interface.", color: "#8b5cf6" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Paradigm</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>OOP <span style={{ color: "#3b82f6" }}>Basics</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Object-Oriented Programming (OOP) is a paradigm based on the concept of "objects" which contain data and code.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 24 }}>
        {pillars.map((p, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: p.color, marginBottom: 4, fontFamily: "'Syne', sans-serif", textTransform: "uppercase" }}>{p.name}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Class vs Object</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1, background: "var(--accent-soft)", padding: "54px", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#8b5cf6", marginBottom: 2 }}>CLASS</div>
            <div style={{ fontSize: 13 }}>The Blueprint</div>
          </div>
          <span style={{ color: "var(--text-muted)" }}>→</span>
          <div style={{ flex: 1, background: "var(--accent-soft)", padding: "54px", borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: "#10b981", marginBottom: 2 }}>OBJECT</div>
            <div style={{ fontSize: 13 }}>The Real Instance
    </div></div></div></div></div>
  );
}

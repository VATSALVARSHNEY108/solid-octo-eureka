"use client";
import React from "react";

export default function AccessSpecifiersLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Encapsulation</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ef4444" }}>Access</span> Specifiers</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Keywords that define the visibility of class members. They are the primary tool for implementing encapsulation.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { name: "public", desc: "Accessible from anywhere outside the class.", color: "#10b981" },
          { name: "private", desc: "Accessible only from within the class. Default for classes.", color: "#ef4444" },
          { name: "protected", desc: "Accessible in the class and its inherited subclasses.", color: "#f97316" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
            <code style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: s.color, display: "block", marginBottom: 4 }}>{s.name}</code>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>CLASS VS STRUCT</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>In a <code style={{color: "#8b5cf6"}}>class</code>, the default access is <code style={{color: "#ef4444"}}>private</code>. In a <code style={{color: "#8b5cf6"}}>struct</code>, the default access is <code style={{color: "#10b981"}}>public</code>.</p>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>DATA HIDING</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Best practice: Keep data members <code style={{color: "#ef4444"}}>private</code> and provide <code style={{color: "#10b981"}}>public</code> getter/setter functions to control how data is accessed and modified.</p>
 
    </div></div>
  );
}

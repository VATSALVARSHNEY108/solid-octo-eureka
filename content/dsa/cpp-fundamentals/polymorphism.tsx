"use client";
import React from "react";

export default function PolymorphismLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Many Forms</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#10b981" }}>Polymorphism</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The ability of a single interface to handle different underlying data types. In C++, it comes in two main flavors: Compile-time and Runtime.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>COMPILE-TIME (STATIC)</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12 }}>Resolved during compilation. Faster performance.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "2px 8px", borderRadius: 4 }}>Function Overloading</span>
            <span style={{ fontSize: 10, background: "rgba(59,130,246,0.1)", color: "#3b82f6", padding: "2px 8px", borderRadius: 4 }}>Operator Overloading</span>
          </div>
        </div>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>RUNTIME (DYNAMIC)</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12 }}>Resolved during execution. More flexible design.</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "2px 8px", borderRadius: 4 }}>Function Overriding</span>
            <span style={{ fontSize: 10, background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "2px 8px", borderRadius: 4 }}>Virtual Functions</span>
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>WHY POLYMORPHISM?</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>It allows you to write generic code that can work with any class in a hierarchy. For example, a <code style={{color: "#10b981"}}>Shape*</code> array can store Circles, Squares, and Triangles, and calling <code style={{color: "#10b981"}}>draw()</code> will execute the correct method for each.</p>
 
    </div></div>
  );
}

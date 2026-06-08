"use client";
import React from "react";

export default function FunctionOverridingLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Runtime Polymorphism</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Function <span style={{ color: "#3b82f6" }}>Overriding</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Occurs when a derived class provides a specific implementation for a function that is already defined in its base class.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE OVERRIDE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class Parent {\npublic:\n    virtual void show() { cout << "Parent"; }\n};\n\nclass Child : public Parent {\npublic:\n    void show() override { cout << "Child"; } // Override\n};`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>VIRTUAL KEYWORD</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>The base class function MUST be marked <code style={{color: "#10b981"}}>virtual</code> to enable overriding.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>OVERRIDE SPECIFIER</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Using <code style={{color: "#3b82f6"}}>override</code> (C++11) is optional but helps the compiler catch errors.</p>
        </div>
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>RECALLING BASE METHOD</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Inside the overridden function, you can still call the base class version using the scope resolution operator: <code style={{color: "#3b82f6"}}>Parent::show();</code></p>
 
    </div></div>
  );
}

"use client";
import React from "react";

export default function EncapsulationLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Data Hiding</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#10b981" }}>Encapsulation</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>The process of bundling data and the functions that operate on that data into a single unit (a class). It protects data from unauthorized access.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE PATTERN</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class BankAccount {\nprivate:\n    double balance; // Hidden data\n\npublic:\n    void deposit(double amt) {\n        if (amt > 0) balance += amt;\n    }\n    double getBalance() { return balance; }\n};`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>PROTECTION</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Prevents accidental modification of internal state by external code.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>CONTROL</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>You can add validation logic inside setter functions to ensure data integrity.</p>
        </div>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>BLACK BOX ANALOGY</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>An object is like a black box. Users know WHAT it does (through its public interface) but not HOW it does it (the private implementation).</p>
 
    </div></div>
  );
}

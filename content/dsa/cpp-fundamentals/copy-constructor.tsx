"use client";
import React from "react";

export default function CopyConstructorLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Cloning</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#3b82f6" }}>Copy</span> Constructor</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A constructor that initializes a new object using an existing object of the same class. Crucial for handling objects that manage dynamic memory.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>SYNTAX</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 14, fontFamily: "monospace", lineHeight: 1.8 }}>{`class MyClass {\npublic:\n    MyClass(const MyClass &source) {\n        // Copy members from source\n    }\n};`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>Must take the source object by <code style={{color: "#3b82f6"}}>const reference</code>.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>SHALLOW COPY</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Default behavior. Copies only the values of members. If a member is a pointer, both objects will point to the SAME memory.</p>
        </div>
        <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>DEEP COPY</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Custom behavior. Allocates NEW memory for the copy and clones the data. Required for pointer members.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>When is it called?</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
          <li><code style={{color: "#3b82f6"}}>MyClass obj2 = obj1;</code> (Initialization)</li>
          <li>Passing an object by value to a function</li>
          <li>Returning an object by value from a function</li>
        </ul>
 
    </div></div>
  );
}

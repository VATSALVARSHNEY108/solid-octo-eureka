"use client";
import React from "react";

export default function DestructorsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Cleanup</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ef4444" }}>Destructors</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A special member function that is automatically called when an object is destroyed. Its main job is to release resources (like heap memory) that the object acquired during its lifetime.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>SYNTAX</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 14, fontFamily: "monospace", lineHeight: 1.8 }}>{`class MyClass {\npublic:\n    ~MyClass() {\n        // Cleanup code here\n        cout << "Object destroyed";\n    }\n};`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>The tilde <code style={{color: "#ef4444"}}>~</code> symbol prefix indicates a destructor.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>NO ARGUMENTS</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>A destructor cannot take any arguments. You can only have ONE destructor per class.</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>NO RETURN TYPE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Like constructors, destructors have no return type.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>When is it called?</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
          <li>When a local object goes out of scope</li>
          <li>When <code style={{color: "#ef4444"}}>delete</code> is called on a pointer to an object</li>
          <li>When the program terminates (for global/static objects)</li>
        </ul>
 
    </div></div>
  );
}

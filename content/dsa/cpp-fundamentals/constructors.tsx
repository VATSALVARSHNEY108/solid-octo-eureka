"use client";
import React from "react";

export default function ConstructorsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Initialization</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#10b981" }}>Constructors</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A special member function that is automatically called when an object of a class is created. Its main job is to initialize the object's data members.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>TYPES OF CONSTRUCTORS</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7, paddingLeft: 20, margin: 0 }}>
          <li><b style={{color: "var(--text-primary)"}}>Default Constructor:</b> Takes no arguments.</li>
          <li><b style={{color: "var(--text-primary)"}}>Parameterized Constructor:</b> Takes arguments to initialize members with specific values.</li>
          <li><b style={{color: "var(--text-primary)"}}>Copy Constructor:</b> Creates a new object as a copy of an existing one.</li>
        </ul>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Code Example</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class Point {\npublic:\n    int x, y;\n    // Parameterized Constructor\n    Point(int x1, int y1) {\n        x = x1; y = y1;\n    }\n};\n\nPoint p(10, 20);`}</pre>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>IMPORTANT RULES</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Constructors have the SAME name as the class. They have NO return type (not even void). They are usually public.</p>
 
    </div></div>
  );
}

"use client";
import React from "react";

export default function StaticMembersLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Shared Data</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#3b82f6" }}>Static</span> Members</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Static members belong to the CLASS itself rather than any specific object. There is only one copy of a static member shared by all instances.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>STATIC VARIABLE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class User {\npublic:\n    static int count; // Shared by all Users\n    User() { count++; }\n};\n\nint User::count = 0; // Initialization (Outside Class)`}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>STATIC FUNCTION</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class Math {\npublic:\n    static int square(int x) { return x * x; }\n};\n\nint s = Math::square(5); // Call without object!`}</pre>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>Static functions can ONLY access static members of the class.</p>
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>KEY FEATURES</div>
        <ul style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
          <li>Allocated once when the program starts.</li>
          <li>Can be accessed using class name: <code style={{color: "#3b82f6"}}>ClassName::member</code>.</li>
          <li>Commonly used for constants and utility functions.</li>
        </ul>
 
    </div></div>
  );
}

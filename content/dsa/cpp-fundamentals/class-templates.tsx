"use client";
import React from "react";

export default function ClassTemplatesLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Generic Classes</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#3b82f6" }}>Class</span> Templates</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Enables a class to handle different data types. Most STL containers like <code style={{color: "#3b82f6"}}>vector</code> and <code style={{color: "#3b82f6"}}>stack</code> are implemented as class templates.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE GENERIC BOX</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`template <class T>\nclass Box {\n    T data;\npublic:\n    Box(T d) : data(d) {}\n    T getData() { return data; }\n};\n\nBox<int> intBox(10);\nBox<string> strBox("Hello");`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>TYPE SAFETY</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Ensures that you only perform valid operations for the specific type <code style={{color: "#10b981"}}>T</code>.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 6 }}>CODE REUSE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Write the data structure logic once; use it for any data type.</p>
        </div>
      </div>

      <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 8 }}>CLASS TEMPLATE SPECIALIZATION</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>You can define a special version of the template for a specific type (like <code style={{color: "#3b82f6"}}>bool</code>) to optimize its behavior.</p>
 
    </div></div>
  );
}

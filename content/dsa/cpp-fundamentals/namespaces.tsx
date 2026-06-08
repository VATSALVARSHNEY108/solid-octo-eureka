"use client";
import React from "react";

export default function NamespacesLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Organization</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>C++ <span style={{ color: "#f97316" }}>Namespaces</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Namespaces are used to group entities like classes, objects, and functions under a name. They prevent naming collisions between different libraries.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE std NAMESPACE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>All standard C++ features (cout, cin, vector, etc.) are inside the <code style={{color: "#f97316"}}>std</code> namespace.</p>
        <pre style={{ margin: "12px 0 0 0", color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`std::cout << "Hello"; // Full name\n\nusing namespace std; // Shortcut (Caution!)\ncout << "Hello";`}</pre>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>CUSTOM NAMESPACE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`namespace MyLib {\n    void log(string s) { ... }\n}\n\nMyLib::log("Test");`}</pre>
      </div>

      <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>BEST PRACTICE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Avoid <code style={{color: "#ef4444"}}>using namespace std;</code> in header files or large projects. It can lead to "Namespace Pollution" where names from different libraries clash.</p>
 
    </div></div>
  );
}

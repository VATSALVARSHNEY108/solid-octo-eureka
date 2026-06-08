"use client";
import React from "react";

export default function DefaultArgumentsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Flexibility</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#f97316" }}>Default</span> Arguments</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Allows calling a function with fewer arguments by providing predefined values for parameters if the caller omits them.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>EXAMPLE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`void greet(string name, string msg = "Hello") {
    cout << msg << ", " << name;
}

greet("Alice");          // Output: Hello, Alice
greet("Bob", "Welcome"); // Output: Welcome, Bob`}</pre>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>TRAILING RULE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Default parameters must always be at the END of the parameter list. You cannot have a non-default parameter after a default one.</p>
          <code style={{ fontSize: 11, color: "#fb923c", display: "block", marginTop: 4 }}>void error(int a = 1, int b); // ERROR!</code>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>REDUCING OVERLOADS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Default arguments can often replace the need for multiple overloaded functions, making the code more maintainable.</p>
 
    </div></div>
  );
}

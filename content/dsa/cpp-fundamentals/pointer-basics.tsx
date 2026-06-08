"use client";
import React from "react";

export default function PointerBasicsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>The Address Operator</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Pointer <span style={{ color: "#3b82f6" }}>Basics</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>To work with pointers, you need two special operators: the Address-of operator <code style={{color: "#3b82f6"}}>&amp;</code> and the Dereference operator <code style={{color: "#10b981"}}>*</code>.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>ADDRESS-OF (&)</div>
          <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6, display: "inline-block", marginBottom: 8 }}>int* ptr = &x;</code>
          <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Gets the memory address where variable <code style={{color: "var(--text-primary)"}}>x</code> is stored.</p>
        </div>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>DEREFERENCE (*)</div>
          <code style={{ fontSize: 13, color: "#fb923c", background: "rgba(249,115,22,0.08)", padding: "4px 12px", borderRadius: 6, display: "inline-block", marginBottom: 8 }}>int value = *ptr;</code>
          <p style={{ color: "var(--text-muted)", fontSize: 12 }}>Gets the value stored at the address pointed to by <code style={{color: "var(--text-primary)"}}>ptr</code>.</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Full Example</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`int x = 10;\nint* ptr = &x;     // ptr stores address of x\n\ncout << ptr;      // Output: 0x7ff... (Address)\ncout << *ptr;     // Output: 10 (Value at address)\n\n*ptr = 20;        // Changes x to 20 indirectly!`}</pre>
 
    </div></div>
  );
}

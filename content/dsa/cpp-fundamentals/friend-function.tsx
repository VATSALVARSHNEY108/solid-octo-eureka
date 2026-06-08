"use client";
import React from "react";

export default function FriendFunctionLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Special Access</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}><span style={{ color: "#ec4899" }}>Friend</span> Functions</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>A function that is NOT a member of a class but has permission to access the class's <code style={{color: "#ec4899"}}>private</code> and <code style={{color: "#ec4899"}}>protected</code> members.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#ec4899", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>DECLARATION</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`class Box {\n    int width;\npublic:\n    friend void printWidth(Box b); // Friend!\n};`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 6 }}>NOT A MEMBER</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>It's defined outside the class scope and doesn't have a <code style={{color: "#f97316"}}>this</code> pointer.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>ONE-WAY</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Friendship is granted, not taken. The class must explicitly declare its "friends".</p>
        </div>
      </div>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginBottom: 8 }}>Common Use Case: Operator Overloading</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Friend functions are frequently used for overloading the insertion <code style={{color: "#ec4899"}}>&lt;&lt;</code> and extraction <code style={{color: "#ec4899"}}>&gt;&gt;</code> operators for custom classes.</p>
 
    </div></div>
  );
}

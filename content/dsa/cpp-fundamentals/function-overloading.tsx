"use client";
import React from "react";

export default function FunctionOverloadingLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(139,92,246,0.1)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Polymorphism</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Function <span style={{ color: "#8b5cf6" }}>Overloading</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Allows multiple functions with the SAME NAME but DIFFERENT PARAMETERS. The compiler determines which one to call based on the arguments provided.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>OVERLOAD EXAMPLES</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`int add(int a, int b);       // Overload 1
double add(double a, double b); // Overload 2
int add(int a, int b, int c);   // Overload 3`}</pre>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>PARAMETER DIFFERENCE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Functions must differ in the number of parameters or their data types.</p>
        </div>
        <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginBottom: 6 }}>RETURN TYPE ALONE</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>Overloading based ONLY on return type is NOT allowed and will cause a compiler error.</p>
        </div>
      </div>

      <div style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700, marginBottom: 8 }}>STATIC POLYMORPHISM</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>This is a form of compile-time polymorphism. It makes the API cleaner as you don't need names like <code style={{color: "#8b5cf6"}}>addInts</code>, <code style={{color: "#8b5cf6"}}>addDoubles</code>, etc.</p>
 
    </div></div>
  );
}

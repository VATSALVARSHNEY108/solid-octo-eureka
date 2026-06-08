"use client";
import React from "react";

export default function PointersAndArraysLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Implicit Decay</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Pointers & <span style={{ color: "#f97316" }}>Arrays</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>In C++, the name of an array acts as a pointer to its first element. This close relationship is why pointer arithmetic works so well with arrays.</p>

      <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>THE EQUIVALENCE</div>
        <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace", lineHeight: 1.8 }}>{`int arr[5] = {10, 20, 30, 40, 50};\nint* ptr = arr; // ptr points to arr[0]\n\ncout << arr[0];   // 10\ncout << *arr;     // 10 (Implicitly a pointer!)\ncout << *(arr+1); // 20 (Same as arr[1])`}</pre>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, marginBottom: 6 }}>ARRAY NOTATION</div>
          <code style={{ fontSize: 12, color: "#3b82f6" }}>arr[i]</code>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 4 }}>The compiler actually translates this to pointer arithmetic under the hood.</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 6 }}>POINTER NOTATION</div>
          <code style={{ fontSize: 12, color: "#10b981" }}>*(arr + i)</code>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 4 }}>This is what happens internally: base address + offset.</p>
        </div>
      </div>

      <div style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#f97316", fontWeight: 700, marginBottom: 8 }}>ONE KEY DIFFERENCE</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>An array name is a CONSTANT pointer. You cannot change its address (<code style={{color: "#f97316"}}>arr++</code> is illegal). A regular pointer can be reassigned freely.</p>
 
    </div></div>
  );
}

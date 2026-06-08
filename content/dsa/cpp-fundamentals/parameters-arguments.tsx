"use client";
import React from "react";

export default function ParametersArgumentsLesson() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display: "inline-block", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Input Data</span>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em", marginBottom: 10 }}>Parameters & <span style={{ color: "#10b981" }}>Arguments</span></h2>
      <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>Parameters are variables defined in the function signature. Arguments are the actual values passed to those parameters when the function is called.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#8b5cf6", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>FORMAL PARAMETERS</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{"void greet(string name) { ... }"}</pre>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>Placeholders used in the function definition.</p>
        </div>

        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#10b981", fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 10 }}>ACTUAL ARGUMENTS</div>
          <pre style={{ margin: 0, color: "#fb923c", fontSize: 13, fontFamily: "monospace" }}>{"greet(\"Alice\");"}</pre>
          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>Real values or variables passed during the call.</p>
        </div>
      </div>

      <div style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)", borderRadius: 14, padding: "16px 20px" }}>
        <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700, marginBottom: 8 }}>MULTIPLE PARAMETERS</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>Separate multiple parameters with commas. The order and type of arguments must match the parameter list exactly.</p>
        <code style={{ fontSize: 12, color: "#fb923c", display: "block", marginTop: 8 }}>void sum(int x, int y, double z);</code>
 
    </div></div>
  );
}

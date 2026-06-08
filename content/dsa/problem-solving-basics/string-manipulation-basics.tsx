"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function StringManipulationBasics() {
  const basics = [
    "Strings are sequences of characters.",
    "In C++, strings are mutable; in Java/Python, they are immutable.",
    "Common ops: Concatenation, Substring, Comparison, Reverse.",
    "Always check for the null terminator `\\0` in C-style strings.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>String Manipulation</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        String problems are common in coding interviews. Manipulation involves handling character arrays, finding patterns, and transforming text.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px", fontFamily:"monospace" }}>
        <div style={{ color:"#8b5cf6", marginBottom:4 }}>"Hello" + " " + "World"</div>
        <div style={{ color:"#10b981", marginBottom:12 }}>= "Hello World"</div>
        <div style={{ color:"#f97316" }}>substring(0, 5) = "Hello"</div>
      </div>

      <MinimalSimulationStudio 
        title="String Manipulation Basics"
        code={["Handle character encoding/ASCII",
          "Traverse or reverse string data",
          "Perform pattern matching or splits",
          "Modify strings (replace, concat)",
          "Handle whitespace and case sensitivity",
          "Return modified string or result"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 String Efficiency</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          {basics.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
 
    </div></div>
  );
}

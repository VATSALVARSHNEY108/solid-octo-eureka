"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BinaryNumberBasics() {
  const table = [
    { dec: 0, bin: "0000" },
    { dec: 1, bin: "0001" },
    { dec: 2, bin: "0010" },
    { dec: 4, bin: "0100" },
    { dec: 8, bin: "1000" },
    { dec: 15, bin: "1111" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Binary Number Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Computers store everything in base-2 (binary). Understanding binary representation is crucial for bitwise operations and memory optimization.
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))", gap:10 }}>
        {table.map((row, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:"#3b82f6" }}>{row.dec}</div>
            <div style={{ fontSize:12, fontFamily:"monospace", color: "var(--text-muted)" }}>{row.bin}</div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Binary Number Basics"
        code={["Convert decimal to binary representation",
          "Perform bitwise operations (AND, OR, XOR)",
          "Apply bit-shifting logic",
          "Check parity or set-bit count",
          "Handle negative numbers (2's complement)",
          "Convert back or return bit property"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Binary Conversion</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          To convert decimal to binary, repeatedly divide by 2 and keep the remainders. To convert binary to decimal, sum the powers of 2 for every '1' bit.
        </p>
 
    </div></div>
  );
}

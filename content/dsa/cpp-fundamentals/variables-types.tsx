"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";
export default function VariablesTypesLesson() {
  const types = [
    { name: "int", size: "4 bytes", range: "−2.1B to 2.1B", example: "int age = 25;", color: "#f97316" },
    { name: "long long", size: "8 bytes", range: "−9.2 × 10¹Ã¢ÂÂ¸ to 9.2 × 10¹Ã¢ÂÂ¸", example: "long long big = 1e18;", color: "#3b82f6" },
    { name: "float", size: "4 bytes", range: "6–7 decimal digits", example: "float pi = 3.14f;", color: "#10b981" },
    { name: "double", size: "8 bytes", range: "15–16 decimal digits", example: "double e = 2.71828;", color: "#8b5cf6" },
    { name: "char", size: "1 byte", range: "−128 to 127 (ASCII)", example: "char grade = 'A';", color: "#f59e0b" },
    { name: "bool", size: "1 byte", range: "true or false", example: "bool flag = true;", color: "#ec4899" },
    { name: "string", size: "dynamic", range: "any text", example: 'string name = "THINK++";', color: "var(--accent-secondary)" },
  ];
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 REFERENCE</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Variables & Data Types</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        C++ is a statically typed language Ã¢â‚¬â€  every variable must be declared with a type. Choosing the right type avoids memory waste and overflow bugs.
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {types.map(t => (
          <div key={t.name} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            <div style={{ width:90, fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:15, color:t.color, flexShrink:0 }}>{t.name}</div>
            <div style={{ display:"flex", gap:24, flex:1, flexWrap:"wrap" }}>
              <span style={{ color: "var(--text-muted)", fontSize:13 }}>📦 <span style={{color: "var(--text-secondary)"}}>{t.size}</span></span>
              <span style={{ color: "var(--text-muted)", fontSize:13 }}>Ã°Å¸â€œÂ <span style={{color: "var(--text-secondary)"}}>{t.range}</span></span>
              <code style={{ color:"#fb923c", background:"rgba(249,115,22,0.08)", padding:"2px 8px", borderRadius:6, fontSize:12, fontFamily:"monospace" }}>{t.example}</code>
            </div>
          </div>
        ))}
      </div>
      <MinimalSimulationStudio />
      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡¡ DSA Pro Tips</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          <li>Use <code style={{color:"#fb923c"}}>long long</code> for problems involving large numbers (≥10Ã¢ÂÂ¹)</li>
          <li>Never use <code style={{color:"#fb923c"}}>float</code> for comparisons Ã¢â‚¬â€ precision errors are common</li>
          <li>Use <code style={{color:"#fb923c"}}>int</code> as default; switch to <code style={{color:"#fb923c"}}>long long</code> only when needed</li>
        </ul>
 
    </div></div>
  );
}


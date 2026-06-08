"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function InputOptimization() {
  const tips = [
    "Use Fast I/O: `ios_base::sync_with_stdio(false); cin.tie(NULL);`",
    "Prefer `\\n` over `endl`: `endl` flushes the buffer, which is slow.",
    "Use `scanf`/`printf` in C++ for very large inputs if `cin` is too slow.",
    "Read characters directly for custom fast parsing.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Input Optimization</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        In some problems, the input is so large (e.g., 10^6 integers) that standard `cin` can take more than a second just to read the data. Input optimization is essential.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"20px", fontFamily:"monospace" }}>
        <div style={{ color:"#8b5cf6", marginBottom:4 }}>ios_base::sync_with_stdio(false);</div>
        <div style={{ color:"#8b5cf6", marginBottom:4 }}>cin.tie(NULL);</div>
        <div style={{ color:"#10b981", marginTop:12 }}>// Use this at the start of main()</div>
      </div>

      <MinimalSimulationStudio 
        title="Input Optimization"
        code={["Use fast scan/read methods",
          "Avoid unnecessary memory allocations",
          "Optimize data reading loop",
          "Check for large input bottlenecks",
          "Use buffered input streams",
          "Minimize overhead in pre-processing"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Why is cin slow?</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          By default, `cin` is synchronized with C's `stdio` library, which ensures you can mix `cin` and `scanf` safely. Turning off this synchronization makes `cin` much faster.
        </p>
 
    </div></div>
  );
}

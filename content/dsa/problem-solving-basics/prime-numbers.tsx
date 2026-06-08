"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function PrimeNumbers() {
  const methods = [
    { name: "Trial Division", complexity: "O(√N)", desc: "Check divisors from 2 up to √N." },
    { name: "Sieve of Eratosthenes", complexity: "O(N log log N)", desc: "Find all primes up to N efficiently." },
    { name: "Segmented Sieve", complexity: "O(√N + (R-L))", desc: "Find primes in a range [L, R]." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Prime Numbers</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself. They are the building blocks of number theory.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {methods.map((m, i) => (
          <div key={i} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:100, fontWeight:800, fontSize:14, color:"#10b981" }}>{m.name}</div>
            <div style={{ flex:1 }}>
              <div style={{ color: "var(--text-primary)", fontWeight:600, fontSize:13 }}>{m.complexity}</div>
              <div style={{ color: "var(--text-muted)", fontSize:12 }}>{m.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <MinimalSimulationStudio 
        title="Prime Numbers"
        code={["Check primality using sqrt(N)",
          "Apply Sieve of Eratosthenes",
          "Perform Prime Factorization",
          "Count primes in a range",
          "Apply Goldbach or prime properties",
          "Generate prime sequences"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 Prime Facts</div>
        <ul style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.9, paddingLeft:20 }}>
          <li>2 is the only even prime number</li>
          <li>Every prime number {'>'} 3 can be written in the form 6k ± 1</li>
          <li>There are infinitely many prime numbers</li>
        </ul>
 
    </div></div>
  );
}

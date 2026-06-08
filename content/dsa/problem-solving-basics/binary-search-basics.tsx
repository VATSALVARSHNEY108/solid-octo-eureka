"use client";
import MinimalSimulationStudio from "@/components/MinimalSimulationStudio";

export default function BinarySearchBasics() {
  const steps = [
    "Initialize `low = 0` and `high = n - 1`.",
    "Calculate `mid = low + (high - low) / 2`.",
    "If `A[mid] == target`, return `mid`.",
    "If `A[mid] < target`, set `low = mid + 1`.",
    "If `A[mid] > target`, set `high = mid - 1`.",
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", padding: "54px" }}>
      <span style={{ display:"inline-block", background:"rgba(139,92,246,0.1)", color:"#8b5cf6", border:"1px solid rgba(139,92,246,0.2)", padding:"4px 12px", borderRadius:100, fontSize:11, fontFamily:"'Syne', sans-serif", fontWeight:700, letterSpacing:"0.08em", marginBottom:16 }}>📖 LESSON</span>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.03em", marginBottom:10 }}>Binary Search Basics</h2>
      <p style={{ color: "var(--text-secondary)", lineHeight:1.7, fontSize:15, maxWidth:560, marginBottom:32 }}>
        Binary Search is a highly efficient algorithm for finding an item from a sorted list of items. It works by repeatedly halving the search interval.
      </p>

      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius:16, padding:"24px", textAlign:"center" }}>
        <div style={{ fontSize:32, fontWeight:800, color:"#8b5cf6", marginBottom:8 }}>O(log N)</div>
        <div style={{ color: "var(--text-secondary)", fontSize:14 }}>Binary search can find an element among 1 million items in just 20 steps.</div>
      </div>

      <MinimalSimulationStudio 
        title="Binary Search Basics"
        code={["Define search space [low, high]",
          "Calculate mid-point safely",
          "Compare mid with target value",
          "If match: return mid index",
          "If target < mid: reduce high to mid-1",
          "If target > mid: increase low to mid+1",
          "Repeat until space is empty"
        ]}
      />

      <div style={{ marginTop:28, background:"rgba(249,115,22,0.05)", border:"1px solid rgba(249,115,22,0.12)", borderRadius:12, padding:"18px 22px" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:700, fontSize:13, color:"#f97316", marginBottom:10 }}>💡 The 'mid' Overflow Bug</div>
        <p style={{ color: "var(--text-secondary)", fontSize:14, lineHeight:1.6 }}>
          Never use `(low + high) / 2` because it can overflow if `low + high` exceeds the maximum integer value. Always use `low + (high - low) / 2`.
        </p>
 
    </div></div>
  );
}

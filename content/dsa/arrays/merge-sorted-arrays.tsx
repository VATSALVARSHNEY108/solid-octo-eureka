"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  arr1: (number | null)[];
  arr2: number[];
  p1: number;
  p2: number;
  p: number;
  panelData: Record<string, any>;
}

// --- Constants ---
const COLORS = {
  bg: "#0d1117",
  surface: "#161b22",
  border: "#21262d",
  borderLighter: "#30363d",
  blue: "#58a6ff",
  blueDark: "#1f6feb",
  orange: "#f0883e",
  green: "#3fb950",
  red: "#f85149",
  textMuted: "#8b949e",
  textDark: "#484f58",
  textWhite: "#c9d1d9",
};

const CODE = [
  "int p1 = m - 1, p2 = n - 1, p = m + n - 1;",
  "while (p2 >= 0) {",
  "    if (p1 >= 0 && nums1[p1] > nums2[p2]) {",
  "        nums1[p--] = nums1[p1--];",
  "    } else {",
  "        nums1[p--] = nums2[p2--];",
  "    }",
  "}",
];

export default function MergeSortedArraysLab() {
  const [nums1Input, setNums1Input] = useState<number[]>([1, 2, 3]);
  const [nums2Input, setNums2Input] = useState<number[]>([2, 5, 6]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    stats: { x: 50, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    const m = nums1Input.length;
    const n = nums2Input.length;
    const arr1: (number | null)[] = [...nums1Input, ...new Array(n).fill(null)];
    const arr2 = [...nums2Input];
    let p1 = m - 1;
    let p2 = n - 1;
    let p = m + n - 1;

    s.push({
      type: "init", message: "Merging nums2 into nums1 from the back. O(1) extra space.",
      line: 0, arr1: [...arr1], arr2: [...arr2], p1, p2, p,
      panelData: { m, n, status: "Pointers at ends" }
    });

    while (p2 >= 0) {
      s.push({
        type: "check", message: `Comparing nums1[${p1}] (${p1 >= 0 ? arr1[p1] : 'N/A'}) and nums2[${p2}] (${arr2[p2]})`,
        line: 2, arr1: [...arr1], arr2: [...arr2], p1, p2, p,
        panelData: { p1, p2, p }
      });

      if (p1 >= 0 && arr1[p1]! > arr2[p2]) {
        arr1[p] = arr1[p1];
        s.push({
          type: "move1", message: `nums1[${p1}] is larger. Move to nums1[${p}].`,
          line: 3, arr1: [...arr1], arr2: [...arr2], p1, p2, p,
          panelData: { moved: arr1[p1], to: p }
        });
        p1--;
      } else {
        arr1[p] = arr2[p2];
        s.push({
          type: "move2", message: `nums2[${p2}] is larger/only remaining. Move to nums1[${p}].`,
          line: 5, arr1: [...arr1], arr2: [...arr2], p1, p2, p,
          panelData: { moved: arr2[p2], to: p }
        });
        p2--;
      }
      p--;
    }

    s.push({
      type: "done", message: "Merging complete. nums1 is now sorted.",
      line: null, arr1: [...arr1], arr2: [...arr2], p1, p2, p,
      panelData: { status: "Sorted", complexity: "O(m+n)" }
    });

    return s;
  }, [nums1Input, nums2Input]);

  const step = steps[Math.min(stepIdx, steps.length - 1)];

  const next = useCallback(() => setStepIdx(p => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setStepIdx(p => Math.max(0, p - 1)), []);
  const reset = useCallback(() => { setStepIdx(0); setIsPlaying(false); }, []);

  useEffect(() => {
    if (!isPlaying) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setStepIdx(p => {
        if (p >= steps.length - 1) { setIsPlaying(false); return p; }
        return p + 1;
      });
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, steps.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!panelDrag.current) return;
      const { panel, ox, oy, sx, sy } = panelDrag.current;
      setPanels(prev => ({ ...prev, [panel]: { x: sx + (e.clientX - ox), y: sy + (e.clientY - oy) } }));
    };
    const handleMouseUp = () => { panelDrag.current = null; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, []);

  const renderPanel = (id: string, title: string, content: React.ReactNode) => {
    const pos = (panels as any)[id];
    return (
      <div style={{
        position: 'absolute', left: pos.x, top: pos.y, width: 260,
        background: 'rgba(22,27,34,0.95)', border: `1px solid ${COLORS.border}`,
        borderRadius: 10, backdropFilter: 'blur(10px)', zIndex: 100
      }}>
        <div onMouseDown={(e) => { panelDrag.current = { panel: id, ox: e.clientX, oy: e.clientY, sx: pos.x, sy: pos.y }; e.stopPropagation(); }} style={{
          cursor: 'grab', padding: '8px 12px', background: COLORS.border,
          fontSize: 10, fontWeight: 700, color: COLORS.textMuted,
          display: 'flex', justifyContent: 'space-between', borderTopLeftRadius: 9, borderTopRightRadius: 9
        }}>
          {title} <span>⠿</span>
        </div>
        <div style={{ padding: '12px 14px' }}>{content}</div>
      </div>
    );
  };

  return (
    <div style={{ width: "100vw", height:"calc(100vh - 124px)", overflowY: "auto", background: COLORS.bg, scrollbarWidth: "none" }}>
      <TheorySection 
        title="Merge Sorted Arrays"
        definition="Combining two pre-sorted arrays into a single sorted array. This can be done in-place if the first array has sufficient trailing space."
        timeComplexity="O(N + M)"
        spaceComplexity="O(1) (In-place)"
        keyPoints={[
          "Two-pointer comparison",
          "Back-to-front merging (to avoid overwriting)",
          "Maintain three pointers (p1, p2, pMerge)",
          "Optimal O(N+M) time complexity"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>MERGE_SORTED_LAB</div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted }}>NUMS1:</span>
          <input 
            type="text" 
            placeholder="1, 2, 3..." 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                const newArr = val.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                if (newArr.length > 0) {
                  setNums1Input(newArr.sort((a,b) => a-b));
                  setStepIdx(0);
                  setIsPlaying(false);
                }
              }
            }}
            style={{ background: "transparent", border: "none", color: COLORS.textWhite, fontSize: 11, outline: "none", width: 100, fontFamily: "inherit" }} 
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted }}>NUMS2:</span>
          <input 
            type="text" 
            placeholder="2, 5, 6..." 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                const newArr = val.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                if (newArr.length > 0) {
                  setNums2Input(newArr.sort((a,b) => a-b));
                  setStepIdx(0);
                  setIsPlaying(false);
                }
              }
            }}
            style={{ background: "transparent", border: "none", color: COLORS.textWhite, fontSize: 11, outline: "none", width: 100, fontFamily: "inherit" }} 
          />
        </div>

        <button style={btnStyle} onClick={reset}>Reset Demo</button>
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: 260, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <div><div style={labelStyle}>Current Step</div><div style={{ fontSize: 11, lineHeight: 1.5 }}>{step.message}</div></div>
          <div><div style={labelStyle}>Playback</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={ctrlBtnStyle} onClick={reset}>↺</button>
              <button style={ctrlBtnStyle} onClick={prev}>‹</button>
              <button style={{ ...ctrlBtnStyle, background: isPlaying ? COLORS.blueDark : COLORS.borderLighter }} onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "⏸" : "▶"}</button>
              <button style={ctrlBtnStyle} onClick={next}>›</button>
            </div>
          </div>
          <div style={{ marginTop: "auto" }}><div style={{ height: 2, background: COLORS.border }}><div style={{ height: "100%", background: COLORS.blue, width: `${((stepIdx + 1) / steps.length) * 100}%` }} /></div></div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {renderPanel("stats", "Pointer Locations", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>P1 (nums1)</span>
                <span style={{ color: COLORS.orange }}>{step.p1}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>P2 (nums2)</span>
                <span style={{ color: COLORS.blue }}>{step.p2}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>P (target)</span>
                <span style={{ color: COLORS.green }}>{step.p}</span>
              </div>
            </div>
          ))}

          {renderPanel("logic", "In-Place Merge", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
            {/* nums1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={labelStyle}>nums1 (capacity {step.arr1.length})</div>
              <div style={{ display: "flex", gap: 8 }}>
                {step.arr1.map((val, i) => {
                  const isP1 = i === step.p1;
                  const isP = i === step.p;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 48, height: 48, 
                        background: isP1 ? "rgba(240,136,62,0.15)" : isP ? "rgba(63,185,80,0.15)" : COLORS.surface,
                        border: `2px solid ${isP1 ? COLORS.orange : isP ? COLORS.green : COLORS.border}`,
                        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 700, color: val === null ? COLORS.textDark : COLORS.textWhite
                      }}>{val ?? "Ø"}</div>
                      <div style={{ fontSize: 8, color: COLORS.textDark }}>{isP1 ? "P1" : isP ? "P" : i}</div>
                    </div>
                  );
          })}
              </div>
            </div>

            {/* nums2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={labelStyle}>nums2</div>
              <div style={{ display: "flex", gap: 8 }}>
                {step.arr2.map((val, i) => {
                  const isP2 = i === step.p2;
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 48, height: 48, 
                        background: isP2 ? "rgba(88,166,255,0.15)" : COLORS.surface,
                        border: `2px solid ${isP2 ? COLORS.blue : COLORS.border}`,
                        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 700, color: COLORS.textWhite
                      }}>{val}</div>
                      <div style={{ fontSize: 8, color: COLORS.textDark }}>{isP2 ? "P2" : i}</div>
                    </div>
                  );
          })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

const btnStyle = { background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
const ctrlBtnStyle = { width: 32, height: 32, borderRadius: 6, background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 14, cursor: "pointer" };
const labelStyle = { fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 };

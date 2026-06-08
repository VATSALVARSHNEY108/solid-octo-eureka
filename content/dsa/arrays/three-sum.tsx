"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  nums: number[];
  i: number | null;
  left: number | null;
  right: number | null;
  triplets: number[][];
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
  "sort(nums);",
  "for (int i = 0; i < n - 2; i++) {",
  "    int L = i + 1, R = n - 1;",
  "    while (L < R) {",
  "        int sum = nums[i] + nums[L] + nums[R];",
  "        if (sum == 0) addTriplets();",
  "        else if (sum < 0) L++;",
  "        else R--;",
  "    }",
  "}",
];

export default function ThreeSumLab() {
  const [nums, setNums] = useState<number[]>([-1, 0, 1, 2, -1, -4]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    stats: { x: 550, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    const sorted = [...nums].sort((a, b) => a - b);
    const triplets: number[][] = [];

    s.push({
      type: "init", message: "Goal: Find all unique triplets that sum to 0. First, sort the array.",
      line: 0, nums: sorted, i: null, left: null, right: null, triplets: [],
      panelData: { status: "Sorting" }
    });

    for (let i = 0; i < sorted.length - 2; i++) {
      if (i > 0 && sorted[i] === sorted[i - 1]) continue;

      let L = i + 1;
      let R = sorted.length - 1;

      s.push({
        type: "outer", message: `Fixed pointer i = ${i} (${sorted[i]}). Setting L = ${L}, R = ${R}.`,
        line: 1, nums: sorted, i, left: L, right: R, triplets: [...triplets],
        panelData: { i: sorted[i], L: sorted[L], R: sorted[R] }
      });

      while (L < R) {
        const sum = sorted[i] + sorted[L] + sorted[R];
        
        s.push({
          type: "check", message: `Sum: ${sorted[i]} + ${sorted[L]} + ${sorted[R]} = ${sum}`,
          line: 4, nums: sorted, i, left: L, right: R, triplets: [...triplets],
          panelData: { sum, target: 0 }
        });

        if (sum === 0) {
          triplets.push([sorted[i], sorted[L], sorted[R]]);
          s.push({
            type: "match", message: `Sum is 0! Triplet found: [${sorted[i]}, ${sorted[L]}, ${sorted[R]}]`,
            line: 5, nums: sorted, i, left: L, right: R, triplets: [...triplets],
            panelData: { status: "Found!", triplet: [sorted[i], sorted[L], sorted[R]] }
          });
          
          while (L < R && sorted[L] === sorted[L + 1]) L++;
          while (L < R && sorted[R] === sorted[R - 1]) R--;
          L++;
          R--;
        } else if (sum < 0) {
          L++;
        } else {
          R--;
        }
      }
    }

    s.push({
      type: "done", message: "Finished scanning all possibilities.",
      line: 9, nums: sorted, i: null, left: null, right: null, triplets: [...triplets],
      panelData: { totalFound: triplets.length }
    });

    return s;
  }, [nums]);

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
        title="Three Sum Problem"
        definition="Find all unique triplets in an array that sum up to exactly zero."
        timeComplexity="O(N²)"
        spaceComplexity="O(log N) or O(N) (Sorting space)"
        keyPoints={[
          "Sort the array to use two pointers",
          "Fixed pointer 'i' + L/R pointers",
          "Handle duplicates to avoid same triplets",
          "Skip same elements to optimize"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>3SUM_LAB</div>
        
        <input 
          type="text" 
          placeholder="-1, 0, 1, 2, -1, -4..." 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value;
              const newArr = val.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
              if (newArr.length > 0) {
                setNums(newArr);
                setStepIdx(0);
                setIsPlaying(false);
              }
            }
          }}
          style={{ 
            background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, 
            fontSize: 11, outline: "none", width: 220, fontFamily: "inherit", padding: "4px 10px", borderRadius: 6
          }} 
        />

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
          <div style={{ marginTop: "auto" }}>
             <div style={labelStyle}>Triplets Found</div>
             <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {step.triplets.map((t, idx) => (
                  <div key={idx} style={{ fontSize: 10, color: COLORS.green }}>[{t.join(", ")}]</div>
                ))}
                {step.triplets.length === 0 && <div style={{ fontSize: 10, color: COLORS.textDark }}>None yet</div>}
             </div>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {renderPanel("stats", "Sum Calculation", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>Fixed (i)</span>
                <span style={{ color: COLORS.blue }}>{step.i !== null ? step.nums[step.i] : "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>Left (L)</span>
                <span style={{ color: COLORS.orange }}>{step.left !== null ? step.nums[step.left] : "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>Right (R)</span>
                <span style={{ color: COLORS.orange }}>{step.right !== null ? step.nums[step.right] : "-"}</span>
              </div>
              <div style={{ height: 1, background: COLORS.border, margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 }}>
                <span style={{ color: COLORS.textWhite }}>SUM</span>
                <span style={{ color: step.panelData.sum === 0 ? COLORS.green : step.panelData.sum < 0 ? COLORS.red : COLORS.orange }}>
                  {step.panelData.sum ?? "-"}
                </span>
              </div>
            </div>
          ))}

          {renderPanel("logic", "Two Pointer Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '2px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {step.nums.map((val, idx) => {
                const isI = idx === step.i;
                const isL = idx === step.left;
                const isR = idx === step.right;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 50, height: 50, 
                      background: isI ? "rgba(88,166,255,0.15)" : (isL || isR) ? "rgba(240,136,62,0.15)" : COLORS.surface,
                      border: `2px solid ${isI ? COLORS.blue : (isL || isR) ? COLORS.orange : COLORS.border}`,
                      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700, color: COLORS.textWhite,
                      transition: "all 0.2s"
                    }}>{val}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: isI ? COLORS.blue : (isL || isR) ? COLORS.orange : COLORS.textDark }}>
                      {isI ? "I" : isL ? "L" : isR ? "R" : `[${idx}]`}
                    </div>
                  </div>
                );
          })}
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

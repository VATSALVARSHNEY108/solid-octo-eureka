"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  nums: number[];
  left: number;
  right: number;
  currentSum: number;
  maxLen: number;
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
  "int left = 0, right = 0, sum = 0, maxLen = 0;",
  "while (right < n) {",
  "    sum += nums[right];",
  "    while (sum > k && left <= right) {",
  "        sum -= nums[left++];",
  "    }",
  "    if (sum == k) {",
  "        maxLen = Math.max(maxLen, right - left + 1);",
  "    }",
  "    right++;",
  "}",
];

export default function LongestSubarrayKLab() {
  const [nums, setNums] = useState<number[]>([1, 2, 3, 1, 1, 1, 4, 2, 3]);
  const [k, setK] = useState(3);
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
    let left = 0, right = 0, currentSum = 0, maxLen = 0;

    s.push({
      type: "init", message: `Goal: Find longest subarray with sum K=${k}. Starting with two pointers at index 0.`,
      line: 0, nums: [...nums], left: 0, right: 0, currentSum: 0, maxLen: 0,
      panelData: { status: "Init" }
    });

    while (right < nums.length) {
      currentSum += nums[right];
      
      s.push({
        type: "expand", message: `Expanding right pointer to ${right} (${nums[right]}). Current Sum = ${currentSum}.`,
        line: 2, nums: [...nums], left, right, currentSum, maxLen,
        panelData: { added: nums[right], currentSum }
      });

      while (currentSum > k && left <= right) {
        const removed = nums[left];
        currentSum -= removed;
        s.push({
          type: "shrink", message: `Sum ${currentSum + removed} > ${k}. Shrinking left pointer. Subtracting ${removed}.`,
          line: 4, nums: [...nums], left, right, currentSum, maxLen,
          panelData: { removed, currentSum }
        });
        left++;
      }

      if (currentSum === k) {
        const len = right - left + 1;
        const oldMax = maxLen;
        maxLen = Math.max(maxLen, len);
        s.push({
          type: "found", message: `Current sum matches K! Length = ${len}. ${len > oldMax ? "New max length!" : ""}`,
          line: 7, nums: [...nums], left, right, currentSum, maxLen,
          panelData: { len, isNewMax: len > oldMax }
        });
      }

      right++;
    }

    s.push({
      type: "done", message: `Scan complete. Longest subarray length with sum ${k} is ${maxLen}.`,
      line: null, nums: [...nums], left, right: right - 1, currentSum, maxLen,
      panelData: { finalMaxLen: maxLen }
    });

    return s;
  }, [nums, k]);

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
        position: 'absolute', left: pos.x, top: pos.y, width: 240,
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
        title="Longest Subarray with Sum K"
        definition="Find the length of the longest contiguous subarray that sums up to a given value K. This version uses the optimal two-pointer approach for non-negative numbers."
        timeComplexity="O(N)"
        spaceComplexity="O(1)"
        keyPoints={[
          "Sliding window (Two Pointers)",
          "Expand 'right' to increase sum",
          "Shrink 'left' if sum exceeds K",
          "Track max length whenever sum equals K"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>LONGEST_K_LAB</div>
        
        <div style={{ display: "flex", gap: 8 }}>
            <input type="text" placeholder="1, 2, 3..." onKeyDown={e => e.key === "Enter" && setNums((e.target as HTMLInputElement).value.split(",").map(Number))} style={inputSmallStyle} />
            <input type="number" placeholder="K" value={k} onChange={e => setK(Number(e.target.value))} style={{ ...inputSmallStyle, width: 60 }} />
        </div>

        <button style={btnStyle} onClick={reset}>Reset Demo</button>
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: 260, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <div><div style={labelStyle}>Current Step</div><div style={{ fontSize: 11, lineHeight: 1.5 }}>{step.message}</div></div>
          <div><div style={labelStyle}>Max Length</div><div style={{ fontSize: 24, fontWeight: 800, color: COLORS.green }}>{step.maxLen}</div></div>
          <div><div style={labelStyle}>Playback</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={ctrlBtnStyle} onClick={reset}>↺</button>
              <button style={ctrlBtnStyle} onClick={prev}>‹</button>
              <button style={{ ...ctrlBtnStyle, background: isPlaying ? COLORS.blueDark : COLORS.borderLighter }} onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "⏸" : "▶"}</button>
              <button style={ctrlBtnStyle} onClick={next}>›</button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {renderPanel("stats", "Window Stats", (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>Current Sum</span>
                  <span style={{ color: step.currentSum === k ? COLORS.green : step.currentSum > k ? COLORS.red : COLORS.blue, fontWeight: 700 }}>{step.currentSum}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                  <span style={{ color: COLORS.textMuted }}>K Target</span>
                  <span style={{ color: COLORS.textWhite, fontWeight: 700 }}>{k}</span>
               </div>
            </div>
          ))}

          {renderPanel("logic", "Window Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '2px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
            <div style={{ display: "flex", gap: 8, position: "relative" }}>
              {step.nums.map((val, idx) => {
                const inWin = idx >= step.left && idx <= step.right;
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 54, 
                      background: inWin ? "rgba(88,166,255,0.15)" : COLORS.surface,
                      border: `1px solid ${inWin ? COLORS.blue : COLORS.border}`,
                      borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700, color: COLORS.textWhite,
                      transition: "all 0.3s"
                    }}>{val}</div>
                    <div style={{ fontSize: 8, color: COLORS.textDark }}>{idx === step.left ? "L" : idx === step.right ? "R" : idx}</div>
                  </div>
                );
          })}
            </div>
            
            <div style={{ display: "flex", gap: 40 }}>
               <div style={{ textAlign: "center" }}>
                  <div style={labelStyle}>Current Window Sum</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: step.currentSum === k ? COLORS.green : COLORS.blue }}>{step.currentSum}</div>
               </div>
               <div style={{ textAlign: "center" }}>
                  <div style={labelStyle}>Max Length Found</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.green }}>{step.maxLen}</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

const inputSmallStyle = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 11, outline: "none", width: 140, fontFamily: "inherit", padding: "4px 10px", borderRadius: 6 };
const btnStyle = { background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
const ctrlBtnStyle = { width: 32, height: 32, borderRadius: 6, background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 14, cursor: "pointer" };
const labelStyle = { fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 };

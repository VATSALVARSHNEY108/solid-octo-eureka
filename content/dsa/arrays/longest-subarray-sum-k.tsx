"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  array: number[];
  prefixSum: number;
  hashMap: Record<number, number>;
  currentIdx: number | null;
  maxLength: number;
  foundStart: number | null;
  foundEnd: number | null;
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
  "int maxLen = 0, sum = 0;",
  "Map<Integer, Integer> map = new HashMap<>();",
  "for (int i = 0; i < n; i++) {",
  "    sum += arr[i];",
  "    if (sum == k) maxLen = i + 1;",
  "    if (map.containsKey(sum - k))",
  "        maxLen = max(maxLen, i - map.get(sum - k));",
  "    if (!map.containsKey(sum)) map.put(sum, i);",
  "}",
  "return maxLen;",
];

export default function LongestSubarraySumKLab() {
  const [array, setArray] = useState<number[]>([1, 2, 3, 1, 1, 1, 1, 4, 2]);
  const [k, setK] = useState(3);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    stats: { x: 50, y: 100 },
    map: { x: 400, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    let sum = 0;
    let maxLen = 0;
    const map: Record<number, number> = {};
    let foundStart: number | null = null;
    let foundEnd: number | null = null;

    s.push({
      type: "init", message: `Find longest subarray with sum equal to ${k}.`,
      line: 0, array, prefixSum: 0, hashMap: {}, currentIdx: null, maxLength: 0,
      foundStart: null, foundEnd: null,
      panelData: { status: "Init", k }
    });

    for (let i = 0; i < array.length; i++) {
      sum += array[i];
      
      s.push({
        type: "add", message: `Index ${i}: Current element ${array[i]}. Running sum: ${sum}.`,
        line: 3, array, prefixSum: sum, hashMap: { ...map }, currentIdx: i, maxLength: maxLen,
        foundStart: null, foundEnd: null,
        panelData: { i, sum, k }
      });

      if (sum === k) {
        maxLen = i + 1;
        foundStart = 0;
        foundEnd = i;
        s.push({
          type: "update_direct", message: `Sum exactly matches K (${k})! Max Length updated to ${maxLen}.`,
          line: 4, array, prefixSum: sum, hashMap: { ...map }, currentIdx: i, maxLength: maxLen,
          foundStart, foundEnd,
          panelData: { i, sum, maxLen, action: "sum == k" }
        });
      }

      const rem = sum - k;
      if (map[rem] !== undefined) {
        const len = i - map[rem];
        if (len > maxLen) {
          maxLen = len;
          foundStart = map[rem] + 1;
          foundEnd = i;
          s.push({
            type: "update_map", message: `Found (sum - k) = ${rem} in map at index ${map[rem]}. Subarray length: ${len}.`,
            line: 6, array, prefixSum: sum, hashMap: { ...map }, currentIdx: i, maxLength: maxLen,
            foundStart, foundEnd,
            panelData: { i, sum, rem, foundAt: map[rem], newLen: len, maxLen }
          });
        }
      }

      if (map[sum] === undefined) {
        map[sum] = i;
        s.push({
          type: "put", message: `Store current sum ${sum} in map at index ${i} if not present.`,
          line: 7, array, prefixSum: sum, hashMap: { ...map }, currentIdx: i, maxLength: maxLen,
          foundStart, foundEnd,
          panelData: { i, sum, action: "map.put(sum, i)" }
        });
      }
    }

    s.push({
      type: "done", message: `Algorithm complete. Longest subarray length: ${maxLen}.`,
      line: 9, array, prefixSum: sum, hashMap: { ...map }, currentIdx: null, maxLength: maxLen,
      foundStart, foundEnd,
      panelData: { result: maxLen, status: "Done" }
    });

    return s;
  }, [array, k]);

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
        title="Longest Subarray with Sum K"
        definition="Given an array, find the maximum length of a contiguous subarray whose elements sum to exactly K."
        timeComplexity="O(N)"
        spaceComplexity="O(N) (for Hashmap)"
        keyPoints={[
          "Prefix Sum technique",
          "Hashmap stores (sum, first_occurrence_index)",
          "Handle negatives by storing sum",
          "One-pass optimal solution"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>SUBARRAY_SUM_K_LAB</div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted }}>ARRAY:</span>
          <input 
            type="text" 
            placeholder="1, 2, 3..." 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const val = (e.target as HTMLInputElement).value;
                const newArr = val.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
                if (newArr.length > 0) {
                  setArray(newArr);
                  setStepIdx(0);
                  setIsPlaying(false);
                }
              }
            }}
            style={{ 
              background: "transparent", border: "none", color: COLORS.textWhite, 
              fontSize: 11, outline: "none", width: 120, fontFamily: "inherit" 
            }} 
          />
        </div>

        <div style={{ fontSize: 11, color: COLORS.textMuted }}>K:</div>
        <input 
          type="number" value={k} onChange={e => setK(parseInt(e.target.value))}
          style={{ width: 60, background: COLORS.border, border: `1px solid ${COLORS.borderLighter}`, color: "white", padding: "4px 8px", borderRadius: 4, fontSize: 11 }}
        />
        <button style={btnStyle} onClick={reset}>Reset</button>
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

          {renderPanel("stats", "Subarray Stats", (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>PREFIX SUM</span>
                <span style={{ color: COLORS.blue, fontWeight: 800 }}>{step.prefixSum}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: COLORS.textMuted }}>MAX LENGTH</span>
                <span style={{ color: COLORS.green, fontWeight: 800 }}>{step.maxLength}</span>
              </div>
            </div>
          ))}

          {renderPanel("map", "Prefix Sum Map", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: COLORS.textDark, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 4 }}>
                <span>SUM</span>
                <span>FIRST INDEX</span>
              </div>
              {Object.entries(step.hashMap).map(([s, idx]) => (
                <div key={s} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.textWhite }}>
                  <span style={{ color: COLORS.orange }}>{s}</span>
                  <span>{idx}</span>
                </div>
              ))}
            </div>
          ))}

          {renderPanel("logic", "Prefix Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {array.map((val, i) => {
                const isCurrent = i === step.currentIdx;
                const isInSubarray = step.foundStart !== null && i >= step.foundStart && i <= step.foundEnd!;
                
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, 
                      background: isCurrent ? "rgba(88,166,255,0.15)" : isInSubarray ? "rgba(63,185,80,0.1)" : COLORS.surface,
                      border: `2px solid ${isCurrent ? COLORS.blue : isInSubarray ? COLORS.green : COLORS.border}`,
                      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700, color: isInSubarray ? COLORS.green : COLORS.textWhite,
                      transition: "all 0.3s"
                    }}>{val}</div>
                    <div style={{ fontSize: 9, color: COLORS.textDark }}>{isCurrent ? "CUR" : `[${i}]`}</div>
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

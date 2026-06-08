"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  s: string;
  t: string;
  left: number;
  right: number;
  windowCounts: Record<string, number>;
  foundCounts: number;
  bestRange: [number, number] | null;
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
  "Map<Char, Int> targetMap = getFreq(t);",
  "int L = 0, R = 0, found = 0;",
  "while (R < s.length()) {",
  "    add char at R to windowCounts;",
  "    if (counts match) found++;",
  "    while (found == targetMap.size()) {",
  "        update best range if current is smaller;",
  "        remove char at L, L++;",
  "    }",
  "    R++;",
  "}",
];

export default function MinimumWindowSubstringLab() {
  const [sStr, setSStr] = useState("ADOBECODEBANC");
  const [tStr, setTStr] = useState("ABC");
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    counts: { x: 600, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const stepsArr: Step[] = [];
    const targetMap: Record<string, number> = {};
    for (const char of tStr) targetMap[char] = (targetMap[char] || 0) + 1;
    const required = Object.keys(targetMap).length;

    const windowCounts: Record<string, number> = {};
    let found = 0;
    let L = 0, R = 0;
    let bestRange: [number, number] | null = null;
    let minLen = Infinity;

    stepsArr.push({
      type: "init", message: `Find min window in '${sStr}' containing all chars of '${tStr}'.`,
      line: 0, s: sStr, t: tStr, left: 0, right: 0, windowCounts: {}, foundCounts: 0, bestRange: null,
      panelData: { targetMap }
    });

    while (R < sStr.length) {
      const charR = sStr[R];
      windowCounts[charR] = (windowCounts[charR] || 0) + 1;

      if (targetMap[charR] && windowCounts[charR] === targetMap[charR]) {
        found++;
      }

      stepsArr.push({
        type: "expand", message: `Expanding R to ${R} ('${charR}'). Found ${found}/${required} target characters.`,
        line: 2, s: sStr, t: tStr, left: L, right: R, windowCounts: { ...windowCounts }, foundCounts: found, bestRange,
        panelData: { charR, found, required }
      });

      while (found === required && L <= R) {
        const currentLen = R - L + 1;
        if (currentLen < minLen) {
          minLen = currentLen;
          bestRange = [L, R];
          stepsArr.push({
            type: "best", message: `New minimum window found! Length: ${minLen} (Range [${L}, ${R}]).`,
            line: 6, s: sStr, t: tStr, left: L, right: R, windowCounts: { ...windowCounts }, foundCounts: found, bestRange: [L, R],
            panelData: { bestRange: [L, R], minLen }
          });
        }

        const charL = sStr[L];
        windowCounts[charL]--;
        if (targetMap[charL] && windowCounts[charL] < targetMap[charL]) {
          found--;
        }

        stepsArr.push({
          type: "shrink", message: `Shrinking L. Removing '${charL}' at index ${L}.`,
          line: 7, s: sStr, t: tStr, left: L, right: R, windowCounts: { ...windowCounts }, foundCounts: found, bestRange,
          panelData: { charL, L, found }
        });
        L++;
      }
      R++;
    }

    stepsArr.push({
      type: "done", message: bestRange ? `Scan finished. Minimum window: '${sStr.substring(bestRange[0], bestRange[1] + 1)}'.` : "No valid window found.",
      line: 10, s: sStr, t: tStr, left: L, right: R, windowCounts: { ...windowCounts }, foundCounts: found, bestRange,
      panelData: { status: "Done" }
    });

    return stepsArr;
  }, [sStr, tStr]);

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

  const targetFreq = useMemo(() => {
     const m: Record<string, number> = {};
     for(const c of tStr) m[c] = (m[c] || 0) + 1;
     return m;
  }, [tStr]);

  return (
    <div style={{ width: "100vw", height:"calc(100vh - 124px)", overflowY: "auto", background: COLORS.bg, scrollbarWidth: "none" }}>
      <TheorySection 
        title="Minimum Window Substring"
        definition="Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window."
        timeComplexity="O(N + M)"
        spaceComplexity="O(1) (Character set size)"
        keyPoints={[
          "Two pointer / Sliding window approach",
          "Frequency maps for target and current window",
          "Expand window until required counts met",
          "Shrink from left to find minimal range"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>MIN_WINDOW_LAB</div>
        
        <div style={{ display: "flex", gap: 12 }}>
            <input type="text" placeholder="S..." value={sStr} onChange={e => setSStr(e.target.value.toUpperCase())} style={inputSmallStyle} />
            <input type="text" placeholder="T..." value={tStr} onChange={e => setTStr(e.target.value.toUpperCase())} style={{ ...inputSmallStyle, width: 80 }} />
        </div>

        <button style={btnStyle} onClick={reset}>Reset Demo</button>
      </div>

      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: 260, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, padding: 20, display: "flex", flexDirection: "column", gap: 24 }}>
          <div><div style={labelStyle}>Current Step</div><div style={{ fontSize: 11, lineHeight: 1.5 }}>{step.message}</div></div>
          <div><div style={labelStyle}>Match Status</div>
             <div style={{ fontSize: 24, fontWeight: 900, color: step.foundCounts === Object.keys(targetFreq).length ? COLORS.green : COLORS.orange }}>
                {step.foundCounts} / {Object.keys(targetFreq).length}
             </div>
          </div>
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

          {renderPanel("counts", "Character Freqs", (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
               <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: COLORS.textDark, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 4 }}>
                  <span>CHAR</span>
                  <span>WIN / REQ</span>
               </div>
               {Object.entries(targetFreq).map(([char, req]) => {
                  const winCount = step.windowCounts[char] || 0;
                  const satisfied = winCount >= req;
                  return (
                    <div key={char} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                       <span style={{ color: COLORS.textWhite, fontWeight: 700 }}>{char}</span>
                       <span style={{ color: satisfied ? COLORS.green : COLORS.orange }}>{winCount} / {req}</span>
                    </div>
                  );
          })}
            </div>
          ))}

          {renderPanel("logic", "Sliding Logic", (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CODE.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '2px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                  <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 80 }}>
            <div style={{ display: "flex", gap: 4, position: "relative" }}>
              {step.s.split("").map((c, idx) => {
                const inWin = idx >= step.left && idx <= step.right;
                const inBest = step.bestRange && idx >= step.bestRange[0] && idx <= step.bestRange[1];
                return (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 40, height: 50, 
                      background: inWin ? "rgba(88,166,255,0.15)" : COLORS.surface,
                      border: `1px solid ${inBest ? COLORS.green : inWin ? COLORS.blue : COLORS.border}`,
                      borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, fontWeight: 700, color: inBest ? COLORS.green : COLORS.textWhite,
                      transition: "all 0.3s"
                    }}>{c}</div>
                    <div style={{ fontSize: 8, color: COLORS.textDark }}>{idx === step.left ? "L" : idx === step.right ? "R" : idx}</div>
                  </div>
                );
          })}
              
              {/* Window Highlights */}
              <div style={{
                  position: "absolute", 
                  left: step.left * (40 + 4) - 2,
                  top: -2,
                  width: (step.right - step.left + 1) * (40 + 4) - 4,
                  height: 54,
                  border: `1.5px solid ${COLORS.blue}`,
                  borderRadius: 6,
                  pointerEvents: "none",
                  transition: "all 0.3s"
              }} />
            </div>

            <div style={{ textAlign: "center" }}>
               <div style={labelStyle}>Best Substring Found</div>
               <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.green, letterSpacing: 2 }}>
                  {step.bestRange ? step.s.substring(step.bestRange[0], step.bestRange[1] + 1) : "???"}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

const inputSmallStyle = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 11, outline: "none", width: 160, fontFamily: "inherit", padding: "4px 10px", borderRadius: 6 };
const btnStyle = { background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
const ctrlBtnStyle = { width: 32, height: 32, borderRadius: 6, background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 14, cursor: "pointer" };
const labelStyle = { fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 };

"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Interval {
  start: number;
  end: number;
}

interface Step {
  type: string;
  message: string;
  line: number | null;
  intervals: Interval[];
  merged: Interval[];
  currentIdx: number | null;
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
  "sort(intervals);",
  "merged.push(intervals[0]);",
  "for (auto next : intervals) {",
  "    auto& last = merged.back();",
  "    if (next.start <= last.end) {",
  "        last.end = max(last.end, next.end);",
  "    } else {",
  "        merged.push(next);",
  "    }",
  "}",
];

export default function MergeIntervalsLab() {
  const [intervals, setIntervals] = useState<Interval[]>([
    { start: 1, end: 3 }, { start: 2, end: 6 }, { start: 8, end: 10 }, { start: 15, end: 18 }
  ]);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    info: { x: 500, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    const merged: Interval[] = [];

    s.push({
      type: "init", message: "Sort intervals by start time. Initialize with first interval.",
      line: 0, intervals: sorted, merged: [], currentIdx: null,
      panelData: { status: "Sorting done" }
    });

    merged.push({ ...sorted[0] });
    s.push({
      type: "first", message: `Add first interval [${sorted[0].start}, ${sorted[0].end}] to result.`,
      line: 1, intervals: sorted, merged: [{ ...sorted[0] }], currentIdx: 0,
      panelData: { mergedCount: 1 }
    });

    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];
      const last = merged[merged.length - 1];

      s.push({
        type: "check", message: `Checking [${next.start}, ${next.end}] against last merged [${last.start}, ${last.end}].`,
        line: 4, intervals: sorted, merged: merged.map(it => ({ ...it })), currentIdx: i,
        panelData: { overlap: next.start <= last.end }
      });

      if (next.start <= last.end) {
        last.end = Math.max(last.end, next.end);
        s.push({
          type: "merge", message: `Overlap! Extend last merged interval to [${last.start}, ${last.end}].`,
          line: 5, intervals: sorted, merged: merged.map(it => ({ ...it })), currentIdx: i,
          panelData: { status: "Merged", newEnd: last.end }
        });
      } else {
        merged.push({ ...next });
        s.push({
          type: "add", message: `No overlap. Add [${next.start}, ${next.end}] as a new interval.`,
          line: 7, intervals: sorted, merged: merged.map(it => ({ ...it })), currentIdx: i,
          panelData: { status: "Added", mergedCount: merged.length }
        });
      }
    }

    s.push({
      type: "done", message: `Completed. Final merged intervals: ${merged.length}.`,
      line: 9, intervals: sorted, merged: merged.map(it => ({ ...it })), currentIdx: null,
      panelData: { finalCount: merged.length, complexity: "O(n log n)" }
    });

    return s;
  }, [intervals]);

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
        title="Merge Intervals"
        definition="Given a collection of intervals, merge all overlapping intervals into a single range."
        timeComplexity="O(N log N) (due to sorting)"
        spaceComplexity="O(N) (to store results)"
        keyPoints={[
          "Sort intervals by start time",
          "Compare current end with next start",
          "Update end to max(end1, end2)",
          "Handles discrete and continuous ranges"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>MERGE_INTERVALS_LAB</div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.bg, padding: "4px 12px", borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
            <span style={{ fontSize: 10, color: COLORS.textMuted }}>INTERVALS:</span>
            <input
              type="text"
              placeholder="1-3, 2-6, 8-10..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value;
                  const pairs = val.split(",").map(s => s.trim().split("-"));
                  const newInts = pairs.map(p => ({ start: parseInt(p[0]), end: parseInt(p[1]) })).filter(it => !isNaN(it.start) && !isNaN(it.end));
                  if (newInts.length > 0) {
                    setIntervals(newInts);
                    setStepIdx(0);
                    setIsPlaying(false);
                  }
                }
              }}
              style={{
                background: "transparent", border: "none", color: COLORS.textWhite,
                fontSize: 11, outline: "none", width: 220, fontFamily: "inherit"
              }}
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
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" /></pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {renderPanel("logic", "Merge Logic", (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {CODE.map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 8px', borderRadius: 4, background: step.line === i ? 'rgba(88,166,255,0.1)' : 'transparent', borderLeft: step.line === i ? `2px solid ${COLORS.blue}` : '2px solid transparent' }}>
                    <span style={{ fontSize: 10, color: COLORS.textDark, minWidth: 16 }}>{i + 1}</span>
                    <span style={{ fontSize: 11, color: step.line === i ? COLORS.textWhite : COLORS.textDark }}>{line}</span>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ position: "absolute", inset: 0, padding: 40, display: "flex", flexDirection: "column", gap: 60 }}>
              {/* Input Intervals */}
              <div>
                <div style={labelStyle}>Input Intervals (Sorted)</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {step.intervals.map((it, i) => (
                    <div key={i} style={{
                      padding: "10px 16px", background: step.currentIdx === i ? "rgba(88,166,255,0.1)" : COLORS.surface,
                      border: `1px solid ${step.currentIdx === i ? COLORS.blue : COLORS.border}`,
                      borderRadius: 8, fontSize: 13, color: step.currentIdx === i ? COLORS.blue : COLORS.textWhite
                    }}>[{it.start}, {it.end}]</div>
                  ))}
                </div>
              </div>

              {/* Merged Intervals */}
              <div>
                <div style={labelStyle}>Merged Result</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {step.merged.map((it, i) => (
                    <div key={i} style={{
                      padding: "10px 16px", background: "rgba(63,185,80,0.1)",
                      border: `1px solid ${COLORS.green}`,
                      borderRadius: 8, fontSize: 13, color: COLORS.green
                    }}>[{it.start}, {it.end}]</div>
                  ))}
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

        const btnStyle = {background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
        const ctrlBtnStyle = {width: 32, height: 32, borderRadius: 6, background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 14, cursor: "pointer" };
        const labelStyle = {fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 };

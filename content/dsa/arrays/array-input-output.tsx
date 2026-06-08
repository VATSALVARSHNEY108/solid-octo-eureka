"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { TheorySection } from "@/components/TheorySection";

// --- Types ---
interface Step {
  type: string;
  message: string;
  line: number | null;
  input: string[];
  memory: (string | null)[];
  output: string[];
  highlightIdx: number | null;
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
  "int[] arr = new int[n];",
  "Scanner sc = new Scanner(System.in);",
  "for (int i = 0; i < n; i++) {",
  "    arr[i] = sc.nextInt(); // Input",
  "}",
  "for (int i = 0; i < n; i++) {",
  "    System.out.print(arr[i] + ' '); // Output",
  "}",
];

export default function ArrayInputOutputLab() {
  const [inputText, setInputText] = useState("10 20 30 40 50");
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [panels, setPanels] = useState({
    logic: { x: 50, y: 400 },
    io: { x: 600, y: 100 },
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const panelDrag = useRef<{ panel: string; ox: number; oy: number; sx: number; sy: number } | null>(null);

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    const inputArr = inputText.split(/\s+/).filter(x => x !== "");
    const n = inputArr.length;
    const memory = new Array(n).fill(null);
    const output: string[] = [];

    s.push({
      type: "init", message: "Goal: Read N integers into an array and then print them back.",
      line: 0, input: [...inputArr], memory: [...memory], output: [], highlightIdx: null,
      panelData: { status: "Ready" }
    });

    // Phase 1: Input
    for (let i = 0; i < n; i++) {
      memory[i] = inputArr[i];
      s.push({
        type: "input", message: `Reading value '${inputArr[i]}' from scanner into arr[${i}].`,
        line: 3, input: [...inputArr], memory: [...memory], output: [], highlightIdx: i,
        panelData: { val: inputArr[i], index: i, action: "Writing to Memory" }
      });
    }

    // Phase 2: Output
    for (let i = 0; i < n; i++) {
      output.push(memory[i]!);
      s.push({
        type: "output", message: `Printing value from arr[${i}] (${memory[i]}) to standard output.`,
        line: 6, input: [...inputArr], memory: [...memory], output: [...output], highlightIdx: i,
        panelData: { val: memory[i], index: i, action: "Reading from Memory" }
      });
    }

    s.push({
      type: "done", message: "Process complete. Input successfully stored and echoed to output.",
      line: null, input: [...inputArr], memory: [...memory], output: [...output], highlightIdx: null,
      panelData: { status: "Completed" }
    });

    return s;
  }, [inputText]);

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
        title="Array Input and Output"
        definition="Input involves reading values from a stream (like keyboard or file) and storing them in array indices. Output involves iterating through the array and sending values to a display or file."
        timeComplexity="O(N)"
        spaceComplexity="O(N) (Storage space)"
        keyPoints={[
          "Scanner/Reader for inputs",
          "Index-based storage (arr[i])",
          "Traversal for printing values",
          "Memory allocation occurs first"
        ]}
      />
      <div style={{
        height:"calc(100vh - 124px)", background: COLORS.bg,
        color: COLORS.textWhite, fontFamily: "'JetBrains Mono', monospace",
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
      <div style={{ height: 48, background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginRight: 20 }}>IO_LAB</div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
           <span style={labelStyle}>Input Data:</span>
           <input 
              type="text" 
              value={inputText}
              onChange={e => { setInputText(e.target.value); setStepIdx(0); }}
              style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 11, padding: "4px 10px", borderRadius: 4, width: 200 }}
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
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", pointerEvents: "none" }}>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/></pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {renderPanel("io", "Stream Monitor", (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               <div>
                  <div style={labelStyle}>Standard Input (Buffer)</div>
                  <div style={{ background: COLORS.bg, padding: 8, borderRadius: 4, fontSize: 11, color: COLORS.textMuted }}>
                    {step.input.map((v, idx) => (
                      <span key={idx} style={{ color: step.type === "input" && step.highlightIdx === idx ? COLORS.orange : COLORS.textDark, textDecoration: step.type === "input" && idx < (step.highlightIdx || 0) ? "line-through" : "none", marginRight: 8 }}>{v}</span>
                    ))}
                  </div>
               </div>
               <div>
                  <div style={labelStyle}>Standard Output (Console)</div>
                  <div style={{ background: "#000", padding: 8, borderRadius: 4, fontSize: 11, color: COLORS.green, minHeight: 40 }}>
                    {step.output.join(" ")}_
                  </div>
               </div>
            </div>
          ))}

          {renderPanel("logic", "I/O Code", (
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
            <div style={{ textAlign: "center" }}>
               <div style={labelStyle}>RAM Memory (Array)</div>
               <div style={{ display: "flex", gap: 12 }}>
                  {step.memory.map((val, idx) => {
                    const isTarget = step.highlightIdx === idx;
                    return (
                      <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 50, height: 60, 
                          background: isTarget ? "rgba(88,166,255,0.1)" : COLORS.surface,
                          border: `1px solid ${isTarget ? COLORS.blue : COLORS.border}`,
                          borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, fontWeight: 800, color: val === null ? COLORS.textDark : COLORS.textWhite,
                          transition: "all 0.2s"
                        }}>{val ?? "?"}</div>
                        <div style={{ fontSize: 9, color: COLORS.textDark }}>addr {idx}</div>
                      </div>
                    );
          })}
               </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
               <div style={{ fontSize: 10, color: COLORS.textMuted }}>{step.type === "input" ? "FLOW: STREAM -> MEMORY" : step.type === "output" ? "FLOW: MEMORY -> CONSOLE" : "IDLE"}</div>
               <div style={{ width: 100, height: 2, background: COLORS.border, position: "relative" }}>
                  {step.type !== "init" && step.type !== "done" && (
                    <div style={{ 
                      width: 10, height: 10, borderRadius: "50%", background: step.type === "input" ? COLORS.orange : COLORS.green, 
                      position: "absolute", top: -4, 
                      left: step.type === "input" ? "0%" : "100%",
                      transform: step.type === "input" ? "translateX(0%)" : "translateX(-100%)",
                      animation: step.type === "input" ? "flowIn 0.5s infinite" : "flowOut 0.5s infinite"
                    }} />
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      @keyframes flowIn { 0% { left: 0%; opacity: 1; } 100% { left: 100%; opacity: 0; } }
      @keyframes flowOut { 0% { left: 100%; opacity: 1; } 100% { left: 0%; opacity: 0; } }
    `}</style>
  </div>
);
}

const btnStyle = { background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit" };
const ctrlBtnStyle = { width: 32, height: 32, borderRadius: 6, background: COLORS.borderLighter, border: `1px solid ${COLORS.border}`, color: COLORS.textWhite, fontSize: 14, cursor: "pointer" };
const labelStyle = { fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 8 };

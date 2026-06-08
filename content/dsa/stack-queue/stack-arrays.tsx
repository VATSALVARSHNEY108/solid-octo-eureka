"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface SArrayStep {
  type: string;
  stack: (number | null)[];
  top: number;
  message: string;
  line?: number;
}

function simulateStackArray(): SArrayStep[] {
  const steps: SArrayStep[] = [];
  const s: (number | null)[] = [null, null, null, null];
  const size = 4;
  let top = -1;

  steps.push({ type: "init", stack: [...s], top, message: `Initialize Stack using an Array of size ${size}. Top is initialized to -1.`, line: 0 });

  function push(val: number, lineIdx: number) {
    if (top >= size - 1) {
      steps.push({ type: "overflow", stack: [...s], top, message: `Push(${val}): Overflow! Top is already at the end of the array.`, line: lineIdx + 1 });
      return;
    }
    top++;
    s[top] = val;
    steps.push({ type: "push", stack: [...s], top, message: `Push(${val}): Increment Top to ${top} and insert ${val}.`, line: lineIdx + 3 });
  }

  function pop(lineIdx: number) {
    if (top < 0) {
      steps.push({ type: "underflow", stack: [...s], top, message: `Pop(): Underflow! Stack is completely empty.`, line: lineIdx + 1 });
      return;
    }
    const val = s[top];
    s[top] = null; // Visual clear
    steps.push({ type: "pop_read", stack: [...s], top, message: `Pop(): Read element ${val} at Top (${top}).`, line: lineIdx + 4 });
    top--;
    steps.push({ type: "pop", stack: [...s], top, message: `Pop(): Decrement Top to ${top}.`, line: lineIdx + 5 });
  }

  push(10, 1);
  push(20, 1);
  push(30, 1);
  pop(7);
  push(40, 1);
  push(50, 1); // Size is 4, this fills it
  push(60, 1); // Overflow!

  return steps;
}

export default function StackArraysLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateStackArray(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = window.setInterval(() => {
      setStepIndex((cur) => {
        if (cur >= steps.length - 1) {
          setPlaying(false);
          return cur;
        }
        return cur + 1;
      });
    }, speed);
    return () => window.clearInterval(timerRef.current as number);
  }, [playing, speed, steps.length]);

  const codeSnippet = [
    "let top = -1;",
    "function push(x) {",
    "  if (top >= size - 1) return 'Overflow';",
    "  top++;",
    "  arr[top] = x;",
    "}",
    "function pop() {",
    "  if (top < 0) return 'Underflow';",
    "  let val = arr[top];",
    "  top--;",
    "  return val;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Core Implementation</span>
          <h1>Stack using Arrays</h1>
          <p className="description">The most straightforward way to build a Stack is by wrapping a standard Array and using a single integer variable `top` to keep track of the highest index.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(1)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Top Pointer</h2><p>We initialize `top = -1`. This conceptually means "the array is completely empty". It's an index pointer, not a physical memory address.</p></article>
          <article className="guide-card highlight"><h2>Pushing</h2><p>To push, we first increment `top`, and then place the element at `array[top]`. We must check if `top == size - 1` to prevent buffer overflow.</p></article>
          <article className="guide-card"><h2>Popping</h2><p>To pop, we read `array[top]` and then decrement `top`. We don't even need to "delete" the data from the array—it will just get overwritten next time we push!</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the Top pointer is the sole source of truth for the stack's size and boundary.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
              </div>
              <label>Speed<input type="range" min="500" max="3000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '80px', alignItems: 'flex-end', minHeight: '220px' }}>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                   <span style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px' }}>Array `arr` (Size 4)</span>
                   <div style={{ 
                     width: '120px', height: '200px', border: '4px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                     background: 'var(--panel2)'
                   }}>
                     {step.stack.map((val, idx) => {
                       const isTop = step.top === idx;
                       return (
                         <div key={idx} style={{
                           width: '100%', height: '40px', background: val !== null ? 'var(--panel)' : 'transparent',
                           border: val !== null ? `2px solid ${isTop ? 'var(--amber)' : 'var(--blue)'}` : '2px dashed var(--border)',
                           borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontWeight: 'bold', fontSize: '18px', color: isTop ? 'var(--amber)' : 'var(--blue)',
                           transition: 'all 0.3s'
                         }}>
                           {val !== null ? val : ''}
                         </div>
                       )
                     })}
                   </div>

                   {/* Top Pointer Indicator */}
                   <div style={{ 
                     position: 'absolute', right: '-80px', 
                     bottom: `${step.top === -1 ? -20 : 10 + (step.top * 46)}px`, 
                     transition: 'bottom 0.3s ease',
                     display: 'flex', alignItems: 'center', gap: '8px'
                   }}>
                     <span style={{ fontSize: '20px', color: 'var(--amber)' }}>◀</span>
                     <span style={{ color: 'var(--amber)', fontWeight: 'bold' }}>Top: {step.top}</span>
                   </div>
                 </div>

               </div>

               {step.type === "overflow" && (
                 <div style={{ padding: '10px 20px', background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '2px solid var(--red)', color: 'var(--red)', borderRadius: '8px', fontWeight: 'bold' }}>
                   ARRAY OVERFLOW! Top = {step.top}
                 </div>
               )}

               <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto' }}>
                 <CodeTracker code={codeSnippet} activeLine={step.line || 0} />
               </div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), radial-gradient(circle at 90% 80%, #35c48608, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 2px 10px rgba(0,0,0,0.1)); }
        .eyebrow { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--blue); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 8px 12px; }
        button { cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; text-decoration: none; display: inline-flex; }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; margin: 24px auto 0; max-width: 1200px;}
        aside { display: flex; flex-direction: column; gap: 12px; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

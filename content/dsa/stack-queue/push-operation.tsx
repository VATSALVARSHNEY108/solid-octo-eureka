"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface PushStep {
  type: string;
  top: number;
  val: number;
  stack: (number | null)[];
  message: string;
  line?: number;
}

function simulatePush(): PushStep[] {
  const steps: PushStep[] = [];
  const size = 5;
  const s: (number | null)[] = [null, null, null, null, null];
  let top = -1;

  steps.push({ type: "init", top, val: -1, stack: [...s], message: `Stack initialized with size ${size}. Top pointer is at -1.`, line: 0 });

  function push(val: number, lineIdx: number) {
    steps.push({ type: "check", top, val, stack: [...s], message: `Attempting to push ${val}. Checking if IsFull().`, line: lineIdx });
    
    if (top === size - 1) {
      steps.push({ type: "overflow", top, val, stack: [...s], message: `Stack Overflow! Top is ${top}, which equals Size-1. Cannot push.`, line: lineIdx + 1 });
      return;
    }

    top++;
    steps.push({ type: "increment", top, val, stack: [...s], message: `Stack is not full. Increment Top to ${top}.`, line: lineIdx + 4 });
    
    s[top] = val;
    steps.push({ type: "write", top, val, stack: [...s], message: `Write ${val} to stack[${top}]. Push successful.`, line: lineIdx + 5 });
  }

  push(10, 1);
  push(20, 1);
  push(30, 1);
  push(40, 1);
  push(50, 1);
  push(60, 1); // Overflow

  return steps;
}

export default function PushOperationLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulatePush(), []);
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
    "function push(val) {",
    "  if (top === size - 1) {",
    "    console.log('Stack Overflow');",
    "    return;",
    "  }",
    "  top++;",
    "  stack[top] = val;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Core Operations</span>
          <h1>The Push Operation</h1>
          <p className="description">Pushing is the act of adding a new element to the top of the Stack. It runs in O(1) constant time.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(1)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Step 1: Check Overflow</h2><p>Always verify if `IsFull()` is true. If the internal array has reached its maximum size, pushing will cause a memory violation (Overflow).</p></article>
          <article className="guide-card highlight"><h2>Step 2: Move Pointer</h2><p>Increment the `top` pointer by 1. Initially, `top` is -1, so the first push moves `top` to index 0.</p></article>
          <article className="guide-card"><h2>Step 3: Insert Data</h2><p>Write the new value to the array exactly at the new `top` index. The element is now officially part of the stack.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Top pointer increment before writing data. Watch out for Overflow!</span>
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
               
               <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                   <span style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px' }}>Stack (Size 5)</span>
                   <div style={{ 
                     width: '120px', height: '250px', border: '4px solid var(--border)', borderTop: 'none', 
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
                   STACK OVERFLOW!
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

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface TrapStep {
  type: string;
  idx: number;
  stack: number[];
  water: number;
  totalWater: number;
  message: string;
  line?: number;
}

function simulateTrappingWater(): TrapStep[] {
  const steps: TrapStep[] = [];
  const height = [0, 1, 0, 2, 1, 0, 1, 3];
  const stack: number[] = [];
  let totalWater = 0;

  steps.push({ type: "init", idx: -1, stack: [...stack], water: 0, totalWater, message: `Calculate trapped water for heights: [0, 1, 0, 2, 1, 0, 1, 3] using a Monotonic Stack.`, line: 0 });

  for (let i = 0; i < height.length; i++) {
    steps.push({ type: "visit", idx: i, stack: [...stack], water: 0, totalWater, message: `Visiting index ${i} with height ${height[i]}.`, line: 2 });

    while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
      const bottomIdx = stack.pop()!;
      const bottomHeight = height[bottomIdx];
      
      steps.push({ type: "found_dip", idx: i, stack: [...stack], water: 0, totalWater, message: `Height ${height[i]} is greater than stack top ${bottomHeight}. We found a dip!`, line: 3 });

      if (stack.length === 0) {
        steps.push({ type: "no_left_wall", idx: i, stack: [...stack], water: 0, totalWater, message: `Stack is empty. There is no left wall to contain the water. Break loop.`, line: 4 });
        break;
      }

      const leftIdx = stack[stack.length - 1];
      const leftHeight = height[leftIdx];
      
      const width = i - leftIdx - 1;
      const boundedHeight = Math.min(leftHeight, height[i]) - bottomHeight;
      const waterTrapped = width * boundedHeight;
      totalWater += waterTrapped;

      steps.push({ 
        type: "trap", idx: i, stack: [...stack], water: waterTrapped, totalWater, 
        message: `Bounded by left wall (H:${leftHeight}) and right wall (H:${height[i]}). W:${width} x H:${boundedHeight} = ${waterTrapped} units trapped!`,
        line: 6 
      });
    }

    stack.push(i);
    steps.push({ type: "push", idx: i, stack: [...stack], water: 0, totalWater, message: `Push index ${i} to stack.`, line: 10 });
  }

  steps.push({ type: "done", idx: -1, stack: [...stack], water: 0, totalWater, message: `Done! Total water trapped: ${totalWater} units.`, line: 12 });

  return steps;
}

export default function TrappingRainWaterLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

  const steps = useMemo(() => simulateTrappingWater(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const height = [0, 1, 0, 2, 1, 0, 1, 3];

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
    "let stack = []; let ans = 0;",
    "for (let i = 0; i < height.length; i++) {",
    "  while (stack.length && height[i] > height[stack[stack.length - 1]]) {",
    "    let top = stack.pop();",
    "    if (stack.length === 0) break;",
    "    let distance = i - stack[stack.length - 1] - 1;",
    "    let boundedHeight = Math.min(height[i], height[stack[stack.length - 1]]) - height[top];",
    "    ans += distance * boundedHeight;",
    "  }",
    "  stack.push(i);",
    "}",
    "return ans;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Hard Data Structures</span>
          <h1>Trapping Rain Water</h1>
          <p className="description">Calculate how much rain water can be trapped between elevation blocks. While often solved with Two Pointers, the Monotonic Stack solution elegantly calculates horizontal slices of water.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Horizontal Slicing</h2><p>The Two Pointer method calculates water vertically column by column. The Stack method calculates water horizontally, slice by slice, as it identifies bowl shapes.</p></article>
          <article className="guide-card highlight"><h2>The Monotonic Rule</h2><p>We keep a monotonically decreasing stack. As long as bars are going down, no water is trapped. We just push them to the stack, forming the left slope of a bowl.</p></article>
          <article className="guide-card"><h2>Closing the Bowl</h2><p>When we encounter a bar taller than the top of the stack, we found the right wall of a bowl! We pop the bottom, look at the new top (the left wall), and calculate the trapped rectangular slice.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Monotonic Stack identify "dips" and calculate horizontal water slices dynamically.</span>
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
              
              <div style={{ marginTop: '20px', padding: '15px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Water Trapped</span>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--blue)' }}>{step.totalWater}</div>
              </div>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '180px', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
                 {height.map((val, i) => {
                   const isCurrent = step.idx === i;
                   const inStack = step.stack.includes(i);
                   
                   let bg = 'var(--panel)';
                   let border = 'var(--border)';

                   if (isCurrent) {
                     border = 'var(--amber)';
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                   } else if (inStack) {
                     border = 'var(--blue)';
                     bg = 'color-mix(in srgb, var(--blue) 10%, transparent)';
                   }

                   return (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>i:{i}</span>
                       <div style={{
                         width: '40px', height: `${Math.max(10, val * 40)}px`, background: bg, border: `2px solid ${border}`, borderBottom: 'none',
                         display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4px',
                         fontSize: '14px', fontWeight: 'bold', color: 'var(--text)',
                         transition: 'all 0.3s'
                       }}>
                         {val}
                       </div>
                     </div>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                 <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Stack (Stores Indices of Left Slopes)</span>
                 <div style={{ 
                   display: 'flex', gap: '4px', border: '3px solid var(--border)', borderLeft: 'none', borderRight: 'none', padding: '8px 10px', 
                   minWidth: '200px', minHeight: '55px', background: 'var(--panel2)',
                   justifyContent: 'flex-start', alignItems: 'center'
                 }}>
                   {step.stack.map((idx, i) => (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', animation: 'slideUp 0.3s' }}>
                       <div style={{
                         width: '40px', height: '40px', background: 'var(--panel)',
                         border: '2px solid var(--blue)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '16px', color: 'var(--blue)'
                       }}>
                         {height[idx]}
                       </div>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>i:{idx}</span>
                     </div>
                   ))}
                   {step.stack.length === 0 && <span style={{ color: 'var(--muted)', width: '100%', textAlign: 'center', fontSize: '14px' }}>Empty</span>}
                 </div>
               </div>

               {step.type === "trap" && (
                 <div style={{ padding: '10px 20px', background: 'color-mix(in srgb, var(--blue) 10%, transparent)', border: '2px solid var(--blue)', color: 'var(--blue)', borderRadius: '8px', fontWeight: 'bold' }}>
                   + {step.water} Water Trapped!
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
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

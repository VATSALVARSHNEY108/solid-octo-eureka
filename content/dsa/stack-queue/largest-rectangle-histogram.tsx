"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface HistogramStep {
  type: string;
  idx: number;
  stack: number[];
  maxArea: number;
  message: string;
  line?: number;
}

function simulateLargestRectangle(): HistogramStep[] {
  const steps: HistogramStep[] = [];
  const heights = [2, 1, 5, 6, 2, 3];
  const stack: number[] = [];
  let maxArea = 0;

  steps.push({ type: "init", idx: -1, stack: [...stack], maxArea, message: `Find largest rectangle in histogram [2, 1, 5, 6, 2, 3]`, line: 0 });

  for (let i = 0; i < heights.length; i++) {
    steps.push({ type: "visit", idx: i, stack: [...stack], maxArea, message: `Visiting bar ${i} (height: ${heights[i]})`, line: 1 });

    while (stack.length > 0 && heights[stack[stack.length - 1]] > heights[i]) {
      const topIdx = stack.pop()!;
      const h = heights[topIdx];
      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      const area = h * w;
      if (area > maxArea) maxArea = area;

      steps.push({ 
        type: "pop_calc", idx: i, stack: [...stack], maxArea, 
        message: `Current height ${heights[i]} < Top height ${h}. Pop and calculate area: height ${h} * width ${w} = ${area}. Max is now ${maxArea}.`,
        line: 3 
      });
    }

    stack.push(i);
    steps.push({ type: "push", idx: i, stack: [...stack], maxArea, message: `Push bar ${i} to stack. Stack maintains increasing heights.`, line: 6 });
  }

  const i = heights.length;
  while (stack.length > 0) {
    const topIdx = stack.pop()!;
    const h = heights[topIdx];
    const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
    const area = h * w;
    if (area > maxArea) maxArea = area;

    steps.push({ 
      type: "flush", idx: i, stack: [...stack], maxArea, 
      message: `Array ended. Flush stack. Pop ${topIdx}. Area: ${h} * ${w} = ${area}. Max is now ${maxArea}.`,
      line: 8 
    });
  }

  steps.push({ type: "done", idx: -1, stack: [...stack], maxArea, message: `Done! Largest rectangle area is ${maxArea}.`, line: 10 });

  return steps;
}

export default function LargestRectangleHistogramLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateLargestRectangle(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const heights = [2, 1, 5, 6, 2, 3];

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
    "let stack = [], maxArea = 0;",
    "for (let i = 0; i <= n; i++) {",
    "  while (stack.length && (i === n || heights[stack[stack.length-1]] > heights[i])) {",
    "    let h = heights[stack.pop()];",
    "    let w = stack.length === 0 ? i : i - stack[stack.length-1] - 1;",
    "    maxArea = Math.max(maxArea, h * w);",
    "  }",
    "  stack.push(i);",
    "}",
    "return maxArea;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Monotonic Stack</span>
          <h1>Largest Rectangle in Histogram</h1>
          <p className="description">Given an array of integer heights representing a histogram, find the area of the largest bounding rectangle.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Core Insight</h2><p>For any bar, the largest rectangle that fully includes it is limited by the first strictly smaller bar to its left, and the first strictly smaller bar to its right.</p></article>
          <article className="guide-card highlight"><h2>Monotonic Stack</h2><p>We use a stack to keep track of bars in strictly increasing height order. When we see a smaller bar, it acts as the "right boundary" for the taller bars currently sitting on top of the stack.</p></article>
          <article className="guide-card"><h2>Calculating Width</h2><p>When popping a bar, its height `h` is known. Its right boundary is the current index `i`. Its left boundary is the index of whatever remains at the top of the stack after it's popped!</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Monotonic Stack maintain increasing heights, collapsing and calculating areas when a smaller bar arrives.</span>
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
               
               <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', borderBottom: '2px solid var(--border)', paddingBottom: '4px', gap: '4px' }}>
                 {heights.map((h, i) => {
                   const isCurrent = step.idx === i;
                   const inStack = step.stack.includes(i);
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';

                   if (isCurrent) {
                     border = 'var(--amber)';
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                   } else if (inStack) {
                     border = 'var(--blue)';
                     bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                   }

                   return (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text)', marginBottom: '4px' }}>{h}</span>
                       <div style={{
                         width: '40px', height: `${h * 20}px`, background: bg,
                         border: `2px solid ${border}`, borderBottom: 'none',
                         transition: 'all 0.3s'
                       }}></div>
                     </div>
                   )
                 })}
                 {/* Virtual bound for flush */}
                 {step.idx === heights.length && (
                   <div style={{ height: '10px', borderLeft: '2px dashed var(--red)' }}></div>
                 )}
               </div>

               <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Stack (Indices)</span>
                   <div style={{ 
                     width: '100px', minHeight: '100px', border: '3px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '4px',
                     background: 'var(--panel2)'
                   }}>
                     {step.stack.map((idx, i) => (
                       <div key={i} style={{
                         width: '100%', height: '30px', background: 'var(--panel)',
                         border: '2px solid var(--blue)', borderRadius: '4px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '14px', color: 'var(--blue)'
                       }}>
                         idx: {idx}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Max Area</span>
                   <div style={{ 
                     minWidth: '100px', height: '60px', borderRadius: '8px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold',
                     color: 'var(--green)', background: 'color-mix(in srgb, var(--green) 10%, transparent)', border: '2px solid var(--green)'
                   }}>
                     {step.maxArea}
                   </div>
                 </div>
               </div>

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

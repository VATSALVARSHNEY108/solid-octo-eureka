"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface WindowStep {
  type: string;
  idx: number;
  deque: number[];
  result: number[];
  message: string;
  line?: number;
}

function simulateSlidingWindowMax(): WindowStep[] {
  const steps: WindowStep[] = [];
  const nums = [1, 3, -1, -3, 5, 3];
  const k = 3;
  const deque: number[] = []; // Stores indices
  const result: number[] = [];

  steps.push({ type: "init", idx: -1, deque: [...deque], result: [...result], message: `Find maximums in sliding window of size ${k}.`, line: 0 });

  for (let i = 0; i < nums.length; i++) {
    steps.push({ type: "visit", idx: i, deque: [...deque], result: [...result], message: `Visiting ${nums[i]} at index ${i}.`, line: 2 });

    // 1. Remove out of bounds elements
    if (deque.length > 0 && deque[0] === i - k) {
      const removed = deque.shift()!;
      steps.push({ type: "remove_old", idx: i, deque: [...deque], result: [...result], message: `Index ${removed} is out of the current window [${i-k+1}, ${i}]. Remove it from front of Deque.`, line: 3 });
    }

    // 2. Remove elements smaller than current from back (Monotonic Decreasing)
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      const popped = deque.pop()!;
      steps.push({ type: "remove_small", idx: i, deque: [...deque], result: [...result], message: `${nums[popped]} is <= current ${nums[i]}. It can never be the max. Remove from back of Deque.`, line: 4 });
    }

    // 3. Push current index
    deque.push(i);
    steps.push({ type: "push", idx: i, deque: [...deque], result: [...result], message: `Push current index ${i} to Deque.`, line: 7 });

    // 4. Record result if window is full
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
      steps.push({ type: "record", idx: i, deque: [...deque], result: [...result], message: `Window size is at least ${k}. The max is at the front of Deque: ${nums[deque[0]]}. Record it.`, line: 9 });
    }
  }

  steps.push({ type: "done", idx: -1, deque: [...deque], result: [...result], message: `Done! Result: [${result.join(', ')}].`, line: 12 });

  return steps;
}

export default function SlidingWindowMaxLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateSlidingWindowMax(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const nums = [1, 3, -1, -3, 5, 3];
  const k = 3;

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
    "let deque = []; let res = [];",
    "for (let i = 0; i < nums.length; i++) {",
    "  if (deque.length && deque[0] === i - k) {",
    "    deque.shift();",
    "  }",
    "  while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) {",
    "    deque.pop();",
    "  }",
    "  deque.push(i);",
    "  if (i >= k - 1) {",
    "    res.push(nums[deque[0]]);",
    "  }",
    "}",
    "return res;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Queue • Sliding Window</span>
          <h1>Sliding Window Maximum</h1>
          <p className="description">Given an array and a sliding window of size K, find the maximum element in the window at each step. This is the classic problem that proves the immense power of the Deque (Double Ended Queue).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(K)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Naive Approach</h2><p>Scanning all K elements for every shift takes O(N*K) time. For large windows, this is brutally slow.</p></article>
          <article className="guide-card highlight"><h2>Monotonic Deque</h2><p>We use a Deque to store indices. We maintain it such that the values it points to are strictly decreasing. This guarantees the absolute maximum for the current window is always at the `front`.</p></article>
          <article className="guide-card"><h2>Two Exits</h2><p>Elements leave the Deque for two reasons: (1) from the back, because a larger element came in and rendered them permanently useless. (2) from the front, because the window simply slid past their index.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Deque cleanly maintain the window maximum in O(1) amortized time per step.</span>
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
               
               <div style={{ display: 'flex', gap: '8px', position: 'relative', minHeight: '60px', alignItems: 'center' }}>
                 {nums.map((val, i) => {
                   const isCurrent = step.idx === i;
                   const inWindow = step.idx !== -1 && i <= step.idx && i > step.idx - k;
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';

                   if (isCurrent) {
                     border = 'var(--amber)';
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                   } else if (inWindow) {
                     border = 'var(--blue)';
                   }

                   return (
                     <div key={i} style={{
                       width: '45px', height: '45px', background: bg, border: `3px solid ${border}`, borderRadius: '6px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontSize: '18px', fontWeight: 'bold', color: 'var(--text)',
                       opacity: (step.idx === -1 || inWindow || isCurrent) ? 1 : 0.3, transition: 'all 0.3s'
                     }}>
                       {val}
                     </div>
                   )
                 })}
                 
                 {/* Window Box Indicator */}
                 {step.idx >= 0 && (
                   <div style={{
                     position: 'absolute',
                     left: `${Math.max(0, step.idx - k + 1) * 53}px`,
                     width: `${Math.min(k, step.idx + 1) * 53 - 8}px`,
                     height: '55px',
                     border: '2px dashed var(--blue)',
                     borderRadius: '8px',
                     pointerEvents: 'none',
                     transition: 'all 0.3s'
                   }} />
                 )}
               </div>

               <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Deque (Stores Indices)</span>
                   <div style={{ 
                     display: 'flex', gap: '4px', border: '3px solid var(--border)', borderLeft: 'none', borderRight: 'none', padding: '8px 10px', 
                     minWidth: '200px', minHeight: '55px', background: 'var(--panel2)',
                     justifyContent: 'flex-start', alignItems: 'center'
                   }}>
                     {step.deque.map((idx, i) => (
                       <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                         <div style={{
                           width: '40px', height: '40px', background: 'var(--panel)',
                           border: '2px solid var(--blue)', borderRadius: '6px',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontWeight: 'bold', fontSize: '16px', color: 'var(--blue)'
                         }}>
                           {nums[idx]}
                         </div>
                         <span style={{ fontSize: '10px', color: 'var(--muted)' }}>i:{idx}</span>
                       </div>
                     ))}
                     {step.deque.length === 0 && <span style={{ color: 'var(--muted)', width: '100%', textAlign: 'center', fontSize: '14px' }}>Empty</span>}
                   </div>
                   <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                     <span>← Front (Max)</span>
                     <span>Back →</span>
                   </div>
                 </div>

               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Result Array</span>
                 <div style={{ display: 'flex', gap: '4px', minHeight: '35px' }}>
                   {step.result.map((val, i) => (
                     <div key={i} style={{
                       width: '35px', height: '35px', background: 'var(--panel)', border: `2px solid var(--green)`, borderRadius: '4px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: 'var(--green)'
                     }}>
                       {val}
                     </div>
                   ))}
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

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface NegStep {
  type: string;
  idx: number;
  deque: number[];
  result: number[];
  message: string;
  line?: number;
}

function simulateFirstNegative(): NegStep[] {
  const steps: NegStep[] = [];
  const arr = [12, -1, -7, 8, -15, 30];
  const K = 3;
  const deque: number[] = [];
  const result: number[] = [];

  steps.push({ type: "init", idx: -1, deque: [...deque], result: [...result], message: `Find first negative in every window of size ${K}.`, line: 0 });

  for (let i = 0; i < arr.length; i++) {
    steps.push({ type: "process", idx: i, deque: [...deque], result: [...result], message: `Processing index ${i} (value: ${arr[i]}).`, line: 1 });

    if (deque.length > 0 && deque[0] <= i - K) {
      const removed = deque.shift()!;
      steps.push({ type: "remove_old", idx: i, deque: [...deque], result: [...result], message: `Index ${removed} is outside the current window of size ${K}. Removed from front of deque.`, line: 2 });
    }

    if (arr[i] < 0) {
      deque.push(i);
      steps.push({ type: "add_neg", idx: i, deque: [...deque], result: [...result], message: `${arr[i]} is negative! Push its index (${i}) to the rear of the deque.`, line: 3 });
    }

    if (i >= K - 1) {
      const ans = deque.length > 0 ? arr[deque[0]] : 0;
      result.push(ans);
      steps.push({ type: "record_ans", idx: i, deque: [...deque], result: [...result], message: `Window [${i - K + 1}...${i}] complete. First negative is at front of deque: ${ans}.`, line: 5 });
    }
  }

  steps.push({ type: "done", idx: -1, deque: [...deque], result: [...result], message: `Done. Final result array: [${result.join(', ')}].`, line: 7 });

  return steps;
}

export default function FirstNegativeWindowLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateFirstNegative(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const arr = [12, -1, -7, 8, -15, 30];
  const K = 3;

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
    "let deque = []; let result = [];",
    "for (let i = 0; i < n; i++) {",
    "  if (deque.length > 0 && deque[0] <= i - k) {",
    "    deque.shift();",
    "  }",
    "  if (arr[i] < 0) {",
    "    deque.push(i);",
    "  }",
    "  if (i >= k - 1) {",
    "    if (deque.length > 0) result.push(arr[deque[0]]);",
    "    else result.push(0);",
    "  }",
    "}",
    "return result;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Queue • Sliding Window</span>
          <h1>First Negative Integer in Window</h1>
          <p className="description">Given an array and an integer K, find the first negative integer for each and every window (contiguous subarray) of size K.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(K)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Queue (Deque)</h2><p>We use a double-ended queue (or standard queue) to store the indices of negative numbers currently in our sliding window.</p></article>
          <article className="guide-card highlight"><h2>Expiring Old Data</h2><p>As the window slides right, the index at the front of the queue might fall out of the window. We must `shift()` it out if `deque[0] &lt;= i - K`.</p></article>
          <article className="guide-card"><h2>Recording Answers</h2><p>Once we've processed at least K elements, the front of the queue is guaranteed to be the FIRST negative number in our current window. If the queue is empty, there are no negatives.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Sliding Window move across the array and the Queue track negative indices.</span>
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
               
               <div style={{ display: 'flex', gap: '8px' }}>
                 {arr.map((val, i) => {
                   let isInWindow = step.idx >= 0 && i > step.idx - K && i <= step.idx;
                   if (step.idx < K - 1 && step.idx >= 0) isInWindow = i <= step.idx;

                   const isNegative = val < 0;
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';

                   if (isInWindow) {
                     border = 'var(--blue)';
                     bg = 'color-mix(in srgb, var(--blue) 10%, transparent)';
                   }
                   if (i === step.idx) border = 'var(--amber)';

                   return (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <div style={{
                         width: '45px', height: '45px', background: bg, border: `3px solid ${border}`, borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontSize: '18px', fontWeight: 'bold', color: isNegative ? 'var(--red)' : 'var(--text)',
                         transition: 'all 0.3s'
                       }}>
                         {val}
                       </div>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>[{i}]</span>
                     </div>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', gap: '40px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Deque (Indices)</span>
                   <div style={{ display: 'flex', gap: '4px', border: '2px solid var(--border)', padding: '8px', borderRadius: '8px', minWidth: '100px', minHeight: '50px' }}>
                     {step.deque.map((idx, i) => (
                       <div key={i} style={{
                         width: '35px', height: '35px', background: 'var(--panel)', border: '2px solid var(--red)', borderRadius: '4px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--red)'
                       }}>
                         {idx}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Result Array</span>
                   <div style={{ display: 'flex', gap: '4px', minWidth: '100px', minHeight: '50px', alignItems: 'center' }}>
                     {step.result.map((res, i) => (
                       <div key={i} style={{
                         width: '40px', height: '40px', background: 'var(--panel2)', border: '2px solid var(--green)', borderRadius: '4px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--green)'
                       }}>
                         {res}
                       </div>
                     ))}
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

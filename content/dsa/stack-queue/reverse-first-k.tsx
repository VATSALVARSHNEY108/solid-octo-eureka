"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface RevKStep {
  type: string;
  queue: number[];
  stack: number[];
  message: string;
  line?: number;
}

function simulateReverseFirstK(): RevKStep[] {
  const steps: RevKStep[] = [];
  const q = [10, 20, 30, 40, 50];
  const s: number[] = [];
  const k = 3;

  steps.push({ type: "init", queue: [...q], stack: [...s], message: `Reverse first K=${k} elements of Queue [10, 20, 30, 40, 50].`, line: 0 });

  // Step 1: Dequeue first K elements and push to Stack
  for (let i = 0; i < k; i++) {
    const val = q.shift()!;
    s.push(val);
    steps.push({ type: "push", queue: [...q], stack: [...s], message: `Step 1: Dequeue ${val} and Push to Stack. (${i+1}/${k})`, line: 2 });
  }

  // Step 2: Pop from Stack and Enqueue back to Queue
  for (let i = 0; i < k; i++) {
    const val = s.pop()!;
    q.push(val);
    steps.push({ type: "enqueue_stack", queue: [...q], stack: [...s], message: `Step 2: Pop ${val} from Stack and Enqueue to Queue. First K elements are now at the back, reversed!`, line: 6 });
  }

  // Step 3: Rotate remaining (N - K) elements
  const remaining = q.length - k;
  for (let i = 0; i < remaining; i++) {
    const val = q.shift()!;
    q.push(val);
    steps.push({ type: "rotate", queue: [...q], stack: [...s], message: `Step 3: Dequeue ${val} and immediately Enqueue it. This rotates the unreversed elements back to their correct relative positions.`, line: 10 });
  }

  steps.push({ type: "done", queue: [...q], stack: [...s], message: `Done! Queue is now [${q.join(', ')}].`, line: 13 });

  return steps;
}

export default function ReverseFirstKLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateReverseFirstK(), []);
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
    "function reverseFirstK(q, k) {",
    "  let stack = [];",
    "  for (let i = 0; i < k; i++) {",
    "    stack.push(q.shift());",
    "  }",
    "  while (stack.length > 0) {",
    "    q.push(stack.pop());",
    "  }",
    "  let rem = q.length - k;",
    "  for (let i = 0; i < rem; i++) {",
    "    q.push(q.shift());",
    "  }",
    "  return q;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Queue • Algorithms</span>
          <h1>Reverse First K Elements of Queue</h1>
          <p className="description">Given an integer K and a queue, reverse the order of the first K elements, leaving the remaining elements in their original relative order.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(K)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>1. Isolate and Reverse</h2><p>Pop the first K elements into a stack. This inherently reverses them. Then pop from the stack and enqueue them back. Now the reversed K elements are at the back of the queue.</p></article>
          <article className="guide-card highlight"><h2>2. The Problem</h2><p>Wait, if they are at the back, the queue is out of order! `1, 2, 3, 4, 5` (k=3) became `4, 5, 3, 2, 1`. The unreversed elements `4, 5` are stuck at the front.</p></article>
          <article className="guide-card"><h2>3. The Rotation Fix</h2><p>To fix this, simply dequeue the remaining `N - K` elements (`4, 5`) and immediately enqueue them back to the rear! This rotates the queue to `3, 2, 1, 4, 5`.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the 3-phase process: Push K, Pop K, Rotate (N-K).</span>
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
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px' }}>The Queue</span>
                   <div style={{ 
                     display: 'flex', gap: '4px', border: '3px solid var(--green)', padding: '8px', 
                     borderRadius: '8px', minWidth: '300px', minHeight: '60px', background: 'var(--panel2)',
                     justifyContent: 'flex-start', alignItems: 'center'
                   }}>
                     {step.queue.map((val, idx) => (
                       <div key={idx} style={{
                         width: '45px', height: '45px', background: 'var(--panel)',
                         border: '2px solid var(--green)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '18px', color: 'var(--green)'
                       }}>
                         {val}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '10px' }}>Stack (Capacity K=3)</span>
                   <div style={{ 
                     width: '80px', height: '150px', border: '3px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                     background: 'var(--panel2)'
                   }}>
                     {step.stack.map((val, idx) => (
                       <div key={idx} style={{
                         width: '100%', height: '35px', background: 'var(--panel)',
                         border: '2px solid var(--blue)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '18px', color: 'var(--blue)'
                       }}>
                         {val}
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

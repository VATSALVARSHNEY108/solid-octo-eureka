"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface PGEStep {
  type: string;
  idx: number;
  stack: number[];
  result: number[];
  message: string;
  line?: number;
}

function simulatePGE(): PGEStep[] {
  const steps: PGEStep[] = [];
  const nums = [4, 8, 5, 2, 25];
  const n = nums.length;
  const stack: number[] = [];
  const result: number[] = new Array(n).fill(-1);

  steps.push({ type: "init", idx: -1, stack: [...stack], result: [...result], message: `Find Previous Greater Element for [4, 8, 5, 2, 25]. Iterate Left-to-Right.`, line: 0 });

  for (let i = 0; i < n; i++) {
    steps.push({ type: "visit", idx: i, stack: [...stack], result: [...result], message: `Visiting ${nums[i]} at index ${i}.`, line: 1 });

    while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {
      const popped = stack.pop()!;
      steps.push({ 
        type: "pop", idx: i, stack: [...stack], result: [...result], 
        message: `${popped} is <= ${nums[i]}. It can't be the Previous Greater for ${nums[i]}. Pop it!`,
        line: 2 
      });
    }

    if (stack.length > 0) {
      result[i] = stack[stack.length - 1];
      steps.push({ type: "found", idx: i, stack: [...stack], result: [...result], message: `Stack has elements. Top element ${stack[stack.length - 1]} is strictly greater! Record it.`, line: 4 });
    } else {
      steps.push({ type: "empty", idx: i, stack: [...stack], result: [...result], message: `Stack is empty. No greater element exists to the left. Record -1.`, line: 5 });
    }

    stack.push(nums[i]);
    steps.push({ type: "push", idx: i, stack: [...stack], result: [...result], message: `Push ${nums[i]} to stack.`, line: 7 });
  }

  steps.push({ type: "done", idx: -1, stack: [...stack], result: [...result], message: `Done! Result: [${result.join(', ')}].`, line: 9 });

  return steps;
}

export default function PreviousGreaterElementLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulatePGE(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const nums = [4, 8, 5, 2, 25];

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
    "let stack = []; let result = new Array(n).fill(-1);",
    "for (let i = 0; i < n; i++) {",
    "  while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {",
    "    stack.pop();",
    "  }",
    "  if (stack.length > 0) {",
    "    result[i] = stack[stack.length - 1];",
    "  }",
    "  stack.push(nums[i]);",
    "}",
    "return result;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Monotonic Stack</span>
          <h1>Previous Greater Element (PGE)</h1>
          <p className="description">Given an array, find the first strictly greater element to the left of each element. This relies on a Monotonic Decreasing Stack but traversed Left-to-Right.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Direction Change</h2><p>For NEXT Greater Element, we usually iterate right-to-left. For PREVIOUS Greater Element, we naturally iterate left-to-right, because the history we care about is on the left.</p></article>
          <article className="guide-card highlight"><h2>Decreasing Stack</h2><p>By popping any element that is `&lt;=` the current element, we ensure the stack strictly decreases from bottom to top. The top of the stack is always the closest greater element.</p></article>
          <article className="guide-card"><h2>Core Concept</h2><p>If an element `A` is smaller than the current element `B`, `A` can NEVER be the "Previous Greater" for any future elements, because `B` blocks it. Thus, it's safe to pop `A` forever.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Left-to-Right traversal using a Decreasing Stack.</span>
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
                 {nums.map((val, i) => {
                   const isCurrent = step.idx === i;
                   const isProcessed = step.idx !== -1 && i < step.idx;
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';

                   if (isCurrent) {
                     border = 'var(--amber)';
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                   } else if (isProcessed) {
                     border = 'var(--blue)';
                   }

                   return (
                     <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <div style={{
                         width: '45px', height: '45px', background: bg, border: `3px solid ${border}`, borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontSize: '18px', fontWeight: 'bold', color: 'var(--text)',
                         opacity: isProcessed || isCurrent ? 1 : 0.4, transition: 'all 0.3s'
                       }}>
                         {val}
                       </div>
                       <div style={{
                         width: '45px', height: '30px', background: 'var(--panel)', border: `2px solid var(--green)`, borderRadius: '4px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontSize: '14px', fontWeight: 'bold', color: 'var(--green)'
                       }}>
                         {step.result[i] === -1 ? '-' : step.result[i]}
                       </div>
                     </div>
                   )
                 })}
               </div>
               <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Top row: Array | Bottom row: PGE Result</span>

               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                 <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Monotonic Decreasing Stack</span>
                 <div style={{ 
                   width: '120px', minHeight: '150px', border: '3px solid var(--border)', borderTop: 'none', 
                   borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                   display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                   background: 'var(--panel2)'
                 }}>
                   {step.stack.map((val, idx) => (
                     <div key={idx} style={{
                       width: '100%', height: '35px', background: 'var(--panel)',
                       border: '2px solid var(--blue)', borderRadius: '6px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontWeight: 'bold', fontSize: '18px', color: 'var(--blue)', animation: 'slideUp 0.3s'
                     }}>
                       {val}
                     </div>
                   ))}
                   {step.stack.length === 0 && <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: '14px' }}>Empty</div>}
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
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

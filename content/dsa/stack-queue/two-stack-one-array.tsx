"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface TStep {
  type: string;
  arr: (number | null)[];
  top1: number;
  top2: number;
  message: string;
  line?: number;
}

function simulateTwoStack(): TStep[] {
  const steps: TStep[] = [];
  const size = 6;
  const arr: (number | null)[] = Array(size).fill(null);
  let top1 = -1;
  let top2 = size;

  steps.push({ type: "init", arr: [...arr], top1, top2, message: `Initialize two pointers: top1 at -1, top2 at ${size} (Size).`, line: 0 });

  function push1(val: number, lineIdx: number) {
    if (top2 - top1 > 1) {
      top1++;
      arr[top1] = val;
      steps.push({ type: "push1", arr: [...arr], top1, top2, message: `Pushing ${val} to Stack 1. Increment top1 to ${top1}.`, line: lineIdx + 2 });
    } else {
      steps.push({ type: "overflow", arr: [...arr], top1, top2, message: `Pushing ${val} to Stack 1 failed. Overflow! Arrays have collided.`, line: lineIdx + 1 });
    }
  }

  function push2(val: number, lineIdx: number) {
    if (top2 - top1 > 1) {
      top2--;
      arr[top2] = val;
      steps.push({ type: "push2", arr: [...arr], top1, top2, message: `Pushing ${val} to Stack 2. Decrement top2 to ${top2}.`, line: lineIdx + 6 });
    } else {
      steps.push({ type: "overflow", arr: [...arr], top1, top2, message: `Pushing ${val} to Stack 2 failed. Overflow! Arrays have collided.`, line: lineIdx + 5 });
    }
  }

  function pop1(lineIdx: number) {
    if (top1 >= 0) {
      const val = arr[top1];
      arr[top1] = null;
      steps.push({ type: "pop1", arr: [...arr], top1: top1 - 1, top2, message: `Popped ${val} from Stack 1. Decrement top1.`, line: lineIdx + 3 });
      top1--;
    }
  }

  push1(10, 1);
  push2(90, 5);
  push1(20, 1);
  push2(80, 5);
  push1(30, 1);
  push1(40, 1); // Fills the array
  push2(70, 5); // Overflow

  return steps;
}

export default function TwoStackOneArrayLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateTwoStack(), []);
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
    "function push1(x) {",
    "  if (top2 - top1 > 1) {",
    "    top1++; arr[top1] = x;",
    "  }",
    "}",
    "function push2(x) {",
    "  if (top2 - top1 > 1) {",
    "    top2--; arr[top2] = x;",
    "  }",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Advanced Implementation</span>
          <h1>Two Stacks in One Array</h1>
          <p className="description">How can you efficiently implement two separate stacks within a single statically sized array? The trick is to start at opposite ends and grow inwards.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(1)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Naive Approach</h2><p>You could divide the array strictly in half (indices 0 to N/2 for Stack 1, and N/2 to N for Stack 2). But if Stack 1 gets full while Stack 2 is completely empty, you throw an Overflow error despite having empty space.</p></article>
          <article className="guide-card highlight"><h2>The Optimal Approach</h2><p>Initialize `top1 = -1` and `top2 = size`. Stack 1 grows left-to-right. Stack 2 grows right-to-left. This way, no space is wasted. You only overflow when the two pointers collide.</p></article>
          <article className="guide-card"><h2>The Collision Condition</h2><p>The stacks are completely full ONLY when `top2 - top1 == 1`. At this exact moment, there are zero empty slots between them.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch Stack 1 grow from the Left, and Stack 2 grow from the Right, until they collide in the middle.</span>
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
               
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
                 
                 <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                   
                   {/* Top 1 Indicator */}
                   <div style={{ position: 'absolute', top: '-45px', left: `${step.top1 * 68 + 10}px`, color: 'var(--amber)', fontWeight: 'bold', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span>Top 1</span>
                     <span>▼</span>
                   </div>
                   
                   {step.arr.map((val, idx) => (
                     <div key={idx} style={{
                       width: '60px', height: '60px', background: val !== null ? 'var(--panel)' : 'transparent',
                       border: val !== null ? `2px solid ${idx <= step.top1 ? 'var(--amber)' : 'var(--blue)'}` : '2px dashed var(--border)',
                       borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontWeight: 'bold', fontSize: '20px', color: 'var(--text)'
                     }}>
                       {val !== null ? val : ''}
                     </div>
                   ))}

                   {/* Top 2 Indicator */}
                   <div style={{ position: 'absolute', bottom: '-45px', left: `${step.top2 * 68 + 10}px`, color: 'var(--blue)', fontWeight: 'bold', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <span>▲</span>
                     <span>Top 2</span>
                   </div>

                 </div>

               </div>

               {step.type === "overflow" && (
                 <div style={{ padding: '10px 20px', background: 'color-mix(in srgb, var(--red) 10%, transparent)', border: '2px solid var(--red)', color: 'var(--red)', borderRadius: '8px', fontWeight: 'bold', marginTop: '20px' }}>
                   OVERFLOW: Pointers Collided!
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

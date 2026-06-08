"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface RecurseStep {
  type: string;
  n: number;
  stack: number[];
  result: string;
  message: string;
  line?: number;
}

function simulateRecursion(): RecurseStep[] {
  const steps: RecurseStep[] = [];
  const stack: number[] = [];
  const result = "";

  steps.push({ type: "init", n: 3, stack: [...stack], result, message: `Calculate factorial(3) using the System Call Stack.`, line: 0 });

  function factorial(n: number, depth: number): number {
    stack.push(n);
    steps.push({ type: "push", n, stack: [...stack], result, message: `Call factorial(${n}). Pushed to Call Stack.`, line: 1 });

    if (n === 1) {
      steps.push({ type: "base", n, stack: [...stack], result, message: `Base Case reached! factorial(1) returns 1.`, line: 2 });
      stack.pop();
      return 1;
    }

    steps.push({ type: "wait", n, stack: [...stack], result, message: `factorial(${n}) pauses and waits for factorial(${n-1}).`, line: 4 });
    const sub = factorial(n - 1, depth + 1);
    
    const ans = n * sub;
    stack.pop();
    steps.push({ type: "pop", n, stack: [...stack], result, message: `factorial(${n}) resumes. ${n} * ${sub} = ${ans}. Popped from Call Stack.`, line: 4 });
    return ans;
  }

  const finalAns = factorial(3, 1);
  steps.push({ type: "done", n: 3, stack: [...stack], result: `Ans: ${finalAns}`, message: `Done! factorial(3) = ${finalAns}. Call Stack is empty.`, line: 6 });

  return steps;
}

export default function RecursionCallStackLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

  const steps = useMemo(() => simulateRecursion(), []);
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
    "function factorial(n) {",
    "  if (n === 1) {",
    "    return 1;",
    "  }",
    "  return n * factorial(n - 1);",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Fundamentals</span>
          <h1>The Recursion Call Stack</h1>
          <p className="description">Every time a function calls itself, the computer uses a hidden data structure called the "Call Stack" to remember where it left off.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Execution Context</h2><p>When `factorial(3)` calls `factorial(2)`, the computer cannot just overwrite the `n=3` variable. It creates a brand new "Execution Context" and pushes it to the top of the Call Stack.</p></article>
          <article className="guide-card highlight"><h2>LIFO in Action</h2><p>The last function called (`factorial(1)`) is the first function to finish. As it returns, its context is popped off the stack, and the function beneath it resumes exactly where it paused.</p></article>
          <article className="guide-card"><h2>Stack Overflow</h2><p>If you forget the Base Case, the recursion will never stop. The Call Stack will grow infinitely until it exceeds the memory allocated by the OS, causing a crash known as a "Stack Overflow".</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the System Call Stack grow during the recursive descent, and shrink as it unwinds.</span>
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
               
               <div style={{ display: 'flex', gap: '40px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '14px', color: 'var(--amber)', fontWeight: 'bold', marginBottom: '10px' }}>System Call Stack</span>
                   <div style={{ 
                     width: '180px', height: '220px', border: '3px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                     background: 'color-mix(in srgb, var(--amber) 5%, transparent)'
                   }}>
                     {step.stack.map((nVal, idx) => (
                       <div key={idx} style={{
                         width: '100%', height: '40px', background: 'var(--panel)',
                         border: '2px solid var(--amber)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '16px', color: 'var(--amber)',
                         fontFamily: 'monospace', animation: 'slideUp 0.3s'
                       }}>
                         factorial({nVal})
                       </div>
                     ))}
                     {step.stack.length === 0 && <span style={{ color: 'var(--muted)', width: '100%', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontSize: '14px' }}>Empty</span>}
                   </div>
                 </div>

                 {step.result && (
                   <div style={{ padding: '15px 30px', background: 'color-mix(in srgb, var(--green) 10%, transparent)', border: '2px solid var(--green)', color: 'var(--green)', borderRadius: '12px', fontSize: '24px', fontWeight: 'bold' }}>
                     {step.result}
                   </div>
                 )}

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

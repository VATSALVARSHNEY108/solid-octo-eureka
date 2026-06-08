"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface RevStackStep {
  type: string;
  stack: number[];
  callStack: string[];
  message: string;
  line?: number;
}

function simulateReverseStack(): RevStackStep[] {
  const steps: RevStackStep[] = [];
  const s = [1, 2, 3];
  const callStack: string[] = [];

  steps.push({ type: "init", stack: [...s], callStack: [...callStack], message: `Reverse Stack [1, 2, 3] recursively.`, line: 0 });

  function insertAtBottom(val: number) {
    if (s.length === 0) {
      s.push(val);
      callStack.pop();
      steps.push({ type: "insert_base", stack: [...s], callStack: [...callStack], message: `insertAtBottom(${val}): Stack is empty. Push ${val} directly. Base case reached.`, line: 9 });
      return;
    }
    
    callStack.push(`insertAtBottom(${val})`);
    const temp = s.pop()!;
    steps.push({ type: "insert_recurse", stack: [...s], callStack: [...callStack], message: `insertAtBottom(${val}): Pop ${temp} and hold it. Recurse down.`, line: 12 });
    
    insertAtBottom(val);
    
    s.push(temp);
    steps.push({ type: "insert_back", stack: [...s], callStack: [...callStack], message: `Return from insertAtBottom. Push ${temp} back on top.`, line: 14 });
  }

  function reverse() {
    if (s.length === 0) {
      steps.push({ type: "rev_base", stack: [...s], callStack: [...callStack], message: `reverse(): Stack is empty. Base case reached.`, line: 1 });
      return;
    }

    callStack.push(`reverse()`);
    const temp = s.pop()!;
    steps.push({ type: "rev_recurse", stack: [...s], callStack: [...callStack], message: `reverse(): Pop ${temp} and hold it. Recurse down to empty the stack.`, line: 4 });
    
    reverse();
    
    callStack.pop();
    steps.push({ type: "rev_insert", stack: [...s], callStack: [...callStack], message: `reverse() returned. Now calling insertAtBottom(${temp}).`, line: 6 });
    insertAtBottom(temp);
  }

  reverse();

  steps.push({ type: "done", stack: [...s], callStack: [...callStack], message: `Done! Stack is fully reversed to [3, 2, 1].`, line: 7 });

  return steps;
}

export default function ReverseStackLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

  const steps = useMemo(() => simulateReverseStack(), []);
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
    "function reverse(stack) {",
    "  if (stack.length === 0) return;",
    "  let temp = stack.pop();",
    "  reverse(stack);",
    "  insertAtBottom(stack, temp);",
    "}",
    "function insertAtBottom(stack, val) {",
    "  if (stack.length === 0) {",
    "    stack.push(val); return;",
    "  }",
    "  let temp = stack.pop();",
    "  insertAtBottom(stack, val);",
    "  stack.push(temp);",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Recursion</span>
          <h1>Reverse a Stack</h1>
          <p className="description">Reverse a stack using ONLY recursion. You are not allowed to use any loops or auxiliary data structures (like another stack or queue).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N^2)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Call Stack</h2><p>Since we can't use an external array or stack, we use the System Call Stack! We recursively pop elements until the stack is empty, storing the popped values in local variables (`temp`) at each recursive level.</p></article>
          <article className="guide-card highlight"><h2>Reverse()</h2><p>The `reverse()` function empties the entire stack. On its way back up (as the recursion unwinds), it takes the element it popped and asks `insertAtBottom` to put it at the very bottom.</p></article>
          <article className="guide-card"><h2>InsertAtBottom()</h2><p>Because the top is blocked by other elements, this function recursively pops everything out of the way, pushes the desired element at the absolute bottom, and then puts everything back on top.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the beautiful double-recursion in action.</span>
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
               
               <div style={{ display: 'flex', gap: '80px', width: '100%', justifyContent: 'center' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '8px' }}>Data Stack</span>
                   <div style={{ 
                     width: '100px', height: '180px', border: '3px solid var(--border)', borderTop: 'none', 
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

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--amber)', marginBottom: '8px' }}>Call Stack</span>
                   <div style={{ 
                     width: '200px', height: '180px', border: '2px dashed var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '4px',
                     background: 'color-mix(in srgb, var(--amber) 5%, transparent)'
                   }}>
                     {step.callStack.map((val, idx) => (
                       <div key={idx} style={{
                         width: '100%', height: '25px', background: 'var(--panel)',
                         border: '1px solid var(--amber)', borderRadius: '4px',
                         display: 'flex', alignItems: 'center', paddingLeft: '8px',
                         fontSize: '11px', color: 'var(--amber)', fontFamily: 'monospace'
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

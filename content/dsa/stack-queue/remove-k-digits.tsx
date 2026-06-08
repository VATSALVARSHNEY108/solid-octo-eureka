"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface RemoveStep {
  type: string;
  idx: number;
  k: number;
  stack: string[];
  message: string;
  line?: number;
}

function simulateRemoveKDigits(): RemoveStep[] {
  const steps: RemoveStep[] = [];
  const num = "1432219";
  let k = 3;
  const stack: string[] = [];

  steps.push({ type: "init", idx: -1, k, stack: [...stack], message: `Remove ${k} digits from "${num}" to make the smallest number.`, line: 0 });

  for (let i = 0; i < num.length; i++) {
    const char = num[i];
    steps.push({ type: "visit", idx: i, k, stack: [...stack], message: `Visiting digit '${char}'.`, line: 1 });

    while (stack.length > 0 && k > 0 && stack[stack.length - 1] > char) {
      const popped = stack.pop()!;
      k--;
      steps.push({ 
        type: "pop", idx: i, k, stack: [...stack], 
        message: `'${popped}' > '${char}'. Popping '${popped}' makes the number smaller. K is now ${k}.`,
        line: 2 
      });
    }

    if (stack.length > 0 || char !== '0') {
      stack.push(char);
      steps.push({ type: "push", idx: i, k, stack: [...stack], message: `Push '${char}' to stack.`, line: 5 });
    } else {
      steps.push({ type: "skip_zero", idx: i, k, stack: [...stack], message: `Leading zero skipped.`, line: 6 });
    }
  }

  while (k > 0 && stack.length > 0) {
    const popped = stack.pop()!;
    k--;
    steps.push({ type: "pop_extra", idx: num.length, k, stack: [...stack], message: `Still need to remove ${k+1} digits. Popping '${popped}' from the end.`, line: 9 });
  }

  if (stack.length === 0) stack.push('0');
  steps.push({ type: "done", idx: -1, k, stack: [...stack], message: `Done! Smallest number is "${stack.join('')}".`, line: 12 });

  return steps;
}

export default function RemoveKDigitsLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateRemoveKDigits(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const num = "1432219";

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
    "let stack = [];",
    "for (let char of num) {",
    "  while (k > 0 && stack.length > 0 && stack[stack.length - 1] > char) {",
    "    stack.pop();",
    "    k--;",
    "  }",
    "  if (stack.length > 0 || char !== '0') {",
    "    stack.push(char);",
    "  }",
    "}",
    "while (k > 0 && stack.length > 0) {",
    "  stack.pop();",
    "  k--;",
    "}",
    "return stack.length === 0 ? '0' : stack.join('');"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Greedy Algorithms</span>
          <h1>Remove K Digits</h1>
          <p className="description">Given a string representing a non-negative integer, remove exactly K digits to form the smallest possible integer.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The Greedy Choice</h2><p>In the number `432`, removing `4` yields `32`, but removing `2` yields `43`. You always want smaller digits at the most significant (leftmost) positions.</p></article>
          <article className="guide-card highlight"><h2>Monotonic Stack</h2><p>We use a stack to build our answer. If the current digit is smaller than the top of the stack, popping the top of the stack makes the overall number smaller!</p></article>
          <article className="guide-card"><h2>Edge Cases</h2><p>Watch out for leading zeros (don't push '0' into an empty stack) and cases where the digits are already in increasing order (like `1234`). In the latter, you must manually pop from the end until K is 0.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the Greedy Monotonic Stack in action. Notice how it eagerly deletes larger numbers to make way for smaller ones.</span>
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
               
               <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                 <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px' }}>
                   {num.split('').map((char, i) => {
                     const isCurrent = step.idx === i;
                     return (
                       <span key={i} style={{
                         color: isCurrent ? 'var(--amber)' : (i < step.idx ? 'var(--muted)' : 'var(--text)'),
                         borderBottom: isCurrent ? '2px solid var(--amber)' : 'none',
                         transition: 'all 0.3s'
                       }}>
                         {char}
                       </span>
                     )
                   })}
                 </div>

                 <div style={{ 
                   background: 'var(--panel2)', border: '2px solid var(--border)', borderRadius: '8px', padding: '10px 20px',
                   display: 'flex', flexDirection: 'column', alignItems: 'center'
                 }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>K (Removals Left)</span>
                   <span style={{ fontSize: '24px', fontWeight: 'bold', color: step.k > 0 ? 'var(--red)' : 'var(--green)' }}>{step.k}</span>
                 </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                 <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Stack (Resulting Digits)</span>
                 <div style={{ 
                   minWidth: '200px', height: '60px', border: '3px solid var(--green)', borderRadius: '8px',
                   display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px',
                   background: 'color-mix(in srgb, var(--green) 10%, transparent)'
                 }}>
                   {step.stack.map((char, idx) => (
                     <div key={idx} style={{
                       width: '35px', height: '35px', background: 'var(--panel)',
                       border: '2px solid var(--green)', borderRadius: '6px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontWeight: 'bold', fontSize: '18px', color: 'var(--green)'
                     }}>
                       {char}
                     </div>
                   ))}
                   {step.stack.length === 0 && <div style={{ color: 'var(--muted)', width: '100%', textAlign: 'center', fontSize: '14px' }}>Empty</div>}
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

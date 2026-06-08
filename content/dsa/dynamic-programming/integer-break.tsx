"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface IBSplitStep {
  type: string;
  i: number;
  j: number;
  dp: number[];
  message: string;
  line?: number;
}

function simulateIntegerBreak(): IBSplitStep[] {
  const steps: IBSplitStep[] = [];
  const n = 6;
  const dp = new Array(n + 1).fill(0);

  steps.push({ type: "init", i: -1, j: -1, dp: [...dp], message: "Initialize DP array. dp[i] is the max product you can get by breaking integer i.", line: 0 });

  dp[1] = 1; // Technically 1 can't be broken further but we'll use 1 for base case
  steps.push({ type: "base", i: 1, j: -1, dp: [...dp], message: "Base case: dp[1] = 1.", line: 1 });

  for (let i = 2; i <= n; i++) {
    steps.push({ type: "outer", i, j: -1, dp: [...dp], message: `Evaluating integer i = ${i}.`, line: 2 });
    for (let j = 1; j < i; j++) {
      steps.push({ type: "inner", i, j, dp: [...dp], message: `Splitting ${i} into ${j} and ${i - j}.`, line: 3 });
      
      const prod1 = j * (i - j);
      const prod2 = j * dp[i - j];
      const maxProd = Math.max(prod1, prod2);
      
      steps.push({ type: "compare", i, j, dp: [...dp], message: `Max between not breaking (${j} * ${i - j} = ${prod1}) and breaking (${j} * dp[${i - j}] = ${prod2}) is ${maxProd}.`, line: 4 });
      
      if (maxProd > dp[i]) {
        dp[i] = maxProd;
        steps.push({ type: "update", i, j, dp: [...dp], message: `New maximum found for ${i}: ${dp[i]}.`, line: 5 });
      } else {
        steps.push({ type: "skip", i, j, dp: [...dp], message: `Current max ${dp[i]} is still better or equal.`, line: 6 });
      }
    }
  }

  steps.push({ type: "done", i: -1, j: -1, dp: [...dp], message: `Done. The max product for ${n} is ${dp[n]}.`, line: 7 });
  return steps;
}

export default function IntegerBreakLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateIntegerBreak(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

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

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) {
      speak(step.message);
    }
  }, [step, isSpeechEnabled, speak]);

  const codeSnippet = [
    "let dp = new Array(n + 1).fill(0);",
    "dp[1] = 1;",
    "for (let i = 2; i <= n; i++) {",
    "  for (let j = 1; j < i; j++) {",
    "    let p1 = j * (i - j);",
    "    let p2 = j * dp[i - j];",
    "    dp[i] = Math.max(dp[i], p1, p2);",
    "  }",
    "}",
    "return dp[n];"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Math</span>
          <h1>Integer Break</h1>
          <p className="description">Given an integer n, break it into the sum of k positive integers, where k {'>'}= 2, and maximize the product of those integers.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N²)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This problem asks us to find the optimal way to break down a number to maximize the product of its parts. It demonstrates overlapping subproblems perfectly.</p></article>
          <article className="guide-card"><h2>The Logic</h2><p>To break `i`, we can try all possible first parts `j` (from 1 to `i-1`). The second part is `i-j`.</p></article>
          <article className="guide-card"><h2>To Break or Not?</h2><p>For the second part `i-j`, we have a choice: we can leave it as is, or we can break it down further. That's why we compare `j * (i-j)` with `j * dp[i-j]`.</p></article>
          <article className="guide-card highlight"><h2>Math Optimization</h2><p>Fun fact: breaking a number into 3s maximizes the product. A greedy math approach runs in O(1) time, but this DP solution runs in O(N^2).</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how breaking integer `i` at split point `j` updates the DP table.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "active" : ""} title="Toggle Voice Narration">
                  {isSpeechEnabled ? "🔊" : "🔇"}
                </button>
              </div>
              <label>Speed<input type="range" min="150" max="1400" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>i (Number)</div>
                   <div style={{ width: '50px', height: '50px', background: 'var(--panel2)', border: '2px solid var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                     {step.i > 0 ? step.i : '-'}
                   </div>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>j (Split 1)</div>
                   <div style={{ width: '50px', height: '50px', background: 'var(--panel2)', border: '2px solid var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                     {step.j > 0 ? step.j : '-'}
                   </div>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>i-j (Split 2)</div>
                   <div style={{ width: '50px', height: '50px', background: 'var(--panel2)', border: '2px solid var(--amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
                     {step.i > 0 && step.j > 0 ? step.i - step.j : '-'}
                   </div>
                 </div>
               </div>

               <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>DP Array (Max Product)</div>
               <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                 {step.dp.map((val, idx) => {
                   const isUpdating = step.type === "update" && step.i === idx;
                   const isDependency = step.i > 0 && step.j > 0 && idx === step.i - step.j;
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';
                   if (isUpdating) {
                     bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                     border = 'var(--blue)';
                   } else if (isDependency) {
                     border = 'var(--amber)';
                   }
                   
                   return (
                     <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)' }}>{idx}</span>
                       <div style={{
                         width: '45px', height: '40px', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: `2px solid ${border}`,
                         fontWeight: 'bold'
                       }}>
                         {val}
                       </div>
                     </div>
                   )
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '240px', marginTop: 'auto' }}>
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
        .actions, .editor, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select, textarea { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 8px 12px; }
        button { cursor: pointer; display: flex; align-items: center; justify-content: center; }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); display: inline-flex; text-decoration: none; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,126,248,0.5); filter: brightness(1.1); }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; margin-bottom: 80px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; transition: transform 0.3s, border-color 0.3s; }
        .guide-card:hover { transform: translateY(-4px); border-color: var(--blue); }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { background: linear-gradient(135deg, var(--panel), var(--panel2)); border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; margin-top: 40px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); margin-top: 24px; }
        aside { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
        .simulation-data { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
        .data-group h3 { font-size: 11px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; margin-bottom: 8px; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

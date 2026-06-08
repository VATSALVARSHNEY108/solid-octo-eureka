"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface CherryStep {
  type: string;
  stepIdx: number;
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  dp: number[][]; // We'll snapshot the 2D DP table (r1 x r2) for the current step
  message: string;
  line?: number;
}

function simulateCherryPickup(grid: number[][]): CherryStep[] {
  const steps: CherryStep[] = [];
  const n = grid.length;
  if (n === 0) return steps;

  // dp[r1][r2] will store max cherries for current step
  let dp = Array.from({ length: n }, () => Array(n).fill(-Infinity));
  dp[0][0] = grid[0][0];

  steps.push({ type: "init", stepIdx: 0, r1: -1, c1: -1, r2: -1, c2: -1, dp: dp.map(r => [...r]), message: `Initialize DP table. Both start at (0,0). Picked up ${grid[0][0]} cherries.`, line: 0 });

  for (let t = 1; t <= 2 * n - 2; t++) {
    steps.push({ type: "loop_step", stepIdx: t, r1: -1, c1: -1, r2: -1, c2: -1, dp: dp.map(r => [...r]), message: `Step ${t}: Moving to next cells.`, line: 1 });
    
    const nextDp = Array.from({ length: n }, () => Array(n).fill(-Infinity));
    
    for (let r1 = Math.max(0, t - (n - 1)); r1 <= Math.min(n - 1, t); r1++) {
      for (let r2 = Math.max(0, t - (n - 1)); r2 <= Math.min(n - 1, t); r2++) {
        const c1 = t - r1;
        const c2 = t - r2;
        
        steps.push({ type: "check_cell", stepIdx: t, r1, c1, r2, c2, dp: dp.map(r => [...r]), message: `Checking positions: Robot1 at (${r1},${c1}), Robot2 at (${r2},${c2}).`, line: 2 });

        if (grid[r1][c1] === -1 || grid[r2][c2] === -1) {
          steps.push({ type: "thorn", stepIdx: t, r1, c1, r2, c2, dp: dp.map(r => [...r]), message: `Thorn encountered. State is invalid.`, line: 3 });
          continue;
        }

        let currentCherry = grid[r1][c1];
        if (r1 !== r2) {
          currentCherry += grid[r2][c2]; // Add Robot2's cherry if they are not on the same cell
        }

        let maxPrev = -Infinity;
        // Previous moves: (Right, Right), (Down, Right), (Right, Down), (Down, Down)
        if (r1 > 0 && r2 > 0) maxPrev = Math.max(maxPrev, dp[r1 - 1][r2 - 1]); // Down, Down
        if (r1 > 0 && c2 > 0) maxPrev = Math.max(maxPrev, dp[r1 - 1][r2]);     // Down, Right
        if (c1 > 0 && r2 > 0) maxPrev = Math.max(maxPrev, dp[r1][r2 - 1]);     // Right, Down
        if (c1 > 0 && c2 > 0) maxPrev = Math.max(maxPrev, dp[r1][r2]);         // Right, Right

        steps.push({ type: "transition", stepIdx: t, r1, c1, r2, c2, dp: dp.map(r => [...r]), message: `Max cherries from previous step: ${maxPrev === -Infinity ? 'None (Blocked)' : maxPrev}. Adding ${currentCherry} from current cells.`, line: 4 });

        if (maxPrev !== -Infinity) {
          nextDp[r1][r2] = maxPrev + currentCherry;
          steps.push({ type: "update", stepIdx: t, r1, c1, r2, c2, dp: nextDp.map(r => [...r]), message: `nextDp[${r1}][${r2}] updated to ${nextDp[r1][r2]}.`, line: 5 });
        }
      }
    }
    dp = nextDp;
  }

  const ans = Math.max(0, dp[n - 1][n - 1]);
  steps.push({ type: "done", stepIdx: 2 * n - 2, r1: n - 1, c1: n - 1, r2: n - 1, c2: n - 1, dp: dp.map(r => [...r]), message: `Done. Maximum cherries collected: ${ans}.`, line: 6 });
  return steps;
}

export default function CherryPickupLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const n = 3;
  const [gridInput, setGridInput] = useState("0, 1, -1\n1, 0, -1\n1, 1,  1");
  const [grid, setGrid] = useState([
    [0, 1, -1],
    [1, 0, -1],
    [1, 1, 1]
  ]);
  
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateCherryPickup(grid), [grid]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [grid]);

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

  const applyGrid = () => {
    const lines = gridInput.trim().split("\n");
    if (lines.length === n) {
      const parsed = lines.map(l => l.split(",").map(s => parseInt(s.trim(), 10)));
      if (parsed.every(row => row.length === n && row.every(val => !isNaN(val) && val >= -1 && val <= 1))) {
        setGrid(parsed);
      } else {
        alert("Invalid input. Use only 0, 1, or -1.");
      }
    }
  };

  const codeSnippet = [
    "let dp = Array(N).fill().map(() => Array(N).fill(-Infinity));",
    "dp[0][0] = grid[0][0];",
    "for (let t = 1; t <= 2*N - 2; t++) {",
    "  let nextDp = Array(N).fill().map(() => Array(N).fill(-Infinity));",
    "  // iterate r1 and r2 within bounds for step t...",
    "  // compute c1 = t - r1, c2 = t - r2",
    "  // handle thorns and add cherries (only once if r1 == r2)",
    "  // maxPrev = max of 4 previous states",
    "  // nextDp[r1][r2] = maxPrev + currentCherry;",
    "  dp = nextDp;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Multi-Dimensional</span>
          <h1>Cherry Pickup</h1>
          <p className="description">Collect maximum cherries going from (0,0) to (N-1,N-1) and back. We can model this as two people starting at (0,0) simultaneously.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N^3)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N^2)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Instead of finding a path down and a path up, we imagine two agents starting at (0,0) and walking to (N-1,N-1) simultaneously.</p></article>
          <article className="guide-card"><h2>State Reduction</h2><p>Since they move at the same speed, after `t` steps, `r1 + c1 = r2 + c2 = t`. Thus, we only need to track `r1` and `r2` for the current step `t`.</p></article>
          <article className="guide-card"><h2>Transitions</h2><p>From the previous step `t-1`, there are 4 possible moves to reach `(r1, c1)` and `(r2, c2)`: (Right, Right), (Down, Right), (Right, Down), (Down, Down).</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>If `r1 == r2` (and thus `c1 == c2`), they are on the same cell, so we only add the cherry once. Otherwise, we add cherries from both cells.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Grid (3x3): 0=empty, 1=cherry, -1=thorn</label>
              <textarea 
                value={gridInput} 
                onChange={(e) => setGridInput(e.target.value)} 
                rows={3} 
                style={{ width: '120px', fontFamily: 'monospace', resize: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              <button onClick={applyGrid}>Update Grid</button>
              <button onClick={() => { setGridInput("0, 1, -1\n1, 0, -1\n1, 1,  1"); setGrid([[0,1,-1],[1,0,-1],[1,1,1]]); }}>Reset</button>
            </div>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the grid elements above (1 for cherry, -1 for thorn).</span>
                <span>▶️ Play to watch the two robots move simultaneously.</span>
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
               <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                 {/* Grid Visualization */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', background: 'var(--panel2)', padding: '8px', borderRadius: '12px' }}>
                   {grid.map((row, r) => row.map((val, c) => {
                     const isR1 = step.r1 === r && step.c1 === c;
                     const isR2 = step.r2 === r && step.c2 === c;
                     
                     let bg = 'var(--bg)';
                     if (isR1 && isR2) bg = 'color-mix(in srgb, var(--green) 30%, transparent)';
                     else if (isR1) bg = 'color-mix(in srgb, var(--blue) 30%, transparent)';
                     else if (isR2) bg = 'color-mix(in srgb, var(--amber) 30%, transparent)';

                     return (
                       <div key={`${r}-${c}`} style={{
                         width: '50px', height: '50px', borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: '1px solid var(--border)',
                         position: 'relative'
                       }}>
                         {val === 1 && <span style={{ fontSize: '24px' }}>🍒</span>}
                         {val === -1 && <span style={{ fontSize: '24px' }}>🌵</span>}
                         {isR1 && <div style={{ position: 'absolute', bottom: '2px', left: '2px', width: '10px', height: '10px', background: 'var(--blue)', borderRadius: '50%' }} />}
                         {isR2 && <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', background: 'var(--amber)', borderRadius: '50%' }} />}
                       </div>
                     )
                   }))}
                 </div>

                 {/* DP Table state visualization (r1 vs r2) for current step */}
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>dp[r1][r2] (Step {step.stepIdx})</div>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                     {step.dp.map((row, r1) => row.map((val, r2) => {
                       const isActive = step.r1 === r1 && step.r2 === r2;
                       return (
                         <div key={`dp-${r1}-${r2}`} style={{
                           width: '40px', height: '40px', borderRadius: '4px',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           background: isActive ? 'color-mix(in srgb, var(--green) 20%, transparent)' : 'var(--panel)',
                           border: `1px solid ${isActive ? 'var(--green)' : 'var(--border)'}`,
                           fontSize: '14px', fontFamily: 'monospace'
                         }}>
                           {val === -Infinity ? 'X' : val}
                         </div>
                       )
                     }))}
                   </div>
                 </div>
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
        .canvas { width: 100%; min-height: 560px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface MatrixPathStep {
  type: string;
  r: number;
  c: number;
  dp: number[][];
  maxVal: number;
  message: string;
  line?: number;
}

function simulateMaxPathSumMatrix(): MatrixPathStep[] {
  const steps: MatrixPathStep[] = [];
  const matrix = [
    [1, 2, 3],
    [9, 8, 7],
    [4, 5, 6]
  ];
  const R = matrix.length;
  const C = matrix[0].length;
  const dp = Array.from({ length: R }, () => Array(C).fill(0));

  steps.push({ type: "init", r: -1, c: -1, dp: dp.map(row => [...row]), maxVal: -Infinity, message: "Initialize DP matrix. The first row simply copies the input matrix.", line: 0 });

  for (let c = 0; c < C; c++) {
    dp[0][c] = matrix[0][c];
  }
  steps.push({ type: "base", r: 0, c: -1, dp: dp.map(row => [...row]), maxVal: -Infinity, message: "Base case: First row is copied.", line: 1 });

  for (let r = 1; r < R; r++) {
    for (let c = 0; c < C; c++) {
      steps.push({ type: "check", r, c, dp: dp.map(row => [...row]), maxVal: -Infinity, message: `Evaluating cell (${r}, ${c}) with value ${matrix[r][c]}.`, line: 2 });
      
      const upLeft = c > 0 ? dp[r-1][c-1] : -Infinity;
      const up = dp[r-1][c];
      const upRight = c < C - 1 ? dp[r-1][c+1] : -Infinity;
      
      const maxParent = Math.max(upLeft, up, upRight);
      dp[r][c] = matrix[r][c] + maxParent;
      
      steps.push({ type: "update", r, c, dp: dp.map(row => [...row]), maxVal: -Infinity, message: `Max of Up-Left, Up, Up-Right is ${maxParent}. Total = ${dp[r][c]}.`, line: 3 });
    }
  }

  let globalMax = -Infinity;
  for (let c = 0; c < C; c++) {
    if (dp[R-1][c] > globalMax) globalMax = dp[R-1][c];
  }

  steps.push({ type: "done", r: -1, c: -1, dp: dp.map(row => [...row]), maxVal: globalMax, message: `Done. The max path sum ending anywhere on the bottom row is ${globalMax}.`, line: 4 });
  return steps;
}

export default function MaximumPathSumMatrixLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateMaxPathSumMatrix(), []);
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
    "for (let c = 0; c < C; c++) dp[0][c] = matrix[0][c];",
    "",
    "for (let r = 1; r < R; r++) {",
    "  for (let c = 0; c < C; c++) {",
    "    let up = dp[r-1][c];",
    "    let upLeft = c > 0 ? dp[r-1][c-1] : -Infinity;",
    "    let upRight = c < C - 1 ? dp[r-1][c+1] : -Infinity;",
    "    ",
    "    dp[r][c] = matrix[r][c] + Math.max(up, upLeft, upRight);",
    "  }",
    "}",
    "return Math.max(...dp[R-1]);"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • 2D Grids</span>
          <h1>Maximum Path Sum in Matrix</h1>
          <p className="description">Find the maximum sum of a falling path through a matrix. You can start at any cell in the top row and fall down-left, down, or down-right.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(R * C)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(C)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is standard 2D Grid DP with a twist: you can start ANYWHERE in the top row, and you must reach the bottom row. At each step, you can fall to 3 possible adjacent columns.</p></article>
          <article className="guide-card"><h2>The Logic</h2><p>For any cell `(r, c)`, the maximum path to reach it is its own value plus the maximum of the three valid cells directly above it: `(r-1, c-1)`, `(r-1, c)`, or `(r-1, c+1)`.</p></article>
          <article className="guide-card"><h2>Out of Bounds</h2><p>When calculating `upLeft` or `upRight` for edge columns, the out-of-bounds cells are treated as `-Infinity` so they are never picked by the `Math.max` function.</p></article>
          <article className="guide-card highlight"><h2>The Answer</h2><p>Because the path can end anywhere in the bottom row, the final answer is the maximum value in the entire last row of the `dp` array.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the path sum fall from the top row to the bottom row.</span>
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
              
              {step.maxVal !== -Infinity && (
                <div style={{ marginTop: '20px', padding: '16px', background: 'var(--panel2)', borderRadius: '8px', border: '2px solid var(--amber)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Global Max Sum</span>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--amber)' }}>{step.maxVal}</div>
                </div>
              )}
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '8px', justifyContent: 'center' }}>
                 {step.dp.map((row, r) => 
                   row.map((val, c) => {
                     const isActive = step.r === r && step.c === c;
                     const isSource = step.r !== -1 && step.type !== "base" && r === step.r - 1 && Math.abs(c - step.c) <= 1;
                     
                     let bg = 'var(--panel)';
                     let border = 'var(--border)';
                     
                     if (isActive) {
                       bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                       border = 'var(--blue)';
                     } else if (isSource) {
                       bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                       border = 'var(--amber)';
                     } else if (val > 0) {
                       bg = 'var(--panel2)';
                     }
                     
                     return (
                       <div key={`${r}-${c}`} style={{
                         width: '60px', height: '60px', borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: `2px solid ${border}`,
                         fontSize: '20px', fontWeight: 'bold'
                       }}>
                         {val > 0 ? val : ''}
                       </div>
                     )
                   })
                 )}
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

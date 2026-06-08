"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface Path2Step {
  type: string;
  r: number;
  c: number;
  dp: number[][];
  message: string;
  line?: number;
}

function simulateUniquePathsII(): Path2Step[] {
  const steps: Path2Step[] = [];
  const grid = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ];
  const R = grid.length;
  const C = grid[0].length;
  
  const dp = Array.from({ length: R }, () => new Array(C).fill(0));

  steps.push({ type: "init", r: -1, c: -1, dp: dp.map(row => [...row]), message: "Initialize DP grid with 0s. The '1' in the original grid is an obstacle.", line: 0 });

  // Init Row 0
  for (let c = 0; c < C; c++) {
    if (grid[0][c] === 1) break; // Obstacle blocks everything after it in row 0
    dp[0][c] = 1;
    steps.push({ type: "init_row", r: 0, c, dp: dp.map(row => [...row]), message: `Row 0: Cell (0, ${c}) is clear, way = 1.`, line: 1 });
  }

  // Init Col 0
  for (let r = 1; r < R; r++) {
    if (grid[r][0] === 1) break;
    dp[r][0] = 1;
    steps.push({ type: "init_col", r, c: 0, dp: dp.map(row => [...row]), message: `Col 0: Cell (${r}, 0) is clear, way = 1.`, line: 2 });
  }

  for (let r = 1; r < R; r++) {
    for (let c = 1; c < C; c++) {
      if (grid[r][c] === 1) {
        dp[r][c] = 0;
        steps.push({ type: "obstacle", r, c, dp: dp.map(row => [...row]), message: `Obstacle at (${r}, ${c})! Cannot pass through. Paths = 0.`, line: 3 });
      } else {
        steps.push({ type: "check", r, c, dp: dp.map(row => [...row]), message: `Calculating paths to (${r}, ${c}). Summing paths from UP (${dp[r-1][c]}) and LEFT (${dp[r][c-1]}).`, line: 4 });
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        steps.push({ type: "update", r, c, dp: dp.map(row => [...row]), message: `Updated dp[${r}][${c}] to ${dp[r][c]}.`, line: 5 });
      }
    }
  }

  steps.push({ type: "done", r: -1, c: -1, dp: dp.map(row => [...row]), message: `Done. The number of unique paths to the bottom-right corner is ${dp[R-1][C-1]}.`, line: 6 });
  return steps;
}

export default function UniquePathsIILesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateUniquePathsII(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  const obstacleGrid = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ];

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
    "if (obstacleGrid[0][0] === 1) return 0;",
    "let dp = Array.from({ length: m }, () => new Array(n).fill(0));",
    "dp[0][0] = 1;",
    "// Initialize first col and row...",
    "for (let r = 1; r < m; r++) {",
    "  for (let c = 1; c < n; c++) {",
    "    if (obstacleGrid[r][c] === 1) {",
    "      dp[r][c] = 0;",
    "    } else {",
    "      dp[r][c] = dp[r-1][c] + dp[r][c-1];",
    "    }",
    "  }",
    "}",
    "return dp[m-1][n-1];"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • 2D Grids</span>
          <h1>Unique Paths II</h1>
          <p className="description">Find the number of unique paths from the top-left to the bottom-right of a grid, but this time, the grid contains obstacles that block your path.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(M * N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(M * N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a variation of "Unique Paths". The core logic remains the same: the number of ways to reach a cell is the sum of ways to reach the cell above it and the cell to its left.</p></article>
          <article className="guide-card highlight"><h2>The Obstacle Rule</h2><p>If a cell contains an obstacle (represented by `1`), you cannot step on it. Therefore, the number of ways to reach that specific cell is `0`.</p></article>
          <article className="guide-card"><h2>Edge Initialization</h2><p>When initializing the first row and column, if you hit an obstacle, all subsequent cells in that row/column must be `0` because they are permanently blocked.</p></article>
          <article className="guide-card"><h2>Optimization</h2><p>Just like Unique Paths, this can be optimized to `O(N)` space by only keeping track of the current row and the previous row, or even just a single 1D array.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the obstacle forces a 0 value, cutting off paths that would have gone through it.</span>
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
              <label>Speed<input type="range" min="150" max="2500" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
              <p className="counter">{stepIndex + 1} / {steps.length}</p>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                 {step.dp?.map((row, r) => (
                   <div key={r} style={{ display: 'flex', gap: '4px' }}>
                     {row.map((val, c) => {
                       const isObstacle = obstacleGrid[r][c] === 1;
                       const isActive = step.r === r && step.c === c;
                       const isSource = step.type === "check" && ((step.r === r + 1 && step.c === c) || (step.r === r && step.c === c + 1));
                       
                       let bg = 'var(--panel)';
                       let border = 'var(--border)';
                       
                       if (isObstacle) {
                         bg = 'var(--red)';
                         border = 'var(--red)';
                       } else if (isActive) {
                         bg = 'color-mix(in srgb, var(--amber) 30%, transparent)';
                         border = 'var(--amber)';
                       } else if (isSource) {
                         border = 'var(--blue)';
                       } else if (val > 0) {
                         bg = 'color-mix(in srgb, var(--green) 10%, transparent)';
                         border = 'var(--green)';
                       }

                       return (
                         <div key={c} style={{
                           width: '50px', height: '50px', borderRadius: '8px',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           background: bg, border: `2px solid ${border}`,
                           fontSize: '20px', fontWeight: 'bold', color: isObstacle ? '#fff' : 'var(--text)',
                           transition: 'all 0.3s'
                         }}>
                           {isObstacle ? 'X' : val}
                         </div>
                       )
                     })}
                   </div>
                 ))}
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

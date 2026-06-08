"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Simulating "Knight Probability in Chessboard"

interface ProbStep {
  type: string;
  k: number;
  r: number;
  c: number;
  prob: number;
  dp: number[][];
  message: string;
  line?: number;
}

function simulateProbDP(): ProbStep[] {
  const steps: ProbStep[] = [];
  const n = 3;
  const K = 2; // total moves
  let dp = Array.from({ length: n }, () => Array(n).fill(0));
  
  // Knight starts at (0, 0)
  dp[0][0] = 1.0;

  steps.push({ type: "init", k: 0, r: -1, c: -1, prob: 0, dp: dp.map(r => [...r]), message: "Initialize. Probability of being at start (0,0) at move 0 is 1.0. All else 0.", line: 0 });

  const moves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

  for (let step = 1; step <= K; step++) {
    const nextDp = Array.from({ length: n }, () => Array(n).fill(0));
    steps.push({ type: "next_move", k: step, r: -1, c: -1, prob: 0, dp: dp.map(r => [...r]), message: `Calculating probabilities for Move ${step}.`, line: 1 });
    
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (dp[r][c] > 0) {
          steps.push({ type: "spread", k: step, r, c, prob: dp[r][c], dp: dp.map(row => [...row]), message: `Square (${r},${c}) has probability ${dp[r][c].toFixed(3)}. Spreading to 8 possible moves (1/8 prob each).`, line: 2 });
          for (const [dr, dc] of moves) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
              nextDp[nr][nc] += dp[r][c] / 8.0;
            }
          }
        }
      }
    }
    dp = nextDp;
    steps.push({ type: "update", k: step, r: -1, c: -1, prob: 0, dp: dp.map(row => [...row]), message: `Move ${step} complete. DP table updated.`, line: 3 });
  }

  let totalProb = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      totalProb += dp[r][c];
    }
  }

  steps.push({ type: "done", k: K, r: -1, c: -1, prob: totalProb, dp: dp.map(row => [...row]), message: `Done. Summing all probabilities gives total chance of staying on board: ${(totalProb * 100).toFixed(1)}%.`, line: 4 });
  return steps;
}

export default function ProbabilityDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateProbDP(), []);
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
    "let dp = Array.from({length: n}, () => Array(n).fill(0));",
    "dp[r][c] = 1.0; // Start position",
    "",
    "for (let k = 1; k <= K; k++) {",
    "  let nextDp = Array.from({length: n}, () => Array(n).fill(0));",
    "  for (let i = 0; i < n; i++) {",
    "    for (let j = 0; j < n; j++) {",
    "      if (dp[i][j] > 0) {",
    "        for (let [di, dj] of moves) {",
    "          if (isValid(i + di, j + dj)) {",
    "            nextDp[i + di][j + dj] += dp[i][j] / 8.0;",
    "          }",
    "        }",
    "      }",
    "    }",
    "  }",
    "  dp = nextDp;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Math</span>
          <h1>Probability DP</h1>
          <p className="description">Calculate the expected value or probability of a specific outcome by transitioning fractional states over time or steps.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(K * N²)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N²)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Probability DP doesn't just store `true` or `false` (can we reach state X?), it stores `float` values: "What is the mathematical probability we reach state X?"</p></article>
          <article className="guide-card"><h2>The Push DP Pattern</h2><p>Instead of "Pull DP" where a cell asks its neighbors for values, Probability DP often uses "Push DP". A cell takes its probability `P` and pushes `P / branches` to its valid next states.</p></article>
          <article className="guide-card"><h2>State Optimization</h2><p>Because the probabilities at step `K` only depend on step `K-1`, we only need to keep two 2D grids in memory: `dp` and `nextDp`.</p></article>
          <article className="guide-card highlight"><h2>Leaking Probabilities</h2><p>If a move goes off the board, that fraction of the probability is lost forever. The final answer is just the sum of all probabilities remaining on the board.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the 1.0 probability spread like water across the 3x3 chessboard via Knight jumps.</span>
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

              {step.type === "done" && (
                <div style={{ marginTop: '20px', padding: '16px', background: 'var(--panel2)', borderRadius: '8px', border: '2px solid var(--green)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Probability</span>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green)' }}>{step.prob.toFixed(4)}</div>
                </div>
              )}
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                 <div style={{ padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: 'var(--blue)' }}>
                   Move {step.k} / 2
                 </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'center' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 70px)', gap: '4px', background: 'var(--border)', padding: '4px', borderRadius: '8px' }}>
                   {step.dp.map((row, r) => 
                     row.map((val, c) => {
                       const isActive = step.r === r && step.c === c;
                       const isTarget = step.type === "spread" && isActive === false && (
                         (Math.abs(r - step.r) === 2 && Math.abs(c - step.c) === 1) ||
                         (Math.abs(r - step.r) === 1 && Math.abs(c - step.c) === 2)
                       );
                       
                       let bg = (r + c) % 2 === 0 ? 'var(--panel)' : 'var(--panel2)';
                       let border = 'transparent';
                       
                       if (isActive) {
                         bg = 'color-mix(in srgb, var(--amber) 30%, var(--panel))';
                         border = 'var(--amber)';
                       } else if (isTarget) {
                         bg = 'color-mix(in srgb, var(--blue) 20%, var(--panel))';
                         border = 'var(--blue)';
                       } else if (val > 0) {
                         bg = `color-mix(in srgb, var(--green) ${Math.min(100, val * 100)}%, var(--panel))`;
                       }

                       return (
                         <div key={`${r}-${c}`} style={{
                           width: '70px', height: '70px', background: bg, border: `2px solid ${border}`,
                           display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                           transition: 'all 0.3s'
                         }}>
                           <span style={{ fontSize: '12px', color: val > 0 ? 'var(--text)' : 'var(--muted)', fontWeight: val > 0 ? 'bold' : 'normal' }}>
                             {val === 0 ? '0' : val.toFixed(3)}
                           </span>
                         </div>
                       )
                     })
                   )}
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
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

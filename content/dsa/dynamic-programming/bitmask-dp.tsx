"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface BitmaskStep {
  type: string;
  mask: number;
  worker: number;
  task: number;
  nextMask: number;
  costValue: number;
  dp: number[];
  message: string;
  line?: number;
}

function simulateBitmaskDP(cost: number[][]): BitmaskStep[] {
  const n = cost.length;
  const numStates = 1 << n;
  const steps: BitmaskStep[] = [];
  const dp = new Array(numStates).fill(Infinity);
  dp[0] = 0;

  steps.push({ type: "init", mask: -1, worker: -1, task: -1, nextMask: -1, costValue: 0, dp: [...dp], message: `Initialize DP array of size ${numStates} with Infinity, and dp[0] = 0.`, line: 0 });

  for (let mask = 0; mask < numStates - 1; mask++) {
    // Count set bits to find which worker we are assigning
    let worker = 0;
    for (let i = 0; i < n; i++) {
      if ((mask & (1 << i)) !== 0) worker++;
    }

    steps.push({ type: "loop_mask", mask, worker, task: -1, nextMask: -1, costValue: 0, dp: [...dp], message: `Processing mask ${mask.toString(2).padStart(n, '0')}. Worker ${worker} is up for assignment.`, line: 1 });

    if (dp[mask] === Infinity) continue;

    for (let task = 0; task < n; task++) {
      steps.push({ type: "check_task", mask, worker, task, nextMask: -1, costValue: cost[worker][task], dp: [...dp], message: `Checking if task ${task} is available in mask ${mask.toString(2).padStart(n, '0')}.`, line: 2 });
      
      if ((mask & (1 << task)) === 0) {
        const nextMask = mask | (1 << task);
        const newCost = dp[mask] + cost[worker][task];
        steps.push({ type: "transition", mask, worker, task, nextMask, costValue: cost[worker][task], dp: [...dp], message: `Task ${task} is available. Cost to assign worker ${worker} to task ${task} is ${cost[worker][task]}.`, line: 3 });
        
        if (newCost < dp[nextMask]) {
          dp[nextMask] = newCost;
          steps.push({ type: "update_dp", mask, worker, task, nextMask, costValue: cost[worker][task], dp: [...dp], message: `dp[${nextMask.toString(2).padStart(n, '0')}] updated to ${newCost}.`, line: 4 });
        } else {
          steps.push({ type: "no_update", mask, worker, task, nextMask, costValue: cost[worker][task], dp: [...dp], message: `dp[${nextMask.toString(2).padStart(n, '0')}] is already better or equal (${dp[nextMask]}). No update.`, line: 4 });
        }
      } else {
        steps.push({ type: "unavailable", mask, worker, task, nextMask: -1, costValue: 0, dp: [...dp], message: `Task ${task} is already assigned in this mask. Skipping.`, line: 2 });
      }
    }
  }

  steps.push({ type: "done", mask: numStates - 1, worker: n, task: -1, nextMask: -1, costValue: 0, dp: [...dp], message: `Done. Minimum cost is dp[${(numStates - 1).toString(2).padStart(n, '0')}] = ${dp[numStates - 1]}.`, line: 5 });
  return steps;
}

export default function BitmaskDPLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const n = 3; // Keep it 3x3 for simplicity and visual clarity (8 states)
  const [costInput, setCostInput] = useState("9,2,7\n6,4,3\n5,8,1");
  const [costMatrix, setCostMatrix] = useState([
    [9, 2, 7],
    [6, 4, 3],
    [5, 8, 1]
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateBitmaskDP(costMatrix), [costMatrix]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [costMatrix]);

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

  const applyCost = () => {
    const lines = costInput.trim().split("\n");
    if (lines.length === n) {
      const parsed = lines.map(l => l.split(",").map(s => parseInt(s.trim(), 10)));
      if (parsed.every(row => row.length === n && row.every(val => !isNaN(val)))) {
        setCostMatrix(parsed);
      }
    }
  };

  const codeSnippet = [
    "let dp = Array(1 << N).fill(Infinity); dp[0] = 0;",
    "for (let mask = 0; mask < (1 << N); mask++) {",
    "  let worker = countSetBits(mask);",
    "  for (let task = 0; task < N; task++) {",
    "    if (!(mask & (1 << task))) {",
    "      dp[mask | (1 << task)] = Math.min(",
    "        dp[mask | (1 << task)],",
    "        dp[mask] + cost[worker][task]",
    "      );",
    "    }",
    "  }",
    "}"
  ];

  const fmt = (v: number) => v === Infinity ? "inf" : v;
  const toBin = (v: number) => v.toString(2).padStart(n, '0');

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • State Compression</span>
          <h1>Bitmask DP</h1>
          <p className="description">Represent small sets using integers (bitmasks) to solve problems like the Assignment Problem or TSP.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * 2^N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(2^N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>In problems with small constraints (e.g., N ≤ 20), we can represent a subset of items as bits in an integer. This is called a bitmask.</p></article>
          <article className="guide-card"><h2>The Assignment Problem</h2><p>We want to assign N workers to N tasks with minimum cost. The mask represents which tasks are already assigned.</p></article>
          <article className="guide-card"><h2>Transitions</h2><p>If task j is not in the mask `(mask & (1 &lt;&lt; j) == 0)`, we transition to `mask | (1 &lt;&lt; j)` by assigning the next available worker to task j.</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>The number of set bits in the mask equals the number of workers we've already assigned. We don't need a separate dimension for workers.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Cost Matrix (3x3, comma separated):</label>
              <textarea 
                value={costInput} 
                onChange={(e) => setCostInput(e.target.value)} 
                rows={3} 
                style={{ width: '120px', fontFamily: 'monospace', resize: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              <button onClick={applyCost}>Update Matrix</button>
              <button onClick={() => { setCostInput("9,2,7\n6,4,3\n5,8,1"); setCostMatrix([[9,2,7],[6,4,3],[5,8,1]]); }}>Reset</button>
            </div>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the cost matrix above to see how assignments change.</span>
                <span>▶️ Use the playback controls to step through the DP state transitions.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="simulation-data">
                <div className="data-group">
                  <h3>Cost Matrix</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '150px' }}>
                    {costMatrix.map((row, i) => row.map((val, j) => (
                      <div key={`${i}-${j}`} style={{ 
                        border: '1px solid var(--border)', padding: '4px', textAlign: 'center', borderRadius: '4px',
                        background: step.worker === i && step.task === j ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'var(--panel2)',
                        borderColor: step.worker === i && step.task === j ? 'var(--amber)' : 'var(--border)'
                      }}>
                        {val}
                      </div>
                    )))}
                  </div>
                </div>
              </div>
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
               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                 {step.dp.map((val, mask) => {
                    const isActive = step.mask === mask;
                    const isNext = step.nextMask === mask;
                    let bg = 'var(--panel2)';
                    let border = 'var(--border)';
                    if (isActive) {
                      bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                      border = 'var(--blue)';
                    } else if (isNext) {
                      bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                      border = 'var(--amber)';
                    }
                    
                    return (
                      <div key={mask} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        padding: '12px', borderRadius: '8px', minWidth: '60px',
                        background: bg,
                        border: `2px solid ${border}`,
                        transition: 'all 0.3s'
                      }}>
                         <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>{toBin(mask)}</span>
                         <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{fmt(val)}</span>
                      </div>
                    );
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '240px' }}>
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

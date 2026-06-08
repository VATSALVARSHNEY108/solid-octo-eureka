"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface BalloonStep {
  type: string;
  len: number;
  i: number;
  j: number;
  k: number;
  dp: number[][];
  message: string;
  line?: number;
}

function simulateBalloons(rawNums: number[]): BalloonStep[] {
  const steps: BalloonStep[] = [];
  const nums = [1, ...rawNums, 1];
  const n = nums.length;
  
  const dp = Array.from({ length: n }, () => Array(n).fill(0));

  steps.push({ type: "init", len: 1, i: -1, j: -1, k: -1, dp: dp.map(r => [...r]), message: "Pad array with 1 at both ends. Initialize DP table.", line: 0 });

  for (let len = 1; len <= n - 2; len++) {
    for (let i = 1; i <= n - 2 - len + 1; i++) {
      const j = i + len - 1;
      steps.push({ type: "loop_len", len, i, j, k: -1, dp: dp.map(r => [...r]), message: `Evaluating interval [${i}, ${j}]. Balloons: [${nums.slice(i, j + 1).join(', ')}]`, line: 1 });
      
      for (let k = i; k <= j; k++) {
        const coins = nums[i - 1] * nums[k] * nums[j + 1];
        const total = dp[i][k - 1] + coins + dp[k + 1][j];
        
        steps.push({ type: "loop_k", len, i, j, k, dp: dp.map(r => [...r]), message: `Assume balloon ${nums[k]} (index ${k}) is burst LAST in this interval. Coins: ${nums[i - 1]} * ${nums[k]} * ${nums[j + 1]} = ${coins}.`, line: 2 });
        
        if (total > dp[i][j]) {
          dp[i][j] = total;
          steps.push({ type: "update", len, i, j, k, dp: dp.map(r => [...r]), message: `New max for interval [${i}, ${j}]: ${dp[i][k - 1]} (left) + ${coins} (mid) + ${dp[k + 1][j]} (right) = ${total}.`, line: 3 });
        } else {
          steps.push({ type: "no_update", len, i, j, k, dp: dp.map(r => [...r]), message: `Total ${total} is not better than current max ${dp[i][j]}.`, line: 3 });
        }
      }
    }
  }

  steps.push({ type: "done", len: n - 2, i: 1, j: n - 2, k: -1, dp: dp.map(r => [...r]), message: `Done. Maximum coins is dp[1][${n-2}] = ${dp[1][n-2]}.`, line: 4 });
  return steps;
}

export default function BurstBalloonsLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [numsInput, setNumsInput] = useState("3, 1, 5, 8");
  const [rawNums, setRawNums] = useState([3, 1, 5, 8]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateBalloons(rawNums), [rawNums]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const nums = useMemo(() => [1, ...rawNums, 1], [rawNums]);

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [rawNums]);

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

  const applyNums = () => {
    const parsed = numsInput.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parsed.length > 0 && parsed.length <= 6) { // limit length for visualizer
      setRawNums(parsed);
    } else {
      alert("Please enter between 1 and 6 valid numbers.");
    }
  };

  const codeSnippet = [
    "let nums = [1, ...rawNums, 1];",
    "for (let len = 1; len <= N; len++) {",
    "  for (let i = 1; i <= N - len + 1; i++) {",
    "    let j = i + len - 1;",
    "    for (let k = i; k <= j; k++) {",
    "      dp[i][j] = Math.max(",
    "        dp[i][j],",
    "        dp[i][k-1] + nums[i-1]*nums[k]*nums[j+1] + dp[k+1][j]",
    "      );",
    "    }",
    "  }",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Interval DP</span>
          <h1>Burst Balloons</h1>
          <p className="description">Maximize coins collected by bursting balloons. Bursting a balloon multiplies its value with its adjacent unburst balloons.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N^3)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N^2)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>Bursting a balloon changes the adjacent balloons for its neighbors. This means subproblems overlap and interfere if we process them in the normal forward direction.</p></article>
          <article className="guide-card"><h2>Reverse Thinking</h2><p>Instead of guessing which balloon to burst first, we guess which balloon is burst LAST in an interval [i, j].</p></article>
          <article className="guide-card"><h2>State Independence</h2><p>If balloon k is burst last, then the subproblems [i, k-1] and [k+1, j] are completely independent, allowing us to use DP.</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>The balloon burst last in interval [i, j] will be adjacent to the boundaries i-1 and j+1. Its coin yield is `nums[i-1] * nums[k] * nums[j+1]`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px' }}>
            <input value={numsInput} onChange={(e) => setNumsInput(e.target.value)} placeholder="e.g., 3, 1, 5, 8" style={{ flex: 1, maxWidth: '300px' }} />
            <button onClick={applyNums}>Update Array</button>
            <button onClick={() => { setNumsInput("3, 1, 5, 8"); setRawNums([3, 1, 5, 8]); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Use the input to change the balloon array.</span>
                <span>▶️ Play to watch the interval DP evaluate all subproblems.</span>
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
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
               <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                 {nums.map((val, idx) => {
                    const isPadding = idx === 0 || idx === nums.length - 1;
                    const inInterval = idx >= step.i && idx <= step.j;
                    const isBoundary = (idx === step.i - 1 || idx === step.j + 1) && step.i !== -1;
                    const isLastBurst = idx === step.k;
                    
                    let bg = 'var(--panel2)';
                    let border = 'var(--border)';
                    if (isLastBurst) {
                      bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                      border = 'var(--amber)';
                    } else if (inInterval) {
                      bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                      border = 'var(--blue)';
                    } else if (isBoundary) {
                      bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                      border = 'var(--green)';
                    }
                    
                    return (
                      <div key={idx} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        width: '50px', height: '60px', 
                        borderRadius: isPadding ? '8px' : '50% 50% 50% 50% / 40% 40% 60% 60%',
                        background: bg, border: `2px solid ${border}`,
                        fontWeight: 'bold', fontSize: '20px',
                        color: isPadding ? 'var(--muted)' : 'var(--text)',
                        transition: 'all 0.3s'
                      }}>
                         {val}
                         {isPadding && <span style={{ fontSize: '10px' }}>(pad)</span>}
                      </div>
                    );
                 })}
               </div>
               
               {step.i !== -1 && step.j !== -1 && (
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                   <div style={{ padding: '16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
                     <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>dp[{step.i}][{step.j}] (Max for interval)</div>
                     <div style={{ fontWeight: 'bold', fontSize: '24px' }}>{step.dp[step.i]?.[step.j] || 0}</div>
                   </div>
                 </div>
               )}
               
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

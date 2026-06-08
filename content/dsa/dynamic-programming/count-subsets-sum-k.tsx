"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface SubsetStep {
  type: string;
  idx: number;
  target: number;
  dp: number[][];
  message: string;
  line?: number;
}

function simulateCountSubsets(nums: number[], sum: number): SubsetStep[] {
  const steps: SubsetStep[] = [];
  const n = nums.length;
  
  const dp = Array.from({ length: n }, () => Array(sum + 1).fill(0));

  steps.push({ type: "init", idx: -1, target: -1, dp: dp.map(r => [...r]), message: "Initialize DP table. Base cases handled in loop.", line: 0 });

  // Base cases for first row
  for (let s = 0; s <= sum; s++) {
    if (s === 0 && nums[0] === 0) dp[0][s] = 2; // pick or not pick 0
    else if (s === 0) dp[0][s] = 1; // target 0, don't pick
    else if (s === nums[0]) dp[0][s] = 1; // pick first element
  }
  
  steps.push({ type: "base", idx: 0, target: -1, dp: dp.map(r => [...r]), message: `Initialize first row based on nums[0] = ${nums[0]}.`, line: 1 });

  for (let i = 1; i < n; i++) {
    for (let target = 0; target <= sum; target++) {
      steps.push({ type: "check", idx: i, target, dp: dp.map(r => [...r]), message: `Index ${i} (num: ${nums[i]}), Target: ${target}.`, line: 2 });
      
      const notPick = dp[i - 1][target];
      let pick = 0;
      
      if (target >= nums[i]) {
        pick = dp[i - 1][target - nums[i]];
        steps.push({ type: "pick", idx: i, target, dp: dp.map(r => [...r]), message: `Can pick: ${nums[i]}. Ways from (target - ${nums[i]}) is dp[${i-1}][${target - nums[i]}] = ${pick}.`, line: 3 });
      } else {
        steps.push({ type: "no_pick", idx: i, target, dp: dp.map(r => [...r]), message: `Cannot pick ${nums[i]} (larger than target ${target}).`, line: 4 });
      }
      
      dp[i][target] = notPick + pick;
      steps.push({ type: "update", idx: i, target, dp: dp.map(r => [...r]), message: `dp[${i}][${target}] = (notPick: ${notPick}) + (pick: ${pick}) = ${dp[i][target]}.`, line: 5 });
    }
  }

  steps.push({ type: "done", idx: n - 1, target: sum, dp: dp.map(r => [...r]), message: `Done. Total subsets summing to ${sum} is ${dp[n - 1][sum]}.`, line: 6 });
  return steps;
}

export default function CountSubsetsSumKLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [numsInput, setNumsInput] = useState("1, 2, 2, 3");
  const [nums, setNums] = useState([1, 2, 2, 3]);
  const [sum, setSum] = useState(3);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateCountSubsets(nums, sum), [nums, sum]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [nums, sum]);

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

  const applyInput = () => {
    const parsed = numsInput.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parsed.length > 0) setNums(parsed);
  };

  const codeSnippet = [
    "let dp = Array(n).fill().map(() => Array(sum + 1).fill(0));",
    "// ... initialize base case for dp[0][s] ...",
    "for (let i = 1; i < n; i++) {",
    "  for (let target = 0; target <= sum; target++) {",
    "    let notPick = dp[i-1][target];",
    "    let pick = 0;",
    "    if (target >= nums[i])",
    "      pick = dp[i-1][target - nums[i]];",
    "    dp[i][target] = notPick + pick;",
    "  }",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • 0/1 Knapsack Pattern</span>
          <h1>Count Subsets with Sum K</h1>
          <p className="description">Count how many subsets of an array sum up exactly to a target K.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * K)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N * K)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>We want to find the number of ways to pick a subset of elements such that their sum equals K. This is a classic "pick or not pick" DP.</p></article>
          <article className="guide-card"><h2>State Definition</h2><p>Let `dp[i][target]` be the number of subsets using the first `i` elements that sum to `target`.</p></article>
          <article className="guide-card"><h2>Transitions</h2><p>For each element `nums[i]`, we either don't pick it (taking ways from `dp[i-1][target]`), or we do pick it (taking ways from `dp[i-1][target - nums[i]]`).</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>The total ways is the sum of ways from both decisions: `dp[i][target] = notPick + pick`. Base cases are crucial, especially handling 0s correctly.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px', alignItems: 'center' }}>
            <label style={{ margin: 0 }}>Nums:</label>
            <input value={numsInput} onChange={(e) => setNumsInput(e.target.value)} placeholder="e.g., 1, 2, 2, 3" style={{ flex: 1, maxWidth: '200px' }} />
            <button onClick={applyInput}>Set</button>
            <label style={{ margin: '0 0 0 16px' }}>Target Sum:</label>
            <input type="number" min="1" max="20" value={sum} onChange={(e) => { setSum(Number(e.target.value)); setPlaying(false); }} style={{ width: '70px' }} />
            <button onClick={() => { setNumsInput("1, 2, 2, 3"); setNums([1, 2, 2, 3]); setSum(3); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the array and target sum.</span>
                <span>▶️ Play to watch the 2D DP table populate layer by layer.</span>
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
               <div style={{ display: 'flex', overflowX: 'auto', padding: '12px', background: 'var(--panel)', borderRadius: '8px' }}>
                 <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                   <thead>
                     <tr>
                       <th style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: 'var(--muted)' }}>Num / Target</th>
                       {Array.from({ length: sum + 1 }).map((_, j) => (
                         <th key={j} style={{ padding: '8px', borderBottom: '1px solid var(--border)', color: step.target === j ? 'var(--blue)' : 'var(--text)' }}>{j}</th>
                       ))}
                     </tr>
                   </thead>
                   <tbody>
                     {step.dp.map((row, i) => (
                       <tr key={i}>
                         <td style={{ padding: '8px', borderRight: '1px solid var(--border)', fontWeight: 'bold', color: step.idx === i ? 'var(--amber)' : 'var(--text)' }}>
                           {nums[i]} (idx {i})
                         </td>
                         {row.map((val, j) => {
                           const isActive = step.idx === i && step.target === j;
                           const isSource1 = step.idx === i + 1 && step.target === j; // From i-1, target
                           const isSource2 = step.idx === i + 1 && step.target !== -1 && j === step.target - nums[step.idx]; // From i-1, target-nums[i]
                           
                           let bg = 'transparent';
                           if (isActive) bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                           else if (isSource1 || isSource2) bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                           
                           return (
                             <td key={j} style={{ 
                               padding: '8px', textAlign: 'center',
                               background: bg,
                               border: isActive ? '1px solid var(--blue)' : (isSource1 || isSource2 ? '1px solid var(--green)' : '1px solid var(--border)'),
                               transition: 'all 0.2s'
                             }}>
                               {val}
                             </td>
                           );
                         })}
                       </tr>
                     ))}
                   </tbody>
                 </table>
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

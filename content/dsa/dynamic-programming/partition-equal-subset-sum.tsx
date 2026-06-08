"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Using 1D space optimized approach natively since it's a direct Subset Sum derivative

interface PartitionStep {
  type: string;
  i: number;
  j: number;
  dp: boolean[];
  message: string;
  line?: number;
}

function simulatePartitionSum(): PartitionStep[] {
  const steps: PartitionStep[] = [];
  const nums = [1, 5, 11, 5];
  const totalSum = nums.reduce((a, b) => a + b, 0);
  
  if (totalSum % 2 !== 0) {
    steps.push({ type: "early_exit", i: -1, j: -1, dp: [], message: `Total sum is ${totalSum}. Cannot partition an odd sum into two equal integer halves.`, line: 0 });
    return steps;
  }

  const target = totalSum / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  steps.push({ type: "init", i: -1, j: -1, dp: [...dp], message: `Total sum is ${totalSum}. Target for each half is ${target}. Initialize DP array where dp[0] = true.`, line: 1 });

  for (let i = 0; i < nums.length; i++) {
    steps.push({ type: "outer", i, j: -1, dp: [...dp], message: `Evaluating number ${nums[i]}. Can we use it to reach target sums?`, line: 2 });
    
    // Reverse traversal to avoid using the same item twice
    for (let j = target; j >= nums[i]; j--) {
      steps.push({ type: "check", i, j, dp: [...dp], message: `Checking if we can reach sum ${j} using ${nums[i]}. Needs dp[${j - nums[i]}] to be true.`, line: 3 });
      
      if (dp[j - nums[i]]) {
        dp[j] = true;
        steps.push({ type: "update", i, j, dp: [...dp], message: `Yes! dp[${j - nums[i]}] is true. So we can reach sum ${j}. Set dp[${j}] = true.`, line: 4 });
      }
    }
  }

  steps.push({ type: "done", i: -1, j: -1, dp: [...dp], message: `Done. dp[${target}] is ${dp[target]}. Thus, partition is ${dp[target] ? 'possible' : 'impossible'}.`, line: 5 });
  return steps;
}

export default function PartitionEqualSubsetSumLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulatePartitionSum(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const nums = [1, 5, 11, 5];

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
    "let sum = nums.reduce((a, b) => a + b, 0);",
    "if (sum % 2 !== 0) return false;",
    "let target = sum / 2;",
    "let dp = new Array(target + 1).fill(false);",
    "dp[0] = true;",
    "for (let num of nums) {",
    "  for (let j = target; j >= num; j--) {",
    "    dp[j] = dp[j] || dp[j - num];",
    "  }",
    "}",
    "return dp[target];"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • 0/1 Knapsack</span>
          <h1>Partition Equal Subset Sum</h1>
          <p className="description">Determine if a given array can be partitioned into two subsets such that the sum of elements in both subsets is equal.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * Target)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(Target)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a classic variation of the Subset Sum / 0-1 Knapsack problem. If the total sum is odd, it's impossible. If it's even, we just need to find ANY subset that sums to exactly `Total / 2`.</p></article>
          <article className="guide-card"><h2>The DP State</h2><p>We use a 1D boolean array where `dp[j]` is `true` if a subset with sum `j` exists. The base case is `dp[0] = true`.</p></article>
          <article className="guide-card"><h2>Reverse Traversal</h2><p>When optimizing to 1D, we MUST iterate the target sum `j` backwards (from `target` down to `num`). This ensures we don't use the same element multiple times.</p></article>
          <article className="guide-card highlight"><h2>The Check</h2><p>For a given `num`, we can reach sum `j` if we could already reach sum `j - num`. So `dp[j] = dp[j] || dp[j - num]`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how each number pushes the reachable sums forward. Notice the backward traversal of the DP array.</span>
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
               
               <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
                 {nums.map((val, idx) => (
                   <div key={idx} style={{
                     width: '50px', height: '50px', borderRadius: '8px',
                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                     background: step.i === idx ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'var(--panel2)',
                     border: `2px solid ${step.i === idx ? 'var(--amber)' : 'var(--border)'}`,
                     fontSize: '20px', fontWeight: 'bold'
                   }}>
                     {val}
                   </div>
                 ))}
               </div>

               <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>DP Array (Can Reach Sum j?)</div>
               <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
                 {step.dp?.map((val, j) => {
                   const isTarget = step.j === j;
                   const isSource = step.i !== -1 && step.j !== -1 && j === step.j - nums[step.i];
                   
                   let bg = val ? 'color-mix(in srgb, var(--green) 20%, transparent)' : 'var(--panel2)';
                   let border = val ? 'var(--green)' : 'var(--border)';
                   
                   if (isTarget) {
                     border = 'var(--amber)';
                     if (step.type === "update") bg = 'color-mix(in srgb, var(--amber) 40%, transparent)';
                   } else if (isSource) {
                     border = 'var(--blue)';
                   }

                   return (
                     <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>{j}</span>
                       <div style={{
                         width: '35px', height: '35px', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: `2px solid ${border}`, fontSize: '14px', fontWeight: 'bold'
                       }}>
                         {val ? 'T' : 'F'}
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

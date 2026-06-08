"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// This simulates the front-partitioning DP (like Palindrome Partitioning II / Min Cuts)
interface PPStep {
  type: string;
  i: number;
  j: number;
  dp: number[];
  isPal: boolean[][];
  message: string;
  line?: number;
}

function simulatePalindromePartitioning(): PPStep[] {
  const steps: PPStep[] = [];
  const s = "aab";
  const n = s.length;
  
  // dp[i] = min cuts for prefix s[0...i]
  const dp = new Array(n).fill(0);
  const isPal = Array.from({ length: n }, () => Array(n).fill(false));

  steps.push({ type: "init", i: -1, j: -1, dp: [...dp], isPal: isPal.map(r => [...r]), message: "Initialize DP for min cuts and 2D table for palindrome checks.", line: 0 });

  for (let i = 0; i < n; i++) {
    let minCuts = i; // Max possible cuts is `i` (every char separate)
    steps.push({ type: "eval", i, j: -1, dp: [...dp], isPal: isPal.map(r => [...r]), message: `Evaluating prefix s[0...${i}] ("${s.substring(0, i+1)}"). Default max cuts = ${minCuts}.`, line: 1 });
    
    for (let j = 0; j <= i; j++) {
      steps.push({ type: "check_pal", i, j, dp: [...dp], isPal: isPal.map(r => [...r]), message: `Checking if s[${j}...${i}] ("${s.substring(j, i+1)}") is a palindrome.`, line: 2 });
      
      if (s[j] === s[i] && (i - j <= 2 || isPal[j + 1][i - 1])) {
        isPal[j][i] = true;
        
        if (j === 0) {
          minCuts = 0;
          steps.push({ type: "full_pal", i, j, dp: [...dp], isPal: isPal.map(r => [...r]), message: `The entire prefix is a palindrome! 0 cuts needed.`, line: 3 });
        } else {
          const cuts = dp[j - 1] + 1;
          if (cuts < minCuts) {
            minCuts = cuts;
            steps.push({ type: "update", i, j, dp: [...dp], isPal: isPal.map(r => [...r]), message: `Valid palindrome found. We can cut before ${j}. Cuts = dp[${j-1}] + 1 = ${minCuts}.`, line: 4 });
          }
        }
      } else {
        steps.push({ type: "no_pal", i, j, dp: [...dp], isPal: isPal.map(r => [...r]), message: `Not a palindrome. Continuing search.`, line: 5 });
      }
    }
    dp[i] = minCuts;
    steps.push({ type: "set_dp", i, j: -1, dp: [...dp], isPal: isPal.map(r => [...r]), message: `Final min cuts for prefix ending at ${i} is ${dp[i]}.`, line: 6 });
  }

  steps.push({ type: "done", i: -1, j: -1, dp: [...dp], isPal: isPal.map(r => [...r]), message: `Done. The minimum cuts for the whole string is ${dp[n-1]}.`, line: 7 });
  return steps;
}

export default function PalindromePartitioningLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulatePalindromePartitioning(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const s = "aab";

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
    "let dp = Array(n).fill(0);",
    "let isPal = Array.from({length: n}, () => Array(n).fill(false));",
    "for (let i = 0; i < n; i++) {",
    "  let minCuts = i;",
    "  for (let j = 0; j <= i; j++) {",
    "    if (s[j] === s[i] && (i - j <= 2 || isPal[j+1][i-1])) {",
    "      isPal[j][i] = true;",
    "      if (j === 0) minCuts = 0;",
    "      else minCuts = Math.min(minCuts, dp[j-1] + 1);",
    "    }",
    "  }",
    "  dp[i] = minCuts;",
    "}",
    "return dp[n-1];"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Front Partitioning</span>
          <h1>Palindrome Partitioning</h1>
          <p className="description">Find the minimum number of cuts needed to partition a string such that every substring is a palindrome.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N²)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N²)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This falls under the "Front Partitioning" pattern. We want to find the optimal way to partition a prefix `s[0...i]`, using answers from smaller prefixes `s[0...j-1]`.</p></article>
          <article className="guide-card"><h2>Fast Palindrome Check</h2><p>Instead of an O(N) check every time, we build a 2D boolean DP `isPal[j][i]` dynamically. `s[j...i]` is a palindrome if `s[j]==s[i]` AND `s[j+1...i-1]` is a palindrome.</p></article>
          <article className="guide-card"><h2>The Cut Logic</h2><p>If `s[j...i]` is a palindrome, we can make a cut right before `j`. The total cuts would be `1 + dp[j-1]` (the min cuts for the prefix ending at `j-1`).</p></article>
          <article className="guide-card highlight"><h2>Base Case Bypass</h2><p>If `j == 0`, the entire substring `s[0...i]` is a palindrome. This means NO cuts are needed! So we set `minCuts = 0`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the algorithm scans backwards to find valid palindromes and makes optimal cuts.</span>
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
               
               <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
                 {s.split('').map((char, idx) => {
                   const inPrefix = step.i !== -1 && idx <= step.i;
                   const inSuffix = step.j !== -1 && idx >= step.j && idx <= step.i;
                   const isCut = step.j > 0 && idx === step.j;
                   
                   let bg = 'var(--panel)';
                   let border = 'var(--border)';
                   if (inSuffix) {
                     bg = step.type === "no_pal" ? 'color-mix(in srgb, var(--red) 15%, transparent)' : 'color-mix(in srgb, var(--green) 20%, transparent)';
                     border = step.type === "no_pal" ? 'var(--red)' : 'var(--green)';
                   } else if (inPrefix) {
                     bg = 'color-mix(in srgb, var(--blue) 15%, transparent)';
                   }

                   return (
                     <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                       {isCut && <div style={{ width: '4px', height: '40px', background: 'var(--amber)', margin: '0 4px', borderRadius: '2px' }}></div>}
                       <div style={{
                         width: '50px', height: '60px', borderRadius: '8px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, border: `2px solid ${border}`,
                         fontSize: '24px', fontWeight: 'bold'
                       }}>
                         {char}
                       </div>
                     </div>
                   )
                 })}
               </div>

               <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>DP Array (Min Cuts)</div>
               <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                 {step.dp.map((val, idx) => {
                   const isTarget = step.type === "set_dp" && step.i === idx;
                   const isSource = step.type === "update" && step.j > 0 && idx === step.j - 1;
                   
                   let bg = 'var(--panel2)';
                   let border = 'var(--border)';
                   if (isTarget) {
                     bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                     border = 'var(--amber)';
                   } else if (isSource) {
                     border = 'var(--blue)';
                   }

                   return (
                     <div key={idx} style={{
                       width: '40px', height: '40px', borderRadius: '6px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: bg, border: `2px solid ${border}`, fontWeight: 'bold'
                     }}>
                       {step.i >= idx || (step.type === "done") ? val : '-'}
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

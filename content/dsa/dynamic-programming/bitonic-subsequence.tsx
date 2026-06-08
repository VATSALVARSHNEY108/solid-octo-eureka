"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface BitonicStep {
  type: string;
  phase: string;
  i: number;
  j: number;
  lis: number[];
  lds: number[];
  ans: number;
  message: string;
  line?: number;
}

function simulateBitonic(nums: number[]): BitonicStep[] {
  const n = nums.length;
  const steps: BitonicStep[] = [];
  const lis = new Array(n).fill(1);
  const lds = new Array(n).fill(1);
  let ans = 0;

  if (n === 0) return steps;

  steps.push({ type: "init", phase: "LIS", i: -1, j: -1, lis: [...lis], lds: [...lds], ans, message: "Initialize LIS and LDS arrays with 1.", line: 0 });

  // Compute LIS from left to right
  for (let i = 0; i < n; i++) {
    steps.push({ type: "loop_i_lis", phase: "LIS", i, j: -1, lis: [...lis], lds: [...lds], ans, message: `LIS: Check element nums[${i}] = ${nums[i]}.`, line: 1 });
    for (let j = 0; j < i; j++) {
      steps.push({ type: "loop_j_lis", phase: "LIS", i, j, lis: [...lis], lds: [...lds], ans, message: `LIS: Compare nums[${i}] (${nums[i]}) with nums[${j}] (${nums[j]}).`, line: 2 });
      if (nums[i] > nums[j]) {
        if (lis[i] < lis[j] + 1) {
          lis[i] = lis[j] + 1;
          steps.push({ type: "update_lis", phase: "LIS", i, j, lis: [...lis], lds: [...lds], ans, message: `LIS: nums[${i}] > nums[${j}]. Update lis[${i}] to ${lis[i]}.`, line: 3 });
        }
      }
    }
  }

  // Compute LDS from right to left
  for (let i = n - 1; i >= 0; i--) {
    steps.push({ type: "loop_i_lds", phase: "LDS", i, j: -1, lis: [...lis], lds: [...lds], ans, message: `LDS: Check element nums[${i}] = ${nums[i]}.`, line: 4 });
    for (let j = n - 1; j > i; j--) {
      steps.push({ type: "loop_j_lds", phase: "LDS", i, j, lis: [...lis], lds: [...lds], ans, message: `LDS: Compare nums[${i}] (${nums[i]}) with nums[${j}] (${nums[j]}).`, line: 5 });
      if (nums[i] > nums[j]) {
        if (lds[i] < lds[j] + 1) {
          lds[i] = lds[j] + 1;
          steps.push({ type: "update_lds", phase: "LDS", i, j, lis: [...lis], lds: [...lds], ans, message: `LDS: nums[${i}] > nums[${j}]. Update lds[${i}] to ${lds[i]}.`, line: 6 });
        }
      }
    }
  }

  // Compute answer
  steps.push({ type: "calc_ans", phase: "ANS", i: -1, j: -1, lis: [...lis], lds: [...lds], ans, message: "Calculate max(lis[i] + lds[i] - 1).", line: 7 });
  for (let i = 0; i < n; i++) {
    const currentLen = lis[i] + lds[i] - 1;
    steps.push({ type: "check_ans", phase: "ANS", i, j: -1, lis: [...lis], lds: [...lds], ans, message: `Index ${i}: lis[${i}] + lds[${i}] - 1 = ${lis[i]} + ${lds[i]} - 1 = ${currentLen}.`, line: 8 });
    if (currentLen > ans) {
      ans = currentLen;
      steps.push({ type: "update_ans", phase: "ANS", i, j: -1, lis: [...lis], lds: [...lds], ans, message: `New maximum bitonic length: ${ans}.`, line: 9 });
    }
  }

  steps.push({ type: "done", phase: "DONE", i: -1, j: -1, lis: [...lis], lds: [...lds], ans, message: `Done. Longest bitonic subsequence length is ${ans}.`, line: 10 });
  return steps;
}

export default function BitonicSubsequenceLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [numsInput, setNumsInput] = useState("1, 11, 2, 10, 4, 5, 2, 1");
  const [nums, setNums] = useState([1, 11, 2, 10, 4, 5, 2, 1]);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateBitonic(nums), [nums]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [nums]);

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
    if (parsed.length > 0) setNums(parsed);
  };

  const codeSnippet = [
    "let lis = Array(N).fill(1), lds = Array(N).fill(1);",
    "for (let i = 0; i < N; i++)",
    "  for (let j = 0; j < i; j++)",
    "    if (nums[i] > nums[j]) lis[i] = Math.max(lis[i], lis[j] + 1);",
    "for (let i = N - 1; i >= 0; i--)",
    "  for (let j = N - 1; j > i; j--)",
    "    if (nums[i] > nums[j]) lds[i] = Math.max(lds[i], lds[j] + 1);",
    "let maxLen = 0;",
    "for (let i = 0; i < N; i++)",
    "  maxLen = Math.max(maxLen, lis[i] + lds[i] - 1);",
    "return maxLen;"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • LIS Variant</span>
          <h1>Longest Bitonic Subsequence</h1>
          <p className="description">Find the longest subsequence that first increases, then decreases.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N^2)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>A bitonic subsequence goes strictly up and then strictly down. We can find this by combining two Longest Increasing Subsequences (LIS).</p></article>
          <article className="guide-card"><h2>Left to Right (LIS)</h2><p>Compute `lis[i]`: the length of the longest increasing subsequence ending at index i.</p></article>
          <article className="guide-card"><h2>Right to Left (LDS)</h2><p>Compute `lds[i]`: the length of the longest decreasing subsequence starting at index i (which is an LIS from right to left).</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>For any element at index `i`, it can be the "peak" of a bitonic subsequence. The max length with `i` as the peak is `lis[i] + lds[i] - 1`.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px' }}>
            <input value={numsInput} onChange={(e) => setNumsInput(e.target.value)} placeholder="e.g., 1, 11, 2, 10, 4, 5, 2, 1" style={{ flex: 1, maxWidth: '400px' }} />
            <button onClick={applyNums}>Update Array</button>
            <button onClick={() => { setNumsInput("1, 11, 2, 10, 4, 5, 2, 1"); setNums([1, 11, 2, 10, 4, 5, 2, 1]); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the array of numbers above.</span>
                <span>▶️ Play to watch the 3-phase calculation: LIS -&gt; LDS -&gt; Max Sum.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="simulation-data">
                <div className="data-group">
                  <h3>State Summary</h3>
                  <div className="distances">
                    <span className="active" style={{borderColor: 'var(--amber)', color: 'var(--amber)'}}>Phase: {step.phase}</span>
                    <span className={step.ans > 0 ? 'active' : ''} style={{borderColor: step.ans > 0 ? 'var(--green)' : '', color: step.ans > 0 ? 'var(--green)' : ''}}>Max Bitonic Length: {step.ans}</span>
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
               <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '8px' }}>
                   <div style={{ width: '40px', fontWeight: 'bold', color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>nums:</div>
                   {nums.map((p, idx) => {
                      const isActive = step.i === idx;
                      const isCompare = step.j === idx;
                      let bg = 'var(--panel2)';
                      let border = 'var(--border)';
                      if (isActive) {
                        bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                        border = 'var(--blue)';
                      } else if (isCompare) {
                        bg = 'color-mix(in srgb, var(--amber) 20%, transparent)';
                        border = 'var(--amber)';
                      }
                      
                      return (
                        <div key={idx} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '40px', height: '40px', borderRadius: '8px',
                          background: bg, border: `2px solid ${border}`,
                          fontWeight: 'bold', transition: 'all 0.2s'
                        }}>{p}</div>
                      );
                   })}
                 </div>
                 
                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '8px' }}>
                   <div style={{ width: '40px', fontWeight: 'bold', color: 'var(--blue)', display: 'flex', alignItems: 'center' }}>lis:</div>
                   {step.lis.map((v, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '40px', height: '40px', borderRadius: '8px',
                        background: step.phase === 'LIS' && step.i === idx ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : 'var(--panel2)', 
                        border: '1px solid var(--border)',
                        color: 'var(--text)', transition: 'all 0.2s'
                      }}>{v}</div>
                   ))}
                 </div>

                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '8px' }}>
                   <div style={{ width: '40px', fontWeight: 'bold', color: 'var(--amber)', display: 'flex', alignItems: 'center' }}>lds:</div>
                   {step.lds.map((v, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '40px', height: '40px', borderRadius: '8px',
                        background: step.phase === 'LDS' && step.i === idx ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'var(--panel2)', 
                        border: '1px solid var(--border)',
                        color: 'var(--text)', transition: 'all 0.2s'
                      }}>{v}</div>
                   ))}
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
        .distances { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
        .distances span { border: 1px solid var(--border); border-radius: 6px; padding: 5px 8px; color: var(--muted); background: var(--panel2); font-family: monospace; transition: all 0.3s; }
        .distances span.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 10%, transparent); }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        .canvas { width: 100%; min-height: 560px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

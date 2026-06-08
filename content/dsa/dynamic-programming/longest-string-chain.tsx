"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface ChainStep {
  type: string;
  word: string;
  prev: string;
  dp: Record<string, number>;
  message: string;
  line?: number;
}

function simulateStringChain(): ChainStep[] {
  const steps: ChainStep[] = [];
  const words = ["a", "b", "ba", "bca", "bda", "bdca"];
  const dp: Record<string, number> = {};
  
  steps.push({ type: "init", word: "", prev: "", dp: {...dp}, message: "Sort words by length. Initialize an empty hash map to store longest chains.", line: 0 });

  for (const word of words) {
    steps.push({ type: "process", word, prev: "", dp: {...dp}, message: `Processing word: "${word}". Default chain length is 1.`, line: 1 });
    let maxLen = 1;
    
    for (let i = 0; i < word.length; i++) {
      const prev = word.slice(0, i) + word.slice(i + 1);
      steps.push({ type: "remove", word, prev, dp: {...dp}, message: `Remove char at index ${i} to form predecessor: "${prev}".`, line: 2 });
      
      if (prev in dp) {
        maxLen = Math.max(maxLen, dp[prev] + 1);
        steps.push({ type: "found", word, prev, dp: {...dp}, message: `Predecessor "${prev}" found in map! Its chain length is ${dp[prev]}. Max is now ${maxLen}.`, line: 3 });
      } else {
        steps.push({ type: "not_found", word, prev, dp: {...dp}, message: `Predecessor "${prev}" not in map.`, line: 4 });
      }
    }
    
    dp[word] = maxLen;
    steps.push({ type: "store", word, prev: "", dp: {...dp}, message: `Store dp["${word}"] = ${maxLen}.`, line: 5 });
  }

  steps.push({ type: "done", word: "", prev: "", dp: {...dp}, message: `Done. The Longest String Chain length is the max value in the map (4).`, line: 6 });
  return steps;
}

export default function LongestStringChainLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateStringChain(), []);
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
    "words.sort((a, b) => a.length - b.length);",
    "let dp = new Map();",
    "for (let word of words) {",
    "  let best = 1;",
    "  for (let i = 0; i < word.length; i++) {",
    "    let prev = word.slice(0, i) + word.slice(i+1);",
    "    if (dp.has(prev)) {",
    "      best = Math.max(best, dp.get(prev) + 1);",
    "    }",
    "  }",
    "  dp.set(word, best);",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Hash Maps</span>
          <h1>Longest String Chain</h1>
          <p className="description">Given a list of words, find the length of the longest chain where each word adds exactly one letter anywhere to the previous word.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N log N + N * L²)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a variation of LIS, but on strings. Instead of checking every previous word, we systematically remove one character to find predecessors.</p></article>
          <article className="guide-card"><h2>Sorting</h2><p>Because a predecessor must be strictly shorter, we first sort the array of words by length. This guarantees we process predecessors before successors.</p></article>
          <article className="guide-card"><h2>Hash Map DP</h2><p>Instead of an array `dp[i]`, we use a hash map `dp[word]` mapping the string to its chain length. This provides O(1) lookups for predecessors.</p></article>
          <article className="guide-card highlight"><h2>The Transition</h2><p>For a word, loop through each character, remove it, and check if the resulting string is in the hash map. Update the max length accordingly.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how removing 1 character helps find predecessors in the hash map.</span>
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
               
               <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Current Word</div>
                   <div style={{ padding: '12px 24px', background: 'color-mix(in srgb, var(--blue) 20%, transparent)', border: '2px solid var(--blue)', borderRadius: '8px', fontWeight: 'bold', fontSize: '20px' }}>
                     {step.word || '...'}
                   </div>
                 </div>
                 
                 <div style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)' }}>➔</div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Testing Predecessor</div>
                   <div style={{ padding: '12px 24px', background: 'var(--panel2)', border: `2px solid ${step.type === "found" ? 'var(--green)' : 'var(--border)'}`, borderRadius: '8px', fontWeight: 'bold', fontSize: '20px' }}>
                     {step.prev || '...'}
                   </div>
                 </div>
               </div>

               <div style={{ marginTop: '20px' }}>
                 <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>DP Hash Map State</div>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                   {Object.entries(step.dp).map(([k, v]) => (
                     <div key={k} style={{
                       padding: '8px 12px', borderRadius: '6px',
                       background: step.type === "found" && step.prev === k ? 'color-mix(in srgb, var(--green) 20%, transparent)' : 'var(--panel)',
                       border: `1px solid ${step.type === "found" && step.prev === k ? 'var(--green)' : 'var(--border)'}`,
                       display: 'flex', gap: '8px'
                     }}>
                       <span style={{ color: 'var(--muted)' }}>{k}:</span>
                       <span style={{ fontWeight: 'bold' }}>{v}</span>
                     </div>
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
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .counter { font-family: monospace; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

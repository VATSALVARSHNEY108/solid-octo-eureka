"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface WordStep {
  type: string;
  i: number;
  j: number;
  dp: boolean[];
  message: string;
  line?: number;
}

function simulateWordBreak(): WordStep[] {
  const steps: WordStep[] = [];
  const s = "catsand";
  const wordDict = new Set(["cat", "cats", "and", "sand", "dog"]);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;

  steps.push({ type: "init", i: -1, j: -1, dp: [...dp], message: "dp[i] represents if the substring s[0...i] can be segmented. dp[0] is true (empty string).", line: 0 });

  for (let i = 1; i <= s.length; i++) {
    steps.push({ type: "outer", i, j: -1, dp: [...dp], message: `Evaluating if we can form the string up to length ${i} ("${s.substring(0, i)}").`, line: 1 });
    
    for (let j = 0; j < i; j++) {
      steps.push({ type: "check", i, j, dp: [...dp], message: `Can we form prefix up to length ${j} AND is the rest "${s.substring(j, i)}" in the dict?`, line: 2 });
      
      if (dp[j]) {
        steps.push({ type: "dp_true", i, j, dp: [...dp], message: `Prefix length ${j} is formable. Now checking if "${s.substring(j, i)}" is in dictionary.`, line: 3 });
        
        if (wordDict.has(s.substring(j, i))) {
          dp[i] = true;
          steps.push({ type: "match", i, j, dp: [...dp], message: `Match! "${s.substring(j, i)}" is in dictionary. Set dp[${i}] to true and break.`, line: 4 });
          break; // Found a valid break, move to next i
        } else {
          steps.push({ type: "mismatch", i, j, dp: [...dp], message: `"${s.substring(j, i)}" is NOT in dictionary. Continue checking.`, line: 5 });
        }
      } else {
        steps.push({ type: "skip", i, j, dp: [...dp], message: `Prefix length ${j} is NOT formable. Skip.`, line: 2 });
      }
    }
  }

  steps.push({ type: "done", i: -1, j: -1, dp: [...dp], message: `Done. The full string can be segmented? ${dp[s.length]}.`, line: 6 });
  return steps;
}

export default function WordBreakLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateWordBreak(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  const s = "catsand";
  const dict = ["cat", "cats", "and", "sand", "dog"];

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
    "let dp = new Array(s.length + 1).fill(false);",
    "dp[0] = true;",
    "let dict = new Set(wordDict);",
    "for (let i = 1; i <= s.length; i++) {",
    "  for (let j = 0; j < i; j++) {",
    "    if (dp[j] && dict.has(s.substring(j, i))) {",
    "      dp[i] = true;",
    "      break;",
    "    }",
    "  }",
    "}",
    "return dp[s.length];"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Strings</span>
          <h1>Word Break</h1>
          <p className="description">Given a string and a dictionary of words, determine if the string can be segmented into a space-separated sequence of dictionary words.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N³ or N²)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a partitioning problem. We want to know if the string `s[0...i]` can be broken up into valid dictionary words.</p></article>
          <article className="guide-card"><h2>The DP Array</h2><p>`dp[i]` is a boolean indicating whether the prefix of length `i` is breakable. We use an array of size `N + 1`.</p></article>
          <article className="guide-card"><h2>The Transition</h2><p>To find if `dp[i]` is true, we test all possible split points `j` (from 0 to i-1). If `dp[j]` is true, AND the remaining substring `s[j...i]` is in the dictionary, then `dp[i]` is true!</p></article>
          <article className="guide-card highlight"><h2>The Early Exit</h2><p>As soon as we find ONE valid `j` that makes `dp[i]` true, we can immediately `break` the inner loop and move on to the next `i`. We just need to know IF it's possible, not how many ways.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the algorithm scans backward from `i` to find a valid word partition `j`.</span>
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

              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--panel2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Dictionary</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {dict.map(w => (
                    <span key={w} style={{ padding: '4px 8px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }}>{w}</span>
                  ))}
                </div>
              </div>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', alignItems: 'flex-end', height: '60px' }}>
                 {s.split('').map((char, idx) => {
                   const isChecking = step.i > 0 && idx >= step.j && idx < step.i;
                   let bg = 'transparent';
                   let color = 'var(--text)';
                   
                   if (isChecking) {
                     if (step.type === "match") {
                       bg = 'color-mix(in srgb, var(--green) 30%, transparent)';
                       color = 'var(--green)';
                     } else if (step.type === "mismatch") {
                       bg = 'color-mix(in srgb, var(--red) 30%, transparent)';
                       color = 'var(--red)';
                     } else {
                       bg = 'color-mix(in srgb, var(--amber) 30%, transparent)';
                       color = 'var(--amber)';
                     }
                   }

                   return (
                     <div key={idx} style={{
                       display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                     }}>
                       <div style={{
                         width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                         background: bg, color, fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace',
                         borderBottom: `2px solid ${isChecking ? color : 'var(--border)'}`, transition: 'all 0.3s'
                       }}>
                         {char}
                       </div>
                     </div>
                   )
                 })}
               </div>

               <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginBottom: '8px' }}>DP Array (Can segment up to length L?)</div>
               <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                 {step.dp?.map((val, idx) => {
                   const isTarget = step.i === idx;
                   const isSource = step.j === idx;
                   
                   let bg = val ? 'color-mix(in srgb, var(--green) 20%, transparent)' : 'var(--panel2)';
                   let border = val ? 'var(--green)' : 'var(--border)';
                   
                   if (isTarget) {
                     border = 'var(--amber)';
                     if (step.type === "match") bg = 'color-mix(in srgb, var(--amber) 40%, transparent)';
                   } else if (isSource) {
                     border = 'var(--blue)';
                   }

                   return (
                     <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', color: 'var(--muted)', marginBottom: '2px' }}>{idx}</span>
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

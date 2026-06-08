"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface VPStep {
  type: string;
  idx: number;
  char: string;
  stack: string[];
  message: string;
  line?: number;
  valid?: boolean;
}

function simulateValidParentheses(): VPStep[] {
  const steps: VPStep[] = [];
  const s = "{[()]}";
  const stack: string[] = [];

  steps.push({ type: "init", idx: -1, char: "", stack: [...stack], message: `String: "${s}". We will iterate through each character.`, line: 0 });

  function isValid() {
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '(' || c === '{' || c === '[') {
        stack.push(c);
        steps.push({ type: "push", idx: i, char: c, stack: [...stack], message: `Found open bracket '${c}'. Pushed to stack.`, line: 3 });
      } else {
        if (stack.length === 0) {
          steps.push({ type: "invalid_empty", idx: i, char: c, stack: [...stack], message: `Found close bracket '${c}', but stack is empty! Invalid.`, line: 6, valid: false });
          return false;
        }
        const top = stack[stack.length - 1];
        if ((c === ')' && top === '(') || (c === '}' && top === '{') || (c === ']' && top === '[')) {
          stack.pop();
          steps.push({ type: "pop_match", idx: i, char: c, stack: [...stack], message: `Found close bracket '${c}'. It matches top '${top}'. Popped!`, line: 9 });
        } else {
          steps.push({ type: "invalid_mismatch", idx: i, char: c, stack: [...stack], message: `Found close bracket '${c}', but top is '${top}'. Mismatch! Invalid.`, line: 12, valid: false });
          return false;
        }
      }
    }

    if (stack.length === 0) {
      steps.push({ type: "valid", idx: s.length, char: "", stack: [...stack], message: `Finished string. Stack is empty. Valid parentheses!`, line: 17, valid: true });
      return true;
    } else {
      steps.push({ type: "invalid_leftover", idx: s.length, char: "", stack: [...stack], message: `Finished string, but stack still has elements. Invalid!`, line: 17, valid: false });
      return false;
    }
  }

  isValid();
  return steps;
}

export default function ValidParenthesesLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateValidParentheses(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

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

  const codeSnippet = [
    "function isValid(s) {",
    "  let stack = [];",
    "  for (let char of s) {",
    "    if (char === '(' || char === '{' || char === '[') {",
    "      stack.push(char);",
    "    } else {",
    "      if (stack.length === 0) return false;",
    "      let top = stack.pop();",
    "      if ((char === ')' && top !== '(') ||",
    "          (char === '}' && top !== '{') ||",
    "          (char === ']' && top !== '[')) {",
    "        return false;",
    "      }",
    "    }",
    "  }",
    "  return stack.length === 0;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Classic Algorithm</span>
          <h1>Valid Parentheses</h1>
          <p className="description">Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is structurally valid.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>The LIFO Requirement</h2><p>When you open a `[`, you cannot close it until any inner brackets like `&#123;` are completely resolved. The last bracket opened MUST be the first bracket closed. This maps perfectly to a Stack.</p></article>
          <article className="guide-card highlight"><h2>The Algorithm</h2><p>Iterate through the string. If it's an opening bracket, push it. If it's a closing bracket, peek the stack. If it matches the corresponding opening bracket, pop it. Otherwise, the string is invalid.</p></article>
          <article className="guide-card"><h2>Edge Cases</h2><p>1. Closing bracket with an empty stack (e.g., `]`).<br/>2. Reaching the end of the string but the stack isn't empty (e.g., `[`). In both cases, return false.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how the stack temporarily holds open brackets until they find their closing pair.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="controls">
                <button onClick={() => setStepIndex(0)}>|&lt;</button>
                <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>&lt;</button>
                <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
                <button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>&gt;</button>
                <button onClick={() => setStepIndex(steps.length - 1)}>&gt;|</button>
              </div>
              <label>Speed<input type="range" min="500" max="3000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
              <label>Timeline<input type="range" min="0" max={Math.max(0, steps.length - 1)} value={stepIndex} onChange={(e) => { setPlaying(false); setStepIndex(Number(e.target.value)); }} /></label>
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px', alignItems: 'center' }}>
               
               <div style={{ display: 'flex', gap: '40px', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                 
                 {/* Array String Representation */}
                 <div style={{ display: 'flex', gap: '4px' }}>
                   {["{", "[", "(", ")", "]", "}"].map((char, i) => (
                     <div key={i} style={{ 
                       width: '40px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                       fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace',
                       background: i === step.idx ? 'var(--blue)' : 'var(--panel2)',
                       color: i === step.idx ? '#fff' : 'var(--text)',
                       borderRadius: '6px', border: '1px solid var(--border)'
                     }}>
                       {char}
                     </div>
                   ))}
                 </div>

                 {/* Stack */}
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '14px', color: 'var(--amber)', fontWeight: 'bold', marginBottom: '10px' }}>Stack</span>
                   <div style={{ 
                     width: '100px', height: '180px', border: '3px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '6px',
                     background: 'color-mix(in srgb, var(--amber) 5%, transparent)'
                   }}>
                     {step.stack.map((char, idx) => (
                       <div key={idx} style={{
                         width: '100%', height: '35px', background: 'var(--panel)',
                         border: '2px solid var(--amber)', borderRadius: '6px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '20px', color: 'var(--amber)',
                         fontFamily: 'monospace'
                       }}>
                         {char}
                       </div>
                     ))}
                   </div>
                 </div>

               </div>

               {step.valid !== undefined && (
                 <div style={{ padding: '15px 30px', background: step.valid ? 'color-mix(in srgb, var(--green) 10%, transparent)' : 'color-mix(in srgb, var(--red) 10%, transparent)', border: `2px solid ${step.valid ? 'var(--green)' : 'var(--red)'}`, color: step.valid ? 'var(--green)' : 'var(--red)', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold' }}>
                   {step.valid ? "String is VALID!" : "String is INVALID!"}
                 </div>
               )}

               <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: 'auto' }}>
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
        .actions, .controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 8px 12px; }
        button { cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; text-decoration: none; display: inline-flex; }
        .detailed-guide { width: min(1120px, calc(100% - 80px)); margin: 0 auto; padding: 100px 0; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin: 0 0 16px 0; color: var(--text); }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }
        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; margin: 24px auto 0; max-width: 1200px;}
        aside { display: flex; flex-direction: column; gap: 12px; }
        label { display: grid; gap: 6px; margin-top: 12px; color: var(--muted); font-size: 13px; }
        .gesture-hint { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; font-size: 11px; color: var(--muted); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}

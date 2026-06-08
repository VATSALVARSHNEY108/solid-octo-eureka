"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface ConvertStep {
  type: string;
  charIndex: number;
  stack: string[];
  output: string;
  message: string;
  line?: number;
}

function simulateInfixToPostfix(): ConvertStep[] {
  const steps: ConvertStep[] = [];
  const exp = "a+b*(c^d-e)^(f+g*h)-i";
  // To keep the simulation simple visually, we'll use a shorter string: "a+b*c"
  const shortExp = "a+b*c";
  const stack: string[] = [];
  let output = "";

  const precedence = (c: string) => {
    if (c === '^') return 3;
    if (c === '/' || c === '*') return 2;
    if (c === '+' || c === '-') return 1;
    return -1;
  };

  steps.push({ type: "init", charIndex: -1, stack: [...stack], output, message: `Convert Infix to Postfix: ${shortExp}`, line: 0 });

  for (let i = 0; i < shortExp.length; i++) {
    const char = shortExp[i];
    steps.push({ type: "read", charIndex: i, stack: [...stack], output, message: `Read character '${char}'.`, line: 1 });

    if (char.match(/[a-zA-Z0-9]/)) {
      output += char;
      steps.push({ type: "operand", charIndex: i, stack: [...stack], output, message: `'${char}' is an operand. Add directly to output.`, line: 2 });
    } else if (char === '(') {
      stack.push(char);
      steps.push({ type: "open_paren", charIndex: i, stack: [...stack], output, message: `'(' found. Push to stack.`, line: 3 });
    } else if (char === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        output += stack.pop();
        steps.push({ type: "close_paren_pop", charIndex: i, stack: [...stack], output, message: `Pop from stack to output until '(' is found.`, line: 4 });
      }
      stack.pop(); // Remove '('
      steps.push({ type: "close_paren_done", charIndex: i, stack: [...stack], output, message: `Popped '(' from stack.`, line: 5 });
    } else {
      while (
        stack.length > 0 &&
        precedence(char) <= precedence(stack[stack.length - 1])
      ) {
        output += stack.pop();
        steps.push({ type: "op_pop", charIndex: i, stack: [...stack], output, message: `Top of stack has higher/equal precedence. Pop to output.`, line: 7 });
      }
      stack.push(char);
      steps.push({ type: "op_push", charIndex: i, stack: [...stack], output, message: `Push operator '${char}' to stack.`, line: 8 });
    }
  }

  while (stack.length > 0) {
    output += stack.pop();
    steps.push({ type: "flush", charIndex: shortExp.length, stack: [...stack], output, message: `End of string. Flush remaining operators from stack to output.`, line: 10 });
  }

  steps.push({ type: "done", charIndex: shortExp.length, stack: [...stack], output, message: `Done! Final Postfix: ${output}`, line: 11 });

  return steps;
}

export default function InfixToPostfixLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const steps = useMemo(() => simulateInfixToPostfix(), []);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];
  const timerRef = useRef<number | null>(null);

  const shortExp = "a+b*c";

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
    "function infixToPostfix(exp) {",
    "  let stack = []; let res = '';",
    "  for (let char of exp) {",
    "    if (isOperand(char)) res += char;",
    "    else if (char === '(') stack.push(char);",
    "    else if (char === ')') {",
    "      while (stack[stack.length-1] !== '(') res += stack.pop();",
    "      stack.pop();",
    "    } else {",
    "      while (stack.length && prec(char) <= prec(stack[stack.length-1])) {",
    "        res += stack.pop();",
    "      }",
    "      stack.push(char);",
    "    }",
    "  }",
    "  while(stack.length) res += stack.pop();",
    "  return res;",
    "}"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Stack • Applications</span>
          <h1>Infix to Postfix Conversion</h1>
          <p className="description">Convert human-readable mathematical expressions into computer-friendly Postfix notation using a Stack to enforce operator precedence.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(N)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Operands First</h2><p>Letters and numbers (operands) never go into the stack. The moment you see them, they are appended directly to the output string.</p></article>
          <article className="guide-card highlight"><h2>The Stack of Operators</h2><p>The stack ONLY holds operators and parentheses. It enforces precedence: a lower-precedence operator cannot be placed on top of a higher-precedence one.</p></article>
          <article className="guide-card"><h2>The Parentheses Rule</h2><p>An open parenthesis `(` is pushed unconditionally. A close parenthesis `)` forces the stack to pop all operators into the output until its matching `(` is found.</p></article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch how operators are deferred in the Stack until their precedence allows them to join the output.</span>
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
               
               <div style={{ display: 'flex', gap: '8px', fontSize: '24px', fontFamily: 'monospace' }}>
                 {shortExp.split('').map((char, i) => {
                   const isActive = step.charIndex === i;
                   return (
                     <span key={i} style={{
                       padding: '8px 12px', borderRadius: '4px',
                       background: isActive ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'transparent',
                       color: isActive ? 'var(--amber)' : 'var(--text)',
                       borderBottom: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                       transition: 'all 0.2s'
                     }}>
                       {char}
                     </span>
                   )
                 })}
               </div>

               <div style={{ display: 'flex', gap: '40px', width: '100%', justifyContent: 'center' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Operator Stack</span>
                   <div style={{ 
                     width: '80px', minHeight: '150px', border: '3px solid var(--border)', borderTop: 'none', 
                     borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px',
                     display: 'flex', flexDirection: 'column-reverse', padding: '10px', gap: '4px',
                     background: 'var(--panel2)'
                   }}>
                     {step.stack.map((char, idx) => (
                       <div key={idx} style={{
                         width: '100%', height: '30px', background: 'var(--panel)',
                         border: '2px solid var(--blue)', borderRadius: '4px',
                         display: 'flex', alignItems: 'center', justifyContent: 'center',
                         fontWeight: 'bold', fontSize: '16px', color: 'var(--blue)'
                       }}>
                         {char}
                       </div>
                     ))}
                   </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Postfix Output</span>
                   <div style={{ 
                     minWidth: '200px', height: '60px', border: '2px dashed var(--green)', borderRadius: '8px',
                     display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: '24px', fontWeight: 'bold',
                     color: 'var(--green)', letterSpacing: '4px', background: 'var(--panel2)'
                   }}>
                     {step.output}
                   </div>
                 </div>
               </div>

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

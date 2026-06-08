"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface CoinStep {
  type: string;
  amount: number;
  coinIndex: number;
  dp: number[];
  message: string;
  line?: number;
}

function simulateCoinChangeI(coins: number[], amount: number): CoinStep[] {
  const steps: CoinStep[] = [];
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  steps.push({ type: "init", amount: -1, coinIndex: -1, dp: [...dp], message: `Initialize DP array of size ${amount + 1} with Infinity, and dp[0] = 0.`, line: 0 });

  for (let cIdx = 0; cIdx < coins.length; cIdx++) {
    const coin = coins[cIdx];
    steps.push({ type: "loop_coin", amount: -1, coinIndex: cIdx, dp: [...dp], message: `Considering coin with value: ${coin}.`, line: 1 });
    
    for (let i = coin; i <= amount; i++) {
      steps.push({ type: "check_amount", amount: i, coinIndex: cIdx, dp: [...dp], message: `Checking if we can make amount ${i} using coin ${coin}.`, line: 2 });
      
      const prevWays = dp[i - coin];
      if (prevWays !== Infinity) {
        if (prevWays + 1 < dp[i]) {
          dp[i] = prevWays + 1;
          steps.push({ type: "update", amount: i, coinIndex: cIdx, dp: [...dp], message: `Update dp[${i}] = dp[${i - coin}] + 1 = ${dp[i]}.`, line: 3 });
        } else {
          steps.push({ type: "no_update", amount: i, coinIndex: cIdx, dp: [...dp], message: `dp[${i}] is already ${dp[i]} which is better or equal to ${prevWays + 1}.`, line: 3 });
        }
      } else {
        steps.push({ type: "unreachable", amount: i, coinIndex: cIdx, dp: [...dp], message: `Amount ${i - coin} is unreachable. Skip.`, line: 2 });
      }
    }
  }

  steps.push({ type: "done", amount, coinIndex: -1, dp: [...dp], message: `Done. Minimum coins to make ${amount} is ${dp[amount] === Infinity ? -1 : dp[amount]}.`, line: 4 });
  return steps;
}

export default function CoinChangeILesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [coinsInput, setCoinsInput] = useState("1, 2, 5");
  const [coins, setCoins] = useState([1, 2, 5]);
  const [amount, setAmount] = useState(11);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateCoinChangeI(coins, amount), [coins, amount]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [coins, amount]);

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
    const parsed = coinsInput.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parsed.length > 0) setCoins(parsed);
  };

  const codeSnippet = [
    "let dp = Array(amount + 1).fill(Infinity); dp[0] = 0;",
    "for (let coin of coins) {",
    "  for (let i = coin; i <= amount; i++) {",
    "    dp[i] = Math.min(dp[i], dp[i - coin] + 1);",
    "  }",
    "}"
  ];

  const fmt = (v: number) => v === Infinity ? "inf" : v;

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • Unbounded Knapsack</span>
          <h1>Coin Change I (Minimum Coins)</h1>
          <p className="description">Find the minimum number of coins needed to make up a given amount. You can use each coin infinitely many times.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N * amount)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(amount)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is a classic unbounded knapsack problem. We want to fill a knapsack of capacity `amount` using minimum items of given weights `coins`.</p></article>
          <article className="guide-card"><h2>State Variable</h2><p>Let `dp[i]` be the minimum number of coins needed to make amount `i`. Initially, `dp[0] = 0` and all other `dp[i] = infinity`.</p></article>
          <article className="guide-card"><h2>Transitions</h2><p>For each coin, we can try to add it to any reachable state `i - coin`. The new state is `dp[i] = Math.min(dp[i], dp[i - coin] + 1)`.</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>By iterating through each coin sequentially and updating the DP table left-to-right, we implicitly allow the same coin to be used multiple times.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px', alignItems: 'center' }}>
            <label style={{ margin: 0 }}>Coins:</label>
            <input value={coinsInput} onChange={(e) => setCoinsInput(e.target.value)} placeholder="e.g., 1, 2, 5" style={{ flex: 1, maxWidth: '200px' }} />
            <button onClick={applyInput}>Set</button>
            <label style={{ margin: '0 0 0 16px' }}>Amount:</label>
            <input type="number" min="1" max="20" value={amount} onChange={(e) => { setAmount(Number(e.target.value)); setPlaying(false); }} style={{ width: '70px' }} />
            <button onClick={() => { setCoinsInput("1, 2, 5"); setCoins([1, 2, 5]); setAmount(11); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the available coins and target amount.</span>
                <span>▶️ Play to watch how the DP table updates sequentially for each coin.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="simulation-data">
                <div className="data-group">
                  <h3>Active Coin</h3>
                  <div className="distances">
                    {coins.map((c, i) => (
                      <span key={i} className={step.coinIndex === i ? 'active' : ''} style={{borderColor: step.coinIndex === i ? 'var(--amber)' : ''}}>
                        {c}
                      </span>
                    ))}
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
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '20px' }}>
               <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                 {step.dp.map((val, idx) => {
                    const isActive = step.amount === idx;
                    const isSource = step.amount !== -1 && step.coinIndex !== -1 && idx === step.amount - coins[step.coinIndex];
                    let bg = 'var(--panel2)';
                    let border = 'var(--border)';
                    if (isActive) {
                      bg = 'color-mix(in srgb, var(--blue) 20%, transparent)';
                      border = 'var(--blue)';
                    } else if (isSource) {
                      bg = 'color-mix(in srgb, var(--green) 20%, transparent)';
                      border = 'var(--green)';
                    }
                    
                    return (
                      <div key={idx} style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        padding: '12px', borderRadius: '8px', minWidth: '50px',
                        background: bg, border: `2px solid ${border}`,
                        transition: 'all 0.3s'
                      }}>
                         <span style={{ fontSize: '11px', color: 'var(--muted)' }}>dp[{idx}]</span>
                         <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{fmt(val)}</span>
                      </div>
                    );
                 })}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '200px', marginTop: 'auto' }}>
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

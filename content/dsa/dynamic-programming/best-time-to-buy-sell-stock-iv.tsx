"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

interface StockStep {
  type: string;
  day: number;
  price: number;
  kIndex: number;
  buy: number[];
  sell: number[];
  message: string;
  line?: number;
}

function simulateStockIV(prices: number[], k: number): StockStep[] {
  const steps: StockStep[] = [];
  const buy = new Array(k + 1).fill(-Infinity);
  const sell = new Array(k + 1).fill(0);

  steps.push({ type: "init", day: -1, price: 0, kIndex: 0, buy: [...buy], sell: [...sell], message: `Initialize buy array to -Infinity and sell array to 0 for k=${k}.`, line: 0 });

  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    steps.push({ type: "loop", day: i, price, kIndex: 0, buy: [...buy], sell: [...sell], message: `Day ${i + 1}: Check price ${price}`, line: 1 });
    
    for (let j = 1; j <= k; j++) {
      const prevBuy = buy[j];
      buy[j] = Math.max(buy[j], sell[j - 1] - price);
      steps.push({ type: "buy", day: i, price, kIndex: j, buy: [...buy], sell: [...sell], message: `buy[${j}] = max(${prevBuy === -Infinity ? '-inf' : prevBuy}, sell[${j - 1}] - ${price}) = ${buy[j]}`, line: 2 });
      
      const prevSell = sell[j];
      sell[j] = Math.max(sell[j], buy[j] + price);
      steps.push({ type: "sell", day: i, price, kIndex: j, buy: [...buy], sell: [...sell], message: `sell[${j}] = max(${prevSell}, buy[${j}] + ${price}) = ${sell[j]}`, line: 3 });
    }
  }

  steps.push({ type: "done", day: prices.length, price: 0, kIndex: 0, buy: [...buy], sell: [...sell], message: `Done. Maximum profit (at most ${k} transactions) is ${sell[k]}`, line: 4 });
  return steps;
}

export default function BestTimeToBuySellStockIVLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [pricesInput, setPricesInput] = useState("3, 2, 6, 5, 0, 3");
  const [prices, setPrices] = useState([3, 2, 6, 5, 0, 3]);
  const [k, setK] = useState(2);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateStockIV(prices, k), [prices, k]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [prices, k]);

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

  const applyPrices = () => {
    const parsed = pricesInput.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parsed.length > 0) setPrices(parsed);
  };

  const codeSnippet = [
    "let buy = Array(k + 1).fill(-Infinity);",
    "let sell = Array(k + 1).fill(0);",
    "for (let price of prices) {",
    "  for (let j = 1; j <= k; j++) {",
    "    buy[j] = Math.max(buy[j], sell[j - 1] - price);",
    "    sell[j] = Math.max(sell[j], buy[j] + price);",
    "  }",
    "}"
  ];

  const fmt = (v: number) => v === -Infinity ? "-inf" : v;

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • State Machines</span>
          <h1>Best Time to Buy and Sell Stock IV</h1>
          <p className="description">Maximize your profit given you can complete at most k transactions.</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N*K)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(K)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>You can complete at most K transactions. We model this as a state machine where each transaction j up to K has its own buy and sell state.</p></article>
          <article className="guide-card"><h2>Generalization</h2><p>This is exactly like Stock III, but generalized to K transactions using arrays instead of discrete variables.</p></article>
          <article className="guide-card"><h2>Space Optimization</h2><p>We only need the previous transaction's sell state to compute the current transaction's buy state, leading to O(K) space.</p></article>
          <article className="guide-card highlight"><h2>Key Insight</h2><p>Notice how `sell[j-1]` is used to transition into `buy[j]`. We can use today's price to buy the stock using the profit we made from the previous j-1 transactions.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor" style={{ display: 'flex', gap: '8px', padding: '0 40px', alignItems: 'center' }}>
            <label style={{ margin: 0 }}>k = </label>
            <input type="number" min="1" max="5" value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: '60px' }} />
            <input value={pricesInput} onChange={(e) => setPricesInput(e.target.value)} placeholder="e.g., 3,2,6,5,0,3" style={{ flex: 1, maxWidth: '300px' }} />
            <button onClick={applyPrices}>Update Prices</button>
            <button onClick={() => { setPricesInput("3, 2, 6, 5, 0, 3"); setPrices([3, 2, 6, 5, 0, 3]); setK(2); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Adjust the array of prices and k above to test different scenarios.</span>
                <span>▶️ Use the playback controls to step through the algorithm.</span>
              </div>
              <h2>Current Step</h2>
              <p>{step?.message || "Ready."}</p>
              
              <div className="simulation-data">
                <div className="data-group">
                  <h3>State Arrays</h3>
                  <div className="distances" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {Array.from({length: k}, (_, i) => i + 1).map(j => (
                      <div key={j} style={{ display: 'contents' }}>
                        <span className={step.buy[j] !== -Infinity ? 'active' : ''} style={{borderColor: step.kIndex === j && step.type === 'buy' ? 'var(--amber)' : ''}}>buy[{j}]: {fmt(step.buy[j])}</span>
                        <span className={step.sell[j] > 0 ? 'active' : ''} style={{borderColor: step.kIndex === j && step.type === 'sell' ? 'var(--blue)' : (step.sell[j] > 0 ? 'var(--green)' : ''), color: step.sell[j] > 0 ? 'var(--green)' : ''}}>sell[{j}]: {step.sell[j]}</span>
                      </div>
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
                 {prices.map((p, i) => (
                    <div key={i} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      padding: '16px', borderRadius: '8px', minWidth: '60px',
                      background: step.day === i ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : 'var(--panel2)',
                      border: `2px solid ${step.day === i ? 'var(--blue)' : 'var(--border)'}`,
                      transition: 'all 0.3s'
                    }}>
                       <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Day {i+1}</span>
                       <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{p}</span>
                    </div>
                 ))}
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'center', height: '220px' }}>
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
        button, a, input, select { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; transition: all 0.3s; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); }
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

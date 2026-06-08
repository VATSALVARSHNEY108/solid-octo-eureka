"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { CodeTracker } from "@/components/CodeTracker";

// Best Time to Buy and Sell Stock with Cooldown
interface CoolStep {
  type: string;
  day: number;
  price: number;
  buy: number;
  sell: number;
  cool: number;
  message: string;
  line?: number;
}

function simulateStockCooldown(): CoolStep[] {
  const steps: CoolStep[] = [];
  const prices = [1, 2, 3, 0, 2];
  
  let buy = -prices[0];
  let sell = 0;
  let cool = 0; // Cooldown means we just sold yesterday, so profit is 'sell' from prev step

  steps.push({ type: "init", day: 0, price: prices[0], buy, sell, cool, message: `Day 0: Price = ${prices[0]}. If we buy, profit = ${buy}. Sell/Cool = 0.`, line: 0 });

  for (let i = 1; i < prices.length; i++) {
    steps.push({ type: "eval", day: i, price: prices[i], buy, sell, cool, message: `Day ${i}: Price = ${prices[i]}. Calculating next states.`, line: 1 });
    
    const prevBuy = buy;
    const prevSell = sell;
    const prevCool = cool;

    buy = Math.max(prevBuy, prevCool - prices[i]);
    steps.push({ type: "buy", day: i, price: prices[i], buy, sell: prevSell, cool: prevCool, message: `Buy State: Max of doing nothing (${prevBuy}) OR buying after cooldown (${prevCool} - ${prices[i]}) = ${buy}.`, line: 2 });
    
    sell = Math.max(prevSell, prevBuy + prices[i]);
    steps.push({ type: "sell", day: i, price: prices[i], buy, sell, cool: prevCool, message: `Sell State: Max of doing nothing (${prevSell}) OR selling what we bought (${prevBuy} + ${prices[i]}) = ${sell}.`, line: 3 });

    cool = prevSell;
    steps.push({ type: "cool", day: i, price: prices[i], buy, sell, cool, message: `Cooldown State: We are forced into cooldown if we sold yesterday. So Cool = PrevSell (${prevSell}).`, line: 4 });
  }

  steps.push({ type: "done", day: prices.length - 1, price: -1, buy, sell, cool, message: `Done. Max profit is always the maximum of the 'Sell' state (${sell}) or 'Cool' state (${cool}).`, line: 5 });
  return steps;
}

export default function StockCooldownLesson() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";

  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const timerRef = useRef<number | null>(null);

  const steps = useMemo(() => simulateStockCooldown(), []);
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
    "let buy = -prices[0];",
    "let sell = 0;",
    "let cool = 0;",
    "for (let i = 1; i < prices.length; i++) {",
    "  let prevBuy = buy;",
    "  let prevSell = sell;",
    "  // We can only buy if we were in cooldown yesterday",
    "  buy = Math.max(prevBuy, cool - prices[i]);",
    "  // We can only sell if we bought previously",
    "  sell = Math.max(prevSell, prevBuy + prices[i]);",
    "  // Cooldown happens the day after selling",
    "  cool = prevSell;",
    "}",
    "return Math.max(sell, cool);"
  ];

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Dynamic Programming • State Machine</span>
          <h1>Best Time to Buy and Sell Stock with Cooldown</h1>
          <p className="description">Maximize your profit from stock trading with one restriction: after you sell your stock, you cannot buy stock on the next day (i.e., cooldown 1 day).</p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(N)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(1)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>
      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card"><h2>Overview</h2><p>This is best modeled as a finite state machine. On any given day, your portfolio can be in one of three states: Holding Stock (Buy), Just Sold (Sell), or Empty (Cooldown).</p></article>
          <article className="guide-card"><h2>The Buy State</h2><p>To enter the `Buy` state today, you either stay in `Buy` from yesterday, or you buy today. But you can ONLY buy today if you were in the `Cooldown` state yesterday.</p></article>
          <article className="guide-card"><h2>The Sell State</h2><p>To enter the `Sell` state today, you either stay in `Sell` from yesterday (doing nothing), or you sell the stock you were holding in the `Buy` state.</p></article>
          <article className="guide-card highlight"><h2>The Cooldown State</h2><p>The `Cooldown` state is forced. If you sell today, tomorrow you MUST be in cooldown. So tomorrow's `Cooldown` profit is just today's `Sell` profit.</p></article>
        </div>
      </section>
      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>▶️ Play to watch the state machine track maximum profits for Buy, Sell, and Cooldown states.</span>
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
            </aside>
            <div className="canvas" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
               
               <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                 <div style={{ padding: '8px 16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: 'var(--text)' }}>
                   Day {step.day}: Price <span style={{ color: 'var(--amber)' }}>${step.price >= 0 ? step.price : '-'}</span>
                 </div>
               </div>

               <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Buy State</span>
                   <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: step.type === "buy" ? 'color-mix(in srgb, var(--blue) 20%, transparent)' : 'var(--panel)', border: `3px solid ${step.type === "buy" ? 'var(--blue)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                     {step.buy}
                   </div>
                 </div>

                 <div style={{ color: 'var(--muted)', fontSize: '24px' }}>→</div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Sell State</span>
                   <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: step.type === "sell" ? 'color-mix(in srgb, var(--green) 20%, transparent)' : 'var(--panel)', border: `3px solid ${step.type === "sell" ? 'var(--green)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                     {step.sell}
                   </div>
                 </div>

                 <div style={{ color: 'var(--muted)', fontSize: '24px' }}>→</div>

                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                   <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Cooldown</span>
                   <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: step.type === "cool" ? 'color-mix(in srgb, var(--amber) 20%, transparent)' : 'var(--panel)', border: `3px solid ${step.type === "cool" ? 'var(--amber)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', transition: 'all 0.3s' }}>
                     {step.cool}
                   </div>
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

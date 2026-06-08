"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, ArrowRightLeft, Waypoints } from "lucide-react";

interface WordStep {
  word: string;
  dist: number;
  visited: string[];
  queue: { word: string; dist: number }[];
  message: string;
}

const DEFAULT_DICTIONARY = ["HOT", "DOT", "DOG", "LOT", "LOG", "COG"];
const DEFAULT_START = "HIT";
const DEFAULT_END = "COG";

function generateWordSteps(start: string, end: string, dictionary: string[]): WordStep[] {
  const steps: WordStep[] = [];
  const startWord = start.toUpperCase();
  const endWord = end.toUpperCase();
  const wordsSet = new Set(dictionary.map(w => w.toUpperCase()));
  
  if (startWord === endWord) {
    steps.push({ word: startWord, dist: 1, visited: [startWord], queue: [], message: "Start and End words are the same!" });
    return steps;
  }

  const queue: { word: string; dist: number }[] = [{ word: startWord, dist: 1 }];
  const visited = new Set<string>([startWord]);

  steps.push({
    word: startWord,
    dist: 1,
    visited: [startWord],
    queue: [...queue],
    message: `Initialization: Starting BFS from "${startWord}". Our goal is to reach "${endWord}" by changing one letter at a time.`
  });

  while (queue.length > 0) {
    const { word, dist } = queue.shift()!;

    for (let i = 0; i < word.length; i++) {
      for (let j = 0; j < 26; j++) {
        const char = String.fromCharCode(65 + j); // Uppercase A-Z
        const nextWord = word.slice(0, i) + char + word.slice(i + 1);
        
        if (nextWord === endWord) {
           visited.add(nextWord);
           steps.push({
            word: nextWord,
            dist: dist + 1,
            visited: Array.from(visited),
            queue: [],
            message: `Goal Reached! "${word}" → "${nextWord}". Shortest path found with ${dist + 1} steps.`
          });
          return steps;
        }

        if (wordsSet.has(nextWord) && !visited.has(nextWord)) {
          visited.add(nextWord);
          queue.push({ word: nextWord, dist: dist + 1 });
          steps.push({
            word: nextWord,
            dist: dist + 1,
            visited: Array.from(visited),
            queue: [...queue],
            message: `Valid Transformation: "${word}" → "${nextWord}". Distance: ${dist + 1}. Adding to search queue.`
          });
        }
      }
    }
  }

  steps.push({
    word: "", dist: 0,
    visited: Array.from(visited),
    queue: [],
    message: `Search Exhausted: No path exists between "${startWord}" and "${endWord}" using this dictionary.`
  });

  return steps;
}

export default function WordLadderSimulation() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [startWord, setStartWord] = useState(DEFAULT_START);
  const [endWord, setEndWord] = useState(DEFAULT_END);
  const [dictionaryStr, setDictionaryStr] = useState(DEFAULT_DICTIONARY.join(", "));
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const dictionary = useMemo(() => dictionaryStr.split(",").map(w => w.trim().toUpperCase()).filter(w => w.length > 0), [dictionaryStr]);
  const steps = useMemo(() => generateWordSteps(startWord, endWord, dictionary), [startWord, endWord, dictionary]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { word: "", dist: 0, visited: [], queue: [], message: "Invalid configuration." });

  useEffect(() => {
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => setStepIndex(s => s + 1), 2100 - speed);
    } else if (stepIndex >= steps.length - 1) {
      setPlaying(false);
    }
    return () => clearInterval(timer);
  }, [playing, stepIndex, steps.length, speed]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.1;
    window.speechSynthesis.speak(utter);
  }, []);

  useEffect(() => {
    if (isSpeechEnabled && step) speak(step.message);
  }, [step, isSpeechEnabled, speak]);

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Breadth-First Search</div>
          <h1>Word Ladder</h1>
          <p className="description">
            Find the shortest sequence of transformations between two words. 
            By treating words as nodes and single-letter changes as edges, we can use <strong>BFS</strong> to discover the most efficient path through the vocabulary.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Graph Search</span>
              <span className="value">Shortest Path</span>
            </div>
            <div className="complexity-item">
              <span className="label">Algorithm</span>
              <span className="value">BFS</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><ArrowRightLeft size={20} /></div>
            <h3>Transformation</h3>
            <p>A valid edge exists between two words if they differ by exactly one character. Our dictionary acts as the constraints of the graph.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Waypoints size={20} /></div>
            <h3>Level Traversal</h3>
            <p>BFS explores the "ladder" level by level (distance by distance), guaranteeing the first time we find the target, it's via the shortest path.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="editor">
          <div className="input-group">
            <label>Start Word</label>
            <input value={startWord} onChange={(e) => { setStartWord(e.target.value.toUpperCase()); setStepIndex(0); }} />
          </div>
          <div className="input-group">
            <label>Target Word</label>
            <input value={endWord} onChange={(e) => { setEndWord(e.target.value.toUpperCase()); setStepIndex(0); }} />
          </div>
          <div className="input-group wide">
            <label>Dictionary (comma separated)</label>
            <input value={dictionaryStr} onChange={(e) => { setDictionaryStr(e.target.value); setStepIndex(0); }} />
          </div>
          <button onClick={() => { setStartWord(DEFAULT_START); setEndWord(DEFAULT_END); setDictionaryStr(DEFAULT_DICTIONARY.join(", ")); setStepIndex(0); }}>Reset</button>
        </div>

        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Search Metrics</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>BFS Queue</h3>
              <div className="queue-viz">
                {step.queue.map((q, i) => (
                  <div key={i} className="queue-item">
                    <span className="q-word">{q.word}</span>
                    <span className="q-dist">D:{q.dist}</span>
                  </div>
                ))}
                {step.queue.length === 0 && <span className="empty">Search queue cleared</span>}
              </div>
            </div>

            <div className="data-section">
              <h3>Word Vocabulary</h3>
              <div className="vocab-grid">
                {[startWord, ...dictionary].map((w, i) => {
                  const isVisited = step.visited.includes(w);
                  const isCurrent = step.word === w;
                  const isEnd = w === endWord;
                  return (
                    <div key={`${w}-${i}`} className={`vocab-card ${isVisited ? 'visited' : ''} ${isCurrent ? 'active' : ''} ${isEnd ? 'target' : ''}`}>
                      {w}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="playback-controls">
              <div className="buttons">
                <button onClick={() => { setStepIndex(0); setPlaying(false); }} className="secondary"><RotateCcw size={16} /></button>
                <button onClick={() => setStepIndex(i => Math.max(0, i - 1))} className="secondary"><ChevronLeft size={20} /></button>
                <button onClick={() => setPlaying(!playing)} className="primary">
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))} className="secondary"><ChevronRight size={20} /></button>
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "secondary active" : "secondary"}>{isSpeechEnabled ? "🔊" : "🔇"}</button>
              </div>
              <div className="speed-slider">
                <span>Speed</span>
                <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <div className="ladder-viz">
              <div className="word-chain">
                {step.visited.map((w, i) => (
                  <div key={i} className="chain-link">
                    <div className={`chain-word ${step.word === w ? 'active' : ''}`}>
                      <div className="word-text">{w}</div>
                      <div className="step-num">{i + 1}</div>
                    </div>
                    {i < step.visited.length - 1 && <div className="connector" />}
                  </div>
                ))}
                {step.visited.length === 0 && <div className="empty">Ready to transform...</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #3b82f6; --accent-light: #60a5fa; --green: #10b981; --amber: #f59e0b; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #2563eb; --accent-light: #3b82f6; }
        
        .hero { padding: 80px 24px; text-align: center; border-bottom: 1px solid var(--border); }
        .hero .content-width { max-width: 800px; margin: 0 auto; }
        .badge { display: inline-block; padding: 4px 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
        .hero h1 { font-size: 56px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 24px; }
        .description { font-size: 18px; color: var(--text-dim); line-height: 1.6; margin-bottom: 40px; }
        .complexity-grid { display: flex; justify-content: center; gap: 40px; }
        .complexity-item { display: flex; flex-direction: column; align-items: center; }
        .complexity-item .label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-dim); margin-bottom: 4px; }
        .complexity-item .value { font-size: 24px; font-weight: 800; color: var(--accent-light); font-family: monospace; }

        .guide { padding: 60px 24px; background: color-mix(in srgb, var(--panel) 50%, transparent); }
        .guide-content { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .card { padding: 48px; background: var(--panel); border: 1px solid var(--border); border-radius: 24px; }
        .card.highlight { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--panel)); }
        .card-icon { width: 40px; height: 40px; border-radius: 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent-light); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .card p { color: var(--text-dim); font-size: 14px; line-height: 1.6; }

        .simulator { padding: 60px 24px; }
        .workspace { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 360px 1fr; gap: 48px; background: var(--panel); padding: 48px; border-radius: 32px; border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 40px; }
        .panel-header { display: flex; align-items: center; gap: 12px; color: var(--text-dim); }
        .panel-header h2 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-message { padding: 20px; background: var(--panel-light); border-radius: 16px; border: 1px solid var(--border); font-size: 14px; line-height: 1.5; color: var(--text); font-weight: 500; min-height: 80px; }
        
        .queue-viz { display: flex; flex-direction: column; gap: 6px; background: var(--bg); padding: 12px; border-radius: 16px; border: 1px solid var(--border); max-height: 160px; overflow-y: auto; }
        .queue-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--panel-light); border-radius: 8px; border: 1px solid var(--border); }
        .q-word { font-weight: 800; font-family: monospace; color: var(--accent-light); }
        .q-dist { font-size: 10px; font-weight: 900; color: var(--text-dim); }

        .vocab-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; max-height: 300px; overflow-y: auto; padding: 4px; }
        .vocab-card { padding: 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 10px; text-align: center; font-size: 11px; font-weight: 800; font-family: monospace; color: var(--text-dim); }
        .vocab-card.visited { border-color: var(--accent); color: var(--accent-light); background: color-mix(in srgb, var(--accent) 5%, var(--bg)); }
        .vocab-card.active { background: var(--accent); color: white; border-color: var(--accent-light); }
        .vocab-card.target { border-color: var(--green); border-width: 2px; }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; overflow-y: auto; max-height: 700px; }
        .ladder-viz { width: 100%; max-width: 600px; }
        .word-chain { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .chain-link { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%; }
        .chain-word { padding: 16px 32px; background: var(--panel); border: 2px solid var(--border); border-radius: 16px; position: relative; min-width: 120px; text-align: center; transition: all 0.4s; }
        .chain-word.active { background: var(--accent); border-color: var(--accent-light); transform: scale(1.1); box-shadow: 0 0 30px var(--accent); }
        .word-text { font-size: 24px; font-weight: 900; font-family: monospace; letter-spacing: 0.1em; color: var(--text); }
        .active .word-text { color: white; }
        .step-num { position: absolute; left: -10px; top: -10px; width: 24px; height: 24px; background: var(--panel-light); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; }
        .connector { width: 4px; height: 32px; background: linear-gradient(to bottom, var(--accent), var(--border)); border-radius: 2px; }
        .empty { font-size: 14px; color: var(--text-dim); font-style: italic; }

        .editor { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; max-width: 1400px; margin-left: auto; margin-right: auto; background: var(--panel); padding: 40px; border-radius: 20px; border: 1px solid var(--border); }
        .input-group { display: flex; flex-direction: column; gap: 6px; }
        .input-group label { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--text-dim); }
        .input-group input { height: 40px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); color: var(--text); padding: 0 12px; font-family: monospace; }
        .input-group.wide { flex: 1; min-width: 300px; }
        .editor button { align-self: flex-end; height: 40px; padding: 0 20px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel-light); color: var(--text); cursor: pointer; transition: all 0.2s; }
        .editor button:hover { border-color: var(--accent); }
        .workspace > aside,
        .workspace > .inspector-panel,
        .workspace > .side-panel,
        .workspace > .control-panel,
        .workspace > .visual-panel,
        .workspace > .data-panel {
          resize: both;
          overflow: auto;
          min-width: 180px;
          min-height: 140px;
          max-width: 640px;
          max-height: 720px;
        }
      `}</style>
    </main>
  );
}


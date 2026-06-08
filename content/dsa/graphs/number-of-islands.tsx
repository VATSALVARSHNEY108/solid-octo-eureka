"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, 
  Info, Zap, Mountain, Waves, MousePointer2, 
  RefreshCw, Eraser, Layers
} from "lucide-react";
import { CodeTracker } from "@/components/CodeTracker";

interface IslandStep {
  grid: number[][];
  visited: boolean[][];
  r?: number;
  c?: number;
  count: number;
  message: string;
  stack: string[];
  discoveryOrder: string[];
  line?: number;
}

const ROWS = 7;
const COLS = 9;

const DEFAULT_GRID = [
  [1, 1, 0, 0, 0, 1, 1, 1, 0],
  [1, 0, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 1, 1, 0, 1, 1, 1],
  [1, 1, 0, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function generateIslandSteps(inputGrid: number[][]): IslandStep[] {
  const grid = inputGrid.map(row => [...row]);
  const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  const steps: IslandStep[] = [];
  const currentStack: string[] = [];
  const discoveryOrder: string[] = [];
  let islandCount = 0;

  steps.push({
    grid: grid.map(r => [...r]),
    visited: visited.map(r => [...r]),
    count: 0,
    message: "Ready to scan the grid for islands.",
    stack: [],
    discoveryOrder: [],
    line: 0
  });

  function dfs(r: number, c: number) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] === 0 || visited[r][c]) return;

    visited[r][c] = true;
    currentStack.push(`(${r}, ${c})`);
    discoveryOrder.push(`(${r}, ${c})`);

    steps.push({
      grid: grid.map(row => [...row]),
      visited: visited.map(row => [...row]),
      r, c,
      count: islandCount,
      message: `Visiting land at (${r}, ${c}). Expanding Island #${islandCount}.`,
      stack: [...currentStack],
      discoveryOrder: [...discoveryOrder],
      line: 3
    });

    // 4-directional search
    steps.push({ grid: grid.map(row => [...row]), visited: visited.map(row => [...row]), r, c, count: islandCount, message: "Expanding to neighbors.", stack: [...currentStack], discoveryOrder: [...discoveryOrder], line: 4 });
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);

    currentStack.pop();
    steps.push({
      grid: grid.map(row => [...row]),
      visited: visited.map(row => [...row]),
      r, c,
      count: islandCount,
      message: `Backtracking from (${r}, ${c}).`,
      stack: [...currentStack],
      discoveryOrder: [...discoveryOrder],
      line: 4
    });
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      steps.push({
        grid: grid.map(row => [...row]),
        visited: visited.map(row => [...row]),
        r, c,
        count: islandCount,
        message: `Scanning (${r}, ${c}).`,
        stack: [],
        discoveryOrder: [...discoveryOrder],
        line: 1
      });
      if (grid[r][c] === 1 && !visited[r][c]) {
        islandCount++;
        steps.push({
          grid: grid.map(row => [...row]),
          visited: visited.map(row => [...row]),
          r, c,
          count: islandCount,
          message: `Found new land at (${r}, ${c}). Starting discovery of Island #${islandCount}.`,
          stack: [],
          discoveryOrder: [...discoveryOrder],
          line: 2
        });
        dfs(r, c);
      }
    }
  }

  steps.push({
    grid: grid.map(row => [...row]),
    visited: visited.map(row => [...row]),
    count: islandCount,
    message: `Discovery complete! Total islands found: ${islandCount}.`,
    stack: [],
    discoveryOrder: [...discoveryOrder]
  });

  return steps;
}

export default function NumberOfIslandsSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [grid, setGrid] = useState<number[][]>(DEFAULT_GRID);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  
  const [stackPos, setStackPos] = useState({ x: 460, y: 20 });
  const [orderPos, setOrderPos] = useState({ x: 20, y: 20 });
  const [codePos, setCodePos] = useState({ x: 20, y: 300 });
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const steps = useMemo(() => generateIslandSteps(grid), [grid]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

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
    if (isSpeechEnabled && step) {
      speak(step.message);
    }
  }, [step, isSpeechEnabled, speak]);

  const toggleCell = (r: number, c: number) => {
    if (playing || stepIndex !== 0) return;
    const newGrid = grid.map((row, ri) => row.map((val, ci) => ri === r && ci === c ? (val === 1 ? 0 : 1) : val));
    setGrid(newGrid);
  };

  const randomizeGrid = () => {
    const newGrid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Math.random() > 0.7 ? 1 : 0));
    setGrid(newGrid);
    setStepIndex(0);
    setPlaying(false);
  };

  const clearGrid = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setStepIndex(0);
    setPlaying(false);
  };

  const svgPoint = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const handleMove = (e: React.PointerEvent) => {
    if (!activeDragPanel) return;
    const pt = svgPoint(e);
    if (activeDragPanel === "stack") {
      setStackPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "order") {
      setOrderPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "code") {
      setCodePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    }
  };

  const startPanelDrag = (e: React.PointerEvent, id: string, pos: { x: number, y: number }) => {
    e.stopPropagation();
    const pt = svgPoint(e);
    setActiveDragPanel(id);
    setDragOffset({ x: pt.x - pos.x, y: pt.y - pos.y });
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <span className="eyebrow">Graph Algorithms • Connected Components</span>
          <h1>Number of Islands</h1>
          <p className="description">
            A fundamental problem in graph theory: identifying isolated regions in a grid. 
            Each island is a <strong>maximal connected component</strong> of land cells.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(ROWS × COLS)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(ROWS × COLS)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Start Simulation</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Discovery Phase</h2>
            <p>We iterate through every cell. If we find land ('1') that hasn't been visited, we've found the start of a new island.</p>
          </article>
          <article className="guide-card">
            <h2>Expansion Phase</h2>
            <p>Upon finding new land, we use DFS to visit all reachable landmasses, marking them as visited so they aren't counted again.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Connectivity</h2>
            <p>In this simulation, we consider 4-directional connectivity (up, down, left, right). Diagonals do not connect landmasses.</p>
          </article>
          <article className="guide-card">
            <h2>Base Cases</h2>
            <p>DFS stops if we hit water ('0'), go out of bounds, or reach a cell that is already part of a discovered island.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Click cells to <b>Toggle Land/Water</b></span>
                <span>📌 Drag <b>Panels</b> to move tools around</span>
                <span>🔄 Reset to modify the map again</span>
              </div>
              <div className="status-panel">
                <div className="editor-tools">
                   <button onClick={randomizeGrid} disabled={playing} title="Generate Random Map"><RefreshCw size={14} /> Random</button>
                   <button onClick={clearGrid} disabled={playing} title="Clear Map"><Eraser size={14} /> Clear</button>
                </div>
                <h2>Current Step</h2>
                <p className="status-msg">{step.message}</p>
                <div className="playback-controls">
                  <button onClick={() => { setStepIndex(0); setPlaying(false); }}><RotateCcw size={16} /></button>
                  <button onClick={() => setStepIndex(i => Math.max(0, i - 1))}><ChevronLeft size={20} /></button>
                  <button onClick={() => setPlaying(!playing)} className="play-btn">{playing ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={() => setStepIndex(i => Math.min(steps.length - 1, i + 1))}><ChevronRight size={20} /></button>
                  <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "active" : ""} title="Toggle Voice Narration">
                    {isSpeechEnabled ? "🔊" : "🔇"}
                  </button>
                </div>
                <div className="speed-ctrl">
                  <span>Speed</span>
                  <input type="range" min="100" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
                </div>
                <div className="stats-box">
                    <div className="stat-item">
                        <span className="stat-label">Islands Found</span>
                        <span className="stat-value">{step.count}</span>
                    </div>
                </div>
              </div>
            </aside>
            <svg ref={svgRef} viewBox="0 0 680 500" onPointerMove={handleMove} onPointerUp={() => setActiveDragPanel(null)}>
              <foreignObject x="60" y="50" width="560" height="400">
                <div className="grid-canvas">
                  {step.grid.map((row, r) => (
                    <div key={r} className="grid-row">
                      {row.map((val, c) => {
                        const isCurrent = step.r === r && step.c === c;
                        const isVisited = step.visited[r][c];
                        return (
                          <div key={`${r}-${c}`} 
                            onClick={() => toggleCell(r, c)}
                            className={`grid-cell ${val === 1 ? 'land' : 'water'} ${isVisited ? 'visited' : ''} ${isCurrent ? 'active' : ''} ${playing || stepIndex !== 0 ? 'readonly' : 'editable'}`}
                          >
                            <div className="content">
                               {val === 1 ? <Mountain size={14} /> : ''}
                            </div>
                            {isCurrent && <div className="scanner-line" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </foreignObject>

              <foreignObject x={stackPos.x} y={stackPos.y} width="160" height="300" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "stack", stackPos)}>
                    <span>DFS Stack</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content stack-viz">
                    {[...step.stack].reverse().map((id, idx) => (
                      <div key={idx} className="stack-item">{id}</div>
                    ))}
                    {step.stack.length === 0 && <span className="empty-msg">Empty</span>}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={orderPos.x} y={orderPos.y} width="160" height="300" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "order", orderPos)}>
                    <span>Discovery</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content order-viz">
                    {step.discoveryOrder.slice(-10).map((id, idx) => (
                      <div key={idx} className="order-item">{id}</div>
                    ))}
                    {step.discoveryOrder.length === 0 && <span className="empty-msg">Waiting...</span>}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={codePos.x} y={codePos.y} width="220" height="180" className="movable-panel">
                <div onPointerDown={(e) => startPanelDrag(e, "code", codePos)} className="h-full">
                  <CodeTracker 
                    code={[
                      "for each cell (r, c):",
                      "  if grid[r][c] == '1':",
                      "    islandCount++",
                      "    dfs(r, c)",
                      "dfs(r, c):",
                      "  mark (r, c) visited",
                      "  for each neighbor (nr, nc):",
                      "    if valid land: dfs(nr, nc)"
                    ]} 
                    activeLine={step.line || 0} 
                  />
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--blue) 8%, transparent), transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 82px); font-weight: 800; letter-spacing: -0.04em; line-height: 1; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .eyebrow { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: var(--blue); }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }

        .actions, .playback-controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; transition: all 0.2s; cursor: pointer; }
        button:hover:not(:disabled) { border-color: var(--blue); }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }

        .play-btn { width: 48px; height: 48px; border-radius: 50%; background: var(--blue) !important; color: white !important; display: flex; align-items: center; justify-content: center; border: none; box-shadow: 0 4px 12px color-mix(in srgb, var(--blue) 30%, transparent); }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); }
        
        .detailed-guide { max-width: 1120px; margin: 0 auto; padding: 80px 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin-bottom: 16px; font-weight: 700; }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--blue); }

        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); }
        
        aside { display: flex; flex-direction: column; gap: 20px; }
        .status-msg { font-size: 14px; line-height: 1.5; min-height: 60px; color: var(--text); font-weight: 500; }
        .speed-ctrl { display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--muted); }
        .editor-tools { display: flex; gap: 8px; }
        .editor-tools button { flex: 1; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px; }

        .stats-box { background: var(--panel2); padding: 16px; border-radius: 12px; border: 1px solid var(--border); margin-top: 8px; }
        .stat-item { display: flex; justify-content: space-between; align-items: center; }
        .stat-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--muted); }
        .stat-value { font-size: 24px; font-weight: 800; color: var(--green); font-family: monospace; }

        svg { width: 100%; min-height: 500px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .grid-canvas { display: flex; flex-direction: column; gap: 4px; padding: 20px; width: fit-content; margin: 0 auto; }
        .grid-row { display: flex; gap: 4px; }
        .grid-cell { width: 44px; height: 44px; border-radius: 8px; border: 2px solid var(--border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: center; position: relative; }
        
        .grid-cell.water { background: color-mix(in srgb, var(--blue) 5%, transparent); color: var(--blue); opacity: 0.4; }
        .grid-cell.land { background: var(--panel2); color: var(--amber); }
        .grid-cell.visited { background: color-mix(in srgb, var(--green) 15%, var(--panel2)); border-color: var(--green); color: var(--green); transform: scale(0.95); opacity: 1; }
        .grid-cell.active { transform: scale(1.15); border-color: var(--blue); z-index: 10; box-shadow: 0 0 20px var(--blue); background: var(--blue); color: white; }
        
        .grid-cell.editable { cursor: cell; }
        .grid-cell.editable:hover { border-color: var(--blue); transform: scale(1.05); }
        .grid-cell.readonly { cursor: default; }

        .scanner-line { position: absolute; inset: -4px; border: 2px solid var(--blue); border-radius: 12px; animation: pulse 1.2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .panel-content { padding: 10px; flex: 1; overflow-y: auto; }
        
        .stack-item { padding: 4px 8px; background: var(--panel2); color: var(--blue); border-radius: 6px; font-size: 10px; margin-bottom: 2px; font-weight: 800; text-align: center; border: 1px solid var(--border); }
        .order-item { padding: 4px 8px; background: color-mix(in srgb, var(--green) 10%, transparent); color: var(--green); border-radius: 6px; font-size: 10px; margin-bottom: 2px; font-weight: 800; text-align: center; }
        .empty-msg { font-size: 10px; color: var(--muted); font-style: italic; text-align: center; display: block; margin-top: 20px; }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}


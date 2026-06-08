"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Palette, ShieldCheck } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface ColoringStep {
  type: string;
  colors: Record<string, number>;
  u?: string;
  neighborColors?: number[];
  availableColors?: number[];
  message: string;
}

const COLOR_PALETTE = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Rose
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#f97316", // Orange
];

const INITIAL_NODES: GraphNode[] = [
  { id: "A", x: 300, y: 100 },
  { id: "B", x: 150, y: 200 },
  { id: "C", x: 450, y: 200 },
  { id: "D", x: 300, y: 350 },
  { id: "E", x: 100, y: 350 },
  { id: "F", x: 500, y: 350 },
];

const INITIAL_EDGES: GraphEdge[] = [
  { id: "e1", from: "A", to: "B" },
  { id: "e2", from: "A", to: "C" },
  { id: "e3", from: "B", to: "C" },
  { id: "e4", from: "B", to: "D" },
  { id: "e5", from: "C", to: "D" },
  { id: "e6", from: "B", to: "E" },
  { id: "e7", from: "D", to: "E" },
  { id: "e8", from: "C", to: "F" },
  { id: "e9", from: "D", to: "F" },
];

function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
  };
}

function nextNodeId(nodes: GraphNode[]) {
  const ids = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const id of ids) {
    if (!nodes.some(n => n.id === id)) return id;
  }
  return `V${nodes.length}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some(e => e.id === `e${index}`)) index++;
  return `e${index}`;
}

function generateColoringSteps(nodes: GraphNode[], edges: GraphEdge[]): ColoringStep[] {
  const steps: ColoringStep[] = [];
  if (nodes.length === 0) return [];
  const colors: Record<string, number> = {};
  nodes.forEach(n => colors[n.id] = -1);

  steps.push({
    type: "init",
    colors: { ...colors },
    message: "Initialization: Graph created. Preparing to assign colors greedily such that no two adjacent nodes match."
  });

  const adj: Record<string, string[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    if (adj[e.from] && adj[e.to]) {
      adj[e.from].push(e.to);
      adj[e.to].push(e.from);
    }
  });

  for (const node of nodes) {
    const u = node.id;
    const neighborColors = adj[u]
      .map(id => colors[id])
      .filter(c => c !== -1);

    const uniqueNeighborColors = Array.from(new Set(neighborColors)).sort((a, b) => a - b);
    const available = Array.from({ length: COLOR_PALETTE.length }, (_, i) => i).filter(c => !uniqueNeighborColors.includes(c));
    const chosen = available[0] ?? 0;

    steps.push({
      type: "check",
      u,
      colors: { ...colors },
      neighborColors: uniqueNeighborColors,
      availableColors: available,
      message: `Analyzing Node ${u}. Neighbors use colors: {${uniqueNeighborColors.map(c => `C${c}`).join(", ") || 'none'}}.`
    });

    colors[u] = chosen;

    steps.push({
      type: "assign",
      u,
      colors: { ...colors },
      message: `Assigned color C${chosen} to Node ${u}. This is the lowest index color not used by its neighbors.`
    });
  }

  const distinctColors = new Set(Object.values(colors)).size;
  steps.push({
    type: "done",
    colors: { ...colors },
    message: `Coloring Complete! The graph was successfully colored using ${distinctColors} distinct colors.`
  });

  return steps;
}

export default function GraphColoringSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState<GraphData>(() => ({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateColoringSteps(graph.nodes, graph.edges), [graph]);
  const step: ColoringStep = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { type: "idle", u: undefined, colors: {}, neighborColors: [], availableColors: [], message: "Add nodes to start." });

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

  const svgPoint = useCallback((e: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()!.inverse());
  }, []);

  const handleCanvasClick = (e: React.PointerEvent) => {
    if (e.target !== svgRef.current) return;
    const pt = svgPoint(e);
    const id = nodeName.trim().toUpperCase() || nextNodeId(graph.nodes);
    if (graph.nodes.some(n => n.id === id)) return;
    setGraph(g => ({ ...g, nodes: [...g.nodes, { id, x: pt.x, y: pt.y }] }));
    setNodeName("");
    setSelected(null);
    setEdgeSource(null);
  };

  const addEdge = useCallback((from = edgeFrom, to = edgeTo) => {
    if (!from || !to || from === to) return;
    const edge = { id: nextEdgeId(graph.edges), from, to };
    setGraph(g => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, graph.edges]);

  const removeSelected = useCallback(() => {
    if (!selected) return;
    setGraph((current) => {
      if (selected.type === "edge") {
        return { ...current, edges: current.edges.filter((e) => e.id !== selected.id) };
      }
      if (current.nodes.length <= 1) return current;
      const nodes = current.nodes.filter((n) => n.id !== selected.id);
      const edges = current.edges.filter((e) => e.from !== selected.id && e.to !== selected.id);
      return { nodes, edges };
    });
    setSelected(null);
  }, [selected]);

  const handleNodePointerDown = (e: React.PointerEvent, node: GraphNode) => {
    e.stopPropagation();
    if (edgeSource === node.id) { setEdgeSource(null); setSelected(null); return; }
    if (edgeSource && edgeSource !== node.id) { addEdge(edgeSource, node.id); setEdgeSource(null); setSelected(null); return; }
    if (e.shiftKey) { setEdgeSource(node.id); setSelected({ type: "node", id: node.id }); } 
    else { setEdgeSource(node.id); setSelected({ type: "node", id: node.id }); setDragging(node.id); }
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const pt = svgPoint(e);
    setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(450, pt.y)) } : n) }));
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault(); e.stopPropagation();
    if (item.type === "node") {
      setGraph(g => {
        if (g.nodes.length <= 1) return g;
        const nodes = g.nodes.filter(n => n.id !== item.id);
        const edges = g.edges.filter(ed => ed.from !== item.id && ed.to !== item.id);
        return { nodes, edges };
      });
    } else {
      setGraph(g => ({ ...g, edges: g.edges.filter(ed => ed.id !== item.id) }));
    }
    setSelected(null);
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Combinatorial Optimization</div>
          <h1>Graph Coloring</h1>
          <p className="description">
            Assign colors to vertices such that no two adjacent vertices share the same color. 
            While finding the minimum colors is NP-Hard, the <strong>Greedy Heuristic</strong> provides a fast, valid coloring using at most Δ+1 colors.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Greedy Time</span>
              <span className="value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Complexity</span>
              <span className="value">NP-Hard</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Palette size={20} /></div>
            <h3>Greedy Strategy</h3>
            <p>Iterate through nodes and assign the smallest available color that doesn't conflict with already-colored neighbors.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><ShieldCheck size={20} /></div>
            <h3>Chromatic Number</h3>
            <p>The minimum number of colors required is χ(G). Greedy coloring is highly sensitive to the order in which nodes are processed.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="editor">
          <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
          <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <button onClick={() => addEdge()}>Join</button>
          <button onClick={removeSelected} disabled={!selected}>Remove</button>
          <button onClick={() => { setGraph({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }); setStepIndex(0); setPlaying(false); }}>Reset</button>
        </div>
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Color Inspector</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>Conflict Resolution</h3>
              <div className="conflict-panel">
                <div className="conflict-item">
                  <span className="label">Forbidden Colors</span>
                  <div className="palette mini">
                    {step.neighborColors?.map(c => (
                      <div key={c} className="swatch forbidden" style={{ background: COLOR_PALETTE[c] }} />
                    ))}
                    {(!step.neighborColors || step.neighborColors.length === 0) && <span className="empty">None</span>}
                  </div>
                </div>
                <div className="conflict-item">
                  <span className="label">Available Colors</span>
                  <div className="palette mini">
                    {step.availableColors?.map(c => (
                      <div key={c} className="swatch" style={{ background: COLOR_PALETTE[c] }} />
                    ))}
                  </div>
                </div>
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
            <svg ref={svgRef} viewBox="0 0 600 500" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
              <defs>
                <filter id="color-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {graph.edges.map((edge) => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                const isSelected = selected?.type === "edge" && selected.id === edge.id;
                return (
                  <g key={edge.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }} onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`edge ${isSelected ? 'selected' : ''}`} />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" />
                  </g>
                );
              })}

              {graph.nodes.map((node) => {
                const colorIdx = step.colors?.[node.id];
                const isCurrent = step.u === node.id;
                const color = colorIdx === undefined || colorIdx === -1 ? 'var(--panel-light)' : COLOR_PALETTE[colorIdx];
                const isSelected = selected?.type === "node" && selected.id === node.id;

                return (
                  <g key={node.id} className={`node-group ${isCurrent ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    onPointerDown={(e) => handleNodePointerDown(e, node)}
                    onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}
                    style={{ cursor: dragging ? 'grabbing' : 'grab' }}
                  >
                    <circle cx={node.x} cy={node.y} r="28" className="node-circle" style={{ fill: color, stroke: isCurrent || isSelected ? 'var(--amber)' : 'var(--border)' }} />
                    <text x={node.x} y={node.y} dy="0.35em" className="node-text" style={{ fill: colorIdx === undefined || colorIdx === -1 ? 'var(--text)' : 'white' }}>{node.id}</text>
                  </g>
                );
              })}
            </svg>
            <div className="gesture-hint-canvas">
               🖱️ Click to Add • ↔️ Drag to Move • ⌨️ Shift+Drag to Join
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #6366f1; --accent-light: #818cf8; --green: #10b981; --red: #ef4444; --amber: #f59e0b; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #4f46e5; --accent-light: #6366f1; }
        
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
        
        .conflict-panel { display: flex; flex-direction: column; gap: 16px; background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 16px; }
        .conflict-item { display: flex; flex-direction: column; gap: 8px; }
        .conflict-item .label { font-size: 10px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; }
        .palette.mini { display: flex; gap: 6px; flex-wrap: wrap; }
        .swatch { width: 20px; height: 20px; border-radius: 6px; border: 1px solid var(--border); position: relative; }
        .swatch.forbidden::after { content: '×'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 14px; background: rgba(0,0,0,0.3); border-radius: 6px; }
        .empty { font-size: 11px; color: var(--text-dim); font-style: italic; }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); overflow: hidden; position: relative; }
        svg { width: 100%; height: 500px; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 34px 34px; }
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.4; pointer-events: none; }
        .edge.selected { stroke: var(--amber); stroke-width: 4; opacity: 1; }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }
        
        .node-group { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: grab; }
        .node-circle { stroke-width: 3; transition: all 0.3s; }
        .node-text { font-weight: 800; font-size: 14px; text-anchor: middle; font-family: monospace; pointer-events: none; }
        
        .node-group.active .node-circle { stroke-width: 6; filter: url(#color-glow); }
        .node-group.selected .node-circle { stroke-width: 6; }

        .editor { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .editor input, .editor select, .editor button { height: 38px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel); color: var(--text); padding: 0 12px; }
        .editor button:hover { border-color: var(--accent); }
        .gesture-hint-canvas { position: absolute; bottom: 12px; right: 12px; font-size: 10px; color: var(--text-dim); pointer-events: none; }
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


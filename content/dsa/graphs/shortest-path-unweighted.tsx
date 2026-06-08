"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, ListOrdered, Navigation } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface SPStep {
  type: string;
  dist: Record<string, number>;
  parent: Record<string, string | null>;
  queue: string[];
  u?: string;
  v?: string;
  message: string;
}

const INITIAL_GRAPH: GraphData = {
  nodes: [
    { id: "A", x: 100, y: 150 },
    { id: "B", x: 250, y: 100 },
    { id: "C", x: 400, y: 100 },
    { id: "D", x: 100, y: 300 },
    { id: "E", x: 250, y: 300 },
    { id: "F", x: 400, y: 300 },
  ],
  edges: [
    { id: "e1", from: "A", to: "B" },
    { id: "e2", from: "B", to: "C" },
    { id: "e3", from: "A", to: "D" },
    { id: "e4", from: "D", to: "E" },
    { id: "e5", from: "E", to: "F" },
    { id: "e6", from: "B", to: "E" },
    { id: "e7", from: "C", to: "F" },
  ],
};

function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

function nextNodeId(nodes: GraphNode[]) {
  const ids = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const id of ids) {
    if (!nodes.some((n) => n.id === id)) return id;
  }
  return `V${nodes.length}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some((e) => e.id === `e${index}`)) index += 1;
  return `e${index}`;
}

function generateSPSteps(nodes: GraphNode[], edges: GraphEdge[], startNodeId: string): SPStep[] {
  const steps: SPStep[] = [];
  const dist: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  
  if (!nodes.length) return [];
  const root = nodes.find(n => n.id === startNodeId) || nodes[0];
  const rootId = root.id;

  const queue: string[] = [rootId];

  nodes.forEach(n => {
    dist[n.id] = Infinity;
    parent[n.id] = null;
  });

  dist[rootId] = 0;

  steps.push({
    type: "init",
    dist: { ...dist },
    parent: { ...parent },
    queue: [...queue],
    message: `Initialize distances to ∞. Start BFS from root node ${rootId}.`
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
    
    steps.push({
      type: "process",
      u,
      dist: { ...dist },
      parent: { ...parent },
      queue: [...queue],
      message: `Extracting ${u} from queue. Visiting all unvisited neighbors.`
    });

    const neighbors = edges.filter(e => e.from === u || e.to === u).map(e => e.from === u ? e.to : e.from);
    for (const v of neighbors) {
      if (dist[v] === Infinity) {
        dist[v] = dist[u] + 1;
        parent[v] = u;
        queue.push(v);
        steps.push({
          type: "relax",
          u, v,
          dist: { ...dist },
          parent: { ...parent },
          queue: [...queue],
          message: `Neighbor ${v} reached. Setting distance to dist[${u}] + 1 = ${dist[v]}.`
        });
      }
    }
  }

  steps.push({
    type: "done",
    dist: { ...dist },
    parent: { ...parent },
    queue: [],
    message: "Breadth-First Search complete. All shortest paths finalized."
  });

  return steps;
}

export default function UnweightedShortestPath() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState(() => cloneGraph(INITIAL_GRAPH));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateSPSteps(graph.nodes, graph.edges, "A"), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || steps[0];

  useEffect(() => {
    let timer: number;
    if (playing && stepIndex < steps.length - 1) {
      timer = window.setInterval(() => setStepIndex(s => s + 1), speed);
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
    if (graph.edges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) return;
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
    setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(560, pt.x)), y: Math.max(45, Math.min(450, pt.y)) } : n) }));
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
          <div className="badge">Breadth-First Search</div>
          <h1>Shortest Path (Unweighted)</h1>
          <p className="description">
            In an unweighted graph, the shortest path is simply the path with the minimum number of edges. 
            By exploring the graph layer-by-layer, BFS ensures that every node is reached via its optimal distance.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Space Complexity</span>
              <span className="value">O(V)</span>
            </div>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><ListOrdered size={20} /></div>
            <h3>Layer Discovery</h3>
            <p>BFS visits all nodes at distance <code>k</code> before moving to distance <code>k+1</code>, guaranteeing the shortest path property.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Navigation size={20} /></div>
            <h3>Parent Tracking</h3>
            <p>By storing the 'parent' of each node (the vertex that discovered it), we can reconstruct the actual shortest path back to the source.</p>
          </div>
        </div>
      </section>

      <section className="simulator">
        <div className="simulator-controls editor">
          <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
          <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <button onClick={() => addEdge()}>Join</button>
          <button onClick={removeSelected} disabled={!selected}>Remove</button>
          <button onClick={() => { setGraph(cloneGraph(INITIAL_GRAPH)); setStepIndex(0); setPlaying(false); }}>Reset</button>
        </div>
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Algorithm Pipeline</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>BFS Queue</h3>
              <div className="queue-viz">
                {step.queue.map((id, idx) => (
                  <div key={idx} className="queue-node">{id}</div>
                ))}
                {step.queue.length === 0 && <div className="empty">Queue empty</div>}
              </div>
            </div>

            <div className="data-section">
              <h3>Distance Table</h3>
              <div className="dist-table">
                {graph.nodes.map(n => (
                  <div key={n.id} className={`dist-row ${step.u === n.id ? 'highlight' : ''}`}>
                    <span className="node-id">{n.id}</span>
                    <span className="dist-val">{step.dist[n.id] === Infinity ? '∞' : step.dist[n.id]}</span>
                  </div>
                ))}
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
                <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "secondary active" : "secondary"} title="Toggle Voice Narration">
                  {isSpeechEnabled ? "🔊" : "🔇"}
                </button>
              </div>
              <div className="speed-slider">
                <span>Speed</span>
                <input type="range" min="100" max="2000" step="100" value={2100 - speed} onChange={(e) => setSpeed(2100 - Number(e.target.value))} />
              </div>
            </div>
          </aside>

          <div className="canvas-area">
            <svg ref={svgRef} viewBox="0 0 600 500" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => { setDragging(null); }}>
              <defs>
                <filter id="sp-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {graph.edges.map(edge => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                const isPath = (step.parent[edge.to] === edge.from) || (step.parent[edge.from] === edge.to);
                const isActive = (step.u === edge.from && step.v === edge.to) || (step.u === edge.to && step.v === edge.from);
                const isSelected = selected?.type === "edge" && selected.id === edge.id;
                
                return (
                  <g key={edge.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                      className={`edge ${isPath ? 'path' : ''} ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`} 
                    />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })} />
                  </g>
                );
              })}

              {graph.nodes.map(node => {
                const isVisited = step.dist[node.id] !== Infinity;
                const isCurrent = step.u === node.id;
                const isNeighbor = step.v === node.id;
                const isSelected = selected?.type === "node" && selected.id === node.id;

                return (
                  <g key={node.id} className={`node-group ${isVisited ? 'visited' : ''} ${isCurrent ? 'active' : ''} ${isNeighbor ? 'neighbor' : ''} ${isSelected ? 'selected' : ''}`}
                    onPointerDown={(e) => handleNodePointerDown(e, node)}
                    onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}
                    style={{ cursor: dragging ? 'grabbing' : 'grab' }}
                  >
                    <circle cx={node.x} cy={node.y} r="25" className="node-circle" />
                    <text x={node.x} y={node.y} dy="0.35em" className="node-text">{node.id}</text>
                    <text x={node.x} y={node.y + 40} className="node-dist">d: {step.dist[node.id] === Infinity ? '∞' : step.dist[node.id]}</text>
                  </g>
                );
              })}
            </svg>
            <div className="gesture-hint" style={{ position: 'absolute', bottom: 12, right: 12, fontSize: 10, color: 'var(--text-dim)', pointerEvents: 'none' }}>
              🖱️ Click to Add • ↔️ Drag to Move • ⌨️ Shift+Drag to Join
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel-light: #1f2937; --border: #2e3a4e; --text: #f3f4f6; --text-dim: #9ca3af; --accent: #4f46e5; --accent-light: #818cf8; --green: #10b981; --amber: #f59e0b; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: 'Inter', system-ui, sans-serif; }
        .page[data-theme="light"] { --bg: #f8fafc; --panel: #ffffff; --panel-light: #f1f5f9; --border: #e2e8f0; --text: #0f172a; --text-dim: #64748b; --accent: #4f46e5; --accent-light: #6366f1; --green: #059669; }
        
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
        
        .queue-viz { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: var(--bg); border-radius: 16px; border: 1px solid var(--border); }
        .queue-node { padding: 6px 12px; background: color-mix(in srgb, var(--amber) 10%, var(--panel-light)); border: 1px solid var(--amber); border-radius: 8px; font-weight: 800; font-family: monospace; font-size: 13px; color: var(--amber); }

        .dist-table { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: var(--bg); border-radius: 16px; border: 1px solid var(--border); }
        .dist-row { display: flex; justify-content: space-between; padding: 8px 12px; border-radius: 8px; font-family: monospace; }
        .dist-row.highlight { background: color-mix(in srgb, var(--accent) 15%, transparent); }
        .node-id { font-weight: 800; color: var(--accent-light); }
        .dist-val { font-weight: 900; color: var(--green); }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); position: relative; overflow: hidden; }
        svg { width: 100%; height: 500px; display: block; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 24px 24px; }
        .edge { stroke: var(--border); stroke-width: 2.5; opacity: 0.3; transition: all 0.3s; pointer-events: none; }
        .edge.path { stroke: var(--green); stroke-width: 5; opacity: 0.8; }
        .edge.active { stroke: var(--accent-light); stroke-width: 4; opacity: 1; stroke-dasharray: 6 3; animation: flow 1s linear infinite; }
        .edge.selected { stroke: var(--amber); opacity: 1; stroke-width: 4; }
        @keyframes flow { to { stroke-dashoffset: -9; } }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }

        .node-group { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: grab; }
        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; pointer-events: none; }
        .node-dist { fill: var(--text-dim); font-size: 10px; font-weight: 700; text-anchor: middle; font-family: monospace; }
        
        .node-group.visited .node-circle { stroke: var(--green); }
        .node-group.active .node-circle { fill: var(--accent); stroke: var(--accent); filter: url(#sp-glow); }
        .node-group.active .node-text { fill: white; }
        .node-group.neighbor .node-circle { stroke: var(--accent-light); stroke-width: 5; }
        .node-group.selected .node-circle { stroke: var(--amber); stroke-width: 5; }

        .editor { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .editor input, .editor select, .editor button { height: 38px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel); color: var(--text); padding: 0 12px; }
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


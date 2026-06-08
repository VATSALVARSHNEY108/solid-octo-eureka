"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Zap, Droplets, Activity } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; cap: number; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; source: string; sink: string; }

interface FlowStep {
  type: string;
  flow: Record<string, Record<string, number>>;
  capacity: Record<string, Record<string, number>>;
  path?: string[];
  maxFlow: number;
  message: string;
}

const INITIAL_NODES: GraphNode[] = [
  { id: "S", x: 80, y: 200 },
  { id: "A", x: 250, y: 80 },
  { id: "B", x: 250, y: 320 },
  { id: "T", x: 420, y: 200 },
];

const INITIAL_EDGES: GraphEdge[] = [
  { id: "e1", from: "S", to: "A", cap: 10 },
  { id: "e2", from: "S", to: "B", cap: 10 },
  { id: "e3", from: "A", to: "B", cap: 2 },
  { id: "e4", from: "A", to: "T", cap: 4 },
  { id: "e5", from: "B", to: "T", cap: 8 },
];

function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
    source: graph.source,
    sink: graph.sink,
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

function generateFlowSteps(graph: GraphData): FlowStep[] {
  const nodes = graph.nodes.map(n => n.id);
  const steps: FlowStep[] = [];
  if (nodes.length < 2) return [];
  
  const capacity: Record<string, Record<string, number>> = {};
  const flow: Record<string, Record<string, number>> = {};
  
  nodes.forEach(u => {
    capacity[u] = {};
    flow[u] = {};
    nodes.forEach(v => {
      capacity[u][v] = 0;
      flow[u][v] = 0;
    });
  });

  graph.edges.forEach(e => {
    if (capacity[e.from] && capacity[e.from][e.to] !== undefined) {
      capacity[e.from][e.to] += e.cap;
    }
  });

  const S = graph.source;
  const T = graph.sink;
  if (!nodes.includes(S) || !nodes.includes(T) || S === T) {
    steps.push({ type: "error", flow, capacity, maxFlow: 0, message: "Invalid Source or Sink configuration." });
    return steps;
  }

  let maxFlow = 0;
  steps.push({
    type: "init",
    flow: JSON.parse(JSON.stringify(flow)),
    capacity: JSON.parse(JSON.stringify(capacity)),
    maxFlow: 0,
    message: `Initialization: Setting all edge flows to 0. Source: ${S}, Sink: ${T}.`
  });

  function bfs(): string[] | null {
    const parent: Record<string, string | null> = {};
    nodes.forEach(n => parent[n] = null);
    const queue: string[] = [S];
    parent[S] = "root";

    while (queue.length > 0) {
      const u = queue.shift()!;
      if (u === T) {
        const path: string[] = [];
        let curr: string | null = T;
        while (curr !== "root" && curr !== null) {
          path.unshift(curr);
          curr = parent[curr];
        }
        return path;
      }

      for (const v of nodes) {
        if (parent[v] === null && capacity[u][v] - flow[u][v] > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }
    return null;
  }

  while (true) {
    const path = bfs();
    if (!path) break;

    let pathFlow = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i+1];
      pathFlow = Math.min(pathFlow, capacity[u][v] - flow[u][v]);
    }

    steps.push({
      type: "find_path",
      flow: JSON.parse(JSON.stringify(flow)),
      capacity: JSON.parse(JSON.stringify(capacity)),
      path,
      maxFlow,
      message: `Augmenting Path Found: ${path.join(" → ")}. Bottleneck capacity is ${pathFlow}.`
    });

    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i+1];
      flow[u][v] += pathFlow;
      flow[v][u] -= pathFlow;
    }
    maxFlow += pathFlow;

    steps.push({
      type: "augment",
      flow: JSON.parse(JSON.stringify(flow)),
      capacity: JSON.parse(JSON.stringify(capacity)),
      path,
      maxFlow,
      message: `Flow Augmented! Successfully pushed ${pathFlow} units. Cumulative max flow: ${maxFlow}.`
    });
  }

  steps.push({
    type: "done",
    flow: JSON.parse(JSON.stringify(flow)),
    capacity: JSON.parse(JSON.stringify(capacity)),
    maxFlow,
    message: `Equilibrium Reached: No more augmenting paths exist. The maximum flow is ${maxFlow}.`
  });

  return steps;
}

export default function NetworkFlowSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState<GraphData>(() => ({ nodes: INITIAL_NODES, edges: INITIAL_EDGES, source: "S", sink: "T" }));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("S");
  const [edgeTo, setEdgeTo] = useState("T");
  const [edgeCap, setEdgeCap] = useState(10);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingCap, setEditingCap] = useState("");

  const steps = useMemo(() => generateFlowSteps(graph), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { type: "empty", flow: {}, capacity: {}, maxFlow: 0, message: "Add nodes and source/sink to start." });

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
    const cap = Number(edgeCap);
    if (!from || !to || from === to || !Number.isFinite(cap)) return;
    const edge = { id: nextEdgeId(graph.edges), from, to, cap };
    setGraph(g => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, edgeCap, graph.edges]);

  const removeSelected = useCallback(() => {
    if (!selected) return;
    setGraph((current) => {
      if (selected.type === "edge") {
        return { ...current, edges: current.edges.filter((e) => e.id !== selected.id) };
      }
      if (current.nodes.length <= 1) return current;
      const nodes = current.nodes.filter((n) => n.id !== selected.id);
      const edges = current.edges.filter((e) => e.from !== selected.id && e.to !== selected.id);
      let { source, sink } = current;
      if (source === selected.id) source = nodes[0]?.id || "";
      if (sink === selected.id) sink = nodes[nodes.length - 1]?.id || "";
      return { nodes, edges, source, sink };
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
    setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(390, pt.y)) } : n) }));
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault(); e.stopPropagation();
    if (item.type === "node") {
      setGraph(g => {
        if (g.nodes.length <= 2) return g;
        const nodes = g.nodes.filter(n => n.id !== item.id);
        const edges = g.edges.filter(ed => ed.from !== item.id && ed.to !== item.id);
        let { source, sink } = g;
        if (source === item.id) source = nodes[0].id;
        if (sink === item.id) sink = nodes[nodes.length - 1].id;
        return { nodes, edges, source, sink };
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
          <div className="badge">Flow Networks</div>
          <h1>Maximum Flow</h1>
          <p className="description">
            Determine the maximum volume of "data" or "fluid" that can travel from source (S) to sink (T). 
            Edmonds-Karp uses BFS to find augmenting paths in the <strong>Residual Graph</strong> until no capacity remains.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(V E²)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Optimization</span>
              <span className="value">Edmonds-Karp</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><Droplets size={20} /></div>
            <h3>Residual Capacity</h3>
            <p>Every edge has a residual capacity (limit - current flow). We can only send flow through edges where residual capacity &gt; 0.</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><Activity size={20} /></div>
            <h3>Augmenting Paths</h3>
            <p>An augmenting path is a simple path from S to T in the residual graph. We "augment" the flow by the bottleneck capacity of this path.</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="editor">
          <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
          <select value={graph.source} onChange={(e) => setGraph(g => ({ ...g, source: e.target.value }))}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>Source: {n.id}</option>)}
          </select>
          <select value={graph.sink} onChange={(e) => setGraph(g => ({ ...g, sink: e.target.value }))}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>Sink: {n.id}</option>)}
          </select>
          <input type="number" value={edgeCap} onChange={(e) => setEdgeCap(Number(e.target.value))} />
          <button onClick={() => addEdge()}>Join</button>
          <button onClick={removeSelected} disabled={!selected}>Remove</button>
          <button onClick={() => { setGraph({ nodes: INITIAL_NODES, edges: INITIAL_EDGES, source: "S", sink: "T" }); setStepIndex(0); setPlaying(false); }}>Reset</button>
        </div>
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Flow Monitor</h2>
            </div>
            
            <div className="status-message">
              {step.message}
            </div>

            <div className="data-section">
              <h3>Flow Metrics</h3>
              <div className="metrics-row">
                <div className="metric-card">
                  <span className="label">Current Max Flow</span>
                  <span className="value">{step.maxFlow}</span>
                </div>
              </div>
            </div>

            <div className="data-section">
              <h3>Edge Utilization</h3>
              <div className="edge-list">
                {graph.edges.map((edge, i) => {
                  const f = step.flow?.[edge.from]?.[edge.to] || 0;
                  const c = edge.cap;
                  const percent = Math.min(100, (f / c) * 100);
                  return (
                    <div key={i} className="edge-item">
                      <div className="edge-header">
                        <span>{edge.from} → {edge.to}</span>
                        <span>{f} / {c}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="fill" style={{ width: `${percent}%` }} />
                      </div>
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
            <svg ref={svgRef} viewBox="0 0 500 400" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
              <defs>
                <marker id="flow-arrow" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
                <filter id="flow-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {graph.edges.map((edge, i) => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                const f = step.flow?.[edge.from]?.[edge.to] || 0;
                const c = edge.cap;
                const isPath = step.path?.includes(edge.from) && step.path?.includes(edge.to) && step.path.indexOf(edge.to) === step.path.indexOf(edge.from) + 1;
                const isSelected = selected?.type === "edge" && selected.id === edge.id;

                const edit = (e: React.MouseEvent) => { e.stopPropagation(); setEditingEdgeId(edge.id); setEditingCap(String(edge.cap)); };
                const commit = () => { const val = Number(editingCap); if (Number.isFinite(val)) setGraph(g => ({ ...g, edges: g.edges.map(ed => ed.id === editingEdgeId ? { ...ed, cap: val } : ed) })); setEditingEdgeId(null); };

                return (
                  <g key={i} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }} onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })} onDoubleClick={edit}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                      className={`edge ${isPath ? 'active' : ''} ${f > 0 ? 'flowing' : ''} ${isSelected ? 'selected' : ''}`} 
                      markerEnd="url(#flow-arrow)"
                    />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" />
                    {editingEdgeId === edge.id ? (
                      <foreignObject x={(from.x+to.x)/2 - 25} y={(from.y+to.y)/2 - 15} width="50" height="30"><input autoFocus className="inline-edit" value={editingCap} onChange={(e) => setEditingCap(e.target.value)} onBlur={commit} onKeyDown={(ev) => ev.key === "Enter" && commit()} /></foreignObject>
                    ) : (
                      <text x={(from.x + to.x)/2} y={(from.y + to.y)/2 - 12} className="edge-label">{f}/{c}</text>
                    )}
                  </g>
                );
              })}

              {graph.nodes.map((node) => {
                const isCurrent = step.path?.includes(node.id);
                const isStart = node.id === graph.source;
                const isEnd = node.id === graph.sink;
                const isSelected = selected?.type === "node" && selected.id === node.id;

                return (
                  <g key={node.id} className={`node-group ${isCurrent ? 'active' : ''} ${isStart ? 'source' : ''} ${isEnd ? 'sink' : ''} ${isSelected ? 'selected' : ''}`}
                    onPointerDown={(e) => handleNodePointerDown(e, node)}
                    onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}
                    style={{ cursor: dragging ? 'grabbing' : 'grab' }}
                  >
                    <circle cx={node.x} cy={node.y} r="25" className="node-circle" />
                    <text x={node.x} y={node.y} dy="0.35em" className="node-text">{node.id}</text>
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
        
        .metric-card { background: var(--bg); border: 1px solid var(--border); padding: 40px; border-radius: 20px; text-align: center; }
        .metric-card .label { font-size: 11px; font-weight: 800; color: var(--text-dim); text-transform: uppercase; display: block; margin-bottom: 8px; }
        .metric-card .value { font-size: 40px; font-weight: 900; color: var(--accent-light); }

        .edge-list { display: flex; flex-direction: column; gap: 10px; background: var(--panel-light); padding: 16px; border-radius: 20px; border: 1px solid var(--border); max-height: 250px; overflow-y: auto; }
        .edge-item { display: flex; flex-direction: column; gap: 6px; }
        .edge-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: var(--text-dim); }
        .progress-bar { height: 6px; background: var(--bg); border-radius: 3px; overflow: hidden; }
        .progress-bar .fill { height: 100%; background: var(--accent); transition: width 0.4s ease; }

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
        .edge { stroke: var(--border); stroke-width: 3; opacity: 0.4; transition: all 0.3s; pointer-events: none; }
        .edge.flowing { stroke: var(--accent); stroke-width: 4; opacity: 1; }
        .edge.active { stroke: var(--green); stroke-width: 6; opacity: 1; filter: url(#flow-glow); }
        .edge.selected { stroke: var(--amber); opacity: 1; stroke-width: 4; }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }
        .edge-label { fill: var(--text-dim); font-size: 11px; font-weight: 800; text-anchor: middle; font-family: monospace; }
        
        .node-group { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: grab; }
        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; font-family: monospace; pointer-events: none; }
        
        .node-group.active .node-circle { stroke: var(--green); stroke-width: 5; fill: color-mix(in srgb, var(--green) 15%, var(--panel)); }
        .node-group.source .node-circle { stroke: var(--accent-light); stroke-width: 5; }
        .node-group.sink .node-circle { stroke: var(--amber); stroke-width: 5; }
        .node-group.selected .node-circle { stroke: var(--amber); stroke-width: 4; }

        .editor { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; max-width: 1400px; margin-left: auto; margin-right: auto; }
        .editor input, .editor select, .editor button { height: 38px; border-radius: 8px; border: 1px solid var(--border); background: var(--panel); color: var(--text); padding: 0 12px; }
        .editor button:hover { border-color: var(--accent); }
        .gesture-hint-canvas { position: absolute; bottom: 12px; right: 12px; font-size: 10px; color: var(--text-dim); pointer-events: none; }
        .inline-edit { width: 100%; height: 100%; background: var(--panel-light); border: 1px solid var(--accent); color: var(--text); text-align: center; border-radius: 4px; font-size: 12px; }
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


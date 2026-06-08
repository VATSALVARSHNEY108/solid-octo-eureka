"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, MousePointer2, ShieldCheck } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface BridgeStep {
  type: string;
  discovery: Record<string, number>;
  low: Record<string, number>;
  bridges: string[];
  visited: string[];
  u?: string; v?: string;
  currentEdge?: string;
  message: string;
}

const INITIAL_GRAPH: GraphData = {
  nodes: [
    { id: "0", x: 300, y: 80 },
    { id: "1", x: 150, y: 200 },
    { id: "2", x: 450, y: 200 },
    { id: "3", x: 300, y: 350 },
    { id: "4", x: 300, y: 480 },
  ],
  edges: [
    { id: "e1", from: "0", to: "1" },
    { id: "e2", from: "0", to: "2" },
    { id: "e3", from: "1", to: "2" },
    { id: "e4", from: "2", to: "3" },
    { id: "e5", from: "3", to: "4" },
  ],
};

function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

function nextNodeId(nodes: GraphNode[]) {
  for (let code = 48; code <= 57; code++) {
    const id = String.fromCharCode(code);
    if (!nodes.some((n) => n.id === id)) return id;
  }
  return `${nodes.length}`;
}

function nextEdgeId(edges: GraphEdge[]) {
  let index = edges.length + 1;
  while (edges.some((e) => e.id === `e${index}`)) index += 1;
  return `e${index}`;
}

function generateBridgeSteps(nodes: GraphNode[], edges: GraphEdge[]): BridgeStep[] {
  const steps: BridgeStep[] = [];
  const discovery: Record<string, number> = {};
  const low: Record<string, number> = {};
  const visited = new Set<string>();
  const bridges: string[] = [];
  let timer = 0;

  function dfs(u: string, p: string | null) {
    visited.add(u);
    discovery[u] = low[u] = ++timer;
    steps.push({ type: "visit", u, discovery: { ...discovery }, low: { ...low }, bridges: [...bridges], visited: Array.from(visited), message: `Visiting ${u}. D=${timer}, L=${timer}.` });
    const neighbors = edges.filter(e => e.from === u || e.to === u).map(e => ({ v: e.from === u ? e.to : e.from, id: e.id }));
    for (const { v, id } of neighbors) {
      if (v === p) continue;
      if (visited.has(v)) {
        low[u] = Math.min(low[u], discovery[v]);
        steps.push({ type: "back_edge", u, v, currentEdge: id, discovery: { ...discovery }, low: { ...low }, bridges: [...bridges], visited: Array.from(visited), message: `Back-edge ${u}-${v} detected.` });
      } else {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        steps.push({ type: "return", u, v, currentEdge: id, discovery: { ...discovery }, low: { ...low }, bridges: [...bridges], visited: Array.from(visited), message: `Backtrack to ${u}. Updated Low[${u}].` });
        if (low[v] > discovery[u]) {
          bridges.push(id);
          steps.push({ type: "bridge_found", u, v, currentEdge: id, discovery: { ...discovery }, low: { ...low }, bridges: [...bridges], visited: Array.from(visited), message: `Bridge Found: Edge ${u}-${v} is critical.` });
        }
      }
    }
  }
  for (const node of nodes) if (!visited.has(node.id)) dfs(node.id, null);
  steps.push({ type: "done", discovery: { ...discovery }, low: { ...low }, bridges: [...bridges], visited: Array.from(visited), message: "Search complete. All bridges identified." });
  return steps;
}

export default function BridgesSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState(() => cloneGraph(INITIAL_GRAPH));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("0");
  const [edgeTo, setEdgeTo] = useState("1");
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const [metricsPos, setMetricsPos] = useState({ x: 20, y: 20 });
  const [bridgePos, setBridgePos] = useState({ x: 480, y: 20 });
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const steps = useMemo(() => generateBridgeSteps(graph.nodes, graph.edges), [graph]);
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
    const id = nodeName.trim() || nextNodeId(graph.nodes);
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
    if (!dragging && !activeDragPanel) return;
    const pt = svgPoint(e);
    if (dragging) {
      setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(40, Math.min(640, pt.x)), y: Math.max(45, Math.min(450, pt.y)) } : n) }));
    } else if (activeDragPanel === "metrics") {
      setMetricsPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "bridge") {
      setBridgePos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    }
  };

  const startPanelDrag = (e: React.PointerEvent, id: string, pos: { x: number, y: number }) => {
    e.stopPropagation();
    const pt = svgPoint(e);
    setActiveDragPanel(id);
    setDragOffset({ x: pt.x - pos.x, y: pt.y - pos.y });
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
          <span className="eyebrow">Graph Algorithms • Connectivity</span>
          <h1>Bridges in a Graph</h1>
          <p className="description">
            A <strong>bridge</strong> is an edge whose removal increases the number of connected components in an undirected graph. 
            It signifies a critical link in any network or infrastructure.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(V + E)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Critical Link</h2>
            <p>Removing a bridge splits the graph into two separate components. It's a single point of failure for communication between nodes.</p>
          </article>
          <article className="guide-card">
            <h2>Back-Edge Detection</h2>
            <p>If there's no back-edge from a node or its descendants to any ancestor of the parent, then the edge to the parent is a bridge.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Tarjan's Condition</h2>
            <p>An edge <code>(u, v)</code> is a bridge if and only if <code>low[v] &gt; disc[u]</code>, meaning <code>v</code> has no alternative path to <code>u</code>.</p>
          </article>
          <article className="guide-card">
            <h2>Efficiency</h2>
            <p>Like articulation points, bridges can be found in a single DFS pass, making the analysis highly efficient for large networks.</p>
          </article>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="simulator-content">
          <div className="editor">
            <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node ID" />
            <select value={edgeFrom} onChange={(e) => setEdgeFrom(e.target.value)}>
              {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
            </select>
            <select value={edgeTo} onChange={(e) => setEdgeTo(e.target.value)}>
              {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
            </select>
            <button onClick={() => addEdge()}>Join Nodes</button>
            <button onClick={removeSelected} disabled={!selected}>Remove</button>
            <button onClick={() => { setGraph(cloneGraph(INITIAL_GRAPH)); setStepIndex(0); setPlaying(false); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Click background to <b>Add Node</b></span>
                <span>↔️ Drag to <b>Move</b> • ⌨️ Shift+Drag to <b>Join</b></span>
                <span>📌 Drag <b>Panel Headers</b> to move tools</span>
              </div>
              <div className="status-panel">
                <h2>Current Step</h2>
                <p className="status-msg">{step.message}</p>
                <div className="playback-controls">
                  <button onClick={() => setStepIndex(0)}><RotateCcw size={16} /></button>
                  <button onClick={() => setStepIndex(i => Math.max(0, i-1))}><ChevronLeft size={20} /></button>
                  <button onClick={() => setPlaying(!playing)} className="play-btn">{playing ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button onClick={() => setStepIndex(i => Math.min(steps.length-1, i+1))}><ChevronRight size={20} /></button>
                  <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={isSpeechEnabled ? "active" : ""} title="Toggle Voice Narration">
                    {isSpeechEnabled ? "🔊" : "🔇"}
                  </button>
                </div>
                <div className="speed-ctrl">
                  <span>Speed</span>
                  <input type="range" min="100" max="2000" step="100" value={2100 - speed} onChange={(e) => setSpeed(2100 - Number(e.target.value))} />
                </div>
              </div>
            </aside>
            <svg ref={svgRef} viewBox="0 0 680 480" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => { setDragging(null); setActiveDragPanel(null); }}>
              {graph.edges.map(edge => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                const isBridge = step.bridges.includes(edge.id);
                const active = step.currentEdge === edge.id;
                const isSelected = selected?.type === "edge" && selected.id === edge.id;
                return (
                  <g key={edge.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`edge ${isBridge ? 'bridge' : ''} ${active ? 'active' : ''} ${isSelected ? 'selected' : ''}`} />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })} />
                  </g>
                );
              })}
              {graph.nodes.map(node => {
                const disc = step.discovery[node.id]; const low = step.low[node.id];
                const active = step.u === node.id; const visited = step.visited.includes(node.id);
                const isSelected = selected?.type === "node" && selected.id === node.id;
                return (
                  <g key={node.id} className={`node ${visited ? 'visited' : ''} ${active ? 'active' : ''} ${isSelected ? 'selected' : ''}`} onPointerDown={(e) => handleNodePointerDown(e, node)} onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}>
                    <circle cx={node.x} cy={node.y} r="24" />
                    <text x={node.x} y={node.y + 5}>{node.id}</text>
                    {disc !== undefined && <text x={node.x} y={node.y + 36} className="metrics-label">D:{disc} L:{low}</text>}
                  </g>
                );
              })}

              <foreignObject x={metricsPos.x} y={metricsPos.y} width="160" height="250" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "metrics", metricsPos)}>
                    <span>Node Metrics</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content metrics-viz">
                    {graph.nodes.map(n => (
                      <div key={n.id} className="metric-row">
                        <span>{n.id}</span>
                        <b>D:{step.discovery[n.id] || '-'} L:{step.low[n.id] || '-'}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={bridgePos.x} y={bridgePos.y} width="160" height="250" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "bridge", bridgePos)}>
                    <span>Identified Bridges</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content bridge-viz">
                    {step.bridges.map((id, idx) => {
                      const e = graph.edges.find(x => x.id === id);
                      return <div key={idx} className="bridge-item"><ShieldCheck size={12} /> {e?.from}-{e?.to}</div>
                    })}
                    {step.bridges.length === 0 && <span className="empty-msg">None yet</span>}
                  </div>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page { --bg: #0a0d14; --panel: #111827; --panel2: #172033; --border: #2b3447; --text: #e5e7eb; --muted: #98a2b3; --blue: #4f7ef8; --green: #35c486; --amber: #f5a623; --red: #ef4444; min-height: 100vh; background: var(--bg); color: var(--text); font-family: Arial, sans-serif; }
        .page[data-theme="light"] { --bg: #f7f9fc; --panel: #ffffff; --panel2: #edf2f7; --border: #d7deea; --text: #172033; --muted: #526174; --blue: #285bd6; --green: #087f5b; --amber: #b76705; --red: #c92a2a; }
        .hero { padding: 120px 24px 80px; background: radial-gradient(circle at 10% 20%, #4f7ef810, transparent 40%), var(--bg); border-bottom: 1px solid var(--border); }
        .hero h1 { margin: 16px 0; font-size: clamp(48px, 9vw, 92px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.95; background: linear-gradient(to bottom right, var(--text), var(--muted)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .content-width { max-width: 1200px; margin: 0 auto; }
        .description { font-size: 19px; max-width: 800px; margin: 24px 0 40px; line-height: 1.6; color: var(--muted); }
        .complexity-tag-group { display: flex; gap: 16px; margin-bottom: 48px; }
        .complexity-tag { background: var(--panel); border: 1px solid var(--border); padding: 12px 20px; border-radius: 12px; display: flex; flex-direction: column; gap: 4px; }
        .complexity-tag .label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .complexity-tag .value { font-size: 20px; font-weight: 700; color: var(--blue); font-family: monospace; }
        .actions, .playback-controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; transition: all 0.2s; cursor: pointer; }
        button:hover { border-color: var(--blue); }
        button.active { border-color: var(--blue); color: var(--blue); background: color-mix(in srgb, var(--blue) 14%, transparent); }
        .play-btn { width: 48px; height: 48px; border-radius: 50%; background: var(--blue) !important; color: white !important; display: flex; align-items: center; justify-content: center; }
        .primary-btn { background: var(--blue); color: white; padding: 14px 32px; font-weight: 600; border-radius: 100px; box-shadow: 0 4px 14px 0 rgba(79,126,248,0.39); }
        .detailed-guide { max-width: 1120px; margin: 0 auto; padding: 80px 24px; }
        .guide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; }
        .guide-card { background: var(--panel); border: 1px solid var(--border); border-radius: 16px; padding: 48px; }
        .guide-card h2 { font-size: 18px; margin-bottom: 16px; }
        .guide-card p { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .guide-card.highlight { border-bottom: 4px solid var(--amber); }
        .simulator { padding: 60px 0 100px; border-top: 1px solid var(--border); }
        .workspace { display: grid; grid-template-columns: 340px 1fr; gap: 40px; padding: 40px; background: var(--panel); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5); }
        aside { display: flex; flex-direction: column; gap: 20px; }
        .status-msg { font-size: 14px; line-height: 1.5; min-height: 60px; color: var(--text); font-weight: 500; }
        .speed-ctrl { display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: var(--muted); }
        .editor { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .editor select { min-width: 80px; }
        svg { width: 100%; min-height: 500px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .edge { stroke: var(--border); stroke-width: 3; opacity: 0.3; transition: all 0.3s; pointer-events: none; }
        .edge.bridge { stroke: var(--amber); stroke-width: 6; opacity: 1; }
        .edge.active { stroke: var(--blue); stroke-width: 5; opacity: 1; stroke-dasharray: 6 3; }
        .edge.selected { stroke: var(--amber); stroke-width: 4; opacity: 1; }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }
        .node circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; cursor: grab; }
        .node.visited circle { stroke: var(--blue); }
        .node.active circle { fill: var(--blue); stroke: var(--blue); filter: drop-shadow(0 0 10px var(--blue)); }
        .node.selected circle { stroke: var(--amber); stroke-width: 5; }
        .node:active circle { cursor: grabbing; }
        .node text { fill: var(--text); font-size: 13px; text-anchor: middle; font-weight: 800; pointer-events: none; }
        .node.active text { fill: white; }
        .metrics-label { font-size: 9px; fill: var(--muted); font-weight: 700; text-anchor: middle; font-family: monospace; }
        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .panel-content { padding: 10px; flex: 1; overflow-y: auto; }
        .metric-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border); font-size: 11px; font-family: monospace; }
        .bridge-item { padding: 6px 10px; background: color-mix(in srgb, var(--amber) 10%, transparent); color: var(--amber); border-radius: 6px; font-size: 12px; margin-bottom: 4px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .empty-msg { font-size: 11px; color: var(--muted); font-style: italic; }
        .gesture-hint { background: var(--panel2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--muted); display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}


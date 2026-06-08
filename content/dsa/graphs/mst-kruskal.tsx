"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, CheckCircle2, XCircle, LayoutGrid, MousePointer2 } from "lucide-react";
import { CodeTracker } from "@/components/CodeTracker";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; weight: number; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface KruskalStep {
  type: string;
  edges: GraphEdge[];
  mstEdges: string[];
  parent: Record<string, string>;
  currentEdgeId?: string;
  message: string;
  line?: number;
}

const INITIAL_GRAPH: GraphData = {
  nodes: [
    { id: "A", x: 100, y: 150 },
    { id: "B", x: 300, y: 80 },
    { id: "C", x: 500, y: 150 },
    { id: "D", x: 100, y: 350 },
    { id: "E", x: 300, y: 420 },
    { id: "F", x: 500, y: 350 },
  ],
  edges: [
    { id: "e1", from: "A", to: "B", weight: 4 },
    { id: "e2", from: "A", to: "D", weight: 2 },
    { id: "e3", from: "B", to: "C", weight: 3 },
    { id: "e4", from: "B", to: "E", weight: 3 },
    { id: "e5", from: "C", to: "F", weight: 2 },
    { id: "e6", from: "D", to: "E", weight: 3 },
    { id: "e7", from: "E", to: "F", weight: 4 },
    { id: "e8", from: "B", to: "D", weight: 1 },
    { id: "e9", from: "C", to: "E", weight: 5 },
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

function find(parent: Record<string, string>, i: string): string {
  if (parent[i] === i) return i;
  return find(parent, parent[i]);
}

function union(parent: Record<string, string>, x: string, y: string) {
  const rootX = find(parent, x);
  const rootY = find(parent, y);
  if (rootX !== rootY) {
    parent[rootX] = rootY;
    return true;
  }
  return false;
}

function generateKruskalSteps(nodes: GraphNode[], edges: GraphEdge[]): KruskalStep[] {
  const steps: KruskalStep[] = [];
  const parent: Record<string, string> = {};
  nodes.forEach(n => parent[n.id] = n.id);

  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mstEdges: string[] = [];

  steps.push({ type: "init", edges: sortedEdges, mstEdges: [], parent: { ...parent }, message: "Sort all edges by weight and initialize DSU.", line: 0 });

  for (const edge of sortedEdges) {
    steps.push({ type: "check", edges: sortedEdges, mstEdges: [...mstEdges], parent: { ...parent }, currentEdgeId: edge.id, message: `Analyzing edge ${edge.from}-${edge.to} (weight: ${edge.weight}).`, line: 1 });
    const rootX = find(parent, edge.from);
    const rootY = find(parent, edge.to);
    
    steps.push({ type: "find", edges: sortedEdges, mstEdges: [...mstEdges], parent: { ...parent }, currentEdgeId: edge.id, message: `Find roots of ${edge.from} and ${edge.to}.`, line: 2 });

    if (rootX !== rootY) {
      union(parent, edge.from, edge.to);
      mstEdges.push(edge.id);
      steps.push({ type: "accept", edges: sortedEdges, mstEdges: [...mstEdges], parent: { ...parent }, currentEdgeId: edge.id, message: `Nodes belong to different components. Adding to MST.`, line: 4 });
    } else {
      steps.push({ type: "reject", edges: sortedEdges, mstEdges: [...mstEdges], parent: { ...parent }, currentEdgeId: edge.id, message: `Nodes are already in the same component. Rejecting to avoid cycle.`, line: 2 });
    }
    if (mstEdges.length === nodes.length - 1) break;
  }
  steps.push({ type: "done", edges: sortedEdges, mstEdges: [...mstEdges], parent: { ...parent }, message: "MST complete!", line: 0 });
  return steps;
}

export default function KruskalSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState(() => cloneGraph(INITIAL_GRAPH));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("A");
  const [edgeTo, setEdgeTo] = useState("B");
  const [edgeWeight, setEdgeWeight] = useState(5);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const [edgeListPos, setEdgeListPos] = useState({ x: 20, y: 20 });
  const [dsuPos, setDsuPos] = useState({ x: 480, y: 20 });
  const [codePos, setCodePos] = useState({ x: 20, y: 240 });
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const steps = useMemo(() => generateKruskalSteps(graph.nodes, graph.edges), [graph]);
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
    const weight = Number(edgeWeight);
    if (graph.edges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from))) return;
    const edge = { id: nextEdgeId(graph.edges), from, to, weight };
    setGraph(g => ({ ...g, edges: [...g.edges, edge] }));
    setSelected({ type: "edge", id: edge.id });
    setEdgeSource(null);
  }, [edgeFrom, edgeTo, edgeWeight, graph.edges]);

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
    } else if (activeDragPanel === "edgeList") {
      setEdgeListPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
    } else if (activeDragPanel === "dsu") {
      setDsuPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
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
          <span className="eyebrow">Graph Algorithms • MST</span>
          <h1>Kruskal's Algorithm</h1>
          <p className="description">
            A greedy algorithm that finds the <strong>Minimum Spanning Tree</strong> by sorting all edges and adding them if they don't form a cycle. 
            It's a forest-growing approach using Disjoint Set Union.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(E log E)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V + E)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Step 1: Sort</h2>
            <p>Begin by sorting all edges of the graph in non-decreasing order of their weight.</p>
          </article>
          <article className="guide-card">
            <h2>Step 2: Greed</h2>
            <p>Pick the smallest edge. Check if adding it forms a cycle with the spanning tree formed so far.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Step 3: Cycle Check</h2>
            <p>Use Disjoint Set Union (DSU) to check if nodes are in the same component. If they aren't, add the edge!</p>
          </article>
          <article className="guide-card">
            <h2>Termination</h2>
            <p>Repeat until there are (V-1) edges in the MST, where V is the number of vertices.</p>
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
            <input type="number" value={edgeWeight} onChange={(e) => setEdgeWeight(Number(e.target.value))} style={{ width: '80px' }} />
            <button onClick={() => addEdge()}>Join</button>
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
              <defs>
                <filter id="mst-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
              </defs>
              {graph.edges.map(edge => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                const isMST = step.mstEdges.includes(edge.id);
                const isCurrent = step.currentEdgeId === edge.id;
                const isRejected = step.type === "reject" && isCurrent;
                const isSelected = selected?.type === "edge" && selected.id === edge.id;
                return (
                  <g key={edge.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`edge ${isMST ? 'mst' : ''} ${isCurrent ? 'active' : ''} ${isRejected ? 'rejected' : ''} ${isSelected ? 'selected' : ''}`} />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })} />
                    <rect x={(from.x + to.x)/2 - 14} y={(from.y + to.y)/2 - 11} width="28" height="22" rx="6" className="weight-bg" />
                    <text x={(from.x + to.x)/2} y={(from.y + to.y)/2 + 5} className="edge-weight">{edge.weight}</text>
                  </g>
                );
              })}
              {graph.nodes.map(node => {
                const isSelected = selected?.type === "node" && selected.id === node.id;
                return (
                  <g key={node.id} className={`node ${isSelected ? 'selected' : ''}`} onPointerDown={(e) => handleNodePointerDown(e, node)} onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}>
                    <circle cx={node.x} cy={node.y} r="22" />
                    <text x={node.x} y={node.y + 5}>{node.id}</text>
                    <text x={node.x} y={node.y + 36} className="node-root">Root: {find(step.parent, node.id)}</text>
                  </g>
                );
              })}

              <foreignObject x={edgeListPos.x} y={edgeListPos.y} width="160" height="300" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "edgeList", edgeListPos)}>
                    <span>Sorted Edges</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content edge-viz">
                    {step.edges.map(e => (
                      <div key={e.id} className={`edge-item ${step.currentEdgeId === e.id ? 'active' : ''} ${step.mstEdges.includes(e.id) ? 'accepted' : ''}`}>
                        <span>{e.from}-{e.to}</span>
                        <b>{e.weight}</b>
                        {step.mstEdges.includes(e.id) && <CheckCircle2 size={10} />}
                      </div>
                    ))}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={dsuPos.x} y={dsuPos.y} width="180" height="250" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "dsu", dsuPos)}>
                    <span>DSU Structure</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content dsu-viz">
                    {graph.nodes.map(n => (
                      <div key={n.id} className="dsu-row">
                        <span className="node-id">{n.id}</span>
                        <span className="arrow">→</span>
                        <span className="parent-id">{step.parent[n.id]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </foreignObject>

              <foreignObject x={codePos.x} y={codePos.y} width="220" height="180" className="movable-panel">
                <div onPointerDown={(e) => startPanelDrag(e, "code", codePos)} className="h-full">
                  <CodeTracker 
                    code={[
                      "sort edges by weight",
                      "for each edge (u, v) with w:",
                      "  if find(u) != find(v):",
                      "    union(u, v)",
                      "    add (u, v) to MST"
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
        .edge { stroke: var(--muted); stroke-width: 2; opacity: 0.2; transition: all 0.3s; pointer-events: none; }
        .edge.mst { stroke: var(--green); stroke-width: 6; opacity: 1; filter: url(#mst-glow); }
        .edge.active { stroke: var(--blue); stroke-width: 4; opacity: 1; stroke-dasharray: 8 4; animation: flow 1s linear infinite; }
        .edge.rejected { stroke: var(--red); opacity: 0.4; stroke-dasharray: 4; }
        .edge.selected { stroke: var(--amber); opacity: 1; stroke-width: 4; }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }
        @keyframes flow { to { stroke-dashoffset: -12; } }
        .weight-bg { fill: var(--panel); stroke: var(--border); stroke-width: 1; pointer-events: none; }
        .edge-weight { fill: var(--muted); font-size: 10px; font-weight: 800; text-anchor: middle; font-family: monospace; pointer-events: none; }
        .node circle { fill: var(--panel); stroke: var(--muted); stroke-width: 2; transition: all 0.3s; cursor: grab; }
        .node.selected circle { stroke: var(--amber); stroke-width: 4; }
        .node:active circle { cursor: grabbing; }
        .node text { fill: var(--text); font-size: 13px; text-anchor: middle; font-weight: 800; pointer-events: none; }
        .node-root { fill: var(--muted); font-size: 9px; font-weight: 700; text-anchor: middle; font-family: monospace; pointer-events: none; }
        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .panel-content { padding: 10px; flex: 1; overflow-y: auto; }
        .edge-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-radius: 6px; font-size: 11px; margin-bottom: 2px; background: var(--panel2); color: var(--muted); }
        .edge-item.active { background: var(--blue); color: white; }
        .edge-item.accepted { color: var(--green); }
        .dsu-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid var(--border); font-size: 12px; font-family: monospace; }
        .parent-id { color: var(--blue); font-weight: 700; }
        .gesture-hint { background: var(--panel2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--muted); display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border); }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}


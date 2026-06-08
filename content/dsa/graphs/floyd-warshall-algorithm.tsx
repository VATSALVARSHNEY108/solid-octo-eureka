"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Table, MousePointer2 } from "lucide-react";

interface GraphNode { id: string; x: number; y: number; }
interface GraphEdge { id: string; from: string; to: string; weight: number; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface FWStep {
  type: string;
  dist: Record<string, Record<string, number>>;
  k?: string; i?: string; j?: string;
  message: string;
  highlightEdges?: string[];
}

const INITIAL_GRAPH: GraphData = {
  nodes: [
    { id: "1", x: 150, y: 150 },
    { id: "2", x: 450, y: 150 },
    { id: "3", x: 150, y: 350 },
    { id: "4", x: 450, y: 350 },
  ],
  edges: [
    { id: "e1", from: "1", to: "2", weight: 3 },
    { id: "e2", from: "1", to: "3", weight: 8 },
    { id: "e3", from: "2", to: "4", weight: 1 },
    { id: "e4", from: "3", to: "4", weight: 5 },
    { id: "e5", from: "4", to: "1", weight: 2 },
  ],
};

function cloneGraph(graph: GraphData): GraphData {
  return {
    nodes: graph.nodes.map((node) => ({ ...node })),
    edges: graph.edges.map((edge) => ({ ...edge })),
  };
}

function nextNodeId(nodes: GraphNode[]) {
  const ids = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
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

function generateFWSteps(nodes: GraphNode[], edges: GraphEdge[]): FWStep[] {
  const steps: FWStep[] = [];
  if (!nodes.length) return [];
  const nodeIds = nodes.map(n => n.id);
  const dist: Record<string, Record<string, number>> = {};

  nodeIds.forEach(u => {
    dist[u] = {};
    nodeIds.forEach(v => dist[u][v] = u === v ? 0 : Infinity);
  });
  edges.forEach(e => {
    if (dist[e.from] && dist[e.from][e.to] !== undefined) {
      dist[e.from][e.to] = Math.min(dist[e.from][e.to], e.weight);
    }
  });

  steps.push({ type: "init", dist: JSON.parse(JSON.stringify(dist)), message: "Initialize dist matrix with direct edges." });

  for (const k of nodeIds) {
    steps.push({ type: "pivot", k, dist: JSON.parse(JSON.stringify(dist)), message: `Pass ${k}: Checking if paths can be shortened via node ${k}.` });
    for (const i of nodeIds) {
      for (const j of nodeIds) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const newDist = dist[i][k] + dist[k][j];
          if (newDist < dist[i][j]) {
            dist[i][j] = newDist;
            steps.push({ type: "relax", k, i, j, dist: JSON.parse(JSON.stringify(dist)), message: `Updated path ${i}→${j} to ${newDist} via ${k}.`, highlightEdges: edges.filter(e => (e.from === i && e.to === k) || (e.from === k && e.to === j)).map(e => e.id) });
          }
        }
      }
    }
  }
  steps.push({ type: "done", dist: JSON.parse(JSON.stringify(dist)), message: "All-pairs shortest paths computed." });
  return steps;
}

export default function FloydWarshallSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState(() => cloneGraph(INITIAL_GRAPH));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("1");
  const [edgeTo, setEdgeTo] = useState("2");
  const [edgeWeight, setEdgeWeight] = useState(5);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [dragging, setDragging] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState("");

  const [matrixPos, setMatrixPos] = useState({ x: 20, y: 20 });
  const [activeDragPanel, setActiveDragPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const steps = useMemo(() => generateFWSteps(graph.nodes, graph.edges), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { type: "empty", dist: {}, message: "Add nodes to start." });

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
    const weight = Number(edgeWeight);
    if (!from || !to || from === to || !Number.isFinite(weight)) return;
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
    } else if (activeDragPanel === "matrix") {
      setMatrixPos({ x: pt.x - dragOffset.x, y: pt.y - dragOffset.y });
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
          <span className="eyebrow">Graph Algorithms • Dynamic Programming</span>
          <h1>Floyd-Warshall Algorithm</h1>
          <p className="description">
            The <strong>Floyd-Warshall algorithm</strong> computes shortest paths between <strong>all pairs</strong> of vertices in a weighted graph. 
            It works by considering every node as a potential intermediate point.
          </p>
          <div className="complexity-tag-group">
            <div className="complexity-tag"><span className="label">Time</span><span className="value">O(V³)</span></div>
            <div className="complexity-tag"><span className="label">Space</span><span className="value">O(V²)</span></div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Try Interactive Simulator</a></div>
        </div>
      </section>

      <section className="detailed-guide">
        <div className="guide-grid">
          <article className="guide-card">
            <h2>Matrix Based</h2>
            <p>Unlike Dijkstra, which uses a priority queue, Floyd-Warshall uses a 2D matrix to store the shortest distance between every pair (i, j).</p>
          </article>
          <article className="guide-card">
            <h2>Pivot Logic</h2>
            <p>For every pair (i, j), we check if going through intermediate node 'k' gives a shorter path: <code>dist[i][j] &gt; dist[i][k] + dist[k][j]</code>.</p>
          </article>
          <article className="guide-card highlight">
            <h2>Negative Weights</h2>
            <p>It can handle negative weights, but not negative cycles. It can however be used to detect negative cycles if <code>dist[i][i] &lt; 0</code>.</p>
          </article>
          <article className="guide-card">
            <h2>Global Shortest</h2>
            <p>Ideal for dense graphs or when you need a distance table for all possible connections in a network.</p>
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
            <input type="number" value={edgeWeight} onChange={(e) => setEdgeWeight(Number(e.target.value))} />
            <button onClick={() => addEdge()}>Join</button>
            <button onClick={removeSelected} disabled={!selected}>Remove</button>
            <button onClick={() => { setGraph(cloneGraph(INITIAL_GRAPH)); setStepIndex(0); setPlaying(false); }}>Reset</button>
          </div>
          <div className="workspace">
            <aside className="movable-panel">
              <div className="gesture-hint">
                <span>🖱️ Click background to <b>Add Node</b></span>
                <span>↔️ Drag to <b>Move</b> • ⌨️ Shift+Drag to <b>Join</b></span>
                <span>✏️ Double-Click weight to <b>Edit</b></span>
                <span>📌 Drag <b>Matrix Header</b> to move the table</span>
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
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto"><path d="M0,0 L0,8 L8,4 z" fill="currentColor" /></marker>
              </defs>
              {graph.edges.map(edge => {
                const from = graph.nodes.find(n => n.id === edge.from)!;
                const to = graph.nodes.find(n => n.id === edge.to)!;
                if (!from || !to) return null;
                const active = step.highlightEdges?.includes(edge.id);
                const isSelected = selected?.type === "edge" && selected.id === edge.id;
                
                const edit = (e: React.MouseEvent) => { e.stopPropagation(); setEditingEdgeId(edge.id); setEditingWeight(String(edge.weight)); };
                const commit = () => { const w = Number(editingWeight); if (Number.isFinite(w)) setGraph(g => ({ ...g, edges: g.edges.map(ed => ed.id === editingEdgeId ? { ...ed, weight: w } : ed) })); setEditingEdgeId(null); };

                return (
                  <g key={edge.id} onPointerDown={(e) => { e.stopPropagation(); setSelected({ type: "edge", id: edge.id }); }} onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: edge.id })} onDoubleClick={edit}>
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`edge ${active ? 'active' : ''} ${isSelected ? 'selected' : ''}`} markerEnd="url(#arrow)" />
                    <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="edge-hit" />
                    {editingEdgeId === edge.id ? (
                      <foreignObject x={(from.x+to.x)/2 - 25} y={(from.y+to.y)/2 - 15} width="50" height="30"><input autoFocus className="inline-edit" value={editingWeight} onChange={(e) => setEditingWeight(e.target.value)} onBlur={commit} onKeyDown={(ev) => ev.key === "Enter" && commit()} /></foreignObject>
                    ) : (
                      <text x={(from.x + to.x)/2} y={(from.y + to.y)/2 - 10} className="edge-weight">{edge.weight}</text>
                    )}
                  </g>
                );
              })}
              {graph.nodes.map(node => {
                const isK = step.k === node.id; const isI = step.i === node.id; const isJ = step.j === node.id;
                const isSelected = selected?.type === "node" && selected.id === node.id;
                return (
                  <g key={node.id} className={`node ${isK ? 'pivot' : ''} ${isI ? 'source' : ''} ${isJ ? 'dest' : ''} ${isSelected ? 'selected' : ''}`} onPointerDown={(e) => handleNodePointerDown(e, node)} onContextMenu={(e) => handleContextMenu(e, { type: "node", id: node.id })}>
                    <circle cx={node.x} cy={node.y} r="22" />
                    <text x={node.x} y={node.y + 5}>{node.id}</text>
                  </g>
                );
              })}

              <foreignObject x={matrixPos.x} y={matrixPos.y} width="220" height="280" className="movable-panel">
                <div className="panel-container" data-theme={theme}>
                  <div className="panel-header" onPointerDown={(e) => startPanelDrag(e, "matrix", matrixPos)}>
                    <span>Distance Matrix</span>
                    <span className="drag-handle">⠿</span>
                  </div>
                  <div className="panel-content matrix-viz">
                    <table className="fw-table">
                      <thead><tr><th></th>{graph.nodes.map(n => <th key={n.id}>{n.id}</th>)}</tr></thead>
                      <tbody>
                        {graph.nodes.map(r => (
                          <tr key={r.id}>
                            <th>{r.id}</th>
                            {graph.nodes.map(c => {
                              const val = step.dist?.[r.id]?.[c.id];
                              const active = step.i === r.id && step.j === c.id;
                              const highlight = (step.i === r.id && step.k === c.id) || (step.k === r.id && step.j === c.id);
                              return (
                                <td key={c.id} className={`${active ? 'active' : ''} ${highlight ? 'highlight' : ''}`}>
                                  {val === undefined || val === Infinity ? '∞' : val}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {graph.nodes.length === 0 && <span className="empty-msg">No data</span>}
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
        .actions, .editor, .playback-controls { display: flex; flex-wrap: wrap; gap: 8px; }
        button, a, input, select { border: 1px solid var(--border); border-radius: 8px; background: var(--panel2); color: var(--text); min-height: 38px; padding: 0 12px; transition: all 0.2s; cursor: pointer; }
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
        svg { width: 100%; min-height: 500px; background: linear-gradient(var(--panel2) 1px, transparent 1px), linear-gradient(90deg, var(--panel2) 1px, transparent 1px), var(--bg); background-size: 34px 34px; border: 1px solid var(--border); border-radius: 8px; }
        .edge { stroke: var(--muted); stroke-width: 2.5; opacity: 0.2; transition: all 0.3s; pointer-events: none; }
        .edge.active { stroke: var(--blue); stroke-width: 5; opacity: 1; }
        .edge.selected { stroke: var(--amber); opacity: 1; stroke-width: 3; }
        .edge-hit { stroke: transparent; stroke-width: 20; fill: none; cursor: pointer; }
        .edge-weight { fill: var(--muted); font-size: 10px; font-weight: 800; text-anchor: middle; font-family: monospace; }
        .node circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; cursor: grab; }
        .node.pivot circle { stroke: var(--amber); stroke-width: 5; }
        .node.source circle { stroke: var(--blue); stroke-width: 5; }
        .node.dest circle { stroke: var(--green); stroke-width: 5; }
        .node.selected circle { stroke: var(--amber); stroke-width: 5; }
        .node:active circle { cursor: grabbing; }
        .node text { fill: var(--text); font-size: 13px; text-anchor: middle; font-weight: 800; pointer-events: none; }
        .movable-panel { cursor: grab; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); overflow: visible; }
        .movable-panel:active { cursor: grabbing; }
        .movable-panel > div { resize: both; overflow: auto; min-width: 140px; min-height: 110px; max-width: 620px; max-height: 430px; }
        .panel-container { background: color-mix(in srgb, var(--panel) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
        .panel-header { background: var(--panel2); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .panel-header span { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--muted); }
        .panel-content { padding: 10px; flex: 1; overflow-y: auto; }
        .fw-table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 11px; }
        .fw-table th, .fw-table td { border: 1px solid var(--border); padding: 6px 2px; text-align: center; }
        .fw-table th { color: var(--muted); }
        .fw-table td.active { background: var(--blue); color: white; font-weight: 900; }
        .fw-table td.highlight { background: color-mix(in srgb, var(--amber) 15%, transparent); color: var(--amber); }
        .gesture-hint { background: var(--panel2); padding: 12px; border-radius: 8px; font-size: 11px; color: var(--muted); display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border); }
        .inline-edit { width: 100%; height: 100%; background: var(--panel2); border: 1px solid var(--blue); color: var(--text); text-align: center; border-radius: 4px; font-size: 12px; }
        @media (max-width: 900px) { .workspace { grid-template-columns: 1fr; } }
      `}</style>
    </main>
  );
}


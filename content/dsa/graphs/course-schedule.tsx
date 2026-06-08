"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, BookOpen, GraduationCap, CircleCheck } from "lucide-react";

interface GraphNode { id: number; x: number; y: number; }
interface GraphEdge { from: number; to: number; }
interface GraphData { nodes: GraphNode[]; edges: GraphEdge[]; }

interface CourseStep {
  indegree: number[];
  queue: number[];
  completed: number[];
  message: string;
  activeNode?: number;
}

const INITIAL_NODES: GraphNode[] = [
  { id: 0, x: 300, y: 100 },
  { id: 1, x: 450, y: 250 },
  { id: 2, x: 300, y: 400 },
  { id: 3, x: 150, y: 250 },
  { id: 4, x: 300, y: 250 },
];

const INITIAL_EDGES: GraphEdge[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 0 },
  { from: 4, to: 0 },
];

function generateCourseSteps(nodes: GraphNode[], edges: GraphEdge[]): CourseStep[] {
  const numNodes = nodes.length;
  if (numNodes === 0) return [];
  
  const nodeIds = nodes.map(n => n.id);
  const adj: Record<number, number[]> = {};
  const indegree: Record<number, number> = {};
  
  nodeIds.forEach(id => { adj[id] = []; indegree[id] = 0; });
  edges.forEach(e => {
    if (adj[e.from]) adj[e.from].push(e.to);
    if (indegree.hasOwnProperty(e.to)) indegree[e.to]++;
  });

  const steps: CourseStep[] = [];
  const currentIndegree = nodeIds.map(id => indegree[id]);

  steps.push({
    indegree: [...currentIndegree],
    queue: [],
    completed: [],
    message: "Analyzing course dependencies and calculating initial in-degrees."
  });

  const queue: number[] = [];
  nodeIds.forEach(id => { if (indegree[id] === 0) queue.push(id); });

  steps.push({
    indegree: [...currentIndegree],
    queue: [...queue],
    completed: [],
    message: `Identified ${queue.length} courses with no prerequisites. Adding to study queue.`
  });

  const completed: number[] = [];
  const qCopy = [...queue];
  const indCopy = { ...indegree };

  while (qCopy.length > 0) {
    const u = qCopy.shift()!;
    completed.push(u);
    
    steps.push({
      indegree: nodeIds.map(id => indCopy[id]),
      queue: [...qCopy],
      completed: [...completed],
      message: `Taking Course ${u}. Satisfying dependencies for following courses.`,
      activeNode: u
    });

    for (const v of adj[u]) {
      indCopy[v]--;
      if (indCopy[v] === 0) {
        qCopy.push(v);
        steps.push({
          indegree: nodeIds.map(id => indCopy[id]),
          queue: [...qCopy],
          completed: [...completed],
          message: `Prerequisite for Course ${v} cleared! Adding to queue.`,
          activeNode: v
        });
      } else {
         steps.push({
          indegree: nodeIds.map(id => indCopy[id]),
          queue: [...qCopy],
          completed: [...completed],
          message: `Course ${v} still has ${indCopy[v]} prerequisite(s) remaining.`,
          activeNode: v
        });
      }
    }
  }

  steps.push({
    indegree: nodeIds.map(id => indCopy[id]),
    queue: [],
    completed: [...completed],
    message: completed.length === numNodes 
      ? "Curriculum complete! All courses can be taken in this order." 
      : `Stuck! Only ${completed.length} courses finished. A circular dependency (cycle) was detected.`
  });

  return steps;
}

export default function CourseScheduleSimulation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as "light" | "dark") || "dark";
  
  const [graph, setGraph] = useState<GraphData>(() => ({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }));
  const [selected, setSelected] = useState<{ type: "node" | "edge"; id: string } | null>(null);
  const [edgeSource, setEdgeSource] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [dragging, setDragging] = useState<number | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);

  const steps = useMemo(() => generateCourseSteps(graph.nodes, graph.edges), [graph]);
  const step = steps[Math.min(stepIndex, steps.length - 1)] || (steps.length ? steps[0] : { indegree: [], queue: [], completed: [], message: "Add courses to start." });

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
    const nextId = graph.nodes.length > 0 ? Math.max(...graph.nodes.map(n => n.id)) + 1 : 0;
    setGraph(g => ({ ...g, nodes: [...g.nodes, { id: nextId, x: pt.x, y: pt.y }] }));
    setSelected(null);
  };

  const handleNodePointerDown = (e: React.PointerEvent, node: GraphNode) => {
    e.stopPropagation();
    if (e.shiftKey) { setEdgeSource(node.id); setSelected({ type: "node", id: node.id.toString() }); } 
    else if (edgeSource !== null && edgeSource !== node.id) {
      const exists = graph.edges.some(ed => ed.from === edgeSource && ed.to === node.id);
      if (!exists) setGraph(g => ({ ...g, edges: [...g.edges, { from: edgeSource, to: node.id }] }));
      setEdgeSource(null);
    } else { setDragging(node.id); setSelected({ type: "node", id: node.id.toString() }); setEdgeSource(node.id); }
  };

  const handleMove = (e: React.PointerEvent) => {
    if (dragging === null) return;
    const pt = svgPoint(e);
    setGraph(g => ({ ...g, nodes: g.nodes.map(n => n.id === dragging ? { ...n, x: Math.max(20, Math.min(580, pt.x)), y: Math.max(20, Math.min(480, pt.y)) } : n) }));
  };

  const handleContextMenu = (e: React.MouseEvent, item: { type: "node" | "edge"; id: string }) => {
    e.preventDefault(); e.stopPropagation();
    if (item.type === "node") {
      const id = parseInt(item.id);
      setGraph(g => ({ nodes: g.nodes.filter(n => n.id !== id), edges: g.edges.filter(ed => ed.from !== id && ed.to !== id) }));
    } else {
      const [from, to] = item.id.split("-").map(Number);
      setGraph(g => ({ ...g, edges: g.edges.filter(ed => !(ed.from === from && ed.to === to)) }));
    }
    setSelected(null);
  };

  return (
    <main className="page" data-theme={theme}>
      <section className="hero">
        <div className="content-width">
          <div className="badge">Graph Algorithms</div>
          <h1>Course Schedule</h1>
          <p className="description">
            Given a set of courses and their prerequisites, determine if you can finish all of them. 
            This is a classic <strong>Topological Sort</strong> problem: if the prerequisite graph contains a cycle, completion is impossible.
          </p>
          <div className="complexity-grid">
            <div className="complexity-item">
              <span className="label">Time Complexity</span>
              <span className="value">O(V + E)</span>
            </div>
            <div className="complexity-item">
              <span className="label">Space Complexity</span>
              <span className="value">O(V + E)</span>
            </div>
          </div>
          <div className="actions"><a href="#simulator" className="primary-btn">Start Interactive Simulator</a></div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-content">
          <div className="card">
            <div className="card-icon"><BookOpen size={20} /></div>
            <h3>Kahn's Algorithm</h3>
            <p>We use a queue-based approach to iteratively process courses with zero incoming edges (no remaining prerequisites).</p>
          </div>
          <div className="card highlight">
            <div className="card-icon"><GraduationCap size={20} /></div>
            <h3>Cycle Detection</h3>
            <p>If we finish the process and some courses remain unvisited, it means there's a circular dependency (e.g., A needs B, B needs A).</p>
          </div>
        </div>
      </section>

      <section id="simulator" className="simulator">
        <div className="workspace">
          <aside className="movable-panel">
            <div className="panel-header">
              <Info size={16} />
              <h2>Curriculum State</h2>
            </div>
            
            <div className={`status-message ${step.completed.length < graph.nodes.length && stepIndex === steps.length - 1 ? 'error' : ''}`}>
              {step.message}
            </div>

            <div className="data-section">
              <h3>Progress Tracker</h3>
              <div className="progress-card">
                <div className="progress-header">
                  <span>Completion</span>
                  <span>{step.completed.length} / {graph.nodes.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="fill" style={{ width: `${(step.completed.length / (graph.nodes.length || 1)) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="data-section">
              <h3>Study Queue</h3>
              <div className="queue-list">
                {step.queue.map((q, i) => (
                  <div key={i} className="queue-item">
                    <span className="bullet" />
                    Course {q}
                  </div>
                ))}
                {step.queue.length === 0 && <div className="empty">No courses ready</div>}
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
              <button className="reset-btn" onClick={() => { setGraph({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }); setStepIndex(0); setPlaying(false); }}>Reset Graph</button>
            </div>
          </aside>

          <div className="canvas-area">
            <svg ref={svgRef} viewBox="0 0 600 500" onPointerDown={handleCanvasClick} onPointerMove={handleMove} onPointerUp={() => setDragging(null)}>
              <defs>
                <marker id="prereq-arrow" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>

              {graph.edges.map((edge, i) => {
                const from = graph.nodes.find(n => n.id === edge.from);
                const to = graph.nodes.find(n => n.id === edge.to);
                if (!from || !to) return null;
                const isCleared = step.completed.includes(edge.from);
                return (
                  <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                    className={`edge ${isCleared ? 'cleared' : ''}`} 
                    markerEnd="url(#prereq-arrow)"
                    onContextMenu={(e) => handleContextMenu(e, { type: "edge", id: `${edge.from}-${edge.to}` })}
                  />
                );
              })}

              {graph.nodes.map((n) => {
                const isDone = step.completed.includes(n.id);
                const inQueue = step.queue.includes(n.id);
                const isActive = step.activeNode === n.id;
                const isSelected = selected?.id === n.id.toString();

                return (
                  <g key={n.id} className={`node-group ${isDone ? 'done' : ''} ${inQueue ? 'queued' : ''} ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`}
                    onPointerDown={(e) => handleNodePointerDown(e, n)}
                    onContextMenu={(e) => handleContextMenu(e, { type: "node", id: n.id.toString() })}
                  >
                    <circle cx={n.x} cy={n.y} r="22" className="node-circle" />
                    <text x={n.x} y={n.y} dy="0.35em" className="node-text">{n.id}</text>
                    {isDone && (
                      <g transform={`translate(${n.x + 12}, ${n.y - 12})`}>
                        <circle r="8" fill="#10b981" stroke="white" strokeWidth="1.5" />
                        <text dy="0.35em" textAnchor="middle" fill="white" fontSize="8" fontWeight="900">✓</text>
                      </g>
                    )}
                    {!isDone && (
                      <text x={n.x} y={n.y + 35} className="node-label">In: {step.indegree[graph.nodes.findIndex(node => node.id === n.id)] ?? '?'}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="gesture-hint-canvas">
               🖱️ Click Canvas: Add Course • ↔️ Drag: Move • ⌨️ Shift+Click: Set Prerequisite
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
        .status-message.error { border-color: var(--red); color: var(--red); background: color-mix(in srgb, var(--red) 5%, var(--panel-light)); }
        
        .progress-card { background: var(--panel-light); padding: 16px; border-radius: 16px; border: 1px solid var(--border); }
        .progress-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 10px; }
        .progress-bar { height: 8px; background: var(--bg); border-radius: 4px; overflow: hidden; }
        .progress-bar .fill { height: 100%; background: var(--green); transition: width 0.4s ease; }
        
        .queue-list { display: flex; flex-direction: column; gap: 6px; }
        .queue-item { padding: 10px 16px; background: color-mix(in srgb, var(--amber) 10%, transparent); border: 1px solid var(--amber); color: var(--amber); border-radius: 12px; display: flex; gap: 10px; align-items: center; font-weight: 700; font-size: 14px; }
        .queue-item .bullet { width: 6px; height: 6px; background: var(--amber); border-radius: 50%; }
        .empty { font-size: 12px; color: var(--text-dim); font-style: italic; }

        .playback-controls { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
        .buttons { display: flex; flex-wrap: wrap; gap: 12px; }
        .buttons button { flex: 1; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; cursor: pointer; border: none; }
        .buttons button.primary { background: var(--accent); color: white; }
        .buttons button.secondary { background: var(--panel-light); color: var(--text); border: 1px solid var(--border); }
        .buttons button.active { border-color: var(--accent); color: var(--accent-light); }
        .speed-slider { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 600; color: var(--text-dim); }
        .speed-slider input { flex: 1; accent-color: var(--accent); }
        .reset-btn { width: 100%; height: 40px; border-radius: 10px; background: var(--bg); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; font-weight: 700; cursor: pointer; }

        .canvas-area { background: color-mix(in srgb, var(--bg) 80%, transparent); border-radius: 24px; border: 1px solid var(--border); position: relative; overflow: hidden; }
        svg { width: 100%; height: 500px; background: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; }
        .edge { stroke: var(--border); stroke-width: 2.5; transition: all 0.3s; opacity: 0.6; pointer-events: none; }
        .edge.cleared { stroke: var(--green); opacity: 1; }

        .node-group { transition: all 0.4s; cursor: grab; }
        .node-circle { fill: var(--panel); stroke: var(--border); stroke-width: 3; transition: all 0.3s; }
        .node-text { fill: var(--text); font-weight: 800; font-size: 14px; text-anchor: middle; pointer-events: none; }
        .node-label { fill: var(--text-dim); font-size: 10px; font-weight: 700; text-anchor: middle; pointer-events: none; font-family: monospace; }
        
        .node-group.done .node-circle { stroke: var(--green); stroke-width: 2; fill: color-mix(in srgb, var(--green) 10%, transparent); }
        .node-group.queued .node-circle { stroke: var(--amber); stroke-width: 4; stroke-dasharray: 4 2; }
        .node-group.active .node-circle { stroke: var(--accent); stroke-width: 5; fill: var(--accent); }
        .node-group.active .node-text { fill: white; }
        .node-group.selected .node-circle { stroke: var(--amber); stroke-width: 4; }
        .gesture-hint-canvas { position: absolute; bottom: 8px; right: 8px; font-size: 8px; color: var(--text-dim); pointer-events: none; }
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


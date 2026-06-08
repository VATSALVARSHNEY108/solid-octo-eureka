"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = {
  classA: "#378ADD",
  classB: "#D85A30",
  sv: "#7F77DD",
  margin: "#1D9E75",
  hyperplane: "#3d3d3a",
  bg: "var(--color-background-primary)",
  bgSecondary: "var(--color-background-secondary)",
  border: "var(--color-border-tertiary)",
  text: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
};

function dot(a, b) { return a[0]*b[0] + a[1]*b[1]; }
function norm(v) { return Math.sqrt(dot(v,v)); }
function sub(a, b) { return [a[0]-b[0], a[1]-b[1]]; }

function trainLinearSVM(points) {
  if (points.length < 2) return null;
  // local classifier training (not performance-critical)

  const pos = points.filter(p => p.label === 1);
  const neg = points.filter(p => p.label === -1);
  if (pos.length === 0 || neg.length === 0) return null;

  let w = [0, 0], b = 0;
  const lr = 0.01, C = 1, epochs = 800;

  for (let e = 0; e < epochs; e++) {
    for (const p of points) {
      const margin = p.label * (dot(w, [p.x, p.y]) + b);
      if (margin < 1) {
        w[0] = w[0] * (1 - lr) + lr * C * p.label * p.x;
        w[1] = w[1] * (1 - lr) + lr * C * p.label * p.y;
        b += lr * C * p.label;
      } else {
        w[0] *= (1 - lr);
        w[1] *= (1 - lr);
      }
    }
  }

  const n = norm(w);
  if (n < 1e-6) return null;

  const svs = points.filter(p => {
    const margin = p.label * (dot(w, [p.x, p.y]) + b);
    return Math.abs(margin - 1) < 0.4;
  });

  return { w, b, svs, marginWidth: 2 / (n || 1) };
}

function CanvasPlayground({ onModelChange }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState([
    { x: 120, y: 130, label: 1 }, { x: 160, y: 100, label: 1 },
    { x: 100, y: 170, label: 1 }, { x: 140, y: 160, label: 1 },
    { x: 180, y: 140, label: 1 }, { x: 290, y: 230, label: -1 },
    { x: 320, y: 200, label: -1 }, { x: 260, y: 260, label: -1 },
    { x: 310, y: 260, label: -1 }, { x: 280, y: 210, label: -1 },
  ]);
  const [tool, setTool] = useState(1);
  const [model, setModel] = useState<{ w: number[]; b: number; svs: any[]; marginWidth: number } | null>(null);
  const [showMargin, setShowMargin] = useState(true);
  const [showSV, setShowSV] = useState(true);

  useEffect(() => {
    const m = trainLinearSVM(points);
    onModelChange?.(m);
    // keep state in sync (avoid React effect cascade by deferring state update)
    queueMicrotask(() => setModel(m));
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const bgColor = isDark ? "#1a1a18" : "#f8f7f4";
    const textCol = isDark ? "#c2c0b6" : "#3d3d3a";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    if (model && showMargin) {
      const { w, b } = model;
      const n = norm(w);
      const drawLine = (offset, color, dash) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = dash ? 1.5 : 2;
        if (dash) ctx.setLineDash([6, 4]);
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        let drawn = false;
        for (let x = 0; x <= W; x++) {
          if (Math.abs(w[1]) < 1e-6) continue;
          const y = (-(w[0] * x + b - offset) / w[1]);
          if (y >= 0 && y <= H) {
            drawn ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
            drawn = true;
          }
        }
        ctx.stroke();
        ctx.restore();
      };
      drawLine(0, isDark ? "#d3d1c7" : COLORS.hyperplane, false);
      drawLine(1, COLORS.margin, true);
      drawLine(-1, COLORS.margin, true);

      if (showMargin) {
        ctx.save();
        ctx.strokeStyle = COLORS.margin;
        ctx.lineWidth = 0;
        ctx.fillStyle = isDark ? "rgba(29,158,117,0.08)" : "rgba(29,158,117,0.06)";
        ctx.beginPath();
        const pts1: number[][] = [], pts2: number[][] = [];
        for (let x = 0; x <= W; x++) {
          if (Math.abs(w[1]) < 1e-6) continue;
          pts1.push([x, -(w[0]*x + b - 1) / w[1]]);
          pts2.push([x, -(w[0]*x + b + 1) / w[1]]);
        }
        ctx.moveTo(pts1[0][0], pts1[0][1]);
        pts1.forEach(([x,y]) => ctx.lineTo(x,y));
        [...pts2].reverse().forEach(([x,y]) => ctx.lineTo(x,y));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    points.forEach(p => {
      const isSV = model && showSV && model.svs.some(s => s.x === p.x && s.y === p.y);
      const color = p.label === 1 ? COLORS.classA : COLORS.classB;

      if (isSV) {
        ctx.save();
        ctx.strokeStyle = COLORS.sv;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      if (p.label === 1) {
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      } else {
        const s = 6;
        ctx.moveTo(p.x - s, p.y - s);
        ctx.lineTo(p.x + s, p.y - s);
        ctx.lineTo(p.x + s, p.y + s);
        ctx.lineTo(p.x - s, p.y + s);
        ctx.closePath();
      }
      ctx.fill();
    });

    ctx.fillStyle = textCol;
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("click to add points", 10, H - 12);
  }, [points, model, showMargin, showSV]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setPoints(ps => [...ps, { x, y, label: tool }]);
  }, [tool]);

  const handleClear = () => setPoints([]);
  const handleReset = () => setPoints([
    { x: 120, y: 130, label: 1 }, { x: 160, y: 100, label: 1 },
    { x: 100, y: 170, label: 1 }, { x: 140, y: 160, label: 1 },
    { x: 180, y: 140, label: 1 }, { x: 290, y: 230, label: -1 },
    { x: 320, y: 200, label: -1 }, { x: 260, y: 260, label: -1 },
    { x: 310, y: 260, label: -1 }, { x: 280, y: 210, label: -1 },
  ]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: COLORS.textSecondary, marginRight: 4 }}>Add:</span>
        <button
          onClick={() => setTool(1)}
          style={{ fontSize: 13, background: tool === 1 ? COLORS.classA : "transparent",
            color: tool === 1 ? "#fff" : COLORS.classA,
            border: `1.5px solid ${COLORS.classA}`, borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
          ● class A
        </button>
        <button
          onClick={() => setTool(-1)}
          style={{ fontSize: 13, background: tool === -1 ? COLORS.classB : "transparent",
            color: tool === -1 ? "#fff" : COLORS.classB,
            border: `1.5px solid ${COLORS.classB}`, borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
          ■ class B
        </button>
        <div style={{ flex: 1 }} />
        <label style={{ fontSize: 13, color: COLORS.textSecondary, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
          <input type="checkbox" checked={showMargin} onChange={e => setShowMargin(e.target.checked)} />
          margin
        </label>
        <label style={{ fontSize: 13, color: COLORS.textSecondary, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
          <input type="checkbox" checked={showSV} onChange={e => setShowSV(e.target.checked)} />
          support vectors
        </label>
        <button onClick={handleReset} style={{ fontSize: 12, color: COLORS.textSecondary, background: "transparent", border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>reset</button>
        <button onClick={handleClear} style={{ fontSize: 12, color: COLORS.textSecondary, background: "transparent", border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>clear</button>
      </div>
      <canvas
        ref={canvasRef}
        width={420}
        height={320}
        onClick={handleClick}
        style={{ width: "100%", height: "auto", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", cursor: "crosshair", display: "block" }}
      />
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: COLORS.textSecondary }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 20, height: 2, background: COLORS.hyperplane }} /> hyperplane
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 20, height: 2, background: COLORS.margin, borderTop: `2px dashed ${COLORS.margin}` }} /> margin boundary
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", border: `2px solid ${COLORS.sv}`, background: "transparent" }} /> support vector
        </span>
      </div>
    </div>
  );
}

const concepts = [
  {
    id: "what",
    title: "What is SVM?",
    icon: "ti-brain",
    body: `A Support Vector Machine (SVM) is a supervised learning algorithm that finds the optimal boundary between two classes. Unlike algorithms that just find any boundary, SVM specifically hunts for the one with maximum margin — the widest possible "road" between the two groups.`,
    formula: null,
    detail: "The key insight: a wider margin between classes means better generalisation to new data you haven't seen yet.",
  },
  {
    id: "hyperplane",
    title: "The hyperplane",
    icon: "ti-separator",
    body: `In 2D, the decision boundary is a line. In 3D, it's a plane. In higher dimensions, it's called a hyperplane. The hyperplane is defined by a weight vector w and bias b:`,
    formula: "w · x + b = 0",
    detail: "Points where w·x + b > 0 are classified as +1, and where w·x + b < 0 as −1.",
  },
  {
    id: "margin",
    title: "Maximum margin",
    icon: "ti-arrows-horizontal",
    body: `The margin is the distance between the hyperplane and the nearest data points from each class. SVM solves an optimisation problem to maximise this margin:`,
    formula: "maximise  2 / ‖w‖",
    detail: "Equivalently, we minimise ½‖w‖² subject to yᵢ(w·xᵢ + b) ≥ 1 for all training points.",
  },
  {
    id: "sv",
    title: "Support vectors",
    icon: "ti-point",
    body: `Support vectors are the critical data points that sit exactly on the margin boundaries. They are the only points that determine the hyperplane — all other points can be removed and the decision boundary would not change.`,
    formula: "yᵢ(w · xᵢ + b) = 1",
    detail: "This sparsity is why SVMs are efficient: the model is fully described by just a few training examples.",
  },
  {
    id: "kernel",
    title: "The kernel trick",
    icon: "ti-transform",
    body: `When data isn't linearly separable, the kernel trick implicitly maps data into a higher-dimensional space where a linear boundary exists — without ever computing those coordinates explicitly.`,
    formula: "K(xᵢ, xⱼ) = φ(xᵢ) · φ(xⱼ)",
    detail: "Common kernels: linear K(a,b)=a·b, polynomial K(a,b)=(a·b+c)ᵈ, RBF K(a,b)=exp(−γ‖a−b‖²).",
  },
  {
    id: "soft",
    title: "Soft margin (C parameter)",
    icon: "ti-adjustments-horizontal",
    body: `Real data has noise and overlap. Soft-margin SVM introduces a penalty parameter C that controls the tradeoff between maximising margin and allowing misclassifications:`,
    formula: "minimise  ½‖w‖² + C Σ ξᵢ",
    detail: "High C: fewer misclassifications, narrower margin, risks overfitting. Low C: wider margin, allows some errors, better generalisation.",
  },
];

const kernelData = {
  linear: { label: "Linear", desc: "K(a,b) = a·b", color: COLORS.classA },
  poly: { label: "Polynomial", desc: "K(a,b) = (a·b + 1)²", color: COLORS.sv },
  rbf: { label: "RBF / Gaussian", desc: "K(a,b) = exp(−γ‖a−b‖²)", color: COLORS.margin },
};

export default function SVMExplainer() {
  const [activeSection, setActiveSection] = useState("what");
  const [svmModel, setSvmModel] = useState<{ w: number[]; b: number; svs: any[]; marginWidth: number } | null>(null);
  const [activeKernel, setActiveKernel] = useState("linear");

  const active = concepts.find(c => c.id === activeSection) || concepts[0];

  return (
    <div style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)", color: "var(--color-text-primary)", maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>
      <h2 className="sr-only">Support Vector Machine interactive explainer</h2>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: "-0.5px" }}>Support Vector Machines</h1>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", padding: "2px 10px", borderRadius: 20, border: "0.5px solid var(--color-border-tertiary)" }}>interactive</span>
        </div>
        <p style={{ fontSize: 15, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>
          A visual guide to one of the most elegant algorithms in machine learning.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {concepts.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveSection(c.id)}
            style={{
              fontSize: 13, padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              border: activeSection === c.id ? `1.5px solid ${COLORS.sv}` : "0.5px solid var(--color-border-secondary)",
              background: activeSection === c.id ? "#EEEDFE" : "transparent",
              color: activeSection === c.id ? "#3C3489" : "var(--color-text-secondary)",
              fontWeight: activeSection === c.id ? 500 : 400,
              transition: "all 0.15s",
            }}>
            {c.title}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <i className={`ti ${active.icon}`} aria-hidden="true" style={{ fontSize: 20, color: COLORS.sv }} />
          <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{active.title}</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: "0 0 12px", color: "var(--color-text-primary)" }}>{active.body}</p>
        {active.formula && (
          <div style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 16px", fontFamily: "var(--font-mono, monospace)", fontSize: 15, color: COLORS.sv, marginBottom: 12, border: "0.5px solid var(--color-border-tertiary)" }}>
            {active.formula}
          </div>
        )}
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6, borderLeft: `3px solid var(--color-border-secondary)`, paddingLeft: 12, borderRadius: 0 }}>
          {active.detail}
        </p>
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <i className="ti ti-hand-click" aria-hidden="true" style={{ fontSize: 18, color: COLORS.margin }} />
          <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Interactive playground</h3>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 14, lineHeight: 1.5 }}>
          Click the canvas to add data points. Watch the SVM recompute the optimal hyperplane in real time.
        </p>
        <CanvasPlayground onModelChange={setSvmModel} />
        {svmModel && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginTop: 14 }}>
            {[
              { label: "margin width", value: svmModel.marginWidth.toFixed(2) + " px" },
              { label: "support vectors", value: svmModel.svs.length },
              { label: "‖w‖", value: norm(svmModel.w).toFixed(3) },
            ].map(m => (
              <div key={m.label} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4, textTransform: "lowercase" }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <i className="ti ti-transform" aria-hidden="true" style={{ fontSize: 18, color: COLORS.classB }} />
          <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Kernel comparison</h3>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 14 }}>
          Each kernel defines a different way of measuring similarity between points.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
          {Object.entries(kernelData).map(([key, k]) => (
            <div
              key={key}
              onClick={() => setActiveKernel(key)}
              style={{
                padding: "14px", borderRadius: 10, cursor: "pointer",
                border: activeKernel === key ? `2px solid ${k.color}` : "0.5px solid var(--color-border-tertiary)",
                background: "var(--color-background-primary)",
                transition: "border 0.15s",
              }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, color: k.color, background: "var(--color-background-secondary)", padding: "4px 8px", borderRadius: 4 }}>{k.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, background: "var(--color-background-secondary)", borderRadius: 8, padding: "10px 14px" }}>
          {activeKernel === "linear" && "Best for linearly separable data. Fast to train. Interpretable weights. Use when features are already informative."}
          {activeKernel === "poly" && "Captures feature interactions up to degree d. Good for image processing. Sensitive to scaling; requires tuning of degree and coefficient."}
          {activeKernel === "rbf" && "The most popular kernel. Works well in practice for most non-linear problems. Controlled by γ (bandwidth) — high γ = complex boundary, low γ = smooth boundary."}
        </div>
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <i className="ti ti-list-check" aria-hidden="true" style={{ fontSize: 18, color: COLORS.classA }} />
          <h3 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>When to use SVM</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, overflow: "hidden" }}>
          {[
            { label: "High-dimensional data", good: true, note: "text, genomics" },
            { label: "Very large datasets", good: false, note: "training is O(n²–n³)" },
            { label: "Clear margin of separation", good: true, note: "works beautifully" },
            { label: "Heavy class overlap", good: false, note: "use boosting instead" },
            { label: "Non-linear boundaries", good: true, note: "with RBF kernel" },
            { label: "Need probability output", good: false, note: "requires Platt scaling" },
            { label: "Small/medium datasets", good: true, note: "generalises well" },
            { label: "Streaming/online data", good: false, note: "not naturally online" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", fontSize: 13,
              background: i % 2 === 0 ? "var(--color-background-primary)" : "var(--color-background-secondary)",
              borderBottom: i < 6 ? "0.5px solid var(--color-border-tertiary)" : "none",
            }}>
              <i className={`ti ${row.good ? "ti-check" : "ti-x"}`} aria-hidden="true"
                style={{ fontSize: 14, color: row.good ? "#1D9E75" : "#D85A30", flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{row.label}</span>
              <span style={{ color: "var(--color-text-secondary)", fontSize: 11 }}>{row.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "1.25rem 1.5rem", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <i className="ti ti-info-circle" aria-hidden="true" style={{ fontSize: 16, marginTop: 2, flexShrink: 0 }} />
        <span>
          The playground above trains a linear SVM using stochastic gradient descent (hinge loss + L2 regularisation). Purple rings mark support vectors. The green band shows the margin. Add overlapping points to see how the boundary adapts.
        </span>
      </div>
    </div>
  );
}
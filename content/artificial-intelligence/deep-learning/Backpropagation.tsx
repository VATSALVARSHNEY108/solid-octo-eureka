"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Layers, Code, Play, Pause, RotateCcw, ArrowRight, TrendingDown } from "lucide-react";

// ---------- Tiny neural net: 2 -> 3 -> 1 with sigmoid ----------
type Net = {
  W1: number[][]; // [3][2]
  b1: number[];   // [3]
  W2: number[][]; // [1][3]
  b2: number[];   // [1]
};

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

function randNet(seed = 1): Net {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return (s / 233280 - 0.5) * 2;
  };
  return {
    W1: [[rand(), rand()], [rand(), rand()], [rand(), rand()]],
    b1: [rand() * 0.1, rand() * 0.1, rand() * 0.1],
    W2: [[rand(), rand(), rand()]],
    b2: [rand() * 0.1],
  };
}

const DATA: { x: [number, number]; y: number }[] = [
  { x: [0, 0], y: 0 },
  { x: [0, 1], y: 1 },
  { x: [1, 0], y: 1 },
  { x: [1, 1], y: 0 },
];

type Pass = {
  x: [number, number];
  y: number;
  z1: number[];
  a1: number[];
  z2: number;
  a2: number;
  loss: number;
  dW1: number[][];
  db1: number[];
  dW2: number[][];
  db2: number[];
};

function forwardBackward(net: Net, x: [number, number], y: number): Pass {
  const z1 = [0, 0, 0];
  const a1 = [0, 0, 0];
  for (let j = 0; j < 3; j++) {
    z1[j] = net.W1[j][0] * x[0] + net.W1[j][1] * x[1] + net.b1[j];
    a1[j] = sigmoid(z1[j]);
  }
  let z2 = net.b2[0];
  for (let j = 0; j < 3; j++) z2 += net.W2[0][j] * a1[j];
  const a2 = sigmoid(z2);
  const loss = 0.5 * (a2 - y) ** 2;

  // backward (MSE + sigmoid)
  const dL_dz2 = (a2 - y) * a2 * (1 - a2);
  const dW2 = [[0, 0, 0]];
  const db2 = [dL_dz2];
  for (let j = 0; j < 3; j++) dW2[0][j] = dL_dz2 * a1[j];

  const dW1 = [[0, 0], [0, 0], [0, 0]];
  const db1 = [0, 0, 0];
  for (let j = 0; j < 3; j++) {
    const dL_da1 = dL_dz2 * net.W2[0][j];
    const dL_dz1 = dL_da1 * a1[j] * (1 - a1[j]);
    db1[j] = dL_dz1;
    dW1[j][0] = dL_dz1 * x[0];
    dW1[j][1] = dL_dz1 * x[1];
  }

  return { x, y, z1, a1, z2, a2, loss, dW1, db1, dW2, db2 };
}

function applyGrads(net: Net, p: Pass, lr: number): Net {
  const W1 = net.W1.map((row, j) => row.map((w, i) => w - lr * p.dW1[j][i]));
  const b1 = net.b1.map((b, j) => b - lr * p.db1[j]);
  const W2 = [net.W2[0].map((w, j) => w - lr * p.dW2[0][j])];
  const b2 = [net.b2[0] - lr * p.db2[0]];
  return { W1, b1, W2, b2 };
}

type Phase = "idle" | "forward" | "loss" | "backward" | "update";

export default function Backpropagation() {
  const [net, setNet] = useState<Net>(() => randNet(7));
  const [sampleIdx, setSampleIdx] = useState(0);
  const [lr, setLr] = useState(1.5);
  const [phase, setPhase] = useState<Phase>("idle");
  const [playing, setPlaying] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const sample = DATA[sampleIdx];
  const pass = useMemo(() => forwardBackward(net, sample.x, sample.y), [net, sample]);

  // total loss across dataset
  const totalLoss = useMemo(
    () => DATA.reduce((acc, d) => acc + forwardBackward(net, d.x, d.y).loss, 0),
    [net]
  );

  const stepRef = useRef<number | null>(null);

  const advance = useCallback(() => {
    setPhase((p) => {
      if (p === "idle") return "forward";
      if (p === "forward") return "loss";
      if (p === "loss") return "backward";
      if (p === "backward") return "update";
      
      setNet((n) => applyGrads(n, pass, lr));
      setSampleIdx((i) => {
        const next = (i + 1) % DATA.length;
        if (next === 0) {
          setEpoch((e) => e + 1);
          setHistory((h) => [...h.slice(-99), totalLoss]);
        }
        return next;
      });
      return "idle";
    });
  }, [pass, lr, totalLoss]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(advance, 800);
    stepRef.current = id;
    return () => window.clearInterval(id);
  }, [playing, advance]);

  const reset = () => {
    setPlaying(false);
    setNet(randNet(Math.floor(Math.random() * 1000) + 1));
    setSampleIdx(0);
    setPhase("idle");
    setEpoch(0);
    setHistory([]);
  };

  const trainFast = () => {
    let n = net;
    const hist: number[] = [...history];
    for (let e = 0; e < 200; e++) {
      for (const d of DATA) {
        const p = forwardBackward(n, d.x, d.y);
        n = applyGrads(n, p, lr);
      }
      const tl = DATA.reduce((a, d) => a + forwardBackward(n, d.x, d.y).loss, 0);
      hist.push(tl);
    }
    setNet(n);
    setHistory(hist.slice(-200));
    setEpoch((e) => e + 200);
  };

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
          Backpropagation
        </h1>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
          Backpropagation computes the gradient of the loss function with respect to the weights of the network. Below is an interactive sandbox visualizing forward activations, backward error gradients, and real-time updates while learning the XOR function.
        </p>
      </motion.div>

      {/* Main Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-[var(--text-primary)]" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Sandbox Controls</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={advance}
                className="flex-1 min-w-[70px] px-3 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                Step
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="flex-1 min-w-[70px] px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-secondary)] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={trainFast}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-secondary)] transition-all"
              >
                Quick Train (200 Epochs)
              </button>
              <button
                onClick={reset}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Net
              </button>
            </div>

            <div>
              <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-1">
                <span>Learning Rate (η)</span>
                <span className="font-mono text-[var(--text-primary)] font-semibold">{lr.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={5}
                step={0.1}
                value={lr}
                onChange={(e) => setLr(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl p-3">
                <div className="text-xs text-[var(--text-secondary)]">Epoch</div>
                <div className="text-xl font-bold text-[var(--text-primary)]">{epoch}</div>
              </div>
              <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl p-3">
                <div className="text-xs text-[var(--text-secondary)]">Total Loss</div>
                <div className="text-xl font-bold text-[var(--text-primary)] font-mono">{totalLoss.toFixed(4)}</div>
              </div>
            </div>
          </div>

          {/* XOR Training Data Selector */}
          <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">XOR Training Set</h3>
            <div className="flex flex-col gap-2">
              {DATA.map((d, i) => {
                const p = forwardBackward(net, d.x, d.y);
                const active = i === sampleIdx;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setPlaying(false);
                      setPhase("idle");
                      setSampleIdx(i);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      active
                        ? "border-[var(--text-primary)] bg-[var(--bg-primary)] font-semibold"
                        : "border-[var(--border-primary)] hover:bg-[var(--bg-primary)]"
                    }`}
                  >
                    <div className="flex gap-3 text-sm font-mono text-[var(--text-secondary)]">
                      <span>Input: ({d.x[0]}, {d.x[1]})</span>
                      <span>Target: {d.y}</span>
                    </div>
                    <div className="text-sm font-mono text-[var(--text-primary)]">
                      Out: {p.a2.toFixed(3)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Neural Network SVG and Sandbox Status Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col justify-between h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Computation Network Graph</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                phase === "idle" ? "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]" :
                phase === "forward" ? "bg-sky-500/10 text-sky-500 border border-sky-500/20" :
                phase === "loss" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                phase === "backward" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              }`}>
                {phase === "idle" ? "Idle / Ready" :
                 phase === "forward" ? "1. Forward Activation" :
                 phase === "loss" ? "2. Calculate Loss" :
                 phase === "backward" ? "3. Backward Propagate" :
                 "4. Gradient Update"}
              </span>
            </div>

            {/* Neural Net Diagram SVG */}
            <div className="flex items-center justify-center p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] flex-grow">
              <NetworkSvg net={net} pass={pass} phase={phase} />
            </div>

            {/* Network Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--text-secondary)] border-t border-[var(--border-primary)] pt-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-sky-500 inline-block" />
                Positive Weight
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-500 inline-block" />
                Negative Weight
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                Positive Gradient
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                Negative Gradient
              </span>
              <span className="font-mono ml-auto">Thickness = Magnitude</span>
            </div>
          </div>
        </div>

      </div>

      {/* Explanatory Walkthrough Block */}
      <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <Explanation phase={phase} pass={pass} lr={lr} />
      </div>

    </div>
  );
}

function NetworkSvg({
  net,
  pass,
  phase,
}: {
  net: Net;
  pass: Pass;
  phase: Phase;
}) {
  const W = 700;
  const H = 360;
  const inX = 100;
  const hidX = W / 2;
  const outX = W - 100;
  
  const inputs = [
    { x: inX, y: 110, label: "x₁", val: pass.x[0] },
    { x: inX, y: 250, label: "x₂", val: pass.x[1] },
  ];
  
  const hidden = pass.a1.map((a, i) => ({
    x: hidX,
    y: 60 + i * 120,
    label: `h${i + 1}`,
    val: a,
  }));
  
  const output = { x: outX, y: 180, label: "ŷ", val: pass.a2 };

  const showForward = phase === "forward" || phase === "loss" || phase === "update";
  const showBackward = phase === "backward" || phase === "update";

  const getEdgeStyle = (w: number, grad: number) => {
    if (showBackward) {
      const positive = grad >= 0;
      const color = positive ? "rgb(244 63 94)" : "rgb(16 185 129)"; // rose or emerald
      const width = 1 + Math.min(8, Math.abs(grad) * 25);
      return { stroke: color, strokeWidth: width };
    }
    const positive = w >= 0;
    const color = positive ? "rgb(56 189 248)" : "rgb(100 116 139)"; // sky or slate
    const width = 1 + Math.min(5, Math.abs(w) * 1.5);
    return { stroke: color, strokeWidth: width };
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-h-[360px]">
      {/* input to hidden connections */}
      {hidden.map((h, j) =>
        inputs.map((inp, i) => {
          const w = net.W1[j][i];
          const g = pass.dW1[j][i];
          const style = getEdgeStyle(w, g);
          return (
            <line
              key={`e1-${j}-${i}`}
              x1={inp.x}
              y1={inp.y}
              x2={h.x}
              y2={h.y}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
              className="transition-all duration-300 opacity-80"
            />
          );
        })
      )}

      {/* hidden to output connections */}
      {hidden.map((h, j) => {
        const w = net.W2[0][j];
        const g = pass.dW2[0][j];
        const style = getEdgeStyle(w, g);
        return (
          <line
            key={`e2-${j}`}
            x1={h.x}
            y1={h.y}
            x2={output.x}
            y2={output.y}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
            className="transition-all duration-300 opacity-80"
          />
        );
      })}

      {/* Animated signals flow */}
      {showForward && (
        <>
          <FlowArrow from={inputs[0]} to={hidden[0]} color="rgb(56 189 248)" />
          <FlowArrow from={hidden[0]} to={output} color="rgb(56 189 248)" />
        </>
      )}
      {showBackward && (
        <>
          <FlowArrow from={output} to={hidden[1]} color="rgb(244 63 94)" />
          <FlowArrow from={hidden[1]} to={inputs[1]} color="rgb(244 63 94)" />
        </>
      )}

      {/* Node elements */}
      {inputs.map((n, i) => (
        <Node key={`in-${i}`} {...n} highlight={showForward} />
      ))}
      {hidden.map((n, i) => (
        <Node key={`hid-${i}`} {...n} highlight={showForward} />
      ))}
      <Node {...output} highlight={showForward} />

      {/* Target details labels */}
      <g transform={`translate(${outX + 45}, ${output.y - 30})`}>
        <rect width="80" height="60" rx="6" fill="var(--bg-secondary)" stroke="var(--border-primary)" />
        <text x="40" y="20" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">TARGET</text>
        <text x="40" y="42" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold" className="font-mono">{pass.y}</text>
      </g>
    </svg>
  );
}

function Node({
  x,
  y,
  label,
  val,
  highlight,
}: {
  x: number;
  y: number;
  label: string;
  val: number;
  highlight: boolean;
}) {
  const intensity = Math.max(0, Math.min(1, val));
  const fill = highlight
    ? `rgba(99, 102, 241, ${0.1 + intensity * 0.75})`
    : "var(--bg-primary)";
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={28}
        fill={fill}
        stroke="var(--border-primary)"
        strokeWidth={2}
        className="transition-all duration-300"
      />
      <text
        x={x}
        y={y - 2}
        textAnchor="middle"
        fill="var(--text-primary)"
        fontWeight="bold"
        fontSize="12"
      >
        {label}
      </text>
      <text
        x={x}
        y={y + 14}
        textAnchor="middle"
        fill="var(--text-secondary)"
        className="font-mono"
        fontSize="10"
      >
        {val.toFixed(2)}
      </text>
    </g>
  );
}

function FlowArrow({
  from,
  to,
  color,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
}) {
  return (
    <circle r={5} fill={color}>
      <animateMotion
        dur="1.2s"
        repeatCount="indefinite"
        path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
      />
    </circle>
  );
}

function Explanation({ phase, pass, lr }: { phase: Phase; pass: Pass; lr: number }) {
  const blocks: Record<Phase, { title: string; desc: string; math: string }> = {
    idle: {
      title: "Understanding Neural Learning Graph",
      desc: "Our neural network is built with a standard 2 input nodes, 3 hidden neurons, and 1 output neuron layout. Step through the stages to inspect the complete network updates in real-time.",
      math: "Epoch = dataset cycles. Loss = error size.",
    },
    forward: {
      title: "Stage 1: Forward Activation Pass",
      desc: "Values flow forward from input units. Hidden units aggregate inputs using weights and biases (z = Σ wᵢxᵢ + b) and feed into a sigmoid non-linear function (a = σ(z)) to produce hidden states.",
      math: `ŷ = σ(z₂) = ${pass.a2.toFixed(4)}`,
    },
    loss: {
      title: "Stage 2: Measure Prediction Cost",
      desc: "We measure cost comparing model output (ŷ) with ground target truth (y) via Mean Squared Error. This cost indicates aggregate performance penalty.",
      math: `L = ½(ŷ − y)² = ½(${pass.a2.toFixed(3)} - ${pass.y})² = ${pass.loss.toFixed(4)}`,
    },
    backward: {
      title: "Stage 3: Backward Gradient Propagation",
      desc: "We propagate the error cost backward using calculus' Chain Rule. Weights are analyzed relative to gradient contribution (∂L/∂w) to decide structural adjustments.",
      math: "∂L/∂w = ∂L/∂ŷ · ∂ŷ/∂z · ∂z/∂w",
    },
    update: {
      title: "Stage 4: Update Parameters",
      desc: "Gradient parameters are shifted opposite to their slope using learning rate (η) to reduce net error dynamically.",
      math: `w ← w − η · ∂L/∂w (η = ${lr.toFixed(2)})`,
    },
  };

  const active = blocks[phase];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <TrendingDown className="w-5 h-5 text-[var(--text-primary)]" />
        <h3 className="text-xl font-bold text-[var(--text-primary)]">{active.title}</h3>
      </div>
      <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
        {active.desc}
      </p>
      <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] p-4 rounded-xl font-mono text-sm text-[var(--text-primary)] mt-2">
        {active.math}
      </div>
    </div>
  );
}

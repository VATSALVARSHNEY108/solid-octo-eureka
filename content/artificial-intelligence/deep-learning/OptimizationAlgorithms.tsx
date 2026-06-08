"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type OptimizerId = "gd" | "momentum" | "rmsprop" | "adam";

type OptimParams = {
  lr: number;
  momentum: number; // beta (momentum)
  beta1: number;
  beta2: number;
  epsilon: number;
  rho: number; // RMSProp decay
};

type SurfaceId = "rosenbrock" | "saddle" | "waves";

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fmt(x: number, digits = 3) {
  if (!Number.isFinite(x)) return "∞";
  return x.toFixed(digits);
}

function surfaceFn(surface: SurfaceId, x: number, y: number) {
  // Keep values in a sane range for visualization (not for "correct" scaling).
  if (surface === "rosenbrock") {
    // Classic narrow valley. Global min at (1,1).
    const a = 1;
    const b = 40;
    const t1 = a - x;
    const t2 = y - x * x;
    return t1 * t1 + b * t2 * t2;
  }
  if (surface === "saddle") {
    // A simple saddle with mild quartic to keep it bounded.
    return 0.6 * (x * x - y * y) + 0.08 * (x ** 4 + y ** 4);
  }
  // "waves"
  const r2 = x * x + y * y;
  return 0.9 * Math.sin(2.2 * x) * Math.cos(2.0 * y) + 0.12 * r2;
}

function gradFn(surface: SurfaceId, x: number, y: number) {
  if (surface === "rosenbrock") {
    const a = 1;
    const b = 40;
    const dx = -2 * (a - x) - 4 * b * x * (y - x * x);
    const dy = 2 * b * (y - x * x);
    return { dx, dy };
  }
  if (surface === "saddle") {
    const dx = 1.2 * x + 0.32 * x ** 3;
    const dy = -1.2 * y + 0.32 * y ** 3;
    return { dx, dy };
  }
  // waves
  const dx = 0.9 * 2.2 * Math.cos(2.2 * x) * Math.cos(2.0 * y) + 0.24 * x;
  const dy = 0.9 * (-2.0) * Math.sin(2.2 * x) * Math.sin(2.0 * y) + 0.24 * y;
  return { dx, dy };
}

function stepOptimizer(
  opt: OptimizerId,
  params: OptimParams,
  state: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    sx: number;
    sy: number;
    mx: number;
    my: number;
    t: number;
  },
  grad: { dx: number; dy: number }
) {
  const lr = params.lr;
  const eps = params.epsilon;

  // Keep gradients from exploding the viz.
  const gdx = clamp(grad.dx, -50, 50);
  const gdy = clamp(grad.dy, -50, 50);

  if (opt === "gd") {
    return {
      ...state,
      x: state.x - lr * gdx,
      y: state.y - lr * gdy,
      t: state.t + 1,
    };
  }

  if (opt === "momentum") {
    const beta = params.momentum;
    const vx = beta * state.vx + (1 - beta) * gdx;
    const vy = beta * state.vy + (1 - beta) * gdy;
    return {
      ...state,
      vx,
      vy,
      x: state.x - lr * vx,
      y: state.y - lr * vy,
      t: state.t + 1,
    };
  }

  if (opt === "rmsprop") {
    const rho = params.rho;
    const sx = rho * state.sx + (1 - rho) * (gdx * gdx);
    const sy = rho * state.sy + (1 - rho) * (gdy * gdy);
    return {
      ...state,
      sx,
      sy,
      x: state.x - (lr * gdx) / (Math.sqrt(sx) + eps),
      y: state.y - (lr * gdy) / (Math.sqrt(sy) + eps),
      t: state.t + 1,
    };
  }

  // adam
  const b1 = params.beta1;
  const b2 = params.beta2;
  const t = state.t + 1;
  const mx = b1 * state.mx + (1 - b1) * gdx;
  const my = b1 * state.my + (1 - b1) * gdy;
  const sx = b2 * state.sx + (1 - b2) * (gdx * gdx);
  const sy = b2 * state.sy + (1 - b2) * (gdy * gdy);
  const mhatx = mx / (1 - Math.pow(b1, t));
  const mhaty = my / (1 - Math.pow(b1, t));
  const shatx = sx / (1 - Math.pow(b2, t));
  const shaty = sy / (1 - Math.pow(b2, t));

  return {
    ...state,
    t,
    mx,
    my,
    sx,
    sy,
    x: state.x - (lr * mhatx) / (Math.sqrt(shatx) + eps),
    y: state.y - (lr * mhaty) / (Math.sqrt(shaty) + eps),
  };
}

function useResizeObserver<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setSize({ w: Math.round(cr.width), h: Math.round(cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, size };
}

function Card({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          {eyebrow ? (
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-4 text-[var(--text-secondary)]">{children}</div>
    </section>
  );
}

function InlineDiagram() {
  return (
    <svg
      viewBox="0 0 960 320"
      className="h-auto w-full"
      role="img"
      aria-label="Gradient descent intuition diagram"
    >
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#f6f6f6" stopOpacity="1" />
        </linearGradient>
        <marker
          id="arrow"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" fill="#111111" />
        </marker>
      </defs>

      <rect x="0" y="0" width="960" height="320" fill="url(#bg)" />

      <path
        d="M60 260 C 200 40, 320 40, 420 180 C 520 320, 700 320, 900 110"
        fill="none"
        stroke="#111111"
        strokeWidth="3"
      />

      <circle cx="170" cy="165" r="8" fill="#111111" />
      <circle cx="245" cy="125" r="8" fill="#111111" />
      <circle cx="320" cy="125" r="8" fill="#111111" />
      <circle cx="395" cy="160" r="8" fill="#111111" />

      <path
        d="M170 165 L 240 130"
        stroke="#111111"
        strokeWidth="3"
        markerEnd="url(#arrow)"
      />
      <path
        d="M245 125 L 315 125"
        stroke="#111111"
        strokeWidth="3"
        markerEnd="url(#arrow)"
      />
      <path
        d="M320 125 L 390 155"
        stroke="#111111"
        strokeWidth="3"
        markerEnd="url(#arrow)"
      />

      <path
        d="M170 165 L 170 105"
        stroke="#777777"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      <path
        d="M245 125 L 245 85"
        stroke="#777777"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      <path
        d="M320 125 L 320 85"
        stroke="#777777"
        strokeWidth="2"
        strokeDasharray="6 6"
      />

      <text
        x="60"
        y="44"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#111111"
      >
        loss
      </text>
      <text
        x="894"
        y="286"
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#111111"
      >
        parameters
      </text>

      <text
        x="520"
        y="70"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="13"
        fill="#333333"
      >
        Each step moves opposite the gradient (downhill)
      </text>
    </svg>
  );
}

function Simulator() {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [surface, setSurface] = useState<SurfaceId>("rosenbrock");
  const [optimizer, setOptimizer] = useState<OptimizerId>("adam");
  const [stepsPerSecond, setStepsPerSecond] = useState(30);
  const [playing, setPlaying] = useState(true);

  const [params, setParams] = useState<OptimParams>({
    lr: 0.02,
    momentum: 0.9,
    beta1: 0.9,
    beta2: 0.999,
    rho: 0.9,
    epsilon: 1e-8,
  });

  const bounds = useMemo(() => {
    if (surface === "rosenbrock") return { x0: -2, x1: 2, y0: -1, y1: 3 };
    if (surface === "saddle") return { x0: -2.5, x1: 2.5, y0: -2.5, y1: 2.5 };
    return { x0: -3, x1: 3, y0: -3, y1: 3 };
  }, [surface]);

  const [state, setState] = useState(() => ({
    x: surface === "rosenbrock" ? -1.2 : -2.2,
    y: surface === "rosenbrock" ? 1.0 : 1.6,
    vx: 0,
    vy: 0,
    sx: 0,
    sy: 0,
    mx: 0,
    my: 0,
    t: 0,
  }));

  const historyRef = useRef<Array<{ x: number; y: number }>>([]);

  // Reset when surface changes (keep it deterministic-ish).
  useEffect(() => {
    const next = {
      x: surface === "rosenbrock" ? -1.2 : -2.2,
      y: surface === "rosenbrock" ? 1.0 : 1.6,
      vx: 0,
      vy: 0,
      sx: 0,
      sy: 0,
      mx: 0,
      my: 0,
      t: 0,
    };
    historyRef.current = [{ x: next.x, y: next.y }];
    setState(next);
  }, [surface]);

  // Draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(320, size.w || 0);
    const h = Math.max(320, Math.round(w * 0.7));

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Heatmap background.
    const cols = 120;
    const rows = Math.round((cols * h) / w);
    const cellW = w / cols;
    const cellH = h / rows;

    // Precompute min/max (rough) for color mapping.
    let minV = Infinity;
    let maxV = -Infinity;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = lerp(bounds.x0, bounds.x1, i / (cols - 1));
        const y = lerp(bounds.y0, bounds.y1, j / (rows - 1));
        const v = surfaceFn(surface, x, y);
        minV = Math.min(minV, v);
        maxV = Math.max(maxV, v);
      }
    }

    // Tone-map for nicer contrast.
    const tone = (v: number) => {
      const t = (v - minV) / (maxV - minV + 1e-9);
      return Math.pow(clamp(t, 0, 1), 0.55);
    };

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = lerp(bounds.x0, bounds.x1, i / (cols - 1));
        const y = lerp(bounds.y0, bounds.y1, j / (rows - 1));
        const v = surfaceFn(surface, x, y);
        const t = tone(v);
        const c = Math.round(255 - t * 200);
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        ctx.fillRect(i * cellW, j * cellH, cellW + 0.5, cellH + 0.5);
      }
    }

    // Axes border
    ctx.strokeStyle = "rgba(17,17,17,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

    // Path.
    const toPx = (x: number, y: number) => {
      const px = ((x - bounds.x0) / (bounds.x1 - bounds.x0)) * w;
      const py = ((y - bounds.y0) / (bounds.y1 - bounds.y0)) * h;
      return { px, py };
    };

    const hist = historyRef.current;
    if (hist.length >= 2) {
      ctx.beginPath();
      hist.forEach((p, idx) => {
        const { px, py } = toPx(p.x, p.y);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = "#111111";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Faint trail dots for readability.
      ctx.fillStyle = "rgba(17,17,17,0.28)";
      for (let k = 0; k < hist.length; k += Math.max(1, Math.floor(hist.length / 70))) {
        const { px, py } = toPx(hist[k].x, hist[k].y);
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Current point.
    const { px, py } = toPx(state.x, state.y);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Caption.
    const loss = surfaceFn(surface, state.x, state.y);
    ctx.fillStyle = "rgba(17,17,17,0.85)";
    ctx.font =
      "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    ctx.fillText(
      `x=${fmt(state.x, 3)}  y=${fmt(state.y, 3)}  loss=${fmt(loss, 3)}`,
      12,
      20
    );
  }, [bounds, size.w, surface, state.x, state.y]);

  // Step loop.
  useEffect(() => {
    if (!playing) return;
    const intervalMs = Math.max(10, Math.round(1000 / stepsPerSecond));
    const timer = window.setInterval(() => {
      setState((prev) => {
        const grad = gradFn(surface, prev.x, prev.y);
        const next = stepOptimizer(optimizer, params, prev, grad);

        historyRef.current.push({ x: next.x, y: next.y });
        if (historyRef.current.length > 240) historyRef.current.shift();

        return next;
      });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [optimizer, params, playing, stepsPerSecond, surface]);

  const reset = () => {
    const next = {
      x: surface === "rosenbrock" ? -1.2 : -2.2,
      y: surface === "rosenbrock" ? 1.0 : 1.6,
      vx: 0,
      vy: 0,
      sx: 0,
      sy: 0,
      mx: 0,
      my: 0,
      t: 0,
    };
    historyRef.current = [{ x: next.x, y: next.y }];
    setState(next);
  };

  const Slider = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    mono,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    mono?: boolean;
  }) => (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
        {label}
      </div>
      <input
        className="w-full accent-black"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div
        className={`w-16 shrink-0 text-right text-xs ${
          mono ? "font-mono" : ""
        } text-[var(--text-secondary)]`}
      >
        {value < 0.001 ? value.toExponential(1) : fmt(value, 3)}
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div ref={ref} className="border border-[var(--border-primary)] bg-white">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="grid gap-4">
        <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            Simulator
          </div>
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["rosenbrock", "Rosenbrock"],
                  ["saddle", "Saddle"],
                  ["waves", "Waves"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setSurface(id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    surface === id
                      ? "border-black bg-black text-white"
                      : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(
                [
                  ["gd", "GD"],
                  ["momentum", "Momentum"],
                  ["rmsprop", "RMSProp"],
                  ["adam", "Adam"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setOptimizer(id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    optimizer === id
                      ? "border-black bg-black text-white"
                      : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <Slider
                label="learning rate"
                value={params.lr}
                min={0.001}
                max={0.12}
                step={0.001}
                mono
                onChange={(lr) => setParams((p) => ({ ...p, lr }))}
              />
              {optimizer === "momentum" ? (
                <Slider
                  label="momentum"
                  value={params.momentum}
                  min={0.0}
                  max={0.99}
                  step={0.01}
                  mono
                  onChange={(momentum) =>
                    setParams((p) => ({ ...p, momentum }))
                  }
                />
              ) : null}
              {optimizer === "rmsprop" ? (
                <Slider
                  label="rho"
                  value={params.rho}
                  min={0.5}
                  max={0.99}
                  step={0.01}
                  mono
                  onChange={(rho) => setParams((p) => ({ ...p, rho }))}
                />
              ) : null}
              {optimizer === "adam" ? (
                <>
                  <Slider
                    label="beta1"
                    value={params.beta1}
                    min={0.5}
                    max={0.99}
                    step={0.01}
                    mono
                    onChange={(beta1) => setParams((p) => ({ ...p, beta1 }))}
                  />
                  <Slider
                    label="beta2"
                    value={params.beta2}
                    min={0.8}
                    max={0.999}
                    step={0.001}
                    mono
                    onChange={(beta2) => setParams((p) => ({ ...p, beta2 }))}
                  />
                </>
              ) : null}
              <Slider
                label="speed"
                value={stepsPerSecond}
                min={5}
                max={90}
                step={1}
                onChange={setStepsPerSecond}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setPlaying((v) => !v)}
                className="rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white"
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={reset}
                className="rounded-md border border-[var(--border-primary)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  historyRef.current = historyRef.current.slice(-1);
                }}
                className="rounded-md border border-[var(--border-primary)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                Clear path
              </button>
            </div>

            <div className="mt-4 text-xs text-[var(--text-tertiary)]">
              Tip: Rosenbrock has a narrow valley. Momentum and Adam usually
              track it better than plain GD.
            </div>
          </div>
        </div>

        <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            What You’re Seeing
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            The grayscale background is the loss surface. Darker is lower loss.
            The white dot is the current parameter point (x, y). The black line
            is the trajectory created by the optimizer update rule.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OptimizationAlgorithms() {
  return (
    <section className="w-full px-12 py-24">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10">
        <header className="grid gap-4">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
            Deep Learning • Optimization
          </div>
          <h1 className="text-balance text-4xl font-semibold text-[var(--text-primary)] md:text-5xl">
            Optimization Algorithms
          </h1>
          <p className="max-w-[70ch] text-pretty text-lg text-[var(--text-secondary)]">
            Training a neural network is an optimization problem: find weights
            that minimize a loss. This page explains the core idea behind
            gradient descent and why Momentum, RMSProp, and Adam became
            practical defaults.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="The Core Loop" eyebrow="Idea">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                You pick parameters <code>θ</code> (weights). The model produces
                predictions. The loss <code>L(θ)</code> measures how wrong those
                predictions are.
              </p>
              <p>
                Optimization repeatedly updates parameters to reduce loss:
                <span className="mt-2 block rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-xs text-[var(--text-primary)]">
                  θ ← θ − α · ∇θ L(θ)
                </span>
              </p>
              <p>
                Here, <code>α</code> is the learning rate and{" "}
                <code>∇θ L</code> is the gradient: the direction of steepest
                increase. We step opposite it to go downhill.
              </p>
            </div>
          </Card>

          <Card title="Why Optimizers Exist" eyebrow="Problem">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Real loss landscapes are noisy, ill-conditioned, and full of
                narrow valleys. Plain gradient descent can:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>zig-zag in narrow valleys</li>
                <li>stall when gradients vanish</li>
                <li>diverge when gradients spike</li>
                <li>need painful learning-rate tuning</li>
              </ul>
              <p>
                Optimizers modify the update rule to stabilize steps and
                accelerate progress.
              </p>
            </div>
          </Card>
        </div>

        <Card title="One Diagram, One Intuition" eyebrow="Diagram">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div className="overflow-hidden rounded-md border border-[var(--border-primary)] bg-white">
              <InlineDiagram />
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                The gradient points uphill. The optimizer chooses a direction
                and step size to move downhill.
              </p>
              <p>
                Momentum adds “inertia” so updates keep going in consistent
                directions.
              </p>
              <p>
                RMSProp and Adam adapt learning rates per-parameter using
                running statistics of gradient magnitudes.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Interactive Simulator" eyebrow="Hands-On">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              Compare how different optimizers move on the same loss surface.
              Start with Rosenbrock, then try Saddle or Waves. Watch for
              zig-zagging, overshoot, and stabilization.
            </p>
            <Simulator />
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="When To Use What" eyebrow="Practical">
            <div className="space-y-3 text-sm leading-relaxed">
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <span className="font-medium text-[var(--text-primary)]">
                    GD
                  </span>
                  : best for teaching; rarely used alone at scale.
                </li>
                <li>
                  <span className="font-medium text-[var(--text-primary)]">
                    Momentum
                  </span>
                  : great default for smooth objectives; common in vision.
                </li>
                <li>
                  <span className="font-medium text-[var(--text-primary)]">
                    RMSProp
                  </span>
                  : stable for non-stationary / noisy gradients; classic for
                  RNNs.
                </li>
                <li>
                  <span className="font-medium text-[var(--text-primary)]">
                    Adam
                  </span>
                  : strong “it just works” baseline; great for transformers and
                  prototyping.
                </li>
              </ul>
            </div>
          </Card>

          <Card title="Common Pitfalls" eyebrow="Tuning">
            <div className="space-y-3 text-sm leading-relaxed">
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Learning rate too high: loss explodes (trajectory shoots out).
                </li>
                <li>
                  Learning rate too low: training crawls (tiny steps).
                </li>
                <li>
                  Adam with too-large lr can look stable but generalize worse.
                </li>
                <li>
                  Momentum too high can overshoot; too low behaves like GD.
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

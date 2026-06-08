"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LossId = "mse" | "mae" | "huber" | "bce" | "ce";

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function fmt(x: number, digits = 3) {
  if (!Number.isFinite(x)) return "∞";
  return x.toFixed(digits);
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function softmax(logits: number[]) {
  const max = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / (sum || 1));
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
      {eyebrow ? (
        <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
      <div className="mt-4 text-[var(--text-secondary)]">{children}</div>
    </section>
  );
}

function InlineLossDiagram() {
  return (
    <svg
      viewBox="0 0 960 320"
      className="h-auto w-full"
      role="img"
      aria-label="Loss function shapes diagram"
    >
      <rect x="0" y="0" width="960" height="320" fill="#ffffff" />
      <path
        d="M70 270 H 920"
        stroke="rgba(17,17,17,0.35)"
        strokeWidth="2"
      />
      <path
        d="M495 40 V 285"
        stroke="rgba(17,17,17,0.18)"
        strokeWidth="2"
        strokeDasharray="6 8"
      />

      <text
        x="70"
        y="40"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#111111"
      >
        loss
      </text>
      <text
        x="920"
        y="300"
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#111111"
      >
        error (prediction − target)
      </text>

      {/* MSE: quadratic */}
      <path
        d="M120 270 C 250 270, 360 160, 495 70 C 630 160, 740 270, 870 270"
        fill="none"
        stroke="#111111"
        strokeWidth="3"
      />
      <text
        x="140"
        y="86"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="#111111"
      >
        MSE (quadratic)
      </text>

      {/* MAE: V-shape */}
      <path
        d="M160 270 L 495 95 L 830 270"
        fill="none"
        stroke="rgba(17,17,17,0.45)"
        strokeWidth="3"
      />
      <text
        x="660"
        y="120"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.75)"
      >
        MAE (linear)
      </text>

      {/* Huber: smooth V */}
      <path
        d="M200 270 C 340 270, 420 160, 495 120 C 570 160, 650 270, 790 270"
        fill="none"
        stroke="rgba(17,17,17,0.75)"
        strokeWidth="3"
      />
      <text
        x="210"
        y="210"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.75)"
      >
        Huber (quadratic then linear)
      </text>
    </svg>
  );
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

function LossCurvePlot({
  loss,
  huberDelta,
}: {
  loss: LossId;
  huberDelta: number;
}) {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const lossFn = useMemo(() => {
    if (loss === "mse")
      return (e: number) => 0.5 * e * e; // 0.5 for nicer derivative
    if (loss === "mae") return (e: number) => Math.abs(e);
    if (loss === "huber") {
      return (e: number) => {
        const a = Math.abs(e);
        const d = huberDelta;
        return a <= d ? 0.5 * a * a : d * (a - 0.5 * d);
      };
    }
    if (loss === "bce") {
      // Assume error axis is logit; plot BCE for y in {0,1} at y=1 (hard positive).
      return (z: number) => -Math.log(sigmoid(z) + 1e-9);
    }
    // ce: show 3-class softmax cross-entropy for correct class 0 with varying logit0.
    return (z: number) => {
      const p = softmax([z, 0, 0])[0];
      return -Math.log(p + 1e-9);
    };
  }, [huberDelta, loss]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = Math.max(320, size.w || 0);
    const h = 260;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const pad = { l: 44, r: 12, t: 14, b: 28 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    const xMin = loss === "bce" || loss === "ce" ? -6 : -4;
    const xMax = loss === "bce" || loss === "ce" ? 6 : 4;

    // sample for y-range
    let yMax = 0;
    const samples = 240;
    for (let i = 0; i < samples; i++) {
      const x = xMin + (i / (samples - 1)) * (xMax - xMin);
      yMax = Math.max(yMax, lossFn(x));
    }
    yMax = Math.max(1, yMax);

    const toX = (x: number) => pad.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const toY = (y: number) => pad.t + (1 - y / yMax) * plotH;

    // grid
    ctx.strokeStyle = "rgba(17,17,17,0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const gx = pad.l + (i / 5) * plotW;
      ctx.beginPath();
      ctx.moveTo(gx, pad.t);
      ctx.lineTo(gx, pad.t + plotH);
      ctx.stroke();
    }
    for (let i = 1; i <= 3; i++) {
      const gy = pad.t + (i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.l, gy);
      ctx.lineTo(pad.l + plotW, gy);
      ctx.stroke();
    }

    // axes
    ctx.strokeStyle = "rgba(17,17,17,0.35)";
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t + plotH);
    ctx.lineTo(pad.l + plotW, pad.t + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, pad.t + plotH);
    ctx.stroke();

    // curve
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < samples; i++) {
      const x = xMin + (i / (samples - 1)) * (xMax - xMin);
      const y = lossFn(x);
      const px = toX(x);
      const py = toY(y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // label
    ctx.fillStyle = "rgba(17,17,17,0.85)";
    ctx.font =
      "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    const caption =
      loss === "mse"
        ? "MSE: 0.5·e^2"
        : loss === "mae"
          ? "MAE: |e|"
          : loss === "huber"
            ? `Huber: delta=${fmt(huberDelta, 2)}`
            : loss === "bce"
              ? "BCE (y=1) vs logit"
              : "Softmax CE (3-class) vs logit0";
    ctx.fillText(caption, pad.l, 14);
  }, [huberDelta, loss, lossFn, size.w]);

  return (
    <div ref={ref} className="border border-[var(--border-primary)] bg-white">
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

function RegressionOutlierSim({ huberDelta }: { huberDelta: number }) {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [outlierCount, setOutlierCount] = useState(2);
  const [outlierMagnitude, setOutlierMagnitude] = useState(4);
  const [noise, setNoise] = useState(0.25);
  const [loss, setLoss] = useState<"mse" | "mae" | "huber">("mse");

  const data = useMemo(() => {
    // deterministic-ish dataset: y = 0.9x + 0.4 + noise, with some outliers
    const points: Array<{ x: number; y: number; outlier: boolean }> = [];
    const n = 40;
    for (let i = 0; i < n; i++) {
      const x = -2 + (4 * i) / (n - 1);
      const base = 0.9 * x + 0.4;
      const n1 = Math.sin(i * 2.17) * noise + Math.cos(i * 0.73) * noise * 0.4;
      points.push({ x, y: base + n1, outlier: false });
    }
    for (let k = 0; k < outlierCount; k++) {
      const idx = Math.floor(((k + 1) * n) / (outlierCount + 1));
      const sign = k % 2 === 0 ? 1 : -1;
      points[idx] = {
        x: points[idx].x,
        y: points[idx].y + sign * outlierMagnitude,
        outlier: true,
      };
    }
    return points;
  }, [noise, outlierCount, outlierMagnitude]);

  const fit = useMemo(() => {
    // Fit y = ax + b by minimizing the chosen loss with a tiny optimizer (Adam-ish).
    let a = 0.2;
    let b = 0.0;
    let ma = 0,
      mb = 0,
      va = 0,
      vb = 0;
    const lr = 0.08;
    const beta1 = 0.9;
    const beta2 = 0.99;
    const eps = 1e-8;

    const lossGrad = (e: number) => {
      if (loss === "mse") return e; // derivative of 0.5 e^2
      if (loss === "mae") return e === 0 ? 0 : e > 0 ? 1 : -1;
      // huber
      const d = huberDelta;
      const ae = Math.abs(e);
      if (ae <= d) return e;
      return d * (e > 0 ? 1 : -1);
    };

    for (let t = 1; t <= 220; t++) {
      let ga = 0;
      let gb = 0;
      for (const p of data) {
        const yhat = a * p.x + b;
        const e = yhat - p.y;
        const g = lossGrad(e);
        ga += g * p.x;
        gb += g;
      }
      ga /= data.length;
      gb /= data.length;

      ma = beta1 * ma + (1 - beta1) * ga;
      mb = beta1 * mb + (1 - beta1) * gb;
      va = beta2 * va + (1 - beta2) * (ga * ga);
      vb = beta2 * vb + (1 - beta2) * (gb * gb);
      const mhatA = ma / (1 - Math.pow(beta1, t));
      const mhatB = mb / (1 - Math.pow(beta1, t));
      const vhatA = va / (1 - Math.pow(beta2, t));
      const vhatB = vb / (1 - Math.pow(beta2, t));

      a -= (lr * mhatA) / (Math.sqrt(vhatA) + eps);
      b -= (lr * mhatB) / (Math.sqrt(vhatB) + eps);
    }

    // compute average loss
    let total = 0;
    for (const p of data) {
      const e = a * p.x + b - p.y;
      if (loss === "mse") total += 0.5 * e * e;
      else if (loss === "mae") total += Math.abs(e);
      else {
        const ae = Math.abs(e);
        const d = huberDelta;
        total += ae <= d ? 0.5 * ae * ae : d * (ae - 0.5 * d);
      }
    }
    total /= data.length;

    return { a, b, avgLoss: total };
  }, [data, huberDelta, loss]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = Math.max(320, size.w || 0);
    const h = 320;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const pad = { l: 44, r: 12, t: 16, b: 36 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;

    const xMin = -2.2;
    const xMax = 2.2;
    // derive y range from data + line
    let yMin = Infinity,
      yMax = -Infinity;
    for (const p of data) {
      yMin = Math.min(yMin, p.y);
      yMax = Math.max(yMax, p.y);
    }
    yMin = Math.min(yMin, fit.a * xMin + fit.b);
    yMax = Math.max(yMax, fit.a * xMax + fit.b);
    const padY = 0.8;
    yMin -= padY;
    yMax += padY;

    const toX = (x: number) => pad.l + ((x - xMin) / (xMax - xMin)) * plotW;
    const toY = (y: number) => pad.t + (1 - (y - yMin) / (yMax - yMin)) * plotH;

    // grid
    ctx.strokeStyle = "rgba(17,17,17,0.08)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const gx = pad.l + (i / 5) * plotW;
      ctx.beginPath();
      ctx.moveTo(gx, pad.t);
      ctx.lineTo(gx, pad.t + plotH);
      ctx.stroke();
    }
    for (let i = 1; i <= 3; i++) {
      const gy = pad.t + (i / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(pad.l, gy);
      ctx.lineTo(pad.l + plotW, gy);
      ctx.stroke();
    }

    // axes
    ctx.strokeStyle = "rgba(17,17,17,0.35)";
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t + plotH);
    ctx.lineTo(pad.l + plotW, pad.t + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, pad.t + plotH);
    ctx.stroke();

    // regression line
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toX(xMin), toY(fit.a * xMin + fit.b));
    ctx.lineTo(toX(xMax), toY(fit.a * xMax + fit.b));
    ctx.stroke();

    // points
    for (const p of data) {
      ctx.fillStyle = p.outlier ? "rgba(239,68,68,0.85)" : "rgba(17,17,17,0.75)";
      ctx.beginPath();
      ctx.arc(toX(p.x), toY(p.y), p.outlier ? 4.2 : 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // caption
    ctx.fillStyle = "rgba(17,17,17,0.85)";
    ctx.font =
      "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    ctx.fillText(
      `fit: y=${fmt(fit.a, 2)}x + ${fmt(fit.b, 2)}   avg loss=${fmt(
        fit.avgLoss,
        3
      )}`,
      pad.l,
      14
    );
  }, [data, fit, size.w]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <div ref={ref} className="border border-[var(--border-primary)] bg-white">
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
          Outlier Playground
        </div>
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["mse", "MSE"],
                ["mae", "MAE"],
                ["huber", "Huber"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setLoss(id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  loss === id
                    ? "border-black bg-black text-white"
                    : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-3">
            <div className="flex items-center gap-3">
              <div className="w-28 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
                outliers
              </div>
              <input
                className="w-full accent-black"
                type="range"
                min={0}
                max={8}
                step={1}
                value={outlierCount}
                onChange={(e) => setOutlierCount(Number(e.target.value))}
              />
              <div className="w-12 shrink-0 text-right text-xs text-[var(--text-secondary)]">
                {outlierCount}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-28 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
                magnitude
              </div>
              <input
                className="w-full accent-black"
                type="range"
                min={0}
                max={8}
                step={0.1}
                value={outlierMagnitude}
                onChange={(e) => setOutlierMagnitude(Number(e.target.value))}
              />
              <div className="w-12 shrink-0 text-right text-xs text-[var(--text-secondary)]">
                {fmt(outlierMagnitude, 1)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-28 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
                noise
              </div>
              <input
                className="w-full accent-black"
                type="range"
                min={0}
                max={1.0}
                step={0.01}
                value={noise}
                onChange={(e) => setNoise(Number(e.target.value))}
              />
              <div className="w-12 shrink-0 text-right text-xs text-[var(--text-secondary)]">
                {fmt(noise, 2)}
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-[var(--text-tertiary)]">
            Red points are outliers. MSE is very sensitive to them; MAE is
            robust but has a non-smooth kink; Huber trades off both.
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassificationLossMiniSim() {
  const [logit, setLogit] = useState(0.2);
  const [bceTarget, setBceTarget] = useState<0 | 1>(1);

  const p = sigmoid(logit);
  const bce =
    -(bceTarget * Math.log(p + 1e-9) + (1 - bceTarget) * Math.log(1 - p + 1e-9));

  const [z0, setZ0] = useState(1.2);
  const [z1, setZ1] = useState(0.2);
  const [z2, setZ2] = useState(-0.5);
  const [trueClass, setTrueClass] = useState<0 | 1 | 2>(0);
  const probs = softmax([z0, z1, z2]);
  const ce = -Math.log(probs[trueClass] + 1e-9);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
          Binary Cross-Entropy
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Treat <span className="font-mono">logit</span> as the model output
          before sigmoid.
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex items-center gap-3">
            <div className="w-20 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
              logit
            </div>
            <input
              className="w-full accent-black"
              type="range"
              min={-6}
              max={6}
              step={0.05}
              value={logit}
              onChange={(e) => setLogit(Number(e.target.value))}
            />
            <div className="w-16 shrink-0 text-right text-xs font-mono text-[var(--text-secondary)]">
              {fmt(logit, 2)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([0, 1] as const).map((t) => (
              <button
                key={t}
                onClick={() => setBceTarget(t)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  bceTarget === t
                    ? "border-black bg-black text-white"
                    : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                target={t}
              </button>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                p
              </div>
              <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">
                {fmt(p, 3)}
              </div>
            </div>
            <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                BCE
              </div>
              <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">
                {fmt(bce, 3)}
              </div>
            </div>
            <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                grad (∂L/∂logit)
              </div>
              <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">
                {fmt(p - bceTarget, 3)}
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-[var(--text-tertiary)]">
            With BCE + sigmoid, the gradient simplifies to <span className="font-mono">p − y</span>.
          </div>
        </div>
      </div>

      <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
        <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
          Softmax Cross-Entropy
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          Adjust 3 logits and see the probability of the true class.
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            {([0, 1, 2] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTrueClass(k)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  trueClass === k
                    ? "border-black bg-black text-white"
                    : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                }`}
              >
                true={k}
              </button>
            ))}
          </div>

          {([
            ["z0", z0, setZ0],
            ["z1", z1, setZ1],
            ["z2", z2, setZ2],
          ] as const).map(([name, v, setV]) => (
            <div key={name} className="flex items-center gap-3">
              <div className="w-12 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
                {name}
              </div>
              <input
                className="w-full accent-black"
                type="range"
                min={-4}
                max={4}
                step={0.05}
                value={v}
                onChange={(e) => setV(Number(e.target.value))}
              />
              <div className="w-16 shrink-0 text-right text-xs font-mono text-[var(--text-secondary)]">
                {fmt(v, 2)}
              </div>
            </div>
          ))}

          <div className="mt-2 grid grid-cols-4 gap-3 text-xs">
            {probs.map((pp, i) => (
              <div
                key={i}
                className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                  p{i}
                </div>
                <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">
                  {fmt(pp, 3)}
                </div>
              </div>
            ))}
            <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                CE
              </div>
              <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">
                {fmt(ce, 3)}
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-[var(--text-tertiary)]">
            Cross-entropy penalizes low probability on the true class. Softmax makes probabilities sum to 1.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LossFunctions() {
  const [loss, setLoss] = useState<LossId>("mse");
  const [huberDelta, setHuberDelta] = useState(1.0);

  return (
    <section className="w-full px-12 py-24">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10">
        <header className="grid gap-4">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
            Deep Learning • Objectives
          </div>
          <h1 className="text-balance text-4xl font-semibold text-[var(--text-primary)] md:text-5xl">
            Loss Functions
          </h1>
          <p className="max-w-[72ch] text-pretty text-lg text-[var(--text-secondary)]">
            A loss function turns “how wrong the model is” into a single number
            to minimize. Your choice changes gradients, robustness to outliers,
            and how training behaves.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="What A Loss Does" eyebrow="Idea">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Training is an optimization problem: find parameters{" "}
                <code>θ</code> that minimize the expected loss.
              </p>
              <p>
                Loss shapes the gradient. Gradient shapes the update. So loss
                isn’t just “measurement” – it’s the force that pushes learning.
              </p>
              <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-xs text-[var(--text-primary)]">
                θ ← θ − α · ∇θ L(θ)
              </div>
            </div>
          </Card>

          <Card title="How To Pick" eyebrow="Rule of Thumb">
            <div className="space-y-3 text-sm leading-relaxed">
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Regression: start with <span className="font-medium text-[var(--text-primary)]">MSE</span>, use{" "}
                  <span className="font-medium text-[var(--text-primary)]">Huber</span> when outliers exist.
                </li>
                <li>
                  Binary classification: <span className="font-medium text-[var(--text-primary)]">BCE</span> (with logits).
                </li>
                <li>
                  Multi-class: <span className="font-medium text-[var(--text-primary)]">Softmax cross-entropy</span>.
                </li>
              </ul>
              <p className="text-sm">
                The “best” loss is the one that matches your data noise model
                and your evaluation metric.
              </p>
            </div>
          </Card>
        </div>

        <Card title="Shapes Matter" eyebrow="Diagram">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div className="overflow-hidden rounded-md border border-[var(--border-primary)] bg-white">
              <InlineLossDiagram />
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                MSE grows quadratically, so it heavily penalizes large errors
                (and outliers).
              </p>
              <p>
                MAE grows linearly, making it robust but less smooth around zero.
              </p>
              <p>
                Huber is the compromise: quadratic near zero, linear for large
                errors.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Loss Curve Explorer" eyebrow="Interactive">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                ["mse", "MSE"],
                ["mae", "MAE"],
                ["huber", "Huber"],
                ["bce", "BCE"],
                ["ce", "Softmax CE"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setLoss(id as LossId)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    loss === (id as LossId)
                      ? "border-black bg-black text-white"
                      : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loss === "huber" ? (
              <div className="max-w-[520px] border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                  Huber delta
                </div>
                <div className="flex items-center gap-3">
                  <input
                    className="w-full accent-black"
                    type="range"
                    min={0.2}
                    max={3.0}
                    step={0.05}
                    value={huberDelta}
                    onChange={(e) => setHuberDelta(Number(e.target.value))}
                  />
                  <div className="w-16 text-right font-mono text-xs text-[var(--text-secondary)]">
                    {fmt(huberDelta, 2)}
                  </div>
                </div>
              </div>
            ) : null}

            <LossCurvePlot loss={loss} huberDelta={huberDelta} />
          </div>
        </Card>

        <Card title="Regression Outliers" eyebrow="Simulation">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              Create outliers and see how the best-fit line changes depending on
              the loss. This is why robust losses exist.
            </p>
            <RegressionOutlierSim huberDelta={huberDelta} />
          </div>
        </Card>

        <Card title="Classification Losses" eyebrow="Simulation">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              Cross-entropy losses are built to turn probabilities into a
              training signal. Play with logits and see how loss and gradients
              react.
            </p>
            <ClassificationLossMiniSim />
          </div>
        </Card>
      </div>
    </section>
  );
}

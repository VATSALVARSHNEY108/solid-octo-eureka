"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type VariantId =
  | "basic"
  | "vae"
  | "sae"
  | "dae"
  | "cae"
  | "mdl"
  | "concrete";

type LatentDim = 1 | 2;

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fmt(x: number, digits = 3) {
  if (!Number.isFinite(x)) return "âˆž";
  return x.toFixed(digits);
}

function mul2(a: [number, number], s: number): [number, number] {
  return [a[0] * s, a[1] * s];
}

function add2(a: [number, number], b: [number, number]): [number, number] {
  return [a[0] + b[0], a[1] + b[1]];
}

function sub2(a: [number, number], b: [number, number]): [number, number] {
  return [a[0] - b[0], a[1] - b[1]];
}

function dot2(a: [number, number], b: [number, number]) {
  return a[0] * b[0] + a[1] * b[1];
}

function norm2(a: [number, number]) {
  return Math.sqrt(dot2(a, a));
}

function unit2(a: [number, number]): [number, number] {
  const n = norm2(a) || 1;
  return [a[0] / n, a[1] / n];
}

// Deterministic-ish pseudo RNG (so the sim is stable across re-renders).
function prng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

function gaussian(rand: () => number) {
  // Box-Muller
  const u = Math.max(1e-9, rand());
  const v = Math.max(1e-9, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
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

function SchemaDiagram() {
  return (
    <svg
      viewBox="0 0 960 280"
      className="h-auto w-full"
      role="img"
      aria-label="Autoencoder encoder-decoder schema"
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f5f5f5" />
        </linearGradient>
        <marker
          id="arr"
          markerWidth="10"
          markerHeight="10"
          refX="7"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6 Z" fill="#111111" />
        </marker>
      </defs>

      <rect x="0" y="0" width="960" height="280" fill="url(#g)" />

      {/* Input */}
      <rect
        x="60"
        y="82"
        width="200"
        height="120"
        rx="12"
        fill="#ffffff"
        stroke="rgba(17,17,17,0.25)"
        strokeWidth="2"
      />
      <text
        x="160"
        y="116"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#111111"
      >
        x âˆˆ X
      </text>
      <text
        x="160"
        y="148"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.7)"
      >
        input data
      </text>

      {/* Encoder */}
      <rect
        x="308"
        y="62"
        width="210"
        height="160"
        rx="14"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="2"
      />
      <text
        x="413"
        y="106"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#111111"
      >
        Encoder
      </text>
      <text
        x="413"
        y="132"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.7)"
      >
        EÏ† : X â†’ Z
      </text>
      <text
        x="413"
        y="162"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.7)"
      >
        z = EÏ†(x)
      </text>

      {/* Latent */}
      <rect
        x="560"
        y="96"
        width="120"
        height="92"
        rx="14"
        fill="#111111"
      />
      <text
        x="620"
        y="136"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#ffffff"
      >
        z âˆˆ Z
      </text>
      <text
        x="620"
        y="160"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(255,255,255,0.8)"
      >
        code
      </text>

      {/* Decoder */}
      <rect
        x="724"
        y="62"
        width="210"
        height="160"
        rx="14"
        fill="#ffffff"
        stroke="#111111"
        strokeWidth="2"
      />
      <text
        x="829"
        y="106"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="14"
        fill="#111111"
      >
        Decoder
      </text>
      <text
        x="829"
        y="132"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.7)"
      >
        DÎ¸ : Z â†’ X
      </text>
      <text
        x="829"
        y="162"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.7)"
      >
        xâ€² = DÎ¸(z)
      </text>

      {/* Arrows */}
      <path
        d="M260 142 L 308 142"
        stroke="#111111"
        strokeWidth="3"
        markerEnd="url(#arr)"
      />
      <path
        d="M518 142 L 560 142"
        stroke="#111111"
        strokeWidth="3"
        markerEnd="url(#arr)"
      />
      <path
        d="M680 142 L 724 142"
        stroke="#111111"
        strokeWidth="3"
        markerEnd="url(#arr)"
      />

      <text
        x="160"
        y="238"
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        fontSize="12"
        fill="rgba(17,17,17,0.7)"
      >
        reconstruction objective: minimize d(x, xâ€²)
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

function computePcaBasis(points: Array<[number, number]>) {
  // For 2D points, PCA basis vectors are eigenvectors of covariance.
  let mx = 0,
    my = 0;
  for (const p of points) {
    mx += p[0];
    my += p[1];
  }
  mx /= points.length || 1;
  my /= points.length || 1;

  let cxx = 0,
    cxy = 0,
    cyy = 0;
  for (const p of points) {
    const x = p[0] - mx;
    const y = p[1] - my;
    cxx += x * x;
    cxy += x * y;
    cyy += y * y;
  }
  const n = Math.max(1, points.length - 1);
  cxx /= n;
  cxy /= n;
  cyy /= n;

  // Eigenvector of [[cxx, cxy],[cxy, cyy]] for largest eigenvalue.
  const tr = cxx + cyy;
  const det = cxx * cyy - cxy * cxy;
  const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
  const l1 = 0.5 * (tr + disc);

  let v1: [number, number];
  if (Math.abs(cxy) > 1e-9) {
    v1 = unit2([l1 - cyy, cxy]);
  } else {
    v1 = cxx >= cyy ? [1, 0] : [0, 1];
  }
  const v2: [number, number] = [-v1[1], v1[0]];

  return { mean: [mx, my] as [number, number], v1, v2 };
}

function AutoencoderSim() {
  const { ref, size } = useResizeObserver<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [latentDim, setLatentDim] = useState<LatentDim>(1);
  const [noise, setNoise] = useState(0.35);
  const [denoise, setDenoise] = useState(true);
  const [outliers, setOutliers] = useState(2);
  const [anomalyThreshold, setAnomalyThreshold] = useState(0.55);

  const points = useMemo(() => {
    const rand = prng(42);
    const pts: Array<[number, number, boolean]> = [];
    // two elongated clusters + a curve-ish manifold
    for (let i = 0; i < 70; i++) {
      const t = i / 69;
      const x = lerp(-1.8, 1.8, t);
      const y = 0.35 * Math.sin(2.1 * x) + 0.25 * gaussian(rand);
      pts.push([x + 0.15 * gaussian(rand), y, false]);
    }
    for (let i = 0; i < 35; i++) {
      const x = -1.4 + 0.35 * gaussian(rand);
      const y = 1.1 + 0.25 * gaussian(rand);
      pts.push([x, y, false]);
    }

    // outliers (anomalies)
    for (let k = 0; k < outliers; k++) {
      const ang = rand() * Math.PI * 2;
      const r = 2.4 + rand() * 0.6;
      pts.push([Math.cos(ang) * r, Math.sin(ang) * r, true]);
    }

    return pts;
  }, [outliers]);

  const pca = useMemo(() => {
    const xy = points.map((p) => [p[0], p[1]] as [number, number]);
    return computePcaBasis(xy);
  }, [points]);

  const recon = useMemo(() => {
    // Linear undercomplete autoencoder (PCA-equivalent) reconstruction:
    // encode: z = V^T (x - mean) ; decode: x' = mean + V z
    // Here V is [v1] or [v1 v2] depending on latentDim.
    const mean = pca.mean;
    const v1 = pca.v1;
    const v2 = pca.v2;

    const decoded: Array<{
      x: number;
      y: number;
      xNoisy: number;
      yNoisy: number;
      xr: number;
      yr: number;
      err: number;
      isOutlier: boolean;
    }> = [];

    const rand = prng(7);
    for (const p of points) {
      const x = p[0];
      const y = p[1];
      const isOutlier = p[2];

      const nx = x + noise * gaussian(rand);
      const ny = y + noise * gaussian(rand);

      const srcX = denoise ? nx : x;
      const srcY = denoise ? ny : y;

      const xc = srcX - mean[0];
      const yc = srcY - mean[1];
      const z1 = xc * v1[0] + yc * v1[1];
      const z2 = xc * v2[0] + yc * v2[1];

      let xr = mean[0] + v1[0] * z1;
      let yr = mean[1] + v1[1] * z1;
      if (latentDim === 2) {
        xr += v2[0] * z2;
        yr += v2[1] * z2;
      }

      const ex = xr - x;
      const ey = yr - y;
      const err = Math.sqrt(ex * ex + ey * ey);

      decoded.push({ x, y, xNoisy: nx, yNoisy: ny, xr, yr, err, isOutlier });
    }

    // Return percentiles for threshold readout.
    const errs = decoded.map((d) => d.err).sort((a, b) => a - b);
    const q = (p: number) => errs[Math.floor(clamp(p, 0, 0.999) * errs.length)] ?? 0;
    return { decoded, p50: q(0.5), p90: q(0.9), p95: q(0.95) };
  }, [denoise, latentDim, noise, pca.mean, pca.v1, pca.v2, points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = Math.max(320, size.w || 0);
    const h = Math.max(320, Math.round(w * 0.7));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const pad = 22;
    const xMin = -3.1,
      xMax = 3.1,
      yMin = -2.4,
      yMax = 2.4;
    const toX = (x: number) =>
      pad + ((x - xMin) / (xMax - xMin)) * (w - pad * 2);
    const toY = (y: number) =>
      pad + (1 - (y - yMin) / (yMax - yMin)) * (h - pad * 2);

    // background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    // axis frame
    ctx.strokeStyle = "rgba(17,17,17,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(pad + 0.5, pad + 0.5, w - pad * 2 - 1, h - pad * 2 - 1);

    // principal direction line (v1)
    const m = pca.mean;
    const v1 = pca.v1;
    const t0 = -3;
    const t1 = 3;
    ctx.strokeStyle = "rgba(17,17,17,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toX(m[0] + v1[0] * t0), toY(m[1] + v1[1] * t0));
    ctx.lineTo(toX(m[0] + v1[0] * t1), toY(m[1] + v1[1] * t1));
    ctx.stroke();

    // Points + recon arrows
    const thr = recon.p95 * anomalyThreshold;

    for (const d of recon.decoded) {
      const isAnom = d.err > thr;

      // arrow from clean point to reconstruction
      ctx.strokeStyle = isAnom ? "rgba(239,68,68,0.35)" : "rgba(17,17,17,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(toX(d.x), toY(d.y));
      ctx.lineTo(toX(d.xr), toY(d.yr));
      ctx.stroke();

      // noisy point (if denoising)
      if (denoise) {
        ctx.fillStyle = "rgba(17,17,17,0.18)";
        ctx.beginPath();
        ctx.arc(toX(d.xNoisy), toY(d.yNoisy), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // original point
      ctx.fillStyle = d.isOutlier
        ? "rgba(239,68,68,0.85)"
        : "rgba(17,17,17,0.78)";
      ctx.beginPath();
      ctx.arc(toX(d.x), toY(d.y), d.isOutlier ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();

      // reconstruction point
      ctx.fillStyle = isAnom ? "#ef4444" : "#ffffff";
      ctx.strokeStyle = isAnom ? "#ef4444" : "#111111";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(toX(d.xr), toY(d.yr), 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // legend / caption
    ctx.fillStyle = "rgba(17,17,17,0.85)";
    ctx.font =
      "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    ctx.fillText(
      `latent dim=${latentDim}  noise=${fmt(noise, 2)}  thresholdâ‰ˆ${fmt(thr, 3)}`,
      pad,
      16
    );
  }, [anomalyThreshold, denoise, latentDim, noise, pca.mean, pca.v1, recon, size.w]);

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

          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              {([1, 2] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setLatentDim(k)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    latentDim === k
                      ? "border-black bg-black text-white"
                      : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  latent={k}D
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={denoise}
                onChange={(e) => setDenoise(e.target.checked)}
              />
              Denoising mode (train on noisy, reconstruct clean)
            </label>

            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
                noise
              </div>
              <input
                className="w-full accent-black"
                type="range"
                min={0}
                max={1.2}
                step={0.01}
                value={noise}
                onChange={(e) => setNoise(Number(e.target.value))}
              />
              <div className="w-14 shrink-0 text-right font-mono text-xs text-[var(--text-secondary)]">
                {fmt(noise, 2)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
                outliers
              </div>
              <input
                className="w-full accent-black"
                type="range"
                min={0}
                max={10}
                step={1}
                value={outliers}
                onChange={(e) => setOutliers(Number(e.target.value))}
              />
              <div className="w-14 shrink-0 text-right font-mono text-xs text-[var(--text-secondary)]">
                {outliers}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-24 shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
                anomaly
              </div>
              <input
                className="w-full accent-black"
                type="range"
                min={0.2}
                max={1.6}
                step={0.01}
                value={anomalyThreshold}
                onChange={(e) => setAnomalyThreshold(Number(e.target.value))}
              />
              <div className="w-14 shrink-0 text-right font-mono text-xs text-[var(--text-secondary)]">
                Ã—{fmt(anomalyThreshold, 2)}
              </div>
            </div>

            <div className="mt-1 text-xs text-[var(--text-tertiary)]">
              Recon error is used as an anomaly score. Raise the anomaly slider to
              be more conservative.
            </div>
          </div>
        </div>

        <div className="border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            Reading The Plot
          </div>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p>
              Dark dots are original data. Faint dots are corrupted inputs (only
              in denoising mode). White circles are reconstructions.
            </p>
            <p>
              When <span className="font-mono">latent=1D</span>, reconstructions
              are forced onto a single â€œmanifold directionâ€ (PCA-like). Thatâ€™s
              compression.
            </p>
            <p>
              Outliers (red) tend to reconstruct poorly, which is why
              reconstruction error can work as an anomaly score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Autoencoders() {
  const [variant, setVariant] = useState<VariantId>("basic");

  const variants = useMemo(
    () =>
      [
        {
          id: "basic",
          title: "Autoencoder (AE)",
          blurb:
            "Undercomplete encoder-decoder trained to reconstruct inputs; learns compressed representations.",
        },
        {
          id: "dae",
          title: "Denoising AE (DAE)",
          blurb:
            "Corrupt inputs and train to reconstruct clean data; learns robust features.",
        },
        {
          id: "sae",
          title: "Sparse AE (SAE)",
          blurb:
            "Add sparsity so only a few latent units activate; encourages parts-based features.",
        },
        {
          id: "cae",
          title: "Contractive AE (CAE)",
          blurb:
            "Penalize encoder Jacobian; makes representations stable to small input changes.",
        },
        {
          id: "vae",
          title: "Variational AE (VAE)",
          blurb:
            "Latent is a distribution; optimize ELBO (recon + KL). Enables generation by sampling.",
        },
        {
          id: "mdl",
          title: "MDL AE",
          blurb:
            "Minimum description length framing: compress code + reconstruction error jointly.",
        },
        {
          id: "concrete",
          title: "Concrete AE",
          blurb:
            "Differentiable feature selection: latent chooses input features via a relaxed categorical distribution.",
        },
      ] as const,
    []
  );

  const variantDetail = useMemo(() => {
    const map: Record<VariantId, { math: string; use: string; note: string }> =
      {
        basic: {
          math: "min_{Î¸,Ï†} E_x [ d(x, DÎ¸(EÏ†(x))) ] (often L2 reconstruction)",
          use: "Compression, embeddings, pretraining, anomaly detection (via recon error).",
          note: "If latent is too large and unregularized, AE can learn identity and be useless.",
        },
        dae: {
          math: "min E_{x,T}[ d(x, D(E(T(x)))) ] where T is a corruption/noise process",
          use: "Denoising, robust features, self-supervised pretraining.",
          note: "DAE often behaves like a regularizer: must recover clean structure from noise.",
        },
        sae: {
          math: "min L_recon + Î»Â·L_sparse (e.g., KL(Ï || ÏÌ‚) or L1 penalty on activations)",
          use: "Interpretable parts/features, feature learning for classification.",
          note: "k-sparse AEs clamp all but top-k activations (hard sparsity).",
        },
        cae: {
          math: "min L_recon + Î»Â·E_x ||âˆ‡_x EÏ†(x)||_F^2 (contractive penalty)",
          use: "Stability under small perturbations; representation learning.",
          note: "DAE can be viewed as a finite-noise cousin of CAE (infinitesimal limit).",
        },
        vae: {
          math: "maximize ELBO = E_{qÏ†(z|x)}[log pÎ¸(x|z)] âˆ’ KL(qÏ†(z|x)||p(z))",
          use: "Generative modeling, latent interpolation, diffusion latents, controllable sampling.",
          note: "Unlike AE, VAE latent is stochastic and regularized to match a prior.",
        },
        mdl: {
          math: "min (code length) + (reconstruction error) (MDL principle)",
          use: "Compression-oriented representations, model selection via description length.",
          note: "Think of learning a code that is short but still reconstructs well.",
        },
        concrete: {
          math: "latent selects k input features via a continuous relaxation (Concrete/Gumbel-Softmax)",
          use: "Feature selection with gradients; interpretability.",
          note: "Useful when you need discrete feature selection but still want end-to-end training.",
        },
      };
    return map[variant];
  }, [variant]);

  return (
    <section className="w-full px-12 py-24">
      <div className="mx-auto grid w-full max-w-[1100px] gap-10">
        <header className="grid gap-4">
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
            Deep Learning â€¢ Representation Learning
          </div>
          <h1 className="text-balance text-4xl font-semibold text-[var(--text-primary)] md:text-5xl">
            Autoencoders
          </h1>
          <p className="max-w-[76ch] text-pretty text-lg text-[var(--text-secondary)]">
            Autoencoders learn an <span className="font-medium">encoder</span>{" "}
            that compresses data into a latent code and a{" "}
            <span className="font-medium">decoder</span> that reconstructs the
            original input. They are a core tool for dimensionality reduction,
            anomaly detection, and modern generative models (VAEs, diffusion
            latents).
          </p>
        </header>

        <Card title="Schema" eyebrow="Definition">
          <div className="overflow-hidden rounded-md border border-[var(--border-primary)] bg-white">
            <SchemaDiagram />
          </div>
          <div className="mt-4 grid gap-3 text-sm leading-relaxed">
            <p>
              Formally, an autoencoder is a pair of functions: an encoder{" "}
              <code>EÏ† : X â†’ Z</code> and a decoder <code>DÎ¸ : Z â†’ X</code>.
              Training minimizes reconstruction error:
            </p>
            <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-xs text-[var(--text-primary)]">
              {"L(?, f) = E_{x ~ µ_ref} [ d(x, D?(Ef(x))) ]"}
            </div>
            <p>
              Undercomplete AEs (dim(Z) &lt; dim(X)) act like compression. With
              sufficient capacity and an overcomplete latent, the AE can learn
              the identity unless we add regularization.
            </p>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Mathematical Principles" eyebrow="Math">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Typical setup: <code>X = R^m</code>, <code>Z = R^n</code> with{" "}
                <code>m &gt; n</code>. A simple one-layer encoder is{" "}
                <code>EÏ†(x) = Ïƒ(Wx + b)</code>.
              </p>
              <p>
                With an L2 reconstruction loss, training becomes least squares:
              </p>
              <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-xs text-[var(--text-primary)]">
                {"min_{θ, φ} (1/N) Σ_i || x_i − Dθ(Eφ(x_i)) ||^2"}
              </div>
              <p>
                Linear undercomplete autoencoders recover the same subspace as
                PCA (up to rotation).
              </p>
            </div>
          </Card>

          <Card title="Interpretation" eyebrow="Intuition">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                Think of the latent code as a bottleneck. If the bottleneck is
                small, the model must discard details and keep only the most
                useful structure.
              </p>
              <p>
                Reconstruction error can act as an anomaly score: if a point is
                unlike the training distribution, the AE often reconstructs it
                poorly.
              </p>
              <p>
                Depth helps: deep encoders/decoders can represent complex
                manifolds more efficiently than shallow ones.
              </p>
            </div>
          </Card>
        </div>

        <Card title="Interactive Simulator" eyebrow="Hands-On">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              This is a small, visual undercomplete autoencoder demo. For
              linear AEs, the solution matches PCA: compress to 1D along the
              dominant direction and reconstruct back into 2D. Toggle denoising
              to see why DAEs learn robust features.
            </p>
            <AutoencoderSim />
          </div>
        </Card>

        <Card title="Variations" eyebrow="Variants">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    variant === v.id
                      ? "border-black bg-black text-white"
                      : "border-[var(--border-primary)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                  Objective
                </div>
                <div className="mt-2 font-mono text-xs text-[var(--text-primary)]">
                  {variantDetail.math}
                </div>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                  Use Cases
                </div>
                <div className="mt-2 text-sm text-[var(--text-secondary)]">
                  {variantDetail.use}
                </div>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                <div className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
                  Note
                </div>
                <div className="mt-2 text-sm text-[var(--text-secondary)]">
                  {variantDetail.note}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm leading-relaxed">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="border border-[var(--border-primary)] bg-white p-4"
                >
                  <div className="font-medium text-[var(--text-primary)]">
                    {v.title}
                  </div>
                  <div className="mt-1 text-[var(--text-secondary)]">
                    {v.blurb}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Applications" eyebrow="Where They Show Up">
            <div className="space-y-2 text-sm leading-relaxed">
              <ul className="list-disc space-y-1 pl-5">
                <li>Dimensionality reduction and embeddings</li>
                <li>Anomaly detection via reconstruction error</li>
                <li>Image denoising / compression / super-resolution</li>
                <li>Information retrieval (semantic hashing)</li>
                <li>Drug discovery and molecule generation (VAE variants)</li>
                <li>Communication systems: end-to-end learned codecs</li>
              </ul>
            </div>
          </Card>

          <Card title="Training Notes" eyebrow="Practice">
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                AEs are trained with gradient descent on reconstruction loss,
                often with regularization (dropout, sparsity, weight decay).
              </p>
              <p>
                VAEs require careful balance between reconstruction and KL terms
                (Î²-VAE). Too much KL can cause posterior collapse.
              </p>
              <p>
                For anomaly detection, always validate thresholds: some AEs can
                reconstruct anomalies surprisingly well.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}




"use client";
import { useState, useEffect, useMemo } from "react";

/**
 * Regularization Simulation Component
 * -------------------------------------
 * Interactive lesson demonstrating how L1 and L2 regularization affect the
 * loss landscape of a simple linear regression problem. Users can adjust:
 *   • true weight (ground-truth) – the target parameter the model should learn
 *   • observed data noise – variance of the synthetic dataset
 *   • regularization strength (lambda) – how strongly the penalty influences optimization
 *   • regularization type – L1 (lasso) or L2 (ridge)
 *   • current model weight – manually move a slider to see the instantaneous loss
 *   • enable an auto-play mode that animates the model weight across the range
 *
 * The UI visualises:
 *   – a synthetic dataset scatter plot (generated on-the-fly)
 *   – the loss curve "Loss(w) = MSE(w) + λ * penalty(w)"
 *   – vertical lines indicating the current model weight and the optimal weight
 *   – a highlighted minimum point of the total loss (the optimal regularised weight)
 *   – a gradient arrow that shows the direction of steepest descent at the current weight
 *   – a rich textual explanation of regularization theory, bias-variance trade-off,
 *     and typical use-cases.
 */

/** Types for the regularization configuration */
type RegType = "L1" | "L2";

interface Config {
  trueWeight: number;   // ground-truth coefficient
  noiseStd: number;     // standard deviation of Gaussian noise
  lambda: number;       // regularization strength
  regType: RegType;     // type of penalty
  modelWeight: number;  // current weight chosen by the user
  dataPoints: number;   // number of synthetic samples
  autoPlay: boolean;    // whether to animate weight automatically
}

/** Generate synthetic data based on the configuration */
function generateData(cfg: Config) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < cfg.dataPoints; i++) {
    const x = Math.random() * 2 - 1; // uniform [-1, 1]
    const noise = cfg.noiseStd * (Math.random() * 2 - 1);
    xs.push(x);
    ys.push(cfg.trueWeight * x + noise);
  }
  return { xs, ys };
}

/** Compute MSE loss for a given weight */
function mseLoss(weight: number, xs: number[], ys: number[]) {
  const n = xs.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const residual = weight * xs[i] - ys[i];
    sum += residual * residual;
  }
  return sum / n;
}

/** Compute the regularization penalty */
function penalty(weight: number, cfg: Config) {
  if (cfg.regType === "L2") return weight * weight;
  return Math.abs(weight);
}

/** Total loss = MSE + λ * penalty */
function totalLoss(weight: number, xs: number[], ys: number[], cfg: Config) {
  return mseLoss(weight, xs, ys) + cfg.lambda * penalty(weight, cfg);
}

/** Analytical optimal weight for L2 (ridge) */
function ridgeOptimal(cfg: Config, xs: number[], ys: number[]) {
  const n = xs.length;
  let sumXX = 0, sumXY = 0;
  for (let i = 0; i < n; i++) {
    sumXX += xs[i] * xs[i];
    sumXY += xs[i] * ys[i];
  }
  const meanXX = sumXX / n;
  const meanXY = sumXY / n;
  // Closed-form solution for ridge regression: w* = meanXY / (meanXX + λ)
  return meanXY / (meanXX + cfg.lambda);
}

/** Brute-force search for L1 (lasso) optimal weight */
function lassoOptimal(cfg: Config, xs: number[], ys: number[]) {
  const candidates: number[] = [];
  const losses: number[] = [];
  for (let w = -2; w <= 2; w += 0.001) {
    const loss = totalLoss(w, xs, ys, cfg);
    candidates.push(w);
    losses.push(loss);
  }
  const minIdx = losses.indexOf(Math.min(...losses));
  return candidates[minIdx];
}

/** Wrapper that returns optimal weight for current reg type */
function analyticalOptimal(cfg: Config, xs: number[], ys: number[]) {
  if (cfg.regType === "L2") {
    return ridgeOptimal(cfg, xs, ys);
  }
  return lassoOptimal(cfg, xs, ys);
}

/** Utility to map a value from data space to SVG pixel space */
function scale(value: number, domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const t = (value - d0) / (d1 - d0);
  return r0 + t * (r1 - r0);
}

/** Compute gradient of total loss at a given weight (numerical central difference) */
function lossGradient(weight: number, xs: number[], ys: number[], cfg: Config) {
  const eps = 1e-5;
  const lossPlus = totalLoss(weight + eps, xs, ys, cfg);
  const lossMinus = totalLoss(weight - eps, xs, ys, cfg);
  return (lossPlus - lossMinus) / (2 * eps);
}

/** Main component */
export default function RegularizationSimulation() {
  // State: configuration
  const [cfg, setCfg] = useState<Config>({
    trueWeight: 0.8,
    noiseStd: 0.2,
    lambda: 0.1,
    regType: "L2",
    modelWeight: 0.0,
    dataPoints: 50,
    autoPlay: false,
  });

  // Derived data: generate synthetic dataset whenever relevant config changes
  const { xs, ys } = useMemo(
    () => generateData(cfg),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.trueWeight, cfg.noiseStd, cfg.dataPoints]
  );

  // Compute loss curve values for visualisation (range -2 … 2)
  const lossCurve = useMemo(() => {
    const points: { w: number; loss: number }[] = [];
    for (let w = -2; w <= 2; w += 0.05) {
      points.push({ w, loss: totalLoss(w, xs, ys, cfg) });
    }
    return points;
  }, [xs, ys, cfg]);

  // Determine the globally optimal regularised weight
  const optimalWeight = useMemo(
    () => analyticalOptimal(cfg, xs, ys),
    [xs, ys, cfg]
  );

  // Auto-play logic – smoothly animate the model weight across the range
  useEffect(() => {
    if (!cfg.autoPlay) return;
    let direction = 1; // 1 = increasing, -1 = decreasing
    const interval = setInterval(() => {
      setCfg((prev) => {
        let newWeight = prev.modelWeight + direction * 0.02;
        if (newWeight > 2) {
          newWeight = 2;
          direction = -1;
        } else if (newWeight < -2) {
          newWeight = -2;
          direction = 1;
        }
        return { ...prev, modelWeight: newWeight };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [cfg.autoPlay]);

  // Event handler – update state immutably
  const update = (partial: Partial<Config>) =>
    setCfg((prev) => ({ ...prev, ...partial }));

  // SVG dimensions
  const W = 200;
  const H = 200;

  return (
    <section className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">
        Regularization Simulation
      </h1>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4 border border-[var(--border-primary)] rounded bg-[var(--bg-secondary)]">

        {/* True Weight */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            True Weight: {cfg.trueWeight.toFixed(2)}
          </label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value={cfg.trueWeight}
            onChange={(e) => update({ trueWeight: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Noise Std */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Noise Std: {cfg.noiseStd.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={cfg.noiseStd}
            onChange={(e) => update({ noiseStd: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Lambda */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Lambda (λ): {cfg.lambda.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={cfg.lambda}
            onChange={(e) => update({ lambda: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Regularization Type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Regularization Type
          </label>
          <select
            value={cfg.regType}
            onChange={(e) => update({ regType: e.target.value as RegType })}
            className="p-2 rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
          >
            <option value="L2">L2 (Ridge)</option>
            <option value="L1">L1 (Lasso)</option>
          </select>
        </div>

        {/* Model Weight */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Model Weight: {cfg.modelWeight.toFixed(2)}
          </label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.01"
            value={cfg.modelWeight}
            onChange={(e) => update({ modelWeight: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Data Points */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Data Points: {cfg.dataPoints}
          </label>
          <input
            type="range"
            min="10"
            max="200"
            step="5"
            value={cfg.dataPoints}
            onChange={(e) => update({ dataPoints: parseInt(e.target.value) })}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Auto-Play toggle */}
        <div className="flex items-center col-span-full gap-2">
          <input
            type="checkbox"
            id="autoplay"
            checked={cfg.autoPlay}
            onChange={(e) => update({ autoPlay: e.target.checked })}
            className="accent-indigo-500"
          />
          <label htmlFor="autoplay" className="text-sm text-[var(--text-secondary)]">
            Auto-play weight animation
          </label>
        </div>
      </div>

      {/* Visualisation area */}
      <div className="grid gap-8 md:grid-cols-2">

        {/* Left: Scatter plot of synthetic data */}
        <div className="relative border border-[var(--border-primary)] rounded p-4 bg-[var(--bg-secondary)]">
          <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
            Synthetic Data (x, y)
          </h2>
          <svg
            viewBox="-1 -1 2 2"
            className="w-full h-64"
            style={{ background: "var(--bg-primary)" }}
          >
            {/* Axes */}
            <line x1="-1" y1="0" x2="1" y2="0" stroke="var(--text-secondary)" strokeWidth={0.005} />
            <line x1="0" y1="-1" x2="0" y2="1" stroke="var(--text-secondary)" strokeWidth={0.005} />

            {/* Data points */}
            {xs.map((x, i) => {
              const y = ys[i];
              // Clamp to visible area
              if (y < -1 || y > 1) return null;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={-y}
                  r={0.025}
                  fill="var(--accent-primary)"
                  opacity={0.7}
                />
              );
            })}

            {/* True weight line: y = trueWeight * x */}
            <line
              x1={scale(-1, [-1, 1], [-1, 1])}
              y1={scale(cfg.trueWeight, [-1, 1], [-1, 1])}
              x2={scale(1, [-1, 1], [-1, 1])}
              y2={scale(-cfg.trueWeight, [-1, 1], [-1, 1])}
              stroke="var(--text-secondary)"
              strokeWidth={0.005}
              strokeDasharray="0.03 0.015"
            />

            {/* Current model weight line: y = modelWeight * x */}
            <line
              x1={-1}
              y1={cfg.modelWeight}
              x2={1}
              y2={-cfg.modelWeight}
              stroke="var(--accent-primary)"
              strokeWidth={0.008}
            />
          </svg>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Dashed = true line &nbsp;|&nbsp; Solid = model fit
          </p>
        </div>

        {/* Right: Loss curve */}
        <div className="relative border border-[var(--border-primary)] rounded p-4 bg-[var(--bg-secondary)]">
          <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
            Total Loss vs Model Weight
          </h2>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-64"
            style={{ background: "var(--bg-primary)" }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="3"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 6 3, 0 6" fill="var(--accent-primary)" />
              </marker>
            </defs>

            {/* Axes */}
            <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="var(--text-secondary)" strokeWidth={0.8} />
            <line x1={W / 2} y1="0" x2={W / 2} y2={H} stroke="var(--text-secondary)" strokeWidth={0.8} />

            {/* Loss curve */}
            {(() => {
              const maxLoss = Math.max(...lossCurve.map((p) => p.loss));
              const minLoss = Math.min(...lossCurve.map((p) => p.loss));
              const pad = (maxLoss - minLoss) * 0.1 || 0.05;
              const lossMax = maxLoss + pad;
              const lossMin = Math.max(0, minLoss - pad);

              const toSvgX = (w: number) => scale(w, [-2, 2], [10, W - 10]);
              const toSvgY = (loss: number) => scale(loss, [lossMax, lossMin], [10, H - 10]);

              const pathD = lossCurve
                .map((pt, i) => `${i === 0 ? "M" : "L"}${toSvgX(pt.w)},${toSvgY(pt.loss)}`)
                .join(" ");

              const cx = toSvgX(cfg.modelWeight);
              const cy = toSvgY(totalLoss(cfg.modelWeight, xs, ys, cfg));
              const grad = lossGradient(cfg.modelWeight, xs, ys, cfg);
              const arrowDx = -0.3 * Math.sign(grad) * Math.min(Math.abs(grad) * 10, 30);
              const ax2 = Math.max(10, Math.min(W - 10, cx + arrowDx));

              const optCx = toSvgX(optimalWeight);
              const optCy = toSvgY(totalLoss(optimalWeight, xs, ys, cfg));

              return (
                <>
                  {/* Loss curve path */}
                  <path d={pathD} stroke="var(--accent-primary)" strokeWidth={2} fill="none" />

                  {/* Optimal weight vertical line */}
                  <line
                    x1={optCx} y1={10}
                    x2={optCx} y2={H - 10}
                    stroke="#22c55e"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />

                  {/* Optimal weight circle marker */}
                  <circle cx={optCx} cy={optCy} r={5} fill="#22c55e" />

                  {/* Current weight vertical line */}
                  <line
                    x1={cx} y1={10}
                    x2={cx} y2={H - 10}
                    stroke="var(--text-primary)"
                    strokeDasharray="4 2"
                    strokeWidth={1}
                  />

                  {/* Gradient arrow at current weight */}
                  {Math.abs(grad) > 0.001 && (
                    <line
                      x1={cx} y1={cy}
                      x2={ax2} y2={cy}
                      stroke="var(--accent-primary)"
                      strokeWidth={2}
                      markerEnd="url(#arrowhead)"
                    />
                  )}

                  {/* Current weight dot */}
                  <circle cx={cx} cy={cy} r={4} fill="var(--text-primary)" />
                </>
              );
            })()}

            {/* Axis labels */}
            <text x={W - 12} y={H / 2 - 4} fill="var(--text-secondary)" fontSize="9">w</text>
            <text x={W / 2 + 3} y={14} fill="var(--text-secondary)" fontSize="9">Loss</text>
          </svg>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Green dashed = optimal weight &nbsp;|&nbsp; White dashed = current weight &nbsp;|&nbsp; Arrow = gradient direction
          </p>
        </div>
      </div>

      {/* Numerical read-out */}
      <div className="mt-4 p-4 border border-[var(--border-primary)] rounded bg-[var(--bg-secondary)]">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Current Metrics
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--text-primary)]">
          <li>MSE at current weight: {mseLoss(cfg.modelWeight, xs, ys).toFixed(4)}</li>
          <li>Penalty ({cfg.regType}) at current weight: {penalty(cfg.modelWeight, cfg).toFixed(4)}</li>
          <li>Total loss at current weight: {totalLoss(cfg.modelWeight, xs, ys, cfg).toFixed(4)}</li>
          <li>Optimal regularised weight (minimum loss): {optimalWeight.toFixed(4)}</li>
        </ul>
      </div>

      {/* Theory & Explanation */}
      <article className="mt-8 space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Why Regularize?</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          In linear regression, the model learns a weight <strong>w</strong> that minimises the
          mean-squared error (MSE) on the training data. When data is noisy or the model has many
          parameters, the learned weight can over-fit: it captures random fluctuations instead of
          the true underlying relationship. Regularization adds a penalty term to the loss function,
          discouraging extreme weights and effectively reducing model variance.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed">Two classic forms are used:</p>
        <ul className="list-disc list-inside ml-6 text-[var(--text-secondary)] space-y-1">
          <li>
            <strong>L2 (Ridge)</strong>: penalty = w². It shrinks weights toward zero smoothly,
            yielding a convex loss with a closed-form solution.
          </li>
          <li>
            <strong>L1 (Lasso)</strong>: penalty = |w|. It encourages sparsity, driving some
            weights exactly to zero, useful for feature selection.
          </li>
        </ul>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          The strength of the penalty is controlled by <strong>λ</strong> (lambda). A small λ
          barely affects the loss, while a large λ dominates the objective, pulling the weight
          toward zero regardless of the data.
        </p>

        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Bias-Variance Trade-off</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Regularization decreases variance (model sensitivity to training data) at the cost of
          increasing bias (error due to simplifying assumptions). The optimal λ balances these two
          sources of error to minimise overall generalisation error.
        </p>

        <h3 className="text-xl font-semibold text-[var(--text-primary)]">Practical Tips</h3>
        <ul className="list-disc list-inside ml-6 text-[var(--text-secondary)] space-y-1">
          <li>Start with a modest λ (e.g., 0.1) and increase until validation loss stops improving.</li>
          <li>Prefer L2 for dense problems where all features contribute.</li>
          <li>Prefer L1 when you suspect only a few features are truly informative.</li>
          <li>Combine both (Elastic Net) for a balance of shrinkage and sparsity.</li>
        </ul>
      </article>
    </section>
  );
}
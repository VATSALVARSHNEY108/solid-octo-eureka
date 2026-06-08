"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Pause, Play, RotateCcw, Sigma, Sliders, Sparkles } from "lucide-react";

type Action = 0 | 1;

function round3(x: number) {
  return Math.round(x * 1000) / 1000;
}

function softmax2(l0: number, l1: number) {
  const m = Math.max(l0, l1);
  const e0 = Math.exp(l0 - m);
  const e1 = Math.exp(l1 - m);
  const z = e0 + e1;
  return [e0 / z, e1 / z] as const;
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

// A tiny stochastic bandit (stateless MDP).
// This is perfect for policy gradients because we can see variance clearly.
function banditReward(a: Action) {
  const base = a === 1 ? 1.0 : 0.2; // action 1 is better on average
  const noise = (Math.random() - 0.5) * 1.4;
  return base + noise;
}

function mean(xs: number[]) {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function entropy2(p0: number, p1: number) {
  const eps = 1e-12;
  const h0 = -p0 * Math.log(p0 + eps);
  const h1 = -p1 * Math.log(p1 + eps);
  return h0 + h1;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function PolicyGradient() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6); // steps per second

  // Policy parameters (logits)
  const [logits, setLogits] = useState<[number, number]>([0, 0]);

  // Baseline (variance reduction)
  const [useBaseline, setUseBaseline] = useState(true);
  const [baseline, setBaseline] = useState(0);
  const [betaBaseline, setBetaBaseline] = useState(0.1);

  // Entropy bonus (keeps exploration)
  const [entropyBonus, setEntropyBonus] = useState(0.0);

  // Learning rate
  const [alpha, setAlpha] = useState(0.15);

  // Stats
  const [steps, setSteps] = useState(0);
  const [counts, setCounts] = useState<[number, number]>([0, 0]);
  const [recentR, setRecentR] = useState<number[]>([]);

  const lastRef = useRef<{
    a?: Action;
    r?: number;
    p0?: number;
    p1?: number;
    adv?: number;
    grad0?: number;
    grad1?: number;
    entropy?: number;
  }>({});

  const [p0, p1] = softmax2(logits[0], logits[1]);
  const avgR = useMemo(() => mean(recentR), [recentR]);
  const H = useMemo(() => entropy2(p0, p1), [p0, p1]);

  const reset = useCallback(() => {
    setPlaying(false);
    setLogits([0, 0]);
    setBaseline(0);
    setSteps(0);
    setCounts([0, 0]);
    setRecentR([]);
    lastRef.current = {};
  }, []);

  const stepOnce = useCallback(() => {
    // 1) sample action from policy
    const [p0Now, p1Now] = softmax2(logits[0], logits[1]);
    const a: Action = Math.random() < p0Now ? 0 : 1;

    // 2) get reward
    const r = banditReward(a);

    // 3) compute advantage (with optional baseline)
    const bNow = useBaseline ? baseline : 0;
    const adv = r - bNow;

    // 4) REINFORCE gradient: ∇ log π(a) = 1[a=k] - π(k)
    // Update logits: l_k ← l_k + α * adv * (1[a=k] - π(k))  (+ entropy bonus)
    // Entropy term encourages spread: add α * η * ∇ H(π). For 2-action softmax,
    // a lightweight proxy that works well for teaching is: push logits toward 0 when entropy is low.
    const entropyNow = entropy2(p0Now, p1Now);
    const entPull0 = -logits[0];
    const entPull1 = -logits[1];

    const g0 = (a === 0 ? 1 : 0) - p0Now;
    const g1 = (a === 1 ? 1 : 0) - p1Now;

    setLogits((prev) => [
      prev[0] + alpha * adv * g0 + alpha * entropyBonus * entPull0,
      prev[1] + alpha * adv * g1 + alpha * entropyBonus * entPull1,
    ]);

    if (useBaseline) {
      setBaseline((prev) => prev + betaBaseline * (r - prev));
    }

    setSteps((s) => s + 1);
    setCounts((c) => (a === 0 ? [c[0] + 1, c[1]] : [c[0], c[1] + 1]));
    setRecentR((xs) => [...xs.slice(-99), r]);

    lastRef.current = {
      a,
      r,
      p0: p0Now,
      p1: p1Now,
      adv,
      grad0: g0,
      grad1: g1,
      entropy: entropyNow,
    };
  }, [alpha, baseline, betaBaseline, entropyBonus, logits, useBaseline]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const interval = 1000 / Math.max(1, speed);
    const loop = (now: number) => {
      if (now - last >= interval) {
        last = now;
        stepOnce();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, stepOnce]);

  const last = lastRef.current;

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-mono border border-[var(--border-primary)] px-3 py-1 rounded-full bg-[var(--bg-secondary)]">
          Reinforcement Learning
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Policy Gradient (REINFORCE)
        </h1>
        <p className="mt-4 text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          Policy gradients optimize a policy <strong>directly</strong>: increase the probability of actions that lead to high return.
          This page shows REINFORCE on a noisy bandit so you can see <strong>variance</strong> and why we use <strong>baselines</strong> and <strong>entropy</strong>.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card
            title="The update rule"
            subtitle="REINFORCE pushes logits in the direction of ∇ log π(a)."
          >
            <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 font-mono text-[12px] text-[var(--text-primary)] overflow-x-auto">
              θ ← θ + α · (G − b) · ∇<sub>θ</sub> log π<sub>θ</sub>(a){"\n"}
              For softmax: ∂/∂logit<sub>k</sub> log π(a) = 1[k=a] − π(k)
            </div>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                <strong>G</strong> is return (here: reward of the bandit pull).
              </li>
              <li>
                <strong>b</strong> is a baseline (e.g. a value function) that reduces variance without changing the expected gradient.
              </li>
              <li>
                <strong>Entropy bonus</strong> keeps the policy from collapsing too early.
              </li>
            </ul>
          </Card>

          <Card
            title="Controls"
            subtitle="Step through updates or run continuously."
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={stepOnce}
                disabled={playing}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" />
                Step
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm hover:bg-[var(--bg-secondary)]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-[var(--text-secondary)]">Auto speed</div>
                  <div className="font-mono text-xs text-[var(--text-primary)]">{speed}/s</div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--text-primary)]"
                />
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-[var(--text-secondary)]">Learning rate α</div>
                  <div className="font-mono text-xs text-[var(--text-primary)]">{round3(alpha)}</div>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.6}
                  step={0.01}
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--text-primary)]"
                />
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-[var(--text-secondary)]">Entropy bonus η</div>
                  <div className="font-mono text-xs text-[var(--text-primary)]">{round3(entropyBonus)}</div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.2}
                  step={0.01}
                  value={entropyBonus}
                  onChange={(e) => setEntropyBonus(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--text-primary)]"
                />
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <Sigma className="h-4 w-4" />
                    <span>Baseline</span>
                  </div>
                  <button
                    onClick={() => setUseBaseline((x) => !x)}
                    className="text-xs font-semibold rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 hover:bg-[var(--bg-primary)]"
                  >
                    {useBaseline ? "Baseline: ON" : "Baseline: OFF"}
                  </button>
                </div>

                <div className="mt-3 grid gap-3">
                  <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="text-[var(--text-secondary)]">b (moving average)</div>
                      <div className="font-mono text-[var(--text-primary)]">{round3(baseline)}</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="text-[var(--text-secondary)]">Baseline lr β</div>
                      <div className="font-mono text-[var(--text-primary)]">{round3(betaBaseline)}</div>
                    </div>
                    <input
                      type="range"
                      min={0.01}
                      max={0.5}
                      step={0.01}
                      value={betaBaseline}
                      onChange={(e) => setBetaBaseline(Number(e.target.value))}
                      className="mt-2 w-full accent-[var(--text-primary)]"
                      disabled={!useBaseline}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              <Sparkles className="h-4 w-4" />
              <span>Bandit environment</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Two actions, noisy rewards</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              Action 1 has higher expected reward, but both are noisy. The policy must learn to shift probability mass toward the better action.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Sliders className="h-4 w-4" />
                  <span>Policy</span>
                </div>
                <div className="mt-3 space-y-3 text-xs">
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">logits</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">
                      l0={round3(logits[0])} | l1={round3(logits[1])}
                    </div>
                  </div>
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">probabilities</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">
                      π(a0)={round3(p0)} | π(a1)={round3(p1)}
                    </div>
                  </div>
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">entropy H(π)</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">{round3(H)}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Training stats</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-center">
                    <div className="text-[var(--text-secondary)]">Steps</div>
                    <div className="font-mono text-[var(--text-primary)]">{steps}</div>
                  </div>
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-center">
                    <div className="text-[var(--text-secondary)]">Avg reward</div>
                    <div className="font-mono text-[var(--text-primary)]">{round3(avgR)}</div>
                  </div>
                  <div className="col-span-2 rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">Action counts</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">
                      a0: {counts[0]} | a1: {counts[1]}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">One update, explained</div>
                <div className="mt-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono text-[12px] text-[var(--text-primary)]">
                  {last.a === undefined ? (
                    <>Press Step to generate an update.</>
                  ) : (
                    <>
                      a = {last.a}{"\n"}
                      r = {round3(last.r ?? 0)}{"\n"}
                      π = [{round3(last.p0 ?? 0)}, {round3(last.p1 ?? 0)}]{"\n"}
                      b = {useBaseline ? round3(baseline) : 0}{"\n"}
                      adv = r - b = {round3(last.adv ?? 0)}{"\n"}
                      ∇logπ: [ {round3(last.grad0 ?? 0)}, {round3(last.grad1 ?? 0)} ]{"\n"}
                      H(π) = {round3(last.entropy ?? 0)}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 text-[11px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-primary)] pt-4">
              <strong>Try this:</strong> turn <em>Baseline OFF</em> and watch the policy wobble more (high-variance updates). Then turn it back ON.
              Add a small entropy bonus to keep exploration early.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Brain,
  Cpu,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Shuffle,
} from "lucide-react";

type Algo = "q_learning" | "reinforce" | "actor_critic";

function actionLabel(a: 0 | 1) {
  return a === 0 ? "Action 0" : "Action 1";
}

function clamp(x: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, x));
}

function softmax2(l0: number, l1: number) {
  const m = Math.max(l0, l1);
  const e0 = Math.exp(l0 - m);
  const e1 = Math.exp(l1 - m);
  const z = e0 + e1;
  return [e0 / z, e1 / z] as const;
}

function round3(x: number) {
  return Math.round(x * 1000) / 1000;
}

// Bandit environment (stateless):
// action 0: noisy small reward, action 1: noisy bigger reward
function banditReward(a: 0 | 1) {
  const base = a === 1 ? 1.0 : 0.2;
  // mean base, with some noise to show variance
  const noise = (Math.random() - 0.5) * 1.2;
  return base + noise;
}

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            {icon}
            <span>Deep Reinforcement Learning</span>
          </div>
          <h2 className="mt-2 text-xl font-bold text-[var(--text-primary)]">{title}</h2>
          {subtitle ? (
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-[var(--text-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
          : "border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function DeepRL() {
  const [algo, setAlgo] = useState<Algo>("actor_critic");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6); // steps per second

  // shared "bandit" knobs
  const [gamma, setGamma] = useState(0.0); // for bandit, γ is irrelevant, but useful to connect to RL notation
  const [eps, setEps] = useState(0.2); // for Q-learning exploration
  const [alphaQ, setAlphaQ] = useState(0.25);

  // REINFORCE knobs
  const [alphaPi, setAlphaPi] = useState(0.15);
  const [useBaseline, setUseBaseline] = useState(true);
  const [betaBaseline, setBetaBaseline] = useState(0.1);

  // Actor-Critic knobs
  const [alphaV, setAlphaV] = useState(0.2);

  // agent params
  const [Q, setQ] = useState<[number, number]>([0, 0]);
  const [logits, setLogits] = useState<[number, number]>([0, 0]); // policy logits for a=0,a=1
  const [V, setV] = useState(0); // critic baseline/value for bandit (single state)
  const [b, setB] = useState(0); // learned baseline (moving average reward)

  // stats
  const [t, setT] = useState(0);
  const [recentR, setRecentR] = useState<number[]>([]);
  const [counts, setCounts] = useState<[number, number]>([0, 0]);

  const lastRef = useRef<{
    a?: 0 | 1;
    r?: number;
    pi?: [number, number];
    adv?: number;
    td?: number;
  }>({});

  const avgR = useMemo(() => {
    if (recentR.length === 0) return 0;
    return recentR.reduce((x, y) => x + y, 0) / recentR.length;
  }, [recentR]);

  const reset = useCallback(() => {
    setPlaying(false);
    setQ([0, 0]);
    setLogits([0, 0]);
    setV(0);
    setB(0);
    setT(0);
    setRecentR([]);
    setCounts([0, 0]);
    lastRef.current = {};
  }, []);

  const stepOnce = useCallback(() => {
    // choose action
    let a: 0 | 1 = 0;
    const [p0, p1] = softmax2(logits[0], logits[1]);

    if (algo === "q_learning") {
      // ε-greedy on Q
      if (Math.random() < eps) a = Math.random() < 0.5 ? 0 : 1;
      else a = Q[1] >= Q[0] ? 1 : 0;
    } else {
      // sample from policy
      a = Math.random() < p0 ? 0 : 1;
    }

    const r = banditReward(a);

    // update counts/stats
    setCounts((c) => (a === 0 ? [c[0] + 1, c[1]] : [c[0], c[1] + 1]));
    setRecentR((xs) => [...xs.slice(-99), r]);
    setT((x) => x + 1);

    // algorithm updates
    if (algo === "q_learning") {
      // since bandit: target is just reward (no next state); still illustrates TD(0)
      setQ((qPrev) => {
        const q = [...qPrev] as [number, number];
        const td = r - q[a];
        q[a] = q[a] + alphaQ * td;
        lastRef.current = { a, r, pi: [p0, p1], td };
        return q;
      });
    } else if (algo === "reinforce") {
      setLogits((prev) => {
        const l = [...prev] as [number, number];
        // baseline b tracks average reward to reduce variance
        const bNow = useBaseline ? b : 0;
        const adv = r - bNow;
        // grad log π for 2-action softmax:
        // ∂/∂logit_k log π(a) = 1[k=a] - π(k)
        l[0] = l[0] + alphaPi * adv * ((a === 0 ? 1 : 0) - p0);
        l[1] = l[1] + alphaPi * adv * ((a === 1 ? 1 : 0) - p1);
        lastRef.current = { a, r, pi: [p0, p1], adv };
        return l;
      });
      if (useBaseline) {
        setB((prev) => prev + betaBaseline * (r - prev));
      }
    } else {
      // Actor-Critic:
      // critic estimates V (single-state), advantage ≈ r - V
      const adv = r - V;
      // critic update
      setV((vPrev) => vPrev + alphaV * (r - vPrev));
      // actor update
      setLogits((prev) => {
        const l = [...prev] as [number, number];
        l[0] = l[0] + alphaPi * adv * ((a === 0 ? 1 : 0) - p0);
        l[1] = l[1] + alphaPi * adv * ((a === 1 ? 1 : 0) - p1);
        lastRef.current = { a, r, pi: [p0, p1], adv };
        return l;
      });
    }
  }, [Q, V, algo, alphaPi, alphaQ, alphaV, b, betaBaseline, eps, logits, useBaseline]);

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

  const [p0, p1] = softmax2(logits[0], logits[1]);
  const last = lastRef.current;

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-mono border border-[var(--border-primary)] px-3 py-1 rounded-full bg-[var(--bg-secondary)]">
          Reinforcement Learning
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Deep Reinforcement Learning (Deep RL)
        </h1>
        <p className="mt-4 text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          Deep RL is RL with <strong>function approximation</strong> (usually neural networks). It’s powerful—but can be unstable.
          This lesson gives you the mental model: what changes when tables become networks, and why replay/targets/advantages exist.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card
            title="The big picture"
            subtitle="Deep RL combines three moving parts: (1) function approximation, (2) bootstrapping, (3) exploration. Stability tricks exist to control their interactions."
            icon={<Brain className="h-4 w-4" />}
          >
            <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                <strong>Value-based</strong>: learn \(Q(s,a)\), act greedily. (DQN-style)
              </li>
              <li>
                <strong>Policy-based</strong>: learn \(\pi(a|s)\) directly. (REINFORCE-style)
              </li>
              <li>
                <strong>Actor-Critic</strong>: learn both, using a critic baseline/advantage for low-variance gradients.
              </li>
              <li>
                <strong>Stability</strong>: replay buffers, target networks, normalization, entropy, clipping (PPO) and more.
              </li>
            </ul>
          </Card>

          <Card
            title="Why Deep RL can be unstable"
            subtitle="With function approximation, small update errors can generalize across many states. Bootstrapping (targets that depend on the model) can amplify mistakes."
            icon={<Shield className="h-4 w-4" />}
          >
            <div className="grid gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 font-mono text-[12px] text-[var(--text-primary)] overflow-x-auto">
                TD target: y = r + γ · maxₐ' Q(s',a'){"\n"}
                Update:  Q(s,a) ← Q(s,a) + α · (y − Q(s,a))
              </div>
              <div>
                <strong>Replay</strong> randomizes data to reduce correlation. <strong>Target nets</strong> slow down target drift.
                <strong>Advantages/baselines</strong> reduce policy-gradient variance.
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Bot className="h-4 w-4" />
                  <span>Interactive sandbox</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">
                  Same environment, three learning styles
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                  This is a <strong>2-action bandit</strong> (no state). The goal is to pick action 1 more often because it has a higher average reward.
                  Use this to feel the difference between Q-learning, REINFORCE, and Actor-Critic updates.
                </p>
              </div>

              <div className="flex items-center gap-2">
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
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill active={algo === "q_learning"} onClick={() => setAlgo("q_learning")}>
                Value-based (Q-learning)
              </Pill>
              <Pill active={algo === "reinforce"} onClick={() => setAlgo("reinforce")}>
                Policy gradient (REINFORCE)
              </Pill>
              <Pill active={algo === "actor_critic"} onClick={() => setAlgo("actor_critic")}>
                Actor-Critic
              </Pill>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Cpu className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-center">
                    <div className="text-[var(--text-secondary)]">Steps</div>
                    <div className="font-mono text-[var(--text-primary)]">{t}</div>
                  </div>
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-center">
                    <div className="text-[var(--text-secondary)]">Avg reward</div>
                    <div className="font-mono text-[var(--text-primary)]">{round3(avgR)}</div>
                  </div>
                  <div className="col-span-2 rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">Action counts</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">
                      a0: {counts[0]} &nbsp;|&nbsp; a1: {counts[1]}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Shuffle className="h-4 w-4" />
                  <span>Policy / values</span>
                </div>
                <div className="mt-3 space-y-3 text-xs">
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">π(a)</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">
                      π(a0)={round3(p0)} &nbsp;|&nbsp; π(a1)={round3(p1)}
                    </div>
                  </div>
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">Q (value-based)</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">
                      Q(a0)={round3(Q[0])} &nbsp;|&nbsp; Q(a1)={round3(Q[1])}
                    </div>
                  </div>
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                    <div className="text-[var(--text-secondary)]">V / baseline (critic)</div>
                    <div className="mt-1 font-mono text-[var(--text-primary)]">
                      V≈{round3(V)} &nbsp;|&nbsp; b≈{round3(b)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Last update</div>
                <div className="mt-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono text-[12px] text-[var(--text-primary)]">
                  {last.a === undefined ? (
                    <>Press Step to start.</>
                  ) : (
                    <>
                      a = {last.a} ({actionLabel(last.a)}){"\n"}
                      r = {round3(last.r ?? 0)}{"\n"}
                      π = [{round3(last.pi?.[0] ?? 0)}, {round3(last.pi?.[1] ?? 0)}]{"\n"}
                      {last.adv !== undefined ? `adv = ${round3(last.adv)}` : ""}
                      {last.td !== undefined ? `td = ${round3(last.td)}` : ""}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                  <div className="text-xs text-[var(--text-secondary)]">γ (shown for notation)</div>
                  <div className="font-mono text-xs text-[var(--text-primary)]">{round3(gamma)}</div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.99}
                  step={0.01}
                  value={gamma}
                  onChange={(e) => setGamma(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--text-primary)]"
                />
                <div className="mt-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  The bandit has no next state, so γ doesn’t affect targets here—this slider is just to keep the symbols consistent with RL formulas.
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
              <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Algorithm knobs</div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">Policy lr (απ)</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{round3(alphaPi)}</div>
                  </div>
                  <input
                    type="range"
                    min={0.01}
                    max={0.6}
                    step={0.01}
                    value={alphaPi}
                    onChange={(e) => setAlphaPi(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                  />
                </div>

                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">Q lr (αQ)</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{round3(alphaQ)}</div>
                  </div>
                  <input
                    type="range"
                    min={0.01}
                    max={0.8}
                    step={0.01}
                    value={alphaQ}
                    onChange={(e) => setAlphaQ(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                    disabled={algo !== "q_learning"}
                  />
                  <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
                    Only used in Q-learning mode.
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">ε exploration</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{round3(eps)}</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={eps}
                    onChange={(e) => setEps(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                    disabled={algo !== "q_learning"}
                  />
                  <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
                    Only used in Q-learning mode.
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">Critic lr (αV)</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{round3(alphaV)}</div>
                  </div>
                  <input
                    type="range"
                    min={0.01}
                    max={0.8}
                    step={0.01}
                    value={alphaV}
                    onChange={(e) => setAlphaV(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                    disabled={algo !== "actor_critic"}
                  />
                  <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
                    Only used in Actor-Critic mode.
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Baseline (variance reduction)</div>
                  <button
                    onClick={() => setUseBaseline((x) => !x)}
                    className="text-xs font-semibold rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 hover:bg-[var(--bg-secondary)]"
                    disabled={algo === "q_learning"}
                  >
                    {useBaseline ? "Baseline: ON" : "Baseline: OFF"}
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  In REINFORCE/Actor-Critic, subtracting a baseline turns reward into an <strong>advantage</strong> signal, reducing gradient variance.
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-xs text-[var(--text-secondary)]">Baseline lr (β)</div>
                      <div className="font-mono text-xs text-[var(--text-primary)]">{round3(betaBaseline)}</div>
                    </div>
                    <input
                      type="range"
                      min={0.01}
                      max={0.5}
                      step={0.01}
                      value={betaBaseline}
                      onChange={(e) => setBetaBaseline(Number(e.target.value))}
                      className="mt-2 w-full accent-[var(--text-primary)]"
                      disabled={!useBaseline || algo === "q_learning"}
                    />
                  </div>
                  <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3">
                    <div className="text-xs text-[var(--text-secondary)]">Baseline value</div>
                    <div className="mt-1 font-mono text-xs text-[var(--text-primary)]">b ≈ {round3(b)}</div>
                    <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
                      In this sandbox, baseline is a moving average of rewards.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-[11px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-primary)] pt-4">
              <strong>Connection to real Deep RL:</strong> replace Q/logits with neural networks, replace the bandit with an MDP,
              and the exact same update structure appears—just with (a) bootstrapped targets and (b) far more correlated data.
            </div>
          </div>

          <Card
            title="Where to go next in this topic"
            subtitle="Use these ideas as a map while reading the other lessons in Reinforcement Learning."
            icon={<Brain className="h-4 w-4" />}
          >
            <div className="grid gap-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="font-semibold text-[var(--text-primary)]">Bellman backups</div>
                <div className="mt-1">
                  Deep RL builds on Bellman expectation/optimality (targets and bootstrapping).
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="font-semibold text-[var(--text-primary)]">DQN</div>
                <div className="mt-1">
                  Value-based deep RL: replay buffer + target network + ε-greedy exploration.
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="font-semibold text-[var(--text-primary)]">Policy Gradient, Actor-Critic, PPO</div>
                <div className="mt-1">
                  Policy optimization deep RL: advantages, entropy, clipping/trust regions, and stability via constrained updates.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


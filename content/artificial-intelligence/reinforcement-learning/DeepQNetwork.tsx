"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  Target,
  Zap,
} from "lucide-react";

type Action = 0 | 1; // 0 = left, 1 = right
const ACTIONS: Action[] = [0, 1];

// Tiny 1D corridor:
// states 0..5, start at 0, goal at 5
// step reward: -1, reaching goal: +10 (terminal)
const N = 6;
const START = 0;
const GOAL = 5;

function envStep(s: number, a: Action) {
  if (s === GOAL) return { s2: GOAL, r: 0, done: true };
  const s2 = a === 1 ? Math.min(GOAL, s + 1) : Math.max(0, s - 1);
  const done = s2 === GOAL;
  const r = done ? 10 : -1;
  return { s2, r, done };
}

type Transition = { s: number; a: Action; r: number; s2: number; done: boolean };

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function mean(xs: number[]) {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function round3(x: number) {
  return Math.round(x * 1000) / 1000;
}

// "Neural network" surrogate:
// Q(s, a) = w[a][s] (a linear layer over one-hot state features).
// This is intentionally simple so the learning dynamics are visible and fast.
type Weights = number[][]; // [action][state]

function makeWeights(seed = 0): Weights {
  // deterministic-ish small init
  const w: Weights = [
    Array.from({ length: N }, (_, i) => 0.02 * Math.sin(seed + i * 1.7)),
    Array.from({ length: N }, (_, i) => 0.02 * Math.cos(seed + i * 1.3)),
  ];
  return w;
}

function qOf(w: Weights, s: number, a: Action) {
  return w[a][s];
}

function greedyAction(w: Weights, s: number): Action {
  return qOf(w, s, 1) >= qOf(w, s, 0) ? 1 : 0;
}

function epsGreedy(w: Weights, s: number, eps: number): Action {
  if (Math.random() < eps) return Math.random() < 0.5 ? 0 : 1;
  return greedyAction(w, s);
}

function actionLabel(a: Action) {
  return a === 1 ? "→ right" : "← left";
}

function tdTarget({
  t,
  gamma,
  wTarget,
}: {
  t: Transition;
  gamma: number;
  wTarget: Weights;
}) {
  if (t.done) return t.r;
  const bestNext = Math.max(qOf(wTarget, t.s2, 0), qOf(wTarget, t.s2, 1));
  return t.r + gamma * bestNext;
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
      <div className="flex items-baseline justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function DeepQNetwork() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(8); // env steps/sec
  const [gamma, setGamma] = useState(0.95);
  const [eps, setEps] = useState(0.25);
  const [batchSize, setBatchSize] = useState(16);
  const [replayCap, setReplayCap] = useState(200);
  const [targetSyncEvery, setTargetSyncEvery] = useState(25); // gradient steps
  const [trainEvery, setTrainEvery] = useState(1); // env steps
  const [lr, setLr] = useState(0.2);

  const [s, setS] = useState(START);
  const [episode, setEpisode] = useState(0);
  const [steps, setSteps] = useState(0);
  const [episodeReturn, setEpisodeReturn] = useState(0);
  const [recentReturns, setRecentReturns] = useState<number[]>([]);

  const [wOnline, setWOnline] = useState<Weights>(() => makeWeights(1));
  const [wTarget, setWTarget] = useState<Weights>(() => makeWeights(2));

  const replayRef = useRef<Transition[]>([]);
  const gradStepsRef = useRef(0);
  const envStepsRef = useRef(0);

  const [last, setLast] = useState<{
    t?: Transition;
    y?: number;
    qsa?: number;
    td?: number;
    synced?: boolean;
    trained?: boolean;
  }>({});

  const avgReturn = useMemo(() => mean(recentReturns), [recentReturns]);

  const reset = useCallback(() => {
    setPlaying(false);
    setS(START);
    setEpisode(0);
    setSteps(0);
    setEpisodeReturn(0);
    setRecentReturns([]);
    setWOnline(makeWeights(1));
    setWTarget(makeWeights(2));
    replayRef.current = [];
    gradStepsRef.current = 0;
    envStepsRef.current = 0;
    setLast({});
  }, []);

  const pushReplay = useCallback(
    (t: Transition) => {
      const buf = replayRef.current;
      buf.push(t);
      if (buf.length > replayCap) buf.splice(0, buf.length - replayCap);
    },
    [replayCap],
  );

  const sampleBatch = useCallback((k: number) => {
    const buf = replayRef.current;
    if (buf.length === 0) return [] as Transition[];
    const out: Transition[] = [];
    for (let i = 0; i < k; i++) {
      out.push(buf[Math.floor(Math.random() * buf.length)]);
    }
    return out;
  }, []);

  const trainOnBatch = useCallback(
    (batch: Transition[]) => {
      if (batch.length === 0) return { tdMean: 0 };
      // SGD update on per-sample squared TD error: (y - Q(s,a))^2
      // With one-hot features, only w[a][s] changes.
      const wNew: Weights = [wOnline[0].slice(), wOnline[1].slice()];
      const tds: number[] = [];
      for (const t of batch) {
        const y = tdTarget({ t, gamma, wTarget });
        const qsa = qOf(wNew, t.s, t.a);
        const td = y - qsa;
        tds.push(td);
        // gradient descent: w <- w + lr * td  (since d/dw (1/2)(td)^2 = -td)
        wNew[t.a][t.s] = qsa + lr * td;
      }
      setWOnline(wNew);
      return { tdMean: mean(tds) };
    },
    [gamma, lr, wOnline, wTarget],
  );

  const maybeSyncTarget = useCallback(() => {
    const g = gradStepsRef.current;
    if (targetSyncEvery <= 0) return false;
    if (g > 0 && g % targetSyncEvery === 0) {
      setWTarget([wOnline[0].slice(), wOnline[1].slice()]);
      return true;
    }
    return false;
  }, [targetSyncEvery, wOnline]);

  const stepOnce = useCallback(() => {
    // 1) act (ε-greedy using ONLINE net)
    const a = epsGreedy(wOnline, s, eps);
    const { s2, r, done } = envStep(s, a);
    const t: Transition = { s, a, r, s2, done };
    pushReplay(t);
    envStepsRef.current += 1;

    // 2) advance environment bookkeeping
    setS(done ? START : s2);
    setSteps((x) => x + 1);
    setEpisodeReturn((ret) => {
      const next = ret + r;
      if (done) return 0;
      return next;
    });

    if (done) {
      setEpisode((e) => e + 1);
      setRecentReturns((xs) => [...xs.slice(-29), episodeReturn + r]);
    }

    // 3) train periodically from replay
    let trained = false;
    let synced = false;
    let y: number | undefined;
    let qsa: number | undefined;
    let td: number | undefined;

    if (replayRef.current.length >= Math.max(4, batchSize) && trainEvery > 0) {
      if (envStepsRef.current % trainEvery === 0) {
        trained = true;
        const batch = sampleBatch(batchSize);

        // capture one representative sample for the "math panel"
        const t0 = batch[0];
        y = tdTarget({ t: t0, gamma, wTarget });
        qsa = qOf(wOnline, t0.s, t0.a);
        td = y - qsa;

        trainOnBatch(batch);
        gradStepsRef.current += 1;
        synced = maybeSyncTarget();
      }
    }

    setLast({
      t,
      y,
      qsa,
      td,
      trained,
      synced,
    });
  }, [
    batchSize,
    eps,
    episodeReturn,
    gamma,
    maybeSyncTarget,
    pushReplay,
    s,
    sampleBatch,
    trainEvery,
    trainOnBatch,
    wOnline,
    wTarget,
  ]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let lastT = performance.now();
    const interval = 1000 / Math.max(1, speed);

    const loop = (now: number) => {
      if (now - lastT >= interval) {
        lastT = now;
        stepOnce();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, stepOnce]);

  const replay = replayRef.current;
  const replayTail = replay.slice(-8).reverse();

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-mono border border-[var(--border-primary)] px-3 py-1 rounded-full bg-[var(--bg-secondary)]">
          Reinforcement Learning
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Deep Q-Network (DQN)
        </h1>
        <p className="mt-4 text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          DQN replaces the tabular Q-table with a function approximator (a “Q-network”), then stabilizes learning with
          <strong> experience replay</strong> and a <strong>target network</strong>. This page simulates that loop step-by-step.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card
            title="Core idea"
            subtitle="DQN is just Q-learning + a Q-network, plus two stability tricks."
          >
            <div className="grid gap-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 font-mono text-[12px] text-[var(--text-primary)] overflow-x-auto">
                Q(s,a) ← Q(s,a) + α · ( y − Q(s,a) ){"\n"}
                y = r + γ · maxₐ' Q<sub>target</sub>(s', a'){"\n"}
                (if terminal: y = r)
              </div>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Replay buffer:</strong> learn from random past transitions to break correlations.
                </li>
                <li>
                  <strong>Target network:</strong> keep a delayed copy of the network to make the target \(y\) less volatile.
                </li>
              </ul>
            </div>
          </Card>

          <Card title="Simulation controls" subtitle="Play, step, and tune hyperparameters.">
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
                  <div className="text-xs text-[var(--text-secondary)]">Speed</div>
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
                  <div className="text-xs text-[var(--text-secondary)]">Discount γ</div>
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
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-[var(--text-secondary)]">Exploration ε</div>
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
                />
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-[var(--text-secondary)]">Learning rate α</div>
                  <div className="font-mono text-xs text-[var(--text-primary)]">{round3(lr)}</div>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.6}
                  step={0.01}
                  value={lr}
                  onChange={(e) => setLr(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">Batch</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{batchSize}</div>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={64}
                    step={4}
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                  />
                </div>
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">Replay cap</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{replayCap}</div>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={600}
                    step={50}
                    value={replayCap}
                    onChange={(e) => setReplayCap(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">Train every</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{trainEvery} step(s)</div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    step={1}
                    value={trainEvery}
                    onChange={(e) => setTrainEvery(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                  />
                </div>
                <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">Target sync</div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">{targetSyncEvery} grad steps</div>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    step={5}
                    value={targetSyncEvery}
                    onChange={(e) => setTargetSyncEvery(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Target className="h-4 w-4" />
                  <span>Environment</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">1D corridor</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Start at state <span className="font-mono">0</span>. Each move costs <span className="font-mono">-1</span>.
                  Reaching goal state <span className="font-mono">5</span> gives <span className="font-mono">+10</span> then terminates.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3">
                  <div className="text-[var(--text-secondary)]">Episode</div>
                  <div className="font-mono text-sm text-[var(--text-primary)]">{episode}</div>
                </div>
                <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3">
                  <div className="text-[var(--text-secondary)]">Steps</div>
                  <div className="font-mono text-sm text-[var(--text-primary)]">{steps}</div>
                </div>
                <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3">
                  <div className="text-[var(--text-secondary)]">Avg return</div>
                  <div className="font-mono text-sm text-[var(--text-primary)]">{round3(avgReturn)}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-6 gap-2">
              {Array.from({ length: N }).map((_, i) => {
                const isGoal = i === GOAL;
                const isAgent = i === s;
                const bg = isGoal ? "rgba(34, 197, 94, 0.15)" : "var(--bg-primary)";
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] relative flex flex-col justify-between p-2"
                    style={{ backgroundColor: bg }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[var(--text-secondary)] font-mono">s{i}</span>
                      {isGoal ? <span className="text-[10px] font-bold text-[var(--text-primary)]">G</span> : null}
                    </div>
                    <div className="flex justify-center items-center h-full">
                      {isAgent ? (
                        <span className="h-4 w-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]" />
                      ) : null}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-mono text-center">
                      π: {actionLabel(greedyAction(wOnline, i)).split(" ")[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Layers className="h-4 w-4" />
                  <span>Online network Q</span>
                </div>
                <div className="mt-3 grid gap-2">
                  {Array.from({ length: N }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between text-xs border-b border-[var(--border-primary)] pb-1">
                      <div className="text-[var(--text-secondary)] font-mono">s{i}</div>
                      <div className="font-mono text-[var(--text-primary)]">
                        Q(←) {round3(qOf(wOnline, i, 0))}{" "}
                        <span className="opacity-60">|</span>{" "}
                        Q(→) {round3(qOf(wOnline, i, 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Target className="h-4 w-4" />
                  <span>Target network Q̂</span>
                </div>
                <div className="mt-3 grid gap-2">
                  {Array.from({ length: N }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between text-xs border-b border-[var(--border-primary)] pb-1">
                      <div className="text-[var(--text-secondary)] font-mono">s{i}</div>
                      <div className="font-mono text-[var(--text-primary)]">
                        Q̂(←) {round3(qOf(wTarget, i, 0))}{" "}
                        <span className="opacity-60">|</span>{" "}
                        Q̂(→) {round3(qOf(wTarget, i, 1))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Target updates are delayed: every <span className="font-mono">{targetSyncEvery}</span> gradient steps,
                  copy online weights into the target network.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Zap className="h-4 w-4" />
                  <span>One update, explained</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-[var(--text-primary)]">TD target and TD error</h3>
              </div>
              <div className="text-right text-xs">
                <div className="text-[var(--text-secondary)]">Replay size</div>
                <div className="font-mono text-[var(--text-primary)]">{replay.length}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Shuffle className="h-4 w-4" />
                  <span>Replay buffer (latest)</span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  {replayTail.length === 0 ? (
                    <div className="text-[var(--text-secondary)]">No transitions yet. Press Step.</div>
                  ) : (
                    replayTail.map((t, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2">
                        <div className="font-mono text-[var(--text-primary)]">
                          (s{t.s}, a={t.a === 1 ? "→" : "←"}, r={t.r}, s'={t.s2})
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)]">{t.done ? "terminal" : " "}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Math panel</div>
                <div className="mt-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono text-[12px] text-[var(--text-primary)]">
                  {last.t ? (
                    <>
                      Transition: (s={last.t.s}, a={last.t.a}, r={last.t.r}, s'={last.t.s2}, done={String(last.t.done)}){"\n"}
                      y = {last.y === undefined ? "—" : round3(last.y)}{"\n"}
                      Q(s,a) = {last.qsa === undefined ? "—" : round3(last.qsa)}{"\n"}
                      TD error (y − Q) = {last.td === undefined ? "—" : round3(last.td)}
                    </>
                  ) : (
                    <>Press Step to generate the first transition.</>
                  )}
                </div>

                <div className="mt-4 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {last.trained ? (
                    <div>
                      Training ran this step (sampled a random minibatch from replay).
                      {last.synced ? (
                        <span className="font-semibold text-[var(--text-primary)]"> Target network synced.</span>
                      ) : null}
                    </div>
                  ) : (
                    <div>Training may be skipped until the replay buffer is large enough.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 text-[11px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-primary)] pt-4">
              <strong>Important:</strong> In real DQN, the Q-network is a deep neural net and the update is done via backprop.
              This demo uses a one-hot linear model so you can clearly see what DQN’s <em>data flow</em> is doing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

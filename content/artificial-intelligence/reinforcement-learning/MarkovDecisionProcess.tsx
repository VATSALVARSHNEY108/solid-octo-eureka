"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Dice5, Pause, Play, RotateCcw, Sigma, Target } from "lucide-react";

type S = "A" | "B" | "C" | "Terminal";
type A = "left" | "right";

const STATES: S[] = ["A", "B", "C", "Terminal"];
const NON_TERMINAL: Exclude<S, "Terminal">[] = ["A", "B", "C"];
const ACTIONS: A[] = ["left", "right"];

type Transition = { to: S; p: number; r: number };
type Dynamics = Record<Exclude<S, "Terminal">, Record<A, Transition[]>>;
type Policy = Record<Exclude<S, "Terminal">, Record<A, number>>;

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function round3(x: number) {
  return Math.round(x * 1000) / 1000;
}

const DEFAULT_DYNAMICS: Dynamics = {
  A: {
    left: [
      { to: "A", p: 0.7, r: -1 },
      { to: "B", p: 0.3, r: -1 },
    ],
    right: [{ to: "B", p: 1.0, r: -1 }],
  },
  B: {
    left: [{ to: "A", p: 1.0, r: -1 }],
    right: [
      { to: "B", p: 0.2, r: -1 },
      { to: "C", p: 0.8, r: -1 },
    ],
  },
  C: {
    left: [{ to: "B", p: 1.0, r: -1 }],
    right: [{ to: "Terminal", p: 1.0, r: 8 }],
  },
};

const UNIFORM_POLICY: Policy = {
  A: { left: 0.5, right: 0.5 },
  B: { left: 0.5, right: 0.5 },
  C: { left: 0.5, right: 0.5 },
};

function normalizeTransitions(list: Transition[]) {
  const sum = list.reduce((acc, t) => acc + t.p, 0);
  if (sum <= 0) {
    const n = list.length;
    return list.map((t) => ({ ...t, p: 1 / n }));
  }
  return list.map((t) => ({ ...t, p: t.p / sum }));
}

function sampleOne(trans: Transition[]) {
  const u = Math.random();
  let acc = 0;
  for (const t of trans) {
    acc += t.p;
    if (u <= acc) return t;
  }
  return trans[trans.length - 1];
}

function expectedBackup({
  s,
  gamma,
  V,
  dynamics,
  policy,
}: {
  s: Exclude<S, "Terminal">;
  gamma: number;
  V: Record<S, number>;
  dynamics: Dynamics;
  policy: Policy;
}) {
  let v = 0;
  for (const a of ACTIONS) {
    const pi = policy[s][a];
    let q = 0;
    for (const t of dynamics[s][a]) {
      q += t.p * (t.r + gamma * V[t.to]);
    }
    v += pi * q;
  }
  return v;
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
      {subtitle ? <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function MarkovDecisionProcess() {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5); // steps per second
  const [gamma, setGamma] = useState(0.9);

  const [dynamics, setDynamics] = useState<Dynamics>(() => DEFAULT_DYNAMICS);
  const [policy, setPolicy] = useState<Policy>(() => UNIFORM_POLICY);

  const [state, setState] = useState<S>("A");
  const [steps, setSteps] = useState(0);
  const [episode, setEpisode] = useState(0);
  const [episodeReturn, setEpisodeReturn] = useState(0);
  const [recentReturns, setRecentReturns] = useState<number[]>([]);

  const [V, setV] = useState<Record<S, number>>({
    A: 0,
    B: 0,
    C: 0,
    Terminal: 0,
  });
  const [evalIters, setEvalIters] = useState(0);

  const lastRef = useRef<{ s?: S; a?: A; to?: S; r?: number } | null>(null);

  const avgReturn = useMemo(() => {
    if (recentReturns.length === 0) return 0;
    return recentReturns.reduce((a, b) => a + b, 0) / recentReturns.length;
  }, [recentReturns]);

  const reset = useCallback(() => {
    setPlaying(false);
    setDynamics(DEFAULT_DYNAMICS);
    setPolicy(UNIFORM_POLICY);
    setState("A");
    setSteps(0);
    setEpisode(0);
    setEpisodeReturn(0);
    setRecentReturns([]);
    setV({ A: 0, B: 0, C: 0, Terminal: 0 });
    setEvalIters(0);
    lastRef.current = null;
  }, []);

  const stepOnce = useCallback(() => {
    setState((sPrev) => {
      if (sPrev === "Terminal") {
        // new episode
        setEpisode((e) => e + 1);
        setRecentReturns((xs) => [...xs.slice(-29), episodeReturn]);
        setEpisodeReturn(0);
        lastRef.current = null;
        return "A";
      }

      const s0 = sPrev as Exclude<S, "Terminal">;
      // sample action from policy
      const u = Math.random();
      const a: A = u < policy[s0].left ? "left" : "right";
      const trans = normalizeTransitions(dynamics[s0][a]);
      const t = sampleOne(trans);
      lastRef.current = { s: s0, a, to: t.to, r: t.r };

      setEpisodeReturn((ret) => ret + t.r);
      setSteps((x) => x + 1);
      return t.to;
    });
  }, [dynamics, episodeReturn, policy]);

  const policyEvalStep = useCallback(() => {
    setV((prev) => {
      const next: Record<S, number> = { ...prev, Terminal: 0 };
      for (const s of NON_TERMINAL) {
        next[s] = expectedBackup({ s, gamma, V: prev, dynamics, policy });
      }
      return next;
    });
    setEvalIters((x) => x + 1);
  }, [dynamics, gamma, policy]);

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

  const setPolicyLeft = useCallback((s: Exclude<S, "Terminal">, pLeft: number) => {
    const left = clamp01(pLeft);
    const right = 1 - left;
    setPolicy((prev) => ({ ...prev, [s]: { left, right } }));
  }, []);

  const setProb_A_left_stay = useCallback((p: number) => {
    setDynamics((prev) => {
      const next: Dynamics = structuredClone(prev);
      const stay = clamp01(p);
      next.A.left = normalizeTransitions([
        { to: "A", p: stay, r: -1 },
        { to: "B", p: 1 - stay, r: -1 },
      ]);
      return next;
    });
  }, []);

  const pAStay = dynamics.A.left.find((t) => t.to === "A")?.p ?? 0.7;

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-mono border border-[var(--border-primary)] px-3 py-1 rounded-full bg-[var(--bg-secondary)]">
          Reinforcement Learning
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Markov Decision Process (MDP)
        </h1>
        <p className="mt-4 text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          An MDP is the mathematical model behind most reinforcement learning: <strong>states</strong>, <strong>actions</strong>,
          <strong> transition probabilities</strong>, and <strong>rewards</strong>. The “Markov” assumption says the future depends only on the current state and action.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card
            title="Definition"
            subtitle="An MDP is a 5-tuple (S, A, P, R, γ)."
          >
            <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 font-mono text-[12px] text-[var(--text-primary)] overflow-x-auto">
              S = set of states{"\n"}
              A = set of actions{"\n"}
              P(s'|s,a) = transition probabilities{"\n"}
              R(s,a,s') = reward function{"\n"}
              γ ∈ [0,1) = discount factor
            </div>

            <div className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              In this page we’ll use a tiny MDP with three non-terminal states (A,B,C) and one terminal state.
              You can change a transition probability, set a policy, roll out trajectories, and run policy evaluation.
            </div>
          </Card>

          <Card
            title="Bellman expectation (policy evaluation)"
            subtitle="Given a fixed policy π, you can compute V^π by repeatedly applying the Bellman backup."
          >
            <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 font-mono text-[12px] text-[var(--text-primary)] overflow-x-auto">
              V^π(s) = Σₐ π(a|s) Σₛ' P(s'|s,a) [ R(s,a,s') + γ V^π(s') ]
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={policyEvalStep}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm hover:bg-[var(--bg-secondary)]"
              >
                <Sigma className="h-4 w-4" />
                Policy eval step
              </button>
              <div className="text-xs text-[var(--text-secondary)]">
                iterations: <span className="font-mono text-[var(--text-primary)]">{evalIters}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Target className="h-4 w-4" />
                  <span>Interactive MDP</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Roll out a trajectory</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                  Press Step to sample <strong>action</strong> from π and then sample <strong>next state</strong> from P(·|s,a).
                  Terminal ends the episode; the next Step starts a new episode at A.
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

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {STATES.map((sId) => {
                const isHere = sId === state;
                const isTerm = sId === "Terminal";
                return (
                  <div
                    key={sId}
                    className={`rounded-xl border p-4 transition ${
                      isHere
                        ? "border-[var(--text-primary)] bg-[var(--bg-primary)]"
                        : "border-[var(--border-primary)] bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-[var(--text-primary)]">{sId}</div>
                      {isHere ? <span className="text-xs font-mono text-[var(--text-primary)]">●</span> : null}
                    </div>
                    <div className="mt-2 text-xs text-[var(--text-secondary)]">
                      V = <span className="font-mono text-[var(--text-primary)]">{round3(V[sId])}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
                      {isTerm ? "Terminal: no actions, V=0" : "Has actions: left/right"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="text-xs text-[var(--text-secondary)]">Episode</div>
                <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">{episode}</div>
                <div className="mt-3 text-xs text-[var(--text-secondary)]">Steps</div>
                <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">{steps}</div>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="text-xs text-[var(--text-secondary)]">Episode return</div>
                <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">{round3(episodeReturn)}</div>
                <div className="mt-3 text-xs text-[var(--text-secondary)]">Avg return (recent)</div>
                <div className="mt-1 font-mono text-sm text-[var(--text-primary)]">{round3(avgReturn)}</div>
              </div>
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="text-xs text-[var(--text-secondary)]">Last transition</div>
                <div className="mt-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-[12px] text-[var(--text-primary)]">
                  {lastRef.current?.s ? (
                    <>
                      s={lastRef.current.s}{"\n"}
                      a={lastRef.current.a}{"\n"}
                      r={round3(lastRef.current.r ?? 0)}{"\n"}
                      s'={lastRef.current.to}
                    </>
                  ) : (
                    <>Press Step to sample.</>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Policy π(a|s)</div>
                <div className="mt-3 space-y-3">
                  {NON_TERMINAL.map((sId) => (
                    <div key={sId} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-[var(--text-secondary)]">
                          State <span className="font-mono text-[var(--text-primary)]">{sId}</span>
                        </div>
                        <div className="font-mono text-xs text-[var(--text-primary)]">
                          left {round3(policy[sId].left)} · right {round3(policy[sId].right)}
                        </div>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={policy[sId].left}
                        onChange={(e) => setPolicyLeft(sId, Number(e.target.value))}
                        className="mt-2 w-full accent-[var(--text-primary)]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Edit a transition probability</div>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  Change how “slippery” action <span className="font-mono">left</span> in state A is:
                  it either stays in A or accidentally moves to B.
                </p>
                <div className="mt-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="text-[var(--text-secondary)]">
                      P(A | A,left)
                    </div>
                    <div className="font-mono text-[var(--text-primary)]">{round3(pAStay)}</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={pAStay}
                    onChange={(e) => setProb_A_left_stay(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                  />
                  <div className="mt-3 rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] p-3 font-mono text-[12px] text-[var(--text-primary)]">
                    A,left:{"\n"}
                    → A with p={round3(pAStay)}, r=-1{"\n"}
                    → B with p={round3(1 - pAStay)}, r=-1
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
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
            </div>

            <div className="mt-6 text-[11px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-primary)] pt-4">
              <strong>MDP intuition:</strong> a policy π turns an MDP into a Markov reward process. The Bellman expectation backup above
              is simply “expected immediate reward + discounted expected next value” under that policy.
            </div>
          </div>

          <Card
            title="Try these experiments"
            subtitle="Small changes here explain big behaviors in real RL."
          >
            <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                Set π(right|C)=1 to reach terminal quickly, then press “Policy eval step” repeatedly and watch V(C), V(B), V(A) rise.
              </li>
              <li>
                Decrease γ: terminal reward matters less far away, so V(A) shrinks relative to V(C).
              </li>
              <li>
                Increase P(A|A,left): action left in A becomes “sticky” and trajectories take longer, lowering expected returns.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}


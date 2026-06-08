"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Sigma,
  Sparkles,
  Target,
} from "lucide-react";

type MDPStateId = "A" | "B" | "C" | "D" | "T";
type ActionId = "left" | "right";

type Transition = { to: MDPStateId; p: number; r: number };
type Dynamics = Record<Exclude<MDPStateId, "T">, Record<ActionId, Transition[]>>;

const STATES: MDPStateId[] = ["A", "B", "C", "D", "T"];
const NON_TERMINAL: Exclude<MDPStateId, "T">[] = ["A", "B", "C", "D"];
const ACTIONS: ActionId[] = ["left", "right"];

const DEFAULT_DYNAMICS: Dynamics = {
  A: {
    left: [{ to: "A", p: 1, r: -1 }],
    right: [{ to: "B", p: 1, r: -1 }],
  },
  B: {
    left: [{ to: "A", p: 1, r: -1 }],
    right: [{ to: "C", p: 1, r: -1 }],
  },
  C: {
    left: [{ to: "B", p: 1, r: -1 }],
    right: [{ to: "D", p: 1, r: -1 }],
  },
  D: {
    left: [{ to: "C", p: 1, r: -1 }],
    // terminal gives a payoff then ends
    right: [{ to: "T", p: 1, r: 10 }],
  },
};

type Mode = "expectation" | "optimality";

type Policy = Record<Exclude<MDPStateId, "T">, Record<ActionId, number>>;

const UNIFORM_POLICY: Policy = {
  A: { left: 0.5, right: 0.5 },
  B: { left: 0.5, right: 0.5 },
  C: { left: 0.5, right: 0.5 },
  D: { left: 0.5, right: 0.5 },
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function round3(x: number) {
  return Math.round(x * 1000) / 1000;
}

function bellmanActionValue({
  s,
  a,
  gamma,
  V,
  dynamics,
}: {
  s: Exclude<MDPStateId, "T">;
  a: ActionId;
  gamma: number;
  V: Record<MDPStateId, number>;
  dynamics: Dynamics;
}) {
  const trans = dynamics[s][a];
  let q = 0;
  for (const t of trans) {
    q += t.p * (t.r + gamma * V[t.to]);
  }
  return q;
}

function bellmanUpdateState({
  s,
  mode,
  gamma,
  V,
  dynamics,
  policy,
}: {
  s: Exclude<MDPStateId, "T">;
  mode: Mode;
  gamma: number;
  V: Record<MDPStateId, number>;
  dynamics: Dynamics;
  policy: Policy;
}) {
  if (mode === "optimality") {
    const qL = bellmanActionValue({ s, a: "left", gamma, V, dynamics });
    const qR = bellmanActionValue({ s, a: "right", gamma, V, dynamics });
    return { vNew: Math.max(qL, qR), q: { left: qL, right: qR } };
  }
  const qL = bellmanActionValue({ s, a: "left", gamma, V, dynamics });
  const qR = bellmanActionValue({ s, a: "right", gamma, V, dynamics });
  const vNew = policy[s].left * qL + policy[s].right * qR;
  return { vNew, q: { left: qL, right: qR } };
}

function greedyAction(q: Record<ActionId, number>): ActionId {
  return q.right >= q.left ? "right" : "left";
}

function arrowForAction(a: ActionId) {
  return a === "right" ? "→" : "←";
}

function EquationCard({
  mode,
}: {
  mode: Mode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {mode === "optimality" ? <Sparkles className="h-4 w-4" /> : <Sigma className="h-4 w-4" />}
        <span>{mode === "optimality" ? "Bellman optimality equation" : "Bellman expectation equation"}</span>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4 font-mono text-[12px] text-[var(--text-primary)] overflow-x-auto">
        {mode === "optimality" ? (
          <div>
            <div className="opacity-80">V(s) = maxₐ Σₛ' P(s'|s,a) · [ R(s,a,s') + γ V(s') ]</div>
          </div>
        ) : (
          <div>
            <div className="opacity-80">V^π(s) = Σₐ π(a|s) Σₛ' P(s'|s,a) · [ R(s,a,s') + γ V^π(s') ]</div>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
        Read it as: <strong>value = immediate reward + discounted next value</strong>, averaged over what happens next.
        The only difference is whether you <strong>average over a policy</strong> (expectation) or take the <strong>best action</strong> (optimality).
      </p>
    </div>
  );
}

function StateRow({
  s,
  isTerminal,
  V,
  q,
  selected,
  onSelect,
  mode,
}: {
  s: MDPStateId;
  isTerminal: boolean;
  V: number;
  q?: Record<ActionId, number>;
  selected: boolean;
  onSelect: () => void;
  mode: Mode;
}) {
  const greedy = q ? greedyAction(q) : "right";
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border px-4 py-3 transition ${
        selected
          ? "border-[var(--text-primary)] bg-[var(--bg-primary)]"
          : "border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)]"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg border border-[var(--border-primary)] flex items-center justify-center font-semibold text-[var(--text-primary)]">
            {s}
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {isTerminal ? "Terminal" : "State"}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {isTerminal ? "V(T) is fixed at 0" : mode === "optimality" ? "Greedy backup" : "Policy-weighted backup"}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-[var(--text-secondary)]">V</div>
          <div className="font-mono text-sm text-[var(--text-primary)]">{round3(V)}</div>
        </div>
      </div>

      {!isTerminal && q ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Q(left)</span>
              <span className="font-mono">{round3(q.left)}</span>
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Q(right)</span>
              <span className="font-mono">{round3(q.right)}</span>
            </div>
          </div>
          <div className="col-span-2 text-[11px] text-[var(--text-secondary)]">
            Greedy action: <span className="font-mono text-[var(--text-primary)]">{arrowForAction(greedy)}</span>
          </div>
        </div>
      ) : null}
    </button>
  );
}

function DerivationPanel({
  s,
  gamma,
  V,
  dynamics,
  policy,
  mode,
}: {
  s: Exclude<MDPStateId, "T">;
  gamma: number;
  V: Record<MDPStateId, number>;
  dynamics: Dynamics;
  policy: Policy;
  mode: Mode;
}) {
  const qLeft = bellmanActionValue({ s, a: "left", gamma, V, dynamics });
  const qRight = bellmanActionValue({ s, a: "right", gamma, V, dynamics });
  const greedy = greedyAction({ left: qLeft, right: qRight });
  const vNew =
    mode === "optimality"
      ? Math.max(qLeft, qRight)
      : policy[s].left * qLeft + policy[s].right * qRight;

  const transLeft = dynamics[s].left;
  const transRight = dynamics[s].right;

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">One backup, explained</div>
          <h3 className="mt-1 text-lg font-bold text-[var(--text-primary)]">
            Updating state <span className="font-mono">{s}</span>
          </h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--text-secondary)]">New value</div>
          <div className="font-mono text-base text-[var(--text-primary)]">{round3(vNew)}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-2">Compute Q(left)</div>
          <div className="font-mono text-[12px] text-[var(--text-primary)] space-y-1">
            {transLeft.map((t, i) => (
              <div key={i} className="opacity-90">
                {t.p} · ( {t.r} + {round3(gamma)}·V({t.to})={round3(gamma)}·{round3(V[t.to])} ) ={" "}
                {round3(t.p * (t.r + gamma * V[t.to]))}
              </div>
            ))}
            <div className="pt-1 border-t border-[var(--border-primary)]">
              Q(left) = {round3(qLeft)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-2">Compute Q(right)</div>
          <div className="font-mono text-[12px] text-[var(--text-primary)] space-y-1">
            {transRight.map((t, i) => (
              <div key={i} className="opacity-90">
                {t.p} · ( {t.r} + {round3(gamma)}·V({t.to})={round3(gamma)}·{round3(V[t.to])} ) ={" "}
                {round3(t.p * (t.r + gamma * V[t.to]))}
              </div>
            ))}
            <div className="pt-1 border-t border-[var(--border-primary)]">
              Q(right) = {round3(qRight)}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
          <div className="text-xs text-[var(--text-secondary)] mb-2">
            Combine into V({s})
          </div>
          <div className="font-mono text-[12px] text-[var(--text-primary)]">
            {mode === "optimality" ? (
              <div>
                V({s}) = max(Q(left), Q(right)) = max({round3(qLeft)}, {round3(qRight)}) ={" "}
                <span className="font-semibold">{round3(vNew)}</span>
                <div className="mt-2 text-[11px] text-[var(--text-secondary)]">
                  Greedy action is {arrowForAction(greedy)}.
                </div>
              </div>
            ) : (
              <div>
                V<sup>π</sup>({s}) = π(left|{s})·Q(left) + π(right|{s})·Q(right)
                <div className="mt-1 opacity-90">
                  = {round3(policy[s].left)}·{round3(qLeft)} + {round3(policy[s].right)}·{round3(qRight)} ={" "}
                  <span className="font-semibold">{round3(vNew)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BellmanEqualtion() {
  const [mode, setMode] = useState<Mode>("optimality");
  const [gamma, setGamma] = useState(0.9);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6); // backups per second
  const [selected, setSelected] = useState<Exclude<MDPStateId, "T">>("B");
  const [iteration, setIteration] = useState(0);

  const dynamics = useMemo(() => DEFAULT_DYNAMICS, []);

  const [policy, setPolicy] = useState<Policy>(UNIFORM_POLICY);
  const [V, setV] = useState<Record<MDPStateId, number>>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    T: 0,
  });

  const lastQRef = useRef<Record<Exclude<MDPStateId, "T">, Record<ActionId, number>>>({
    A: { left: 0, right: 0 },
    B: { left: 0, right: 0 },
    C: { left: 0, right: 0 },
    D: { left: 0, right: 0 },
  });

  const recomputeAllQ = useCallback(
    (vNow: Record<MDPStateId, number>) => {
      const next: typeof lastQRef.current = { ...lastQRef.current };
      for (const s of NON_TERMINAL) {
        const qL = bellmanActionValue({ s, a: "left", gamma, V: vNow, dynamics });
        const qR = bellmanActionValue({ s, a: "right", gamma, V: vNow, dynamics });
        next[s] = { left: qL, right: qR };
      }
      lastQRef.current = next;
    },
    [dynamics, gamma],
  );

  useEffect(() => {
    recomputeAllQ(V);
  }, [V, recomputeAllQ]);

  const normalizePolicyRow = useCallback((pLeft: number) => {
    const left = clamp01(pLeft);
    const right = 1 - left;
    return { left, right };
  }, []);

  const setPolicyForSelected = useCallback(
    (pLeft: number) => {
      const row = normalizePolicyRow(pLeft);
      setPolicy((prev) => ({ ...prev, [selected]: row }));
    },
    [normalizePolicyRow, selected],
  );

  const reset = useCallback(() => {
    setPlaying(false);
    setIteration(0);
    setV({ A: 0, B: 0, C: 0, D: 0, T: 0 });
    setPolicy(UNIFORM_POLICY);
  }, []);

  const stepOnce = useCallback(() => {
    setV((prev) => {
      const next: Record<MDPStateId, number> = { ...prev };
      // synchronous backup over all non-terminal states
      for (const s of NON_TERMINAL) {
        const { vNew } = bellmanUpdateState({
          s,
          mode,
          gamma,
          V: prev,
          dynamics,
          policy,
        });
        next[s] = vNew;
      }
      next.T = 0;
      return next;
    });
    setIteration((i) => i + 1);
  }, [dynamics, gamma, mode, policy]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const intervalMs = 1000 / Math.max(1, speed);

    const loop = (now: number) => {
      if (now - last >= intervalMs) {
        last = now;
        stepOnce();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, stepOnce]);

  const selectedPolicyLeft = policy[selected].left;
  const qForSelected = lastQRef.current[selected];

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Bellman Equation
        </h1>
        <p className="mt-4 text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          The Bellman equation is the core “backup” identity behind dynamic programming and modern reinforcement learning.
          In this simulation, you’ll watch values update step-by-step as the equation propagates information through an MDP.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <EquationCard mode={mode} />

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Simulation controls</div>
                <div className="mt-1 text-sm font-semibold text-[var(--text-primary)]">Value iteration (synchronous backups)</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--text-secondary)]">Iteration</div>
                <div className="font-mono text-sm text-[var(--text-primary)]">{iteration}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
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

            <div className="mt-4 grid gap-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("expectation")}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    mode === "expectation"
                      ? "border-[var(--text-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      : "border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                  }`}
                >
                  Expectation
                </button>
                <button
                  onClick={() => setMode("optimality")}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    mode === "optimality"
                      ? "border-[var(--text-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      : "border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
                  }`}
                >
                  Optimality
                </button>
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
                <div className="mt-2 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Lower γ makes the agent more “short-sighted”; higher γ propagates terminal rewards farther back.
                </div>
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
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <Target className="h-4 w-4" />
                  <span>The MDP (a tiny corridor)</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-[var(--text-primary)]">
                  A → B → C → D → T
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                  Each step costs <span className="font-mono">-1</span>. From <span className="font-mono">D</span>, going right reaches terminal
                  with reward <span className="font-mono">+10</span>. Value iteration uses the Bellman equation to push that information backward.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {STATES.map((s) => (
                <StateRow
                  key={s}
                  s={s}
                  isTerminal={s === "T"}
                  V={V[s]}
                  q={s === "T" ? undefined : lastQRef.current[s as Exclude<MDPStateId, "T">]}
                  selected={s === selected}
                  onSelect={() => {
                    if (s !== "T") setSelected(s);
                  }}
                  mode={mode}
                />
              ))}
            </div>

            {mode === "expectation" ? (
              <div className="mt-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
                <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Policy π(a|s)</div>
                <div className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  In expectation mode, the backup averages over actions using a policy. Select a state and adjust π(left|s). (π(right|s) is \(1-π(left|s)\).)
                </div>
                <div className="mt-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-[var(--text-secondary)]">
                      Selected state: <span className="font-mono text-[var(--text-primary)]">{selected}</span>
                    </div>
                    <div className="font-mono text-xs text-[var(--text-primary)]">
                      π(left)={round3(selectedPolicyLeft)} · π(right)={round3(1 - selectedPolicyLeft)}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={selectedPolicyLeft}
                    onChange={(e) => setPolicyForSelected(Number(e.target.value))}
                    className="mt-2 w-full accent-[var(--text-primary)]"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 text-[11px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-primary)] pt-4">
                <strong>Tip:</strong> In optimality mode, a “max” chooses the best action. You should see values propagate leftward quickly because
                “go right” becomes optimal everywhere once the terminal payoff dominates.
              </div>
            )}
          </div>

          <DerivationPanel
            s={selected}
            gamma={gamma}
            V={V}
            dynamics={dynamics}
            policy={policy}
            mode={mode}
          />

          <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              <Sigma className="h-4 w-4" />
              <span>What to notice</span>
            </div>
            <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              <li>
                <strong>Bootstrapping:</strong> values update using other values (the \(γV(s')\) term), so information flows through the state graph over iterations.
              </li>
              <li>
                <strong>Expectation vs optimality:</strong> switch modes to see how the backup changes from “average under π” to “take the best action.”
              </li>
              <li>
                <strong>γ controls horizon:</strong> with smaller γ, terminal reward matters less far away; with larger γ it propagates farther back.
              </li>
              <li>
                <strong>Q-values are just intermediate:</strong> they make the max/average explicit, and are what Q-learning-style methods learn directly.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


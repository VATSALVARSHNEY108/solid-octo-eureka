"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, Lightbulb, Play, Pause, RotateCcw, ArrowRight } from "lucide-react";

/* ============================================================
   GridWorld environment
   - 5x7 grid with a Cliff along the bottom row (classic Sutton & Barto setup)
   - Start at bottom-left, Goal at bottom-right
   - Stepping on cliff -> reward -100, teleport to Start
   - Every other step: reward -1
   - Reaching goal: reward 0 and terminate
============================================================ */
const ROWS = 5;
const COLS = 9;
const START: [number, number] = [ROWS - 1, 0];
const GOAL: [number, number] = [ROWS - 1, COLS - 1];
const isCliff = (r: number, c: number) =>
  r === ROWS - 1 && c > 0 && c < COLS - 1;

type Action = 0 | 1 | 2 | 3; // up, right, down, left
const ACTIONS: Action[] = [0, 1, 2, 3];
const ARROWS = ["↑", "→", "↓", "←"];
const DELTA: Record<Action, [number, number]> = {
  0: [-1, 0],
  1: [0, 1],
  2: [1, 0],
  3: [0, -1],
};

function step(r: number, c: number, a: Action) {
  const [dr, dc] = DELTA[a];
  let nr = Math.max(0, Math.min(ROWS - 1, r + dr));
  let nc = Math.max(0, Math.min(COLS - 1, c + dc));
  let reward = -1;
  let done = false;
  if (isCliff(nr, nc)) {
    reward = -100;
    nr = START[0];
    nc = START[1];
  } else if (nr === GOAL[0] && nc === GOAL[1]) {
    reward = 0;
    done = true;
  }
  return { nr, nc, reward, done };
}

/* ============================================================
   Q-table helpers
============================================================ */
type QTable = number[][][]; // [r][c][a]
const makeQ = (): QTable =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => [0, 0, 0, 0]),
  );

function epsGreedy(q: QTable, r: number, c: number, eps: number): Action {
  if (Math.random() < eps) {
    return ACTIONS[Math.floor(Math.random() * 4)];
  }
  const row = q[r][c];
  let best: Action = 0;
  let bestV = row[0];
  for (let a = 1 as Action; a < 4; a++) {
    if (row[a] > bestV) {
      bestV = row[a];
      best = a;
    }
  }
  return best;
}

const maxQ = (q: QTable, r: number, c: number) =>
  Math.max(q[r][c][0], q[r][c][1], q[r][c][2], q[r][c][3]);

/* ============================================================
   Slides — the explanation flow
============================================================ */
type Slide = {
  title: string;
  body: React.ReactNode;
  hint?: string;
};

const SLIDES: Slide[] = [
  {
    title: "1 · The setup — Reinforcement Learning",
    body: (
      <>
        <p>
          An <strong>agent</strong> lives in an <strong>environment</strong>. At every time step it
          observes a <strong>state</strong> <code>s</code>, picks an <strong>action</strong>{" "}
          <code>a</code>, then receives a <strong>reward</strong> <code>r</code> and a
          next state <code>s'</code>.
        </p>
        <p>
          Its goal is to learn a <strong>policy</strong> — a way to choose actions — that
          maximizes the long-run sum of rewards.
        </p>
        <p>
          Below is a tiny world. The agent starts on the bottom-left and
          must reach the goal (green) on the bottom-right. The red strip is a{" "}
          <strong>cliff</strong>: stepping on it costs <code>-100</code> and sends the
          agent back to start. Every other step costs <code>-1</code>.
        </p>
      </>
    ),
    hint: "Press Play to watch the agents learn.",
  },
  {
    title: "2 · The Q-function",
    body: (
      <>
        <p>
          <code>Q(s, a)</code> estimates the total future reward you expect if
          you take action <code>a</code> in state <code>s</code>, then follow
          your policy afterwards.
        </p>
        <p>
          We store one number per (cell, action). The arrows on each cell show
          the action with the highest Q-value — that is the agent's currently
          preferred move.
        </p>
        <p>
          The cell shading reflects <code>maxₐ Q(s, a)</code>: brighter = more
          valuable.
        </p>
      </>
    ),
  },
  {
    title: "3 · Exploration vs exploitation (ε-greedy)",
    body: (
      <>
        <p>
          With probability <code>ε</code> the agent picks a random action
          (explore); otherwise it picks the greedy one (exploit).
        </p>
        <p>
          A bit of randomness is essential — without it the agent would never
          discover better paths. We use <code>ε = 0.1</code> here.
        </p>
      </>
    ),
  },
  {
    title: "4 · Q-Learning — the off-policy update",
    body: (
      <>
        <p>The update rule is:</p>
        <pre className="rounded-md bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)] border border-[var(--border-primary)] overflow-x-auto font-mono">
{`Q(s, a) ← Q(s, a) + α · [ r + γ · maxₐ' Q(s', a') − Q(s, a) ]`}
        </pre>
        <p>
          Notice the <strong>max</strong>: we bootstrap from the <em>best possible</em>{" "}
          next action, even if our ε-greedy policy wouldn't actually take it.
          That is why Q-learning is called <strong>off-policy</strong> — it learns the
          value of the greedy policy while behaving more randomly.
        </p>
        <p>
          Consequence: Q-learning learns the <strong>optimal</strong> path, which here
          runs right along the edge of the cliff. It still falls in
          occasionally because of ε-exploration.
        </p>
      </>
    ),
  },
  {
    title: "5 · SARSA — the on-policy update",
    body: (
      <>
        <p>SARSA actually samples the next action <code>a'</code> and uses it:</p>
        <pre className="rounded-md bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)] border border-[var(--border-primary)] overflow-x-auto font-mono">
{`Q(s, a) ← Q(s, a) + α · [ r + γ · Q(s', a') − Q(s, a) ]`}
        </pre>
        <p>
          The name comes from the tuple it uses: <strong>S</strong>tate, <strong>A</strong>ction,{" "}
          <strong>R</strong>eward, next <strong>S</strong>tate, next <strong>A</strong>ction.
        </p>
        <p>
          Because the bootstrap target depends on what the agent <em>really</em>{" "}
          does (including occasional random moves), SARSA is <strong>on-policy</strong>.
          It learns the value of the ε-greedy policy itself — so it prefers a{" "}
          <strong>safer</strong> path that stays away from the cliff.
        </p>
      </>
    ),
  },
  {
    title: "6 · Watch them diverge",
    body: (
      <>
        <p>
          Both agents are training on identical worlds in parallel. Look at the
          arrows after a few hundred steps:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Q-Learning</strong> hugs the cliff — optimal but risky under
            exploration.
          </li>
          <li>
            <strong>SARSA</strong> takes the long way around — slightly suboptimal but
            far less likely to fall.
          </li>
        </ul>
        <p>
          That is the whole story: <strong>off-policy = learn the greedy ideal</strong>,{" "}
          <strong>on-policy = learn the policy you actually follow</strong>.
        </p>
      </>
    ),
    hint: "Use Reset to start over and compare again.",
  },
];

/* ============================================================
   Simulation hook — runs Q-learning and SARSA in lock-step
============================================================ */
const ALPHA = 0.5;
const GAMMA = 1.0;
const EPS = 0.1;

type AgentState = {
  q: QTable;
  r: number;
  c: number;
  nextA: Action; // for SARSA: pre-sampled next action
  episode: number;
  steps: number;
  episodeReturn: number;
  lastReturns: number[]; // recent episode returns
};

function newAgent(): AgentState {
  const q = makeQ();
  return {
    q,
    r: START[0],
    c: START[1],
    nextA: epsGreedy(q, START[0], START[1], EPS),
    episode: 0,
    steps: 0,
    episodeReturn: 0,
    lastReturns: [],
  };
}

function qLearningStep(s: AgentState): AgentState {
  const a = epsGreedy(s.q, s.r, s.c, EPS);
  const { nr, nc, reward, done } = step(s.r, s.c, a);
  const target = reward + GAMMA * maxQ(s.q, nr, nc);
  s.q[s.r][s.c][a] += ALPHA * (target - s.q[s.r][s.c][a]);
  const episodeReturn = s.episodeReturn + reward;
  if (done) {
    return {
      ...s,
      r: START[0],
      c: START[1],
      episode: s.episode + 1,
      steps: s.steps + 1,
      episodeReturn: 0,
      lastReturns: [...s.lastReturns.slice(-49), episodeReturn],
    };
  }
  return { ...s, r: nr, c: nc, steps: s.steps + 1, episodeReturn };
}

function sarsaStep(s: AgentState): AgentState {
  const a = s.nextA;
  const { nr, nc, reward, done } = step(s.r, s.c, a);
  const aPrime = epsGreedy(s.q, nr, nc, EPS);
  const target = reward + GAMMA * s.q[nr][nc][aPrime];
  s.q[s.r][s.c][a] += ALPHA * (target - s.q[s.r][s.c][a]);
  const episodeReturn = s.episodeReturn + reward;
  if (done) {
    const r0 = START[0];
    const c0 = START[1];
    return {
      ...s,
      r: r0,
      c: c0,
      nextA: epsGreedy(s.q, r0, c0, EPS),
      episode: s.episode + 1,
      steps: s.steps + 1,
      episodeReturn: 0,
      lastReturns: [...s.lastReturns.slice(-49), episodeReturn],
    };
  }
  return {
    ...s,
    r: nr,
    c: nc,
    nextA: aPrime,
    steps: s.steps + 1,
    episodeReturn,
  };
}

/* ============================================================
   Grid renderer
============================================================ */
function Grid({
  agent,
  color,
}: {
  agent: AgentState;
  color: string;
}) {
  // Compute V(s) = max_a Q(s,a) range for shading
  let vMin = Infinity;
  let vMax = -Infinity;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (isCliff(r, c)) continue;
      const v = maxQ(agent.q, r, c);
      if (v < vMin) vMin = v;
      if (v > vMax) vMax = v;
    }
  }
  if (!isFinite(vMin) || vMin === vMax) {
    vMin = -1;
    vMax = 0;
  }

  return (
    <div
      className="grid gap-1 border border-[var(--border-primary)] p-1 rounded-lg bg-[var(--bg-secondary)]"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((__, c) => {
          const cliff = isCliff(r, c);
          const isStart = r === START[0] && c === START[1];
          const isGoal = r === GOAL[0] && c === GOAL[1];
          const isAgent = r === agent.r && c === agent.c;

          let bg = "var(--bg-primary)";
          if (cliff) bg = "rgba(239, 68, 68, 0.2)"; // custom transparent red
          else if (isGoal) bg = "rgba(34, 197, 94, 0.2)"; // custom transparent green
          else if (isStart) bg = "rgba(59, 130, 246, 0.2)"; // custom transparent blue
          else {
            const v = maxQ(agent.q, r, c);
            const t = (v - vMin) / (vMax - vMin || 1);
            // Dynamic white shading for high contrast light/dark mode
            bg = `rgba(255, 255, 255, ${Math.min(0.25, t * 0.25)})`;
          }

          // pick best action arrow
          const row = agent.q[r][c];
          let best: Action = 0;
          let bestV = row[0];
          for (let a = 1 as Action; a < 4; a++) {
            if (row[a] > bestV) {
              bestV = row[a];
              best = a;
            }
          }
          const showArrow =
            !cliff && !isGoal && (row[0] || row[1] || row[2] || row[3]);

          return (
            <div
              key={`${r}-${c}`}
              className="relative aspect-square rounded flex items-center justify-center text-xs font-semibold border border-[var(--border-primary)]"
              style={{ backgroundColor: bg, color: "var(--text-primary)" }}
            >
              {cliff && <span className="text-red-500 font-bold">×</span>}
              {isStart && !isAgent && <span className="text-[10px] text-blue-500">S</span>}
              {isGoal && <span className="text-green-500">G</span>}
              {showArrow && !isAgent && !isStart && (
                <span className="opacity-70 text-sm font-bold text-[var(--text-primary)]">{ARROWS[best]}</span>
              )}
              {isAgent && (
                <span
                  className="absolute inset-1.5 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

/* ============================================================
   Stats card
============================================================ */
function Stats({ agent }: { agent: AgentState }) {
  const avg =
    agent.lastReturns.length === 0
      ? 0
      : agent.lastReturns.reduce((a, b) => a + b, 0) /
        agent.lastReturns.length;
  return (
    <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
      <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2">
        <div className="text-[var(--text-secondary)]">Episodes</div>
        <div className="text-base font-semibold text-[var(--text-primary)]">
          {agent.episode}
        </div>
      </div>
      <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2">
        <div className="text-[var(--text-secondary)]">Steps</div>
        <div className="text-base font-semibold text-[var(--text-primary)]">
          {agent.steps}
        </div>
      </div>
      <div className="rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2">
        <div className="text-[var(--text-secondary)]">Avg return</div>
        <div className="text-base font-semibold text-[var(--text-primary)]">
          {avg.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

export default function Qlearning() {
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(20); // steps per tick
  const [tick, setTick] = useState(0);

  const qAgentRef = useRef<AgentState>(newAgent());
  const sAgentRef = useRef<AgentState>(newAgent());

  // Animation loop
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      if (dt > 1000 / 30) {
        last = now;
        for (let i = 0; i < speed; i++) {
          qAgentRef.current = qLearningStep(qAgentRef.current);
          sAgentRef.current = sarsaStep(sAgentRef.current);
        }
        setTick((t) => t + 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  const reset = useCallback(() => {
    qAgentRef.current = newAgent();
    sAgentRef.current = newAgent();
    setTick((t) => t + 1);
  }, []);

  const stepOnce = useCallback(() => {
    qAgentRef.current = qLearningStep(qAgentRef.current);
    sAgentRef.current = sarsaStep(sAgentRef.current);
    setTick((t) => t + 1);
  }, []);

  const current = SLIDES[slide];

  // Avoid "unused tick" warning; tick triggers re-render
  void tick;

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
          Q-Learning & SARSA
        </h1>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
          Q-Learning and SARSA are fundamental, model-free reinforcement learning algorithms. While Q-Learning is an off-policy algorithm that learns the value of the optimal policy independently of the agent's actions, SARSA is an on-policy algorithm that learns the value of the policy currently being executed.
        </p>
      </motion.div>

      {/* Explanation slider */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col justify-between gap-4">
          <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex-grow min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-4">
                <Lightbulb className="w-4 h-4" />
                <span>Concept {slide + 1} / {SLIDES.length}</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">{current.title}</h3>
              <div className="text-[var(--text-secondary)] space-y-3 text-sm leading-relaxed">
                {current.body}
              </div>
            </div>
            {current.hint && (
              <div className="mt-4 p-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-xs text-amber-500 font-semibold">
                Tip: {current.hint}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSlide((s) => Math.max(0, s - 1))}
              disabled={slide === 0}
              className="px-4 py-2 text-sm font-medium border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] disabled:opacity-40"
            >
              ← Prev
            </button>
            <div className="flex gap-1">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 w-4 rounded-full transition ${
                    i === slide ? "bg-[var(--text-primary)]" : "bg-[var(--border-primary)] hover:bg-[var(--text-secondary)]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setSlide((s) => Math.min(SLIDES.length - 1, s + 1))}
              disabled={slide === SLIDES.length - 1}
              className="px-4 py-2 text-sm font-medium border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Visualizer Panel */}
        <div className="lg:col-span-3 p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={stepOnce}
              disabled={playing}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4" />
              Step
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm hover:bg-[var(--bg-secondary)]"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <div className="ml-auto flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <label htmlFor="speed-slider">Speed</label>
              <input
                id="speed-slider"
                type="range"
                min={1}
                max={200}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-24 accent-[var(--text-primary)]"
              />
              <span className="w-8 text-right font-mono">
                {speed}×
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-bold text-sm mb-2 text-[var(--text-primary)]">
                <span className="text-blue-500 mr-2">●</span>Q-Learning (Off-Policy)
              </h4>
              <Grid agent={qAgentRef.current} color="#3b82f6" />
              <Stats agent={qAgentRef.current} />
            </div>

            <div>
              <h4 className="font-bold text-sm mb-2 text-[var(--text-primary)]">
                <span className="text-fuchsia-500 mr-2">●</span>SARSA (On-Policy)
              </h4>
              <Grid agent={sAgentRef.current} color="#d946ef" />
              <Stats agent={sAgentRef.current} />
            </div>
          </div>

          <div className="mt-6 text-[11px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-primary)] pt-4">
            <strong>Legend:</strong> <span className="text-green-500">G</span> Goal ·{" "}
            <span className="text-blue-500">S</span> Start ·{" "}
            <span className="text-red-500">×</span> Cliff (Reward -100, reset to start) ·{" "}
            Arrows show each cell's greedy action · Brighter cells represent higher values.
          </div>
        </div>
      </div>
    </div>
  );
}

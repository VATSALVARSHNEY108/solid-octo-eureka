"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, Lightbulb, Play, Pause, RotateCcw, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { Formula } from "@/components/Formula";

// 1D Cliff walk environment for Actor-Critic simulation
// 7 states: [Start, S1, S2, S3, S4, Cliff, Goal]
// Left (Action 0), Right (Action 1)
const STATES_COUNT = 7;
const START_STATE = 0;
const GOAL_STATE = 6;
const CLIFF_STATE = 5;

// Rewards: Goal -> +10, Cliff -> -50, Others -> -1
function getRewardAndNextState(state: number, action: number): { nextState: number; reward: number; done: boolean } {
  if (state === GOAL_STATE || state === CLIFF_STATE) {
    return { nextState: state, reward: 0, done: true };
  }

  // Left action
  if (action === 0) {
    const nextState = Math.max(0, state - 1);
    return { nextState, reward: -1, done: false };
  }
  
  // Right action
  const nextState = state + 1;
  if (nextState === CLIFF_STATE) {
    return { nextState: START_STATE, reward: -50, done: false }; // cliff resets to start
  }
  if (nextState === GOAL_STATE) {
    return { nextState, reward: 10, done: true };
  }
  return { nextState, reward: -1, done: false };
}

export default function ActorCritic() {
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  
  // Actor-Critic agent state
  // Critic: State value function V(s)
  const [V, setV] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  
  // Actor: Policy preference parameters theta[state][action]
  // In each state, we choose Action Left (index 0) or Action Right (index 1)
  const [theta, setTheta] = useState<number[][]>([
    [0.5, 0.5], // Start
    [0.5, 0.5], // S1
    [0.5, 0.5], // S2
    [0.5, 0.5], // S3
    [0.5, 0.5], // S4
    [0.5, 0.5], // Cliff (terminal)
    [0.5, 0.5], // Goal (terminal)
  ]);

  const [agentState, setAgentState] = useState<number>(START_STATE);
  const [lastAction, setLastAction] = useState<number | null>(null);
  const [lastTDError, setLastTDError] = useState<number | null>(null);
  const [episodeCount, setEpisodeCount] = useState<number>(0);
  const [recentRewards, setRecentRewards] = useState<number[]>([]);
  const [currentEpisodeReturn, setCurrentEpisodeReturn] = useState<number>(0);

  // Hyperparameters
  const alpha_critic = 0.2;
  const alpha_actor = 0.1;
  const gamma = 0.95;

  // Softmax helper to get action probabilities
  const getProbs = useCallback((state: number): number[] => {
    const preferences = theta[state];
    const maxPref = Math.max(...preferences);
    const exps = preferences.map(p => Math.exp(p - maxPref));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  }, [theta]);

  // Reset agent parameters and learning
  const resetLearning = () => {
    setV([0, 0, 0, 0, 0, 0, 0]);
    setTheta([
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
      [0.5, 0.5],
    ]);
    setAgentState(START_STATE);
    setLastAction(null);
    setLastTDError(null);
    setStepCount(0);
    setEpisodeCount(0);
    setRecentRewards([]);
    setCurrentEpisodeReturn(0);
    setPlaying(false);
  };

  // Perform single step of Actor-Critic
  const runSingleStep = useCallback(() => {
    let currentState = agentState;
    if (currentState === GOAL_STATE || currentState === CLIFF_STATE) {
      // Start a new episode if at a terminal state
      currentState = START_STATE;
      setAgentState(START_STATE);
      setCurrentEpisodeReturn(0);
      return;
    }

    // 1. Choose action using actor's policy probabilities
    const probs = getProbs(currentState);
    const action = Math.random() < probs[0] ? 0 : 1;
    setLastAction(action);

    // 2. Interact with environment
    const { nextState, reward, done } = getRewardAndNextState(currentState, action);
    
    // 3. Critic evaluates the state-value change: Compute TD Error / Advantage
    const targetValue = done ? reward : reward + gamma * V[nextState];
    const tdError = targetValue - V[currentState];
    setLastTDError(tdError);

    // Update state value function V(s)
    const newV = [...V];
    newV[currentState] = V[currentState] + alpha_critic * tdError;
    setV(newV);

    // Update policy parameters theta[s][a]
    const newTheta = theta.map((row, sIdx) => {
      if (sIdx !== currentState) return row;
      const currentProbs = getProbs(currentState);
      return row.map((pref, aIdx) => {
        // gradient policy update rule
        const indicator = aIdx === action ? 1 : 0;
        return pref + alpha_actor * tdError * (indicator - currentProbs[aIdx]);
      });
    });
    setTheta(newTheta);

    // Transition to next state
    setAgentState(nextState);
    setStepCount(prev => prev + 1);
    setCurrentEpisodeReturn(prev => prev + reward);

    if (done) {
      setEpisodeCount(prev => prev + 1);
      setRecentRewards(prev => [...prev.slice(-29), currentEpisodeReturn + reward]);
    }
  }, [agentState, V, theta, getProbs, currentEpisodeReturn]);

  // Simulation timer
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      runSingleStep();
    }, 300);
    return () => clearInterval(interval);
  }, [playing, runSingleStep]);

  const avgReturn = recentRewards.length > 0 
    ? (recentRewards.reduce((a, b) => a + b, 0) / recentRewards.length).toFixed(1)
    : "0.0";

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-mono border border-[var(--border-primary)] px-3 py-1 rounded-full bg-[var(--bg-secondary)]">
          Reinforcement Learning
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mt-4 mb-6">
          Actor-Critic Architecture
        </h1>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-4xl">
          Actor-Critic is a hybrid reinforcement learning architecture that combines the strengths of both <strong>policy-based</strong> (Actor) and <strong>value-based</strong> (Critic) methods to achieve stable, sample-efficient learning in complex environments.
        </p>
      </motion.div>

      {/* Highlights / Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)]">
              <Cpu className="w-6 h-6 text-[var(--text-primary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Policy vs Value-Based</h3>
          </div>
          <ul className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <li>
              <strong>Policy-based RL:</strong> Modifies policies directly to maximize return. Great for high-dimensional, continuous, or stochastic action spaces, but suffers from high gradient variance.
            </li>
            <li>
              <strong>Value-based RL:</strong> Learns the expected return of states/actions, deriving the optimal policy implicitly. Exceptionally sample-efficient and stable.
            </li>
            <li className="border-t border-[var(--border-primary)] pt-4">
              <strong>Actor-Critic Fusion:</strong> The <em>Actor</em> proposes actions via a policy, and the <em>Critic</em> evaluates those actions using value-estimates, significantly reducing policy gradient variance.
            </li>
          </ul>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">The Feedback Loop</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
              Critic calculates the **TD Error** (advantage signal) which guides policy updates in the Actor.
            </p>
          </div>
          
          {/* Custom SVG Architecture Diagram */}
          <div className="w-full flex justify-center py-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)]">
            <svg width="320" height="240" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text-primary)]">
              {/* Outer boundary / loop lines */}
              <path d="M 60 190 L 60 50 L 120 50" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" strokeDasharray="3 3"/>
              <path d="M 200 50 L 260 50 L 260 190" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"/>
              <path d="M 260 210 L 60 210" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"/>
              
              {/* Box 1: Actor (Policy) */}
              <rect x="120" y="30" width="80" height="40" rx="6" fill="var(--bg-secondary)" stroke="currentColor" strokeWidth="2" />
              <text x="160" y="55" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">Actor (Policy)</text>
              
              {/* Box 2: Critic (Value) */}
              <rect x="120" y="100" width="80" height="40" rx="6" fill="var(--bg-secondary)" stroke="currentColor" strokeWidth="2" />
              <text x="160" y="125" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">Critic (Value)</text>

              {/* Box 3: Environment */}
              <rect x="100" y="180" width="120" height="40" rx="6" fill="var(--bg-primary)" stroke="currentColor" strokeWidth="2" />
              <text x="160" y="205" fill="currentColor" fontSize="12" fontWeight="bold" textAnchor="middle">Environment</text>

              {/* Signals */}
              <path d="M 60 120 L 120 120" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"/>
              <text x="35" y="115" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">state (s)</text>
              <text x="285" y="115" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">action (a)</text>
              <text x="160" y="235" fill="var(--text-secondary)" fontSize="10" fontWeight="bold">reward (r) & next state (s')</text>
              
              {/* TD Error Connection */}
              <path d="M 160 100 L 160 70" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"/>
              <text x="182" y="90" fill="currentColor" fontSize="10" fontWeight="bold" textAnchor="middle">TD Error (δ)</text>

              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Proof / Mathematics Section */}
      <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-primary)]">
            <ShieldCheck className="w-6 h-6 text-[var(--text-primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Mathematical Proof: Baseline Unbiasedness</h2>
        </div>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Standard policy gradient algorithms suffer from high variance. Subtracted baselines reduce variance without introducing bias. Here is the complete proof that the expected value of the baseline gradient term equals zero:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col gap-4 bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-primary)]">
            <div className="text-xs uppercase font-mono tracking-wide text-[var(--text-secondary)]">Baseline Expectation Proof</div>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">Expected Baseline Gradient:</span>
                <Formula tex="\mathbb{E}_{a_t \sim \pi_\theta} \left[ b(s_t) \nabla_\theta \log \pi_\theta(a_t | s_t) \right] = 0" block />
              </div>

              <div>
                <span className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">Expanded Integral / Summation:</span>
                <Formula tex="\sum_{a} \pi_\theta(a | s_t) b(s_t) \nabla_\theta \log \pi_\theta(a | s_t)" block />
              </div>

              <div>
                <span className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">Applying Log-Derivative Identity:</span>
                <Formula tex="= b(s_t) \sum_{a} \pi_\theta(a | s_t) \frac{\nabla_\theta \pi_\theta(a | s_t)}{\pi_\theta(a | s_t)}" block />
              </div>

              <div>
                <span className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">Simplifying to Derivative of Total Probability:</span>
                <Formula tex="= b(s_t) \nabla_\theta \sum_{a} \pi_\theta(a | s_t) = b(s_t) \nabla_\theta (1) = 0" block />
              </div>
            </div>
          </div>

          <div className="text-sm text-[var(--text-secondary)] space-y-4 leading-relaxed">
            <p>
              Since the sum of probability over all actions is always equal to 1, its gradient with respect to policy parameters <Formula tex="\theta" /> is always 0.
            </p>
            <p>
              This mathematically guarantees that adding any state-dependent baseline <Formula tex="b(s_t)" /> will not introduce bias to our policy gradient estimate.
            </p>
            <p>
              In Actor-Critic frameworks, we use the Critic value function <Formula tex="V(s_t)" /> as the baseline, establishing the Advantage:
            </p>
            <div className="p-3 bg-[var(--bg-primary)] rounded border border-[var(--border-primary)] text-center font-mono">
              <Formula tex="A(s_t, a_t) = r_t + \gamma V(s_{t+1}) - V(s_t)" block={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Panel */}
      <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-primary)] pb-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Interactive Actor-Critic Explorer</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Watch a 1D Cliff walk agent update its Actor preferences and Critic values in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaying(!playing)}
              className="flex items-center gap-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={runSingleStep}
              disabled={playing || agentState === GOAL_STATE}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] disabled:opacity-40 transition"
            >
              <ArrowRight className="w-4 h-4" />
              Step
            </button>
            <button
              onClick={resetLearning}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* 1D Grid visualization */}
        <div className="flex flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">The Environment Grid (S = Start, G = Goal, X = Cliff)</div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: STATES_COUNT }).map((_, sIdx) => {
              const isAgent = agentState === sIdx;
              const isStart = sIdx === START_STATE;
              const isGoal = sIdx === GOAL_STATE;
              const isCliff = sIdx === CLIFF_STATE;

              let bg = "var(--bg-primary)";
              if (isCliff) bg = "rgba(239, 68, 68, 0.15)";
              if (isGoal) bg = "rgba(34, 197, 94, 0.15)";
              if (isStart) bg = "rgba(59, 130, 246, 0.15)";

              return (
                <div
                  key={sIdx}
                  className={`aspect-square flex flex-col justify-between p-2 rounded-lg border transition duration-300 relative ${
                    isAgent ? "border-white ring-2 ring-white/20" : "border-[var(--border-primary)]"
                  }`}
                  style={{ backgroundColor: bg }}
                >
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono">S{sIdx}</span>
                  
                  <div className="flex justify-center items-center h-full">
                    {isAgent && (
                      <span className="h-4 w-4 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1)] animate-ping absolute" />
                    )}
                    {isAgent && (
                      <span className="h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] relative z-10" />
                    )}
                    {!isAgent && isStart && <span className="text-sm font-bold text-blue-500">S</span>}
                    {!isAgent && isGoal && <span className="text-sm font-bold text-green-500">G</span>}
                    {!isAgent && isCliff && <span className="text-sm font-bold text-red-500 font-mono">×</span>}
                  </div>

                  <div className="text-[10px] text-center font-mono font-semibold text-[var(--text-primary)]">
                    V: {V[sIdx].toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats and Learning updates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action Choice details */}
          <div className="p-5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">Actor Action Preferences</h4>
            <div className="space-y-2 text-xs">
              {Array.from({ length: STATES_COUNT - 2 }).map((_, sIdx) => {
                const probs = getProbs(sIdx + 1);
                return (
                  <div key={sIdx} className="flex justify-between items-center border-b border-[var(--border-primary)] pb-1">
                    <span className="text-[var(--text-secondary)]">State {sIdx + 1}:</span>
                    <span className="font-mono text-[var(--text-primary)]">
                      ← {(probs[0] * 100).toFixed(0)}% | {(probs[1] * 100).toFixed(0)}% →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Episode metrics */}
          <div className="p-5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">Training Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Episodes Completed:</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">{episodeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Total Steps:</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">{stepCount}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border-primary)] pt-2 mt-2">
                  <span className="text-[var(--text-secondary)]">Avg Episode Return:</span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">{avgReturn}</span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-[var(--text-secondary)] mt-4 leading-relaxed">
              Over time, the average return increases as the agent learns to avoid the Cliff (State 5) and reach the Goal (State 6).
            </p>
          </div>

          {/* Update Signals */}
          <div className="p-5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">Live Math Signals</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-2 rounded">
                <span className="text-[var(--text-secondary)]">Last Action Taken:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {lastAction === null ? "None" : lastAction === 0 ? "← Left" : "Right →"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-[var(--bg-secondary)] p-2 rounded">
                <span className="text-[var(--text-secondary)]">TD Error / Advantage (δ):</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {lastTDError === null ? "0.00" : lastTDError.toFixed(3)}
                </span>
              </div>
              
              <div className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                If <Formula tex="\delta > 0" />, the action was better than expected. The Actor increases preference for that action, and the Critic increases state value.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

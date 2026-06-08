"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, Pause, RotateCcw, TrendingUp, HelpCircle, ShieldAlert } from "lucide-react";

// Types
type Particle = {
  id: number;
  x: number;
  y: number;
  targetY: number;
  value: number;
  color: string;
};

export default function PPO() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [policyWeights, setPolicyWeights] = useState<number[]>([0.5, 0.3, 0.2]); // Probability of [Jump, Run, Slide]
  const [klDivergence, setKlDivergence] = useState<number>(0);
  const [ratio, setRatio] = useState<number>(1.0);
  const [clipBound, setClipBound] = useState<number>(0.2); // epsilon default = 0.2
  const [totalEpisodes, setTotalEpisodes] = useState<number>(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([12, 15, 18]);
  const [averageScore, setAverageScore] = useState<number>(15);
  
  // Game simulation state
  const [obstacleX, setObstacleX] = useState<number>(500);
  const [obstacleType, setObstacleType] = useState<"low" | "high" | "wide">("low");
  const [agentY, setAgentY] = useState<number>(200);
  const [agentAction, setAgentAction] = useState<"Run" | "Jump" | "Slide">("Run");
  const [collisionText, setCollisionText] = useState<string>("");
  const [reward, setReward] = useState<number>(0);
  const [oldPolicy, setOldPolicy] = useState<number[]>([0.5, 0.3, 0.2]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setObstacleX((prev) => {
        if (prev <= 120) {
          // Obstacle reached agent - calculate action score & reward
          const type = obstacleType;
          let success = false;
          
          if (type === "low" && agentAction === "Jump") success = true;
          if (type === "high" && agentAction === "Slide") success = true;
          if (type === "wide" && agentAction === "Run") success = true;
          
          if (success) {
            setReward(10);
            setCollisionText("✓ Success! +10 Reward");
            setScoreHistory((h) => [...h.slice(-9), (h[h.length - 1] || 0) + 10]);
          } else {
            setReward(-10);
            setCollisionText("✗ Collision! -10 Reward");
            setScoreHistory((h) => [...h.slice(-9), Math.max(0, (h[h.length - 1] || 0) - 5)]);
          }

          // Trigger Policy PPO clip update
          updatePPO(success, type, agentAction);

          // Reset Obstacle
          const types: ("low" | "high" | "wide")[] = ["low", "high", "wide"];
          setObstacleType(types[Math.floor(Math.random() * types.length)]);
          return 500;
        }
        return prev - 8;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaying, obstacleType, agentAction]);

  // Action decision helper based on current Policy probabilities
  useEffect(() => {
    if (!isPlaying) return;
    if (obstacleX === 250) {
      // Decide action based on obstacle type and policy weights
      // Let's sample action using simple softmax probabilities
      const rand = Math.random();
      let chosen: "Run" | "Jump" | "Slide" = "Run";
      
      const probJump = policyWeights[0];
      const probSlide = policyWeights[1];
      
      if (rand < probJump) {
        chosen = "Jump";
        setAgentY(120);
        setAgentAction("Jump");
      } else if (rand < probJump + probSlide) {
        chosen = "Slide";
        setAgentY(240);
        setAgentAction("Slide");
      } else {
        chosen = "Run";
        setAgentY(200);
        setAgentAction("Run");
      }

      // Reset agent state after a delay
      setTimeout(() => {
        setAgentY(200);
        setAgentAction("Run");
        setCollisionText("");
      }, 700);
    }
  }, [obstacleX, policyWeights, isPlaying]);

  // Update PPO policy using surrogate clipped objective calculation
  const updatePPO = (success: boolean, type: "low" | "high" | "wide", action: "Run" | "Jump" | "Slide") => {
    setOldPolicy([...policyWeights]);
    setTotalEpisodes((e) => e + 1);

    // Compute synthetic PPO updates
    let newWeights = [...policyWeights];
    const learningRate = 0.08;

    if (success) {
      // Encourage action
      if (action === "Jump") {
        newWeights[0] = Math.min(0.9, newWeights[0] + learningRate);
        newWeights[1] = Math.max(0.05, newWeights[1] - learningRate/2);
        newWeights[2] = Math.max(0.05, newWeights[2] - learningRate/2);
      } else if (action === "Slide") {
        newWeights[1] = Math.min(0.9, newWeights[1] + learningRate);
        newWeights[0] = Math.max(0.05, newWeights[0] - learningRate/2);
        newWeights[2] = Math.max(0.05, newWeights[2] - learningRate/2);
      } else {
        newWeights[2] = Math.min(0.9, newWeights[2] + learningRate);
        newWeights[0] = Math.max(0.05, newWeights[0] - learningRate/2);
        newWeights[1] = Math.max(0.05, newWeights[1] - learningRate/2);
      }
    } else {
      // Discourage action
      if (action === "Jump") {
        newWeights[0] = Math.max(0.05, newWeights[0] - learningRate);
        newWeights[1] = Math.min(0.9, newWeights[1] + learningRate/2);
        newWeights[2] = Math.min(0.9, newWeights[2] + learningRate/2);
      } else if (action === "Slide") {
        newWeights[1] = Math.max(0.05, newWeights[1] - learningRate);
        newWeights[0] = Math.min(0.9, newWeights[0] + learningRate/2);
        newWeights[2] = Math.min(0.9, newWeights[2] + learningRate/2);
      } else {
        newWeights[2] = Math.max(0.05, newWeights[2] - learningRate);
        newWeights[0] = Math.min(0.9, newWeights[0] + learningRate/2);
        newWeights[1] = Math.min(0.9, newWeights[1] + learningRate/2);
      }
    }

    // Softmax normalization
    const sum = newWeights[0] + newWeights[1] + newWeights[2];
    newWeights = newWeights.map((w) => w / sum);
    setPolicyWeights(newWeights);

    // Compute simulated metrics
    const idx = action === "Jump" ? 0 : action === "Slide" ? 1 : 2;
    const currentRatio = newWeights[idx] / oldPolicy[idx];
    setRatio(currentRatio);

    // Calculate KL divergence: D_KL(P || Q) = sum( P(x) * log(P(x) / Q(x)) )
    const kl = newWeights.reduce((acc, w, i) => acc + w * Math.log(w / oldPolicy[i]), 0);
    setKlDivergence(Math.abs(kl));

    // Calculate average score
    setAverageScore((prev) => Math.round((prev * 9 + (success ? 25 : 5)) / 10));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPolicyWeights([0.5, 0.3, 0.2]);
    setOldPolicy([0.5, 0.3, 0.2]);
    setRatio(1.0);
    setKlDivergence(0);
    setTotalEpisodes(0);
    setScoreHistory([12, 15, 18]);
    setAverageScore(15);
    setObstacleX(500);
    setObstacleType("low");
    setAgentY(200);
    setAgentAction("Run");
    setCollisionText("");
  };

  return (
    <div className="flex flex-col gap-12 px-12 py-24 max-w-7xl mx-auto">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-6">
          Proximal Policy Optimization (PPO)
        </h1>
        <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
          PPO stabilizes policy gradient methods by clipping parameter update ratios. Below is an interactive reinforcement learning agent training sandbox using clipped surrogate objective updates to master a dynamic running obstacle course.
        </p>
      </motion.div>

      {/* Main layout sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Policy Stats Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-[var(--text-primary)]" />
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Policy Probabilities</h3>
            </div>

            {/* Action Bar Graphs */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                  <span>JUMP (Low Obstacles)</span>
                  <span className="font-mono text-[var(--text-primary)] font-semibold">{(policyWeights[0] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border border-[var(--border-primary)]">
                  <div
                    className="h-full bg-[var(--text-primary)] transition-all duration-300"
                    style={{ width: `${policyWeights[0] * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                  <span>SLIDE (High Obstacles)</span>
                  <span className="font-mono text-[var(--text-primary)] font-semibold">{(policyWeights[1] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border border-[var(--border-primary)]">
                  <div
                    className="h-full bg-[var(--text-primary)] transition-all duration-300"
                    style={{ width: `${policyWeights[1] * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                  <span>RUN (Wide Obstacles)</span>
                  <span className="font-mono text-[var(--text-primary)] font-semibold">{(policyWeights[2] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border border-[var(--border-primary)]">
                  <div
                    className="h-full bg-[var(--text-primary)] transition-all duration-300"
                    style={{ width: `${policyWeights[2] * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Hyperparameters Config */}
            <div className="border-t border-[var(--border-primary)] pt-4 mt-2">
              <div className="flex justify-between text-sm text-[var(--text-secondary)] mb-1">
                <span>Clipping Hyperparameter (ε)</span>
                <span className="font-mono text-[var(--text-primary)] font-semibold">{clipBound.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.4}
                step={0.05}
                value={clipBound}
                onChange={(e) => setClipBound(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--text-primary)]"
              />
            </div>

            {/* Run / Reset Controls */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause Training" : "Start Agent"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] text-sm font-semibold hover:text-[var(--text-primary)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Game simulation canvas */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col justify-between h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <span>Environment: Running Course</span>
                <span className="text-xs text-[var(--text-secondary)]">Decision area: x &lt; 250</span>
              </h3>
              <div className="flex gap-4 text-xs font-mono text-[var(--text-secondary)]">
                <span>Episodes: {totalEpisodes}</span>
                <span>Avg Performance: {averageScore}</span>
              </div>
            </div>

            {/* Physics Engine Arena */}
            <div className="relative w-full h-[240px] bg-slate-950 rounded-xl overflow-hidden border border-[var(--border-primary)] flex items-end">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
              
              {/* Agent */}
              <motion.div
                className="absolute left-[80px] w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xs"
                animate={{ y: agentY }}
                style={{
                  backgroundColor: agentAction === "Jump" ? "rgb(56 189 248)" :
                                   agentAction === "Slide" ? "rgb(244 63 94)" : "rgb(16 185 129)",
                  color: "#fff"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {agentAction}
              </motion.div>

              {/* Obstacle */}
              <div
                className="absolute w-10 rounded-md transition-all duration-75"
                style={{
                  left: `${obstacleX}px`,
                  bottom: "20px",
                  height: obstacleType === "high" ? "80px" : obstacleType === "wide" ? "20px" : "40px",
                  width: obstacleType === "wide" ? "60px" : "30px",
                  backgroundColor: "rgb(234 179 8)",
                  border: "2px solid #fff"
                }}
              />

              {/* Base line Floor */}
              <div className="w-full h-5 bg-slate-800 border-t border-slate-700 z-10" />

              {/* Obstacle label */}
              <div
                className="absolute text-[10px] text-yellow-400 font-bold px-2 py-0.5 bg-yellow-950/70 border border-yellow-500/30 rounded"
                style={{ left: `${obstacleX}px`, bottom: obstacleType === "high" ? "110px" : "70px" }}
              >
                {obstacleType === "high" ? "HIGH WALL" : obstacleType === "wide" ? "WIDE PIT" : "LOW BARRIER"}
              </div>

              {/* Success / Fail Banner overlays */}
              {collisionText && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm font-bold shadow-lg ${
                  collisionText.startsWith("✓") ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" :
                  "bg-rose-950/80 text-rose-400 border border-rose-500/30"
                }`}>
                  {collisionText}
                </div>
              )}
            </div>

            {/* PPO Clipped Surrogate Dashboard */}
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-primary)] pt-4 mt-4 text-xs font-mono text-[var(--text-secondary)]">
              <div className="flex flex-col">
                <span>Update Ratio r_t(θ)</span>
                <span className={`text-sm font-bold ${
                  ratio > 1 + clipBound || ratio < 1 - clipBound ? "text-rose-500" : "text-emerald-500"
                }`}>
                  {ratio.toFixed(3)}
                </span>
                <span className="text-[10px]">
                  {ratio > 1 + clipBound ? "CLIPPED (MAX)" : ratio < 1 - clipBound ? "CLIPPED (MIN)" : "UNCLIPPED"}
                </span>
              </div>

              <div className="flex flex-col">
                <span>KL Divergence</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {klDivergence.toFixed(4)}
                </span>
                <span className="text-[10px]">Policy Drift metric</span>
              </div>

              <div className="flex flex-col">
                <span>Surrogate Objective</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {Math.min(ratio * (reward || 1), Math.max(1 - clipBound, Math.min(1 + clipBound, ratio)) * (reward || 1)).toFixed(2)}
                </span>
                <span className="text-[10px]">L_CLIP objective value</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Clipped Surrogate Walkthrough block */}
      <div className="p-8 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[var(--text-primary)]" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Understanding Clipped Surrogate Objectives</h3>
        </div>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          Standard policy gradient updates are prone to destructively large changes. PPO limits policy updates by defining a clipped probability ratio objective:
        </p>
        <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] p-5 rounded-xl font-mono text-sm text-[var(--text-primary)] leading-loose">
          L^CLIP(θ) = Ê_t [ min( r_t(θ)Â_t , clip(r_t(θ), 1 - ε, 1 + ε)Â_t ) ]
          <br />
          Where <span className="underline">r_t(θ) = π_θ(a_t | s_t) / π_θ_old(a_t | s_t)</span> is the probability ratio between the new and old policy parameters.
        </div>
        <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
          If the updated policy deviates too far from the old values (outside the boundary of <span className="font-semibold">[1 - ε, 1 + ε]</span>), the gradient is truncated (clipped). This ensures safe, progressive policy iterations, allowing stable updates without catastrophic policy failure.
        </p>
      </div>

    </div>
  );
}

// lib/content-registry.ts
import type { Subject, Topic, Lesson } from "./content-types";

export const SUBJECT_META: Record<string, { description: string; icon: string; color: string; label: string }> = {
  "artificial-intelligence": {
    description: "Master Artificial Intelligence from foundations to advanced agentic systems",
    icon: "AI",
    color: "from-indigo-500 to-purple-600",
    label: "Artificial Intelligence (AI)",
  },
  "communication-systems": {
    description: "Learn analog and digital communication fundamentals, modulation techniques, and channel behavior.",
    icon: "CS",
    color: "from-neutral-700 to-neutral-900",
    label: "Communication Systems",
  },
  "compiler-design": {
    description: "Understand lexical analysis, parsing, semantic analysis, optimization, and code generation.",
    icon: "CD",
    color: "from-neutral-700 to-neutral-900",
    label: "Compiler Design",
  },
  "computer-networks": {
    description: "Learn layered protocols, routing, switching, and transport mechanisms across local and wide-area networks.",
    icon: "CNS",
    color: "from-neutral-700 to-neutral-900",
    label: "Computer Networks",
  },
  "computer-organization-and-architecture": {
    description: "Study processor design, instruction execution, memory hierarchy, and internal computer organization.",
    icon: "COA",
    color: "from-neutral-700 to-neutral-900",
    label: "Computer Organization and Architecture",
  },
  "control-systems": {
    description: "Explore feedback systems, stability analysis, controllers, and dynamic system response.",
    icon: "CTRL",
    color: "from-neutral-700 to-neutral-900",
    label: "Control Systems",
  },
  "database-management-system": {
    description: "Learn relational modeling, SQL, normalization, transactions, concurrency, and indexing.",
    icon: "DBMS",
    color: "from-neutral-700 to-neutral-900",
    label: "Database Management System",
  },
  "digital-electronics": {
    description: "Study logic gates, combinational and sequential circuits, memory elements, and digital design.",
    icon: "DE",
    color: "from-neutral-700 to-neutral-900",
    label: "Digital Electronics",
  },
  dsa: {
    description: "Build strong foundations in data structures, algorithms, complexity analysis, and problem solving.",
    icon: "DSA",
    color: "from-neutral-700 to-neutral-900",
    label: "Data Structures and Algorithms",
  },
  "operating-system": {
    description: "Understand process scheduling, memory management, file systems, and device coordination.",
    icon: "OS",
    color: "from-neutral-700 to-neutral-900",
    label: "Operating System",
  },
  "signals-and-systems": {
    description: "Learn continuous/discrete signals, system properties, transforms, and frequency-domain analysis.",
    icon: "S&S",
    color: "from-neutral-700 to-neutral-900",
    label: "Signals and Systems",
  },
  "machine-learning": {
    description: "Explore core concepts of supervised, unsupervised and self‑supervised learning with interactive visualizations.",
    icon: "ML",
    color: "from-indigo-600 to-purple-600",
    label: "Machine Learning",
  },
};

export const TOPIC_ORDER: Record<string, string[]> = {
  dsa: [
    "cpp-fundamentals",
    "problem-solving-basics",
    "time-space-complexity",
    "arrays",
    "strings",
    "searching-sorting",
    "hashing",
    "recursion-backtracking",
    "linked-list",
    "stack-queue",
    "graphs",
    "dynamic-programming",
  ],
  "artificial-intelligence": [
    "computer-vision",
    "deep-learning",
    "frameworks",
    "generative-ai",
    "machine-learning",
    "mathematics",
    "llm-and-nlp",
    "reinforcement-learning",
  ],
};

export const TOPIC_LABELS: Record<string, string> = {
  "cpp-fundamentals": "C++ Fundamentals",
  "problem-solving-basics": "Problem Solving Basics",
  "time-space-complexity": "Time & Space Complexity",
  "machine-learning": "Machine Learning",
  "machine-learning/supervised": "Supervised Learning",
  "machine-learning/unsupervised": "Unsupervised Learning",
  "machine-learning/self-supervised": "Self‑Supervised Learning",
  "llm-and-nlp": "LLM and NLP",
  "05-normalization": "Normalization",
};

export const TOPIC_DESCRIPTIONS: Record<string, string> = {
  "cpp-fundamentals": "Dive deep into C++ fundamentals ...",
  "problem-solving-basics": "Develop a structured, analytical mindset ...",
};

// Updated LESSON_ORDER for topics
export const LESSON_ORDER: Record<string, string[]> = {
  // existing subjects
  "machine-learning": [
    "Introduction",
    "SupervisedLearning",
    "UnsupervisedLearning",
    "SemiSupervisedLearning",
    "SelfSupervisedLeaning",
    "DataPreprocessing",
    "FeatureEngineering",
    "Classification",
    "Regression",
    "DecisionTrees",
    "RandomForest",
    "SupportVectorMachiines",
    "KNearestNeighbors",
    "NaiveBayes",
    "Clustering",
    "DimensionalityReduction",
    "Regularization",
    "ModelSelection",
    "HyperparameterTuning",
    "EnsembleLearning",
    "EvaluationMetrics",
  ],
  // Deep Learning topic under artificial-intelligence
  "deep-learning": [
    "NeuralNetworks",
    "CNN",
    "RNN",
    "GAN",
    "Transformers"
  ],
  // other topics
  "artificial-intelligence": ["gan-lab"],
  "ai-foundations": [
    "00-theory-history-of-ai",
    "00-theory-mathematical-foundations-overview",
  ],
  "reinforcement-learning": [
    "MarkovDecisionProcess",
    "BellmanEqualtion",
    "MonteCarlo",
    "QLearning",
    "DeepQNetwork",
    "PolicyGradient",
    "ActorCritic",
    "PPO",
    "DeepRL",
  ],
  "llm-and-nlp": [
    "LLM",
    "GPT",
    "embeddings",
  ],
};

export function formatLessonName(filename: string): string {
  const name = filename.replace(/\.(jsx|tsx|js|ts)$/, "");
  return name.replace(/[-_]/g, " ");
}

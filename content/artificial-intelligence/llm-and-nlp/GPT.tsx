"use client";

import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  History, 
  Cpu, 
  Scale, 
  Zap, 
  ShieldAlert, 
  FileText, 
  HelpCircle, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

// ── Visual Design System (High-Contrast Black & White Theme) ────────────────
const S = {
  bgPrimary: "var(--bg-primary)",
  bgSecondary: "var(--bg-secondary)",
  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  borderColor: "var(--border-color)",
  borderSubtle: "var(--border-subtle)",
};

// ── Interactive Timeline Data ────────────────────────────────────────────────
const TIMELINE_DATA = [
  {
    year: "2018",
    name: "GPT-1",
    parameters: "117 Million",
    dataset: "BookCorpus (4.5 GB)",
    desc: "OpenAI introduced generative pre-training (GP) to the decoder portion of the transformer architecture. Designed for semi-supervised learning—trained on unlabeled books followed by task-specific fine-tuning.",
    citation: "[6][11][12]"
  },
  {
    year: "2019",
    name: "GPT-2",
    parameters: "1.5 Billion",
    dataset: "WebText (40 GB, 8M pages)",
    desc: "A direct 10x scale-up of parameter count and dataset size. Demonstrated zero-shot transfer capabilities, generating highly coherent text. Released in stages due to concerns over potential malicious misuse.",
    citation: "[13][15][16]"
  },
  {
    year: "2020",
    name: "GPT-3",
    parameters: "175 Billion",
    dataset: "Common Crawl, WebText2, Books, Wikipedia (570 GB)",
    desc: "Marked a milestone in few-shot learning, performing diverse tasks without explicit fine-tuning. OpenAI subsequently introduced RLHF (Reinforcement Learning from Human Feedback) leading to InstructGPT.",
    citation: "[14][18][19]"
  },
  {
    year: "2022",
    name: "ChatGPT",
    parameters: "175B (GPT-3.5 fine-tuned)",
    dataset: "Massive web corpora + Human feedback",
    desc: "Launched on November 30, 2022, ChatGPT brought conversational AI to the mainstream. Powered initially by GPT-3.5 and aligned using RLHF to generate helpful, honest, and harmless responses.",
    citation: "[19][20]"
  },
  {
    year: "2023",
    name: "GPT-4",
    parameters: "Estimated ~1.76 Trillion (MoE)",
    dataset: "Multimodal (Text + Images)",
    desc: "A large-scale multimodal foundation model capable of processing both text and image inputs. Integrated into Copilot, Khan Academy, Duolingo, and countless enterprise applications.",
    citation: "[21][22][35]"
  },
  {
    year: "2024",
    name: "GPT-4o & Reasoning",
    parameters: "Optimized multimodal native",
    dataset: "Audio, Visual, and Text native datasets",
    desc: "GPT-4o introduced native omni-multimodality (real-time text, audio, and vision). Reasoning models like OpenAI o3 and DeepSeek R1 introduced multi-step chain-of-thought computation before replying.",
    citation: "[7][24][25]"
  },
  {
    year: "2025",
    name: "GPT-5",
    parameters: "Next-gen frontier scale",
    dataset: "Ultra-scale multimodal",
    desc: "Released on August 7, 2025. Features an intelligent router that dynamically routes simple tasks to faster models and complex reasoning tasks to slower reasoning architectures.",
    citation: "[26][27][30]"
  }
];

export default function GPTPage() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);
  
  // Scaling Law Simulator State
  const [paramsExponent, setParamsExponent] = useState(9); // 10^9 = 1B
  const [dataTokensExponent, setDataTokensExponent] = useState(10); // 10^10 = 10B tokens
  
  // Calculate predicted loss based on empirical scaling law: Loss = (Nc / N)^alpha + (Dc / D)^beta
  const predictedLoss = useMemo(() => {
    const N = Math.pow(10, paramsExponent);
    const D = Math.pow(10, dataTokensExponent);
    
    // Constant values inspired by Kaplan et al. (2020) scaling laws
    const Nc = 8.8e13;
    const Dc = 5.4e13;
    const alpha = 0.076;
    const beta = 0.095;
    
    const lossN = Math.pow(Nc / N, alpha);
    const lossD = Math.pow(Dc / D, beta);
    
    // Add base baseline entropy
    return (lossN + lossD + 1.2).toFixed(3);
  }, [paramsExponent, dataTokensExponent]);

  return (
    <div className="w-full min-h-screen px-6 py-12 md:px-12 md:py-20 flex flex-col gap-16 font-sans" style={{ backgroundColor: S.bgPrimary, color: S.textPrimary }}>
      
      {/* ── Header / Hero Section ── */}
      <header className="relative border border-[var(--border-color)] p-8 md:p-12 rounded-2xl overflow-hidden" style={{ backgroundColor: S.bgSecondary }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative z-10 max-w-4xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest px-3.5 py-1.5 border rounded-full border-[var(--border-color)] text-[var(--text-secondary)]">
              Subject 01 · LLM &amp; NLP
            </span>
            <span className="text-xs font-mono px-3.5 py-1.5 border rounded-full border-[var(--border-color)] text-[var(--text-secondary)] flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" /> Architecture &amp; History
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none" style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}>
            Generative Pre-trained Transformer (GPT)
          </h1>
          
          <p className="text-base md:text-lg leading-relaxed text-[var(--text-secondary)] max-w-3xl">
            A generative pre-trained transformer (GPT) is a type of large language model (LLM)<sup>[1][2][3]</sup> that is widely used in generative artificial intelligence chatbots.<sup>[4][5]</sup> GPTs are based on a deep learning architecture called the transformer. They are pre-trained on large datasets of unlabeled content, and able to generate novel content.<sup>[2][3]</sup>
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-[var(--border-subtle)] mt-2">
            <div>
              <div className="text-2xl font-bold font-mono">2018</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">First Introduced</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">175B+</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Scale Threshold</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">Multimodal</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Vision &amp; Audio native</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">Reasoning</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Dynamic Routing</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Introduction & Background ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Cpu size={20} />
            <h2 className="text-2xl font-bold font-mono">Core Foundations &amp; Background</h2>
          </div>
          
          <p className="leading-relaxed text-[var(--text-secondary)]">
            OpenAI was the first to apply generative pre-training to the transformer architecture, introducing the <strong>GPT-1</strong> model in 2018.<sup>[6]</sup> The company has since released many bigger GPT models. The chatbot ChatGPT, released in late 2022 (using GPT-3.5), was followed by many competitor chatbots using their own generative pre-trained transformers to generate text, such as Gemini, DeepSeek, and Claude.
          </p>

          <p className="leading-relaxed text-[var(--text-secondary)]">
            During the 2010s, improved machine learning algorithms, more powerful computers, and an increase in the amount of digitized material allowed for an AI boom.<sup>[8]</sup> Separately, the concept of generative pre-training (GP) was a long-established technique in machine learning. GP is a form of self-supervised learning wherein a model is first trained on a large, unlabeled dataset (the "pre-training" step) to learn to generate data points. This pre-trained model is then adapted to a specific task using a labeled dataset (the "fine-tuning" step).<sup>[9]</sup>
          </p>
          
          <p className="leading-relaxed text-[var(--text-secondary)]">
            The transformer architecture for deep learning is the core technology of a GPT. Developed by researchers at Google, it was introduced in the paper <em>"Attention Is All You Need"</em> in 2017. The transformer architecture solved many of the performance issues that were associated with older recurrent neural network (RNN) designs for natural language processing (NLP). The architecture's use of an attention mechanism allows models to process entire sequences of text at once, enabling the training of much larger and more sophisticated models.<sup>[10]</sup> Since 2017, available transformer-based NLP systems have been capable of processing, mining, organizing, connecting, contrasting, and summarizing texts as well as answering questions from textual input.
          </p>
        </div>

        <div className="lg:col-span-5 border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-6" style={{ backgroundColor: S.bgSecondary }}>
          <h3 className="text-lg font-bold font-mono flex items-center gap-2">
            <Sparkles size={16} /> Omnipresent Modalities &amp; Reasoning
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            GPTs are primarily used to generate text, but can be trained to generate other kinds of data. For example, <strong>GPT-4o</strong> can process and generate text, images, and audio.<sup>[7]</sup>
          </p>
          <div className="p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)]">
            <span className="text-xs font-mono font-bold block mb-1">Reasoning Models</span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              To improve performance on complex tasks, some GPTs, such as OpenAI o3, allocate more computation time analyzing the problem before generating an output, and are called reasoning models.
            </p>
          </div>
          <div className="p-4 border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)]">
            <span className="text-xs font-mono font-bold block mb-1">Dynamic Routing (2025+)</span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              In 2025, GPT-5 was released with an intelligent router that automatically selects whether to use a faster model or a slower reasoning model based on the provided task.
            </p>
          </div>
        </div>
      </section>

      {/* ── Interactive History / Timeline ── */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
          <History size={20} />
          <h2 className="text-2xl font-bold font-mono">Interactive GPT Evolution Timeline</h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
          Click on any model milestone below to explore parameters, training datasets, and architectural breakthroughs.
        </p>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin">
          {TIMELINE_DATA.map((t, idx) => {
            const isActive = idx === activeTimelineIdx;
            return (
              <button
                key={t.name}
                onClick={() => setActiveTimelineIdx(idx)}
                className={`px-5 py-3 border rounded-xl font-mono text-sm flex-shrink-0 transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] font-bold shadow-md"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-primary)]"
                }`}
              >
                {t.name} ({t.year})
              </button>
            );
          })}
        </div>

        {/* Timeline Content Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border border-[var(--border-color)] p-8 rounded-2xl" style={{ backgroundColor: S.bgSecondary }}>
          <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--border-subtle)] pb-6 md:pb-0 md:pr-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)]">Milestone Model</div>
              <div className="text-3xl font-extrabold mt-1">{TIMELINE_DATA[activeTimelineIdx].name}</div>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Model Parameters</div>
                <div className="text-base font-bold font-mono">{TIMELINE_DATA[activeTimelineIdx].parameters}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Training Corpus</div>
                <div className="text-base font-bold font-mono">{TIMELINE_DATA[activeTimelineIdx].dataset}</div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono bg-[var(--bg-primary)] px-2.5 py-1 border border-[var(--border-subtle)] rounded">
                Historical Context &amp; Details
              </span>
              <p className="text-base leading-relaxed mt-2 text-[var(--text-secondary)]">
                {TIMELINE_DATA[activeTimelineIdx].desc}
              </p>
            </div>
            <div className="text-xs font-mono text-[var(--text-secondary)] pt-6 flex items-center gap-1.5">
              <span>Citations:</span>
              <span className="bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                {TIMELINE_DATA[activeTimelineIdx].citation}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Architectural & Mathematical Concepts ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)]">
            <Cpu size={20} />
          </div>
          <h3 className="text-lg font-bold font-mono">Foundation Models</h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            A foundation model is an AI model trained on broad data at scale such that it can be adapted to a wide range of downstream tasks.<sup>[28][29]</sup> Major examples include OpenAI's GPT-5, Google's PaLM (a broad foundation model compared to GPT-3), Together's GPT-JT (open-source GPT-3 alternative), and Meta's LLaMA.
          </p>
        </div>

        <div className="border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)]">
            <Zap size={20} />
          </div>
          <h3 className="text-lg font-bold font-mono">Efficient Architectures</h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Standard self-attention has quadratic complexity. To mitigate this scale limit, models utilize sparse attention or memory-efficient structures. Architectures like <strong>BigBird</strong>, <strong>Reformer</strong>, and <strong>FlashAttention</strong> optimize scaling parameters to handle extremely long context sequences.
          </p>
        </div>

        <div className="border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--text-primary)] text-[var(--bg-primary)]">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-lg font-bold font-mono">Emergent Abilities</h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Emergent abilities refer to capabilities that appear in LLMs only when they reach a certain scale, and are absent in smaller versions of the same models. Examples include multi-step reasoning, in-context zero-shot learning, and sudden optimization jumps on complex benchmarks.<sup>[46][47]</sup>
          </p>
        </div>
      </section>

      {/* ── Interactive Scaling Laws Simulator ── */}
      <section className="border border-[var(--border-color)] p-8 rounded-2xl flex flex-col gap-8" style={{ backgroundColor: S.bgSecondary }}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Scale size={20} />
            <h2 className="text-2xl font-bold font-mono">Kaplan Scaling Laws Simulator</h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Scaling laws show empirical relationships between model loss and parameters, dataset size, and compute. Adjust model variables below to observe the changes in predicted validation loss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-mono mb-2">
                <span>Model Size (Parameters)</span>
                <span className="font-bold">10^{paramsExponent} ({(Math.pow(10, paramsExponent) / 1e6).toFixed(0)}M)</span>
              </div>
              <input 
                type="range" 
                min={7} 
                max={12} 
                value={paramsExponent} 
                onChange={(e) => setParamsExponent(parseInt(e.target.value))}
                className="w-full accent-[var(--text-primary)]" 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-mono mb-2">
                <span>Dataset Size (Tokens)</span>
                <span className="font-bold">10^{dataTokensExponent} ({(Math.pow(10, dataTokensExponent) / 1e9).toFixed(0)}B tokens)</span>
              </div>
              <input 
                type="range" 
                min={8} 
                max={13} 
                value={dataTokensExponent} 
                onChange={(e) => setDataTokensExponent(parseInt(e.target.value))}
                className="w-full accent-[var(--text-primary)]" 
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center border border-[var(--border-subtle)] p-6 rounded-xl bg-[var(--bg-primary)]">
            <div className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-mono">Predicted Validation Loss</div>
            <div className="text-6xl font-black mt-2 font-mono">{predictedLoss}</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-4 max-w-xs text-center leading-relaxed font-mono">
              Formula: Loss ≈ (N_c/N)^0.076 + (D_c/D)^0.095 + Baseline. Performance follows power-law relationships as size increases.<sup>[44][45]</sup>
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Issues, Benchmarks & Ethics ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Brand Issues */}
        <div className="lg:col-span-6 border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-bold font-mono flex items-center gap-2 text-[var(--text-primary)]">
            <ShieldAlert size={18} /> Brand &amp; Trademark Issues
          </h3>
          <div className="text-sm leading-relaxed text-[var(--text-secondary)] space-y-4">
            <p>
              OpenAI claims "GPT" as its own branding, citing its association with ChatGPT. In 2023, they revised brand guidelines to restrict API clients from using "GPT" in names. In the U.S., the USPTO responded to OpenAI's trademark application by determining that "GPT" was both descriptive and generic.<sup>[48][53]</sup>
            </p>
            <p>
              In the EU, the EUIPO registered "GPT" as a trademark in spring 2023, but it has since been challenged and is pending cancellation. In Switzerland, the Swiss Federal Institute of Intellectual Property registered it successfully.<sup>[62][63]</sup>
            </p>
          </div>
        </div>

        {/* Benchmarks & Evaluation */}
        <div className="lg:col-span-6 border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="text-lg font-bold font-mono flex items-center gap-2">
            <FileText size={18} /> Evaluation &amp; Benchmarking
          </h3>
          <div className="text-sm leading-relaxed text-[var(--text-secondary)] space-y-4">
            <p>
              Evaluation of GPT models is carried out using standard benchmarks (such as accuracy on datasets, robustness, bias, and toxicity). Tasks typically test natural language understanding, reasoning, query answering, and code generation.<sup>[65][66]</sup>
            </p>
            <p>
              Evaluating models remains an active area of research, as existing tests may not fully reflect real-world execution performance or the safety risks associated with large-scale generative models.<sup>[65]</sup>
            </p>
          </div>
        </div>

        {/* Ethical Considerations */}
        <div className="lg:col-span-12 border border-[var(--border-color)] p-6 rounded-2xl flex flex-col gap-4" style={{ backgroundColor: S.bgSecondary }}>
          <h3 className="text-lg font-bold font-mono flex items-center gap-2 text-[var(--text-primary)]">
            <HelpCircle size={18} /> Ethical Considerations &amp; Societal Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm leading-relaxed text-[var(--text-secondary)]">
            <div>
              <span className="font-bold block mb-1">Bias Amplification</span>
              <p className="text-xs">
                LLMs can reproduce and amplify patterns present in their training data, including social biases, which may lead to unfair, biased, or discriminatory outputs.<sup>[67][68]</sup>
              </p>
            </div>
            <div>
              <span className="font-bold block mb-1">Misinformation &amp; Hallucinations</span>
              <p className="text-xs">
                These models generate fluent text optimized for probability rather than verifying factual accuracy. This can lead to highly convincing misinformation in production.<sup>[69]</sup>
              </p>
            </div>
            <div>
              <span className="font-bold block mb-1">Environmental Impact</span>
              <p className="text-xs">
                Training large-scale models requires massive computational infrastructures, leading to significant energy consumption and carbon footprints. Efficient training methods are highly sought after.<sup>[70][71]</sup>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Citation Legend ── */}
      <footer className="border-t border-[var(--border-subtle)] pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-secondary)] font-mono gap-4">
        <div>
          THINK++ Interactive Labs · Generative Pre-trained Transformers
        </div>
        <div className="flex items-center gap-2">
          <span>Module status:</span>
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">Active</span>
        </div>
      </footer>
    </div>
  );
}

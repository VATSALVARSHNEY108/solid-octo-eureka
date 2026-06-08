"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export const dreamResearchPapers = [
  {
    id: 1,
    title: "Dreaming and the Brain: From Phenomenology to Neurophysiology",
    authors: ["Yuval Nir", "Giulio Tononi"],
    type: "Review Paper",
    category: "Neuroscience",
    description:
      "Covers brain regions, REM sleep, dream mechanisms, and neurophysiology.",
    links: {
      paper: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2814941/",
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/20079677/",
    },
  },
  {
    id: 2,
    title: "The Functional Role of Dreaming in Emotional Processes",
    authors: ["Scarpelli et al."],
    type: "Review Paper",
    category: "Psychology",
    description:
      "Focuses on emotional regulation, memory processing, and nightmares.",
    links: {
      paper: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6428732/",
      pubmed: "https://pubmed.ncbi.nlm.nih.gov/30930809/",
    },
  },
  {
    id: 3,
    title: "The Overfitted Brain: Dreams Evolved to Assist Generalization",
    authors: ["Erik Hoel"],
    type: "Theoretical Neuroscience",
    category: "AI + Neuroscience",
    description:
      "Explains dreams using machine learning concepts such as generalization and noise augmentation.",
    links: {
      arxiv: "https://arxiv.org/abs/2007.09560",
      published:
        "https://www.sciencedirect.com/science/article/pii/S2666389921000647",
    },
  },
  {
    id: 4,
    title:
      "Hierarchical Neural Representation of Dreamed Objects Revealed by Brain Decoding with Deep Neural Network Features",
    authors: ["Tomoyasu Horikawa", "Yukiyasu Kamitani"],
    type: "Brain Decoding Research",
    category: "AI + Brain Research",
    description: "Uses DNN features and fMRI data to predict dream content.",
    links: {
      arxiv: "https://arxiv.org/abs/1611.09520",
      paper:
        "https://www.frontiersin.org/journals/computational-neuroscience/articles/10.3389/fncom.2017.00004/full",
    },
  },
  {
    id: 5,
    title: "DREAM: Visual Decoding from Reversing Human Visual System",
    authors: ["Research Team"],
    type: "AI Brain Decoding",
    category: "Computer Vision + Neuroscience",
    description: "Reconstructs visual information from brain activity.",
    links: {
      arxiv: "https://arxiv.org/abs/2310.02265",
    },
  },
] as const;

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
interface FnParam {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

interface ActivationFunction {
  id: string;
  name: string;
  short: string;
  formula: string;
  formulaFn: (x: number, params?: Record<string, number>) => number;
  params: FnParam[];
  range: string;
  diff: string;
  cost: string;
  vg: string;
  usecase: string;
  badges: string[];
  definition: string;
  intuition: string;
  gradient: string;
  advantages: string[];
  disadvantages: string[];
  usecase_detail: string;
  mistakes: string;
  comparison: string;
}

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════
const FUNCTIONS: ActivationFunction[] = [
  {
    id: "step", name: "Step Function", short: "Step",
    formula: "f(x) = 1 if x ≥ 0, else 0",
    formulaFn: (x) => x >= 0 ? 1 : 0,
    params: [],
    range: "{0, 1}", diff: "No (at 0)", cost: "Very Low", vg: "Extreme", usecase: "Binary output",
    badges: ["Binary", "Non-differentiable"],
    definition: "The step function outputs 1 when the input is non-negative, 0 otherwise. It mimics a biological neuron either firing or not firing.",
    intuition: "Think of a light switch — either on or off. The output is completely binary, with an abrupt discontinuity at zero.",
    gradient: "The derivative is zero everywhere except at x=0 where it is undefined. This makes gradient-based learning impossible — the network cannot determine how to adjust weights.",
    advantages: ["Extremely simple to compute", "Clear binary decision boundary", "Historically important in early perceptrons"],
    disadvantages: ["Not differentiable at zero", "Cannot use gradient descent directly", "Dead gradient problem everywhere", "No probabilistic interpretation"],
    usecase_detail: "Binary classifiers in simple perceptrons. Largely replaced by sigmoid in modern practice. Sometimes used in binary neural networks for edge deployment.",
    mistakes: "Using it in hidden layers — gradients never flow backward. Use sigmoid instead if a probabilistic binary output is needed.",
    comparison: "Sigmoid is a smooth, differentiable approximation of the step function. For any real gradient-based training, sigmoid is the proper substitute."
  },
  {
    id: "linear", name: "Linear Function", short: "Linear",
    formula: "f(x) = αx",
    formulaFn: (x, p) => (p?.alpha ?? 1) * x,
    params: [{ name: "alpha", label: "α (slope)", min: -2, max: 2, step: 0.1, default: 1 }],
    range: "(-∞, +∞)", diff: "Yes (constant)", cost: "Minimal", vg: "None (exploding risk)", usecase: "Output layer (regression)",
    badges: ["Continuous", "Unbounded"],
    definition: "A linear activation simply scales the input by a constant factor α. The network computes a weighted sum but applies no non-linearity.",
    intuition: "A straight line through the origin. No matter how many layers use linear activations, the entire network collapses to a single linear transformation — depth provides no representational benefit.",
    gradient: "The gradient is constant (α) everywhere — no vanishing or exploding gradient caused by this function itself. However, stacking linear layers collapses to one linear layer, so depth is useless.",
    advantages: ["No vanishing gradient", "Simple and fast", "Useful for regression output layers"],
    disadvantages: ["Network depth is wasted — all layers collapse to one", "Cannot learn non-linear patterns", "Cannot produce probabilities"],
    usecase_detail: "The output layer for regression tasks where the target is continuous and unbounded. Never used in hidden layers of a network meant to learn non-linear functions.",
    mistakes: "Using linear activations in hidden layers. You lose all representational power — the network cannot model anything beyond a hyperplane.",
    comparison: "ReLU provides non-linearity while still being linear in the positive domain, making it far more powerful in hidden layers."
  },
  {
    id: "sigmoid", name: "Sigmoid", short: "Sigmoid",
    formula: "f(x) = 1 / (1 + e⁻ˣ)",
    formulaFn: (x) => 1 / (1 + Math.exp(-x)),
    params: [],
    range: "(0, 1)", diff: "Yes", cost: "Low-Medium", vg: "High (deep nets)", usecase: "Binary classification output",
    badges: ["Smooth", "Bounded", "S-curve"],
    definition: "The sigmoid squashes any real number to the interval (0,1), making it ideal for interpreting output as a probability.",
    intuition: "An S-shaped curve that is steep near zero and flat at the extremes. Large positive inputs saturate toward 1, large negative inputs toward 0. The output is always a valid probability.",
    gradient: "f'(x) = f(x)(1 - f(x)), maximized at 0.25 when x=0. At saturation (|x| > 4), the gradient approaches zero — vanishing gradient in deep networks.",
    advantages: ["Outputs interpretable as probabilities", "Smooth, differentiable everywhere", "Clear probabilistic meaning", "Bounded output prevents explosion"],
    disadvantages: ["Vanishing gradient at saturation", "Output not zero-centered (shifts gradients positive)", "Expensive to compute (exp)", "Not suitable for deep hidden layers"],
    usecase_detail: "The output layer for binary classification. In LSTMs, used for gate activations. Avoid in deep hidden layers — use ReLU family instead.",
    mistakes: "Using sigmoid in hidden layers of deep networks. The vanishing gradient kills learning in early layers. Also, outputs are always positive, biasing weight updates.",
    comparison: "Tanh is zero-centered and generally preferable to sigmoid in hidden layers. For outputs, softmax generalizes sigmoid to multi-class."
  },
  {
    id: "tanh", name: "Tanh", short: "Tanh",
    formula: "f(x) = (eˣ - e⁻ˣ) / (eˣ + e⁻ˣ)",
    formulaFn: (x) => Math.tanh(x),
    params: [],
    range: "(-1, 1)", diff: "Yes", cost: "Low-Medium", vg: "Moderate", usecase: "RNNs, hidden layers",
    badges: ["Zero-centered", "Bounded", "S-curve"],
    definition: "Tanh is a rescaled sigmoid that maps to (-1, 1), centered at zero. This makes gradient updates more symmetric during training.",
    intuition: "A steeper, zero-centered version of sigmoid. Outputs negative for negative inputs, positive for positive — exactly what we want for weight updates to go in either direction symmetrically.",
    gradient: "f'(x) = 1 - tanh²(x), peaking at 1.0 when x=0. Still suffers from vanishing gradients at saturation, but less severely than sigmoid.",
    advantages: ["Zero-centered output (symmetric gradients)", "Stronger gradient than sigmoid near origin", "Bounds output to avoid explosion", "Good for RNNs and LSTMs"],
    disadvantages: ["Vanishing gradient at saturation", "Computationally expensive (two exp calls)", "Still saturates for large |x|"],
    usecase_detail: "RNN hidden states, LSTM cell gates, older feedforward networks. Still preferred over sigmoid in hidden layers due to zero-centering.",
    mistakes: "Confusing the gradient range — tanh's derivative peaks at 1 (not 0.25 like sigmoid), making it significantly better. But it still vanishes for |x| > 2.",
    comparison: "Sigmoid times 2 minus 1. Strictly better than sigmoid for hidden layers due to zero-centering. In modern deep networks, ReLU often outperforms both."
  },
  {
    id: "relu", name: "ReLU", short: "ReLU",
    formula: "f(x) = max(0, x)",
    formulaFn: (x) => Math.max(0, x),
    params: [],
    range: "[0, +∞)", diff: "No (at 0)", cost: "Very Low", vg: "Low (positive)", usecase: "Deep networks, CNNs",
    badges: ["Sparse", "Fast", "Standard"],
    definition: "Rectified Linear Unit. The most widely used activation function in modern deep learning. Zero for negatives, identity for positives — brutally simple, highly effective.",
    intuition: "A ramp function. When a neuron sees a negative input, it outputs zero — it becomes inactive. When positive, it passes the signal unchanged. This sparsity is computationally efficient and biologically plausible.",
    gradient: "Gradient is 1 for positive inputs, 0 for negative. No vanishing gradient on the positive side. The dying ReLU problem: neurons with consistently negative preactivations output zero gradient — permanently dead.",
    advantages: ["No vanishing gradient (positive side)", "Computationally trivial (max operation)", "Induces sparse activations (~50% zeros)", "Accelerates convergence significantly", "Works well with batch normalization"],
    disadvantages: ["Dying ReLU: neurons can become permanently inactive", "Not zero-centered output", "Not differentiable at 0", "Unbounded output can cause instability"],
    usecase_detail: "Default choice for hidden layers in CNNs, MLPs, and most feedforward architectures. Combined with batch normalization for deep networks.",
    mistakes: "High learning rates can kill ReLUs permanently. Dead neurons output zero gradient forever — use learning rate warmup or Leaky ReLU variants to mitigate.",
    comparison: "Leaky ReLU and ELU fix the dying neuron problem. GELU and Swish outperform ReLU on many benchmarks. ReLU remains the default due to simplicity."
  },
  {
    id: "leaky", name: "Leaky ReLU", short: "Leaky",
    formula: "f(x) = x if x > 0, else αx",
    formulaFn: (x, p) => x > 0 ? x : (p?.alpha ?? 0.01) * x,
    params: [{ name: "alpha", label: "α (leak)", min: 0.001, max: 0.5, step: 0.001, default: 0.01 }],
    range: "(-∞, +∞)", diff: "No (at 0)", cost: "Very Low", vg: "Very Low", usecase: "Drop-in ReLU replacement",
    badges: ["Non-dying", "Simple fix"],
    definition: "Leaky ReLU allows a small negative slope α for negative inputs, preventing neurons from permanently dying by ensuring some gradient flows even when inactive.",
    intuition: "A tiny leak for negative values — just enough gradient to rescue dying neurons. Visually almost identical to ReLU, but with a shallow slope instead of zero on the left.",
    gradient: "1 for x>0, α for x≤0. No dead neuron problem. Small but consistent gradient for all inputs ensures every neuron can recover.",
    advantages: ["No dying neuron problem", "Nearly as fast as ReLU", "Allows gradients to flow for negative inputs", "Simple drop-in replacement for ReLU"],
    disadvantages: ["α is a hyperparameter requiring tuning", "Not zero-centered", "Inconsistent performance advantage over ReLU", "Not always better than ReLU in practice"],
    usecase_detail: "Anywhere you would use ReLU but fear dead neurons — particularly useful with very deep networks or aggressive learning rates.",
    mistakes: "Setting α too large (>0.2) — the function loses the sparsity benefit of ReLU. Very small α (0.01) is usually the right default.",
    comparison: "PReLU makes α a learnable parameter. ELU produces smoother negative outputs. SELU has self-normalizing properties. All are improvements on Leaky ReLU in different ways."
  },
  {
    id: "prelu", name: "PReLU", short: "PReLU",
    formula: "f(x) = x if x > 0, else αᵢx",
    formulaFn: (x, p) => x > 0 ? x : (p?.alpha ?? 0.25) * x,
    params: [{ name: "alpha", label: "α (learned)", min: 0.001, max: 0.999, step: 0.001, default: 0.25 }],
    range: "(-∞, +∞)", diff: "No (at 0)", cost: "Low", vg: "Very Low", usecase: "Image classification (ResNets)",
    badges: ["Learnable α", "Adaptive"],
    definition: "Parametric ReLU makes the negative slope α a learnable parameter that is trained via backpropagation, adapting per neuron during training.",
    intuition: "The network itself decides how much to leak for each neuron. Some neurons may learn high α (nearly linear), others near-zero α (nearly ReLU). Each neuron adapts to its role.",
    gradient: "Backprop through x and through α. For negative x, dL/dα = dL/df * x, allowing α to be updated. Introduces extra parameters but minimal overhead.",
    advantages: ["Learnable negative slope adapts to data", "Can outperform fixed Leaky ReLU", "Minimal parameter overhead", "Improved performance in image tasks"],
    disadvantages: ["Adds parameters to optimize", "Can overfit on small datasets", "Initialization matters", "More complex to implement than ReLU/Leaky ReLU"],
    usecase_detail: "Used in ResNet and other image classification networks. Introduced by He et al. (2015), showing improvement over ReLU for deep residual networks.",
    mistakes: "On small datasets, the extra parameters may cause overfitting. Initialize α conservatively (e.g., 0.25). Consider weight decay on α.",
    comparison: "Leaky ReLU uses fixed α (simpler). PReLU learns α (more expressive). ELU provides a smooth alternative for the negative regime."
  },
  {
    id: "elu", name: "ELU", short: "ELU",
    formula: "f(x) = x if x > 0, else α(eˣ − 1)",
    formulaFn: (x, p) => x > 0 ? x : (p?.alpha ?? 1.0) * (Math.exp(x) - 1),
    params: [{ name: "alpha", label: "α (saturation)", min: 0.1, max: 3, step: 0.1, default: 1.0 }],
    range: "(-α, +∞)", diff: "Yes (everywhere)", cost: "Low-Medium", vg: "Low", usecase: "Deep networks needing smoothness",
    badges: ["Smooth", "Negative values", "Differentiable"],
    definition: "Exponential Linear Unit uses an exponential curve for negative inputs, approaching −α asymptotically. Unlike ReLU and Leaky ReLU, ELU is differentiable everywhere.",
    intuition: "Imagine Leaky ReLU but with a smooth curve instead of a line for negatives. The exponential form means the negative output saturates at −α, pushing mean activations closer to zero.",
    gradient: "1 for x>0, α·eˣ for x≤0. Smooth everywhere, no kink at origin. Negative saturation region still has vanishing gradient for large |x|.",
    advantages: ["Smooth everywhere (differentiable at 0)", "Negative outputs push mean toward zero", "Reduces bias shift during training", "No dying neuron problem"],
    disadvantages: ["Computationally more expensive than ReLU (exp)", "Saturates for large negative inputs", "α requires tuning", "SELU generally preferred when self-normalization is needed"],
    usecase_detail: "Deep fully-connected networks, residual networks, situations where smooth gradients matter. Introduced as an improvement over ReLU with better statistical properties.",
    mistakes: "Not using appropriate α for your problem. α=1 is the standard default. Be aware of computational cost in inference-critical deployments.",
    comparison: "SELU is a scaled ELU with provably self-normalizing properties. Swish and GELU often outperform ELU on modern benchmarks but are more expensive."
  },
  {
    id: "selu", name: "SELU", short: "SELU",
    formula: "f(x) = λx if x>0, else λα(eˣ−1)",
    formulaFn: (x) => { const a = 1.6732632423543772, l = 1.0507009873554805; return l * (x > 0 ? x : a * (Math.exp(x) - 1)); },
    params: [],
    range: "(−λα, +∞)", diff: "Yes (everywhere)", cost: "Medium", vg: "Low", usecase: "Feedforward networks (self-norm)",
    badges: ["Self-normalizing", "Fixed constants"],
    definition: "Scaled ELU with specific constants (λ≈1.0507, α≈1.6733) derived mathematically to achieve self-normalizing properties — activations maintain zero mean and unit variance through deep networks.",
    intuition: "SELU is the activation equivalent of batch normalization baked into the function itself. With the right weight initialization, activations automatically stay normalized — no batch norm needed.",
    gradient: "λ for x>0, λ·α·eˣ for x≤0. The specific constants ensure the network is a contraction mapping — activations converge to normalized distributions.",
    advantages: ["Self-normalizing without batch normalization", "Enables very deep feedforward networks", "Theoretically grounded (Klambauer et al. 2017)", "Consistent performance across depths"],
    disadvantages: ["Requires specific weight initialization (LeCun normal)", "Requires specific architecture (no skip connections, dropout)", "Batch norm often used anyway, reducing advantage", "Less effective in CNNs"],
    usecase_detail: "Self-normalizing Neural Networks (SNNs). Works best in deep feedforward architectures with no residual connections, used with AlphaDropout.",
    mistakes: "Using SELU with standard He initialization — it requires LeCun initialization. Also, SELU breaks with residual connections or standard dropout.",
    comparison: "ELU without the scaling constants. The scaling is crucial for self-normalization. In practice, batch norm + ReLU often achieves similar results more flexibly."
  },
  {
    id: "softplus", name: "Softplus", short: "Softplus",
    formula: "f(x) = ln(1 + eˣ)",
    formulaFn: (x) => Math.log(1 + Math.exp(Math.min(x, 88))),
    params: [],
    range: "(0, +∞)", diff: "Yes", cost: "Medium", vg: "Low", usecase: "Smooth ReLU alternative",
    badges: ["Smooth ReLU", "Positive output"],
    definition: "Softplus is a smooth approximation to ReLU — continuously differentiable everywhere with an output that approaches zero smoothly from above rather than kinking at zero.",
    intuition: "Imagine smoothing out the kink in ReLU. At x=0, ReLU has a sharp corner — Softplus rounds this corner. For large |x|, softplus ≈ ReLU for positive and ≈ 0 for negative.",
    gradient: "f'(x) = 1/(1+e⁻ˣ) = sigmoid(x). Derivative is sigmoid! This means gradient vanishes slightly for large negative x but never reaches exactly zero.",
    advantages: ["Smooth and differentiable everywhere", "No dead neurons", "Approximates ReLU with smooth gradient", "Useful in variational models (VAEs)"],
    disadvantages: ["Computationally expensive (log + exp)", "Not sparse like ReLU", "Slightly inferior to ReLU in practice", "Output not zero-centered"],
    usecase_detail: "Variational Autoencoders (VAE) where smooth activations help optimization. Also used when differentiability everywhere is required (e.g., second-order optimization).",
    mistakes: "Expecting Softplus to outperform ReLU in standard classification — it typically does not despite its theoretical smoothness advantage.",
    comparison: "ReLU is a piecewise linear approximation. Softplus is fully smooth. In practice, the difference is minor — ReLU wins on speed and sparsity."
  },
  {
    id: "softsign", name: "Softsign", short: "Softsign",
    formula: "f(x) = x / (1 + |x|)",
    formulaFn: (x) => x / (1 + Math.abs(x)),
    params: [],
    range: "(-1, 1)", diff: "Yes", cost: "Low", vg: "Moderate", usecase: "Alternative to tanh",
    badges: ["Bounded", "Lighter than tanh"],
    definition: "Softsign is a smooth squashing function mapping to (-1,1), similar to tanh but with polynomial decay rather than exponential — saturating more slowly.",
    intuition: "Like tanh but using |x| in the denominator rather than an exponential. This makes it cheaper to compute and slower to saturate — inputs must be larger to push the function into its flat regions.",
    gradient: "f'(x) = 1/(1+|x|)². Decays as 1/x² rather than exponentially, so gradients vanish more slowly than tanh.",
    advantages: ["Cheaper to compute than tanh (no exp)", "Slower saturation preserves gradients longer", "Zero-centered output", "Good alternative in resource-constrained settings"],
    disadvantages: ["Less commonly used than tanh or ReLU", "Less framework support", "Not as well studied as alternatives", "Polynomial decay still causes some gradient vanishing"],
    usecase_detail: "Situations where tanh is appropriate but computational budget is limited. Found in some older architectures and specialized applications.",
    mistakes: "Assuming it is always better than tanh — in practice the difference is small and problem-dependent.",
    comparison: "Tanh saturates exponentially; Softsign saturates polynomially (slower). This gives Softsign slightly better gradient flow. ReLU variants are generally preferable in both cases."
  },
  {
    id: "gelu", name: "GELU", short: "GELU",
    formula: "f(x) = x · Φ(x)",
    formulaFn: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
    params: [],
    range: "(≈-0.17, +∞)", diff: "Yes", cost: "Medium", vg: "Low", usecase: "Transformers, BERT, GPT",
    badges: ["Transformer standard", "Probabilistic"],
    definition: "Gaussian Error Linear Unit weights inputs by their probability under a Gaussian distribution. Used in BERT, GPT, and most modern transformer architectures.",
    intuition: "GELU asks: how likely is this input to be active under a Gaussian? Large positive inputs are almost certainly active; large negatives almost certainly inactive; near zero, there's uncertainty — GELU applies a smooth, probabilistic gate.",
    gradient: "Complex but smooth. Has a slightly negative region near x ≈ -0.17, then rises steeply. This non-monotone property correlates with improved optimization landscapes.",
    advantages: ["State-of-the-art performance in NLP", "Smooth, non-monotone shape aids optimization", "No dead neuron problem", "Stochastic interpretation aids regularization"],
    disadvantages: ["More expensive to compute (requires tanh approximation)", "Complex derivative", "Less interpretable than ReLU", "May not improve over ReLU in non-NLP tasks"],
    usecase_detail: "Default activation in transformers (BERT, GPT-2/3/4, RoBERTa, T5). Also used in vision transformers (ViT) and other modern architectures.",
    mistakes: "Using the less accurate approximation — always use the tanh-based approximation rather than computing the true CDF. In non-NLP tasks, benchmark before assuming GELU wins.",
    comparison: "Outperforms ReLU in transformers. Swish (x·sigmoid(x)) is a related function. SwiGLU (used in LLaMA) extends this concept further."
  },
  {
    id: "swish", name: "Swish", short: "Swish",
    formula: "f(x) = x · σ(βx)",
    formulaFn: (x, p) => x * (1 / (1 + Math.exp(-(p?.beta ?? 1) * x))),
    params: [{ name: "beta", label: "β (sharpness)", min: 0.1, max: 5, step: 0.1, default: 1.0 }],
    range: "(≈-0.28, +∞)", diff: "Yes", cost: "Low-Medium", vg: "Low", usecase: "Deep networks (Google Brain)",
    badges: ["Self-gated", "Non-monotone"],
    definition: "Swish multiplies the input by its own sigmoid — a self-gated activation. Discovered through automated search (Google Brain, 2017), consistently outperforming ReLU on deep networks.",
    intuition: "The input gates itself — large positives pass through near-unchanged (sigmoid→1), near-zero inputs are suppressed, and the function has a slight negative region that acts as implicit regularization.",
    gradient: "f'(x) = f(x) + σ(βx)(1-f(x)). Smooth everywhere. The slight non-monotonicity (the dip below zero) is believed to help escape poor local optima.",
    advantages: ["Consistently outperforms ReLU on deep networks", "Smooth and differentiable", "Non-monotone aids optimization", "β=1 works well without tuning"],
    disadvantages: ["More expensive than ReLU (sigmoid computation)", "β introduces another hyperparameter", "Marginal improvement over GELU", "Not as widely adopted as GELU in NLP"],
    usecase_detail: "Used in EfficientNet and other modern vision models. Good default for deep CNNs and MLPs. β=1 (called SiLU in PyTorch) is the standard choice.",
    mistakes: "Overcomplicating with β tuning — β=1 is nearly always optimal. Note: PyTorch calls this SiLU (Sigmoid Linear Unit).",
    comparison: "GELU ≈ x·Φ(x); Swish = x·σ(βx). These are closely related — GELU uses the Gaussian CDF, Swish uses sigmoid. Performance is similar; GELU is preferred in NLP, Swish in vision."
  },
  {
    id: "mish", name: "Mish", short: "Mish",
    formula: "f(x) = x · tanh(softplus(x))",
    formulaFn: (x) => x * Math.tanh(Math.log(1 + Math.exp(Math.min(x, 88)))),
    params: [],
    range: "(≈-0.31, +∞)", diff: "Yes", cost: "Medium-High", vg: "Low", usecase: "Object detection (YOLO)",
    badges: ["Self-regularizing", "Complex"],
    definition: "Mish computes x·tanh(softplus(x)), combining the smoothness of softplus with the bounded behavior of tanh. Used in YOLOv4 and several vision models.",
    intuition: "Mish is like Swish but with a richer negative region — the curve dips more deeply before rising. This creates a self-regularizing effect and strong gradient flow near the origin.",
    gradient: "Complex composite derivative involving softplus, tanh, and their derivatives. Always non-zero, smooth everywhere, with stronger gradient near origin than Swish.",
    advantages: ["Strong performance on object detection", "Non-monotone with smooth negative region", "Self-regularizing behavior", "Continuous and differentiable everywhere"],
    disadvantages: ["Computationally expensive (tanh + softplus + log)", "Complex implementation", "Marginal improvement over Swish on most tasks", "Less widely supported in frameworks"],
    usecase_detail: "YOLOv4 and derivatives, some vision transformers. Strong choice for object detection. Generally competitive with Swish across domains.",
    mistakes: "Expecting significant gains over Swish in every task — improvements are dataset and task dependent. The extra computation may not be justified.",
    comparison: "More complex than Swish with a deeper negative dip. Both are non-monotone self-gated functions. Mish slightly outperforms Swish on some detection benchmarks."
  },
  {
    id: "softmax", name: "Softmax", short: "Softmax",
    formula: "f(xᵢ) = eˣᵢ / Σeˣⱼ",
    formulaFn: (x) => { const e = Math.exp(x); return e / (e + Math.exp(-x) + 0.1); },
    params: [],
    range: "(0, 1)", diff: "Yes", cost: "Low-Medium", vg: "Moderate", usecase: "Multi-class output layer",
    badges: ["Multi-class", "Probabilistic", "Output layer"],
    definition: "Softmax converts a vector of real numbers into a probability distribution over K classes. Unlike other functions, it operates on the entire output layer simultaneously.",
    intuition: "Imagine each class competing for probability mass. Softmax amplifies differences — the largest value dominates exponentially, squashing smaller ones. The outputs always sum to exactly 1.",
    gradient: "Jacobian (not scalar derivative). For i≠j: ∂fᵢ/∂xⱼ = -fᵢfⱼ. For i=j: ∂fᵢ/∂xⱼ = fᵢ(1-fᵢ). Combined with cross-entropy loss, simplifies to (predicted - true).",
    advantages: ["Outputs valid probability distribution (sum=1)", "Standard for multi-class classification", "Numerically stable with log-softmax", "Cross-entropy gradient is very clean"],
    disadvantages: ["Operates on vectors not scalars", "Sensitive to temperature — can become too peaked", "Not suitable for hidden layers", "Computationally linked across all outputs"],
    usecase_detail: "Output layer for multi-class classification in virtually every classifier. Also used in attention mechanisms (scaled dot-product attention in transformers).",
    mistakes: "Computing softmax then log for cross-entropy — use log_softmax directly for numerical stability (avoids log(0) issues from overflow).",
    comparison: "Sigmoid is the binary special case of softmax (K=2). In attention, softmax normalizes attention scores to weights summing to 1."
  }
];

// ═══════════════════════════════════════════════════════
// CANVAS DRAWING UTILITIES
// ═══════════════════════════════════════════════════════
function getColorStr(dark: boolean, opacity = 1): string {
  return dark ? `rgba(240,237,232,${opacity})` : `rgba(17,17,16,${opacity})`;
}
function getBgStr(dark: boolean): string { return dark ? "#1a1a18" : "#ffffff"; }
function getBg2Str(dark: boolean): string { return dark ? "#161614" : "#f2f1ee"; }

function drawGraph(
  canvas: HTMLCanvasElement,
  fn: ActivationFunction,
  xVal: number,
  params: Record<string, number>,
  dark: boolean,
  hoverX?: number | null
) {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.parentElement?.offsetWidth || 400;
  const H = 260;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const pad = { l: 44, r: 12, t: 12, b: 32 };
  const gw = W - pad.l - pad.r, gh = H - pad.t - pad.b;
  const xRange: [number, number] = [-5, 5];
  const yRange: [number, number] = [-2.5, 2.5];

  const toX = (x: number) => pad.l + ((x - xRange[0]) / (xRange[1] - xRange[0])) * gw;
  const toY = (y: number) => pad.t + (1 - (y - yRange[0]) / (yRange[1] - yRange[0])) * gh;

  ctx.strokeStyle = getColorStr(dark, 0.06); ctx.lineWidth = 1;
  for (let v = -2; v <= 2; v++) {
    if (v === 0) continue;
    ctx.beginPath(); ctx.moveTo(toX(v), pad.t); ctx.lineTo(toX(v), H - pad.b); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad.l, toY(v)); ctx.lineTo(W - pad.r, toY(v)); ctx.stroke();
  }
  ctx.strokeStyle = getColorStr(dark, 0.2); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(W - pad.r, toY(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(toX(0), pad.t); ctx.lineTo(toX(0), H - pad.b); ctx.stroke();

  ctx.fillStyle = getColorStr(dark, 0.35); ctx.font = "10px DM Mono,monospace"; ctx.textAlign = "center";
  [-4, -2, 0, 2, 4].forEach(v => ctx.fillText(String(v), toX(v), H - pad.b + 14));
  ctx.textAlign = "right";
  [-2, -1, 0, 1, 2].forEach(v => ctx.fillText(String(v), pad.l - 5, toY(v) + 4));

  ctx.strokeStyle = getColorStr(dark, 0.9); ctx.lineWidth = 2;
  ctx.beginPath();
  let first = true;
  for (let px = 0; px <= gw; px++) {
    const x = xRange[0] + (px / gw) * (xRange[1] - xRange[0]);
    const y = fn.formulaFn(x, params);
    const cy = toY(Math.max(yRange[0], Math.min(yRange[1], y)));
    if (first) { ctx.moveTo(pad.l + px, cy); first = false; } else ctx.lineTo(pad.l + px, cy);
  }
  ctx.stroke();

  // hover or current x marker
  const displayX = hoverX ?? xVal;
  const y = fn.formulaFn(displayX, params);
  const cy = toY(Math.max(yRange[0], Math.min(yRange[1], y)));
  const cx2 = toX(displayX);
  ctx.strokeStyle = getColorStr(dark, 0.4); ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(cx2, pad.t); ctx.lineTo(cx2, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.l, cy); ctx.lineTo(cx2, cy); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = getColorStr(dark, 1); ctx.beginPath(); ctx.arc(cx2, cy, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = getColorStr(dark, 0.8); ctx.font = "10px DM Mono,monospace"; ctx.textAlign = "left";
  ctx.fillText(`(${displayX.toFixed(2)}, ${Math.max(yRange[0], Math.min(yRange[1], y)).toFixed(3)})`, cx2 + 6, cy - 6);
}

function drawNeuron(canvas: HTMLCanvasElement, fnId: string, x: number, y: number, dark: boolean) {
  const W = canvas.parentElement?.offsetWidth || 400;
  const H = 80;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d")!; ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);
  const mid = H / 2, r = 22;
  const activation = Math.max(0, Math.min(1, (y + 1) / 2));
  const inputX = W * 0.18, outputX = W * 0.82, neuronX = W * 0.5;

  const lineAlpha = 0.3 + activation * 0.5;
  ctx.strokeStyle = getColorStr(dark, lineAlpha); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(inputX + 16, mid); ctx.lineTo(neuronX - r, mid); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(neuronX + r, mid); ctx.lineTo(outputX - 14, mid); ctx.stroke();
  ctx.fillStyle = getColorStr(dark, lineAlpha);
  ctx.beginPath(); ctx.moveTo(outputX - 14, mid - 5); ctx.lineTo(outputX - 2, mid); ctx.lineTo(outputX - 14, mid + 5); ctx.closePath(); ctx.fill();

  ctx.fillStyle = getColorStr(dark, 0.1); ctx.strokeStyle = getColorStr(dark, 0.3); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(inputX, mid, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = getColorStr(dark, 0.7); ctx.font = "10px DM Mono,monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(x.toFixed(2), inputX, mid);

  ctx.fillStyle = getBg2Str(dark); ctx.strokeStyle = getColorStr(dark, 0.6); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(neuronX, mid, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = getColorStr(dark, activation * 0.5);
  ctx.beginPath(); ctx.arc(neuronX, mid, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = getColorStr(dark, 0.9); ctx.font = "9px DM Mono,monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(y.toFixed(3), neuronX, mid);

  ctx.fillStyle = getColorStr(dark, activation * 0.3); ctx.strokeStyle = getColorStr(dark, 0.3); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(outputX, mid, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = getColorStr(dark, 0.9);
  ctx.fillText(y.toFixed(2), outputX, mid);

  ctx.fillStyle = getColorStr(dark, 0.3); ctx.font = "9px Inter,sans-serif"; ctx.textBaseline = "alphabetic";
  ctx.fillText("Input", inputX, mid + 24);
  ctx.fillText("Neuron", neuronX, mid + r + 12);
  ctx.fillText("Output", outputX, mid + 24);
}

function drawHeroNN(canvas: HTMLCanvasElement, dark: boolean) {
  const size = canvas.parentElement?.offsetWidth || 480;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = size + "px"; canvas.style.height = size + "px";
  const ctx = canvas.getContext("2d")!; ctx.scale(dpr, dpr);
  const W = size, H = size;
  ctx.clearRect(0, 0, W, H);
  const layers = [3, 4, 4, 2];
  const layerX = [W * 0.18, W * 0.38, W * 0.62, W * 0.82];
  const r = 18;
  const neurons = layers.map((n, li) => {
    const span = (n - 1) * H * 0.18;
    return Array.from({ length: n }, (_, i) => ({
      x: layerX[li], y: H / 2 - span / 2 + i * H * 0.18, active: Math.random()
    }));
  });
  for (let li = 0; li < layers.length - 1; li++) {
    neurons[li].forEach(n1 => {
      neurons[li + 1].forEach(n2 => {
        const w = (n1.active + n2.active) / 2;
        ctx.strokeStyle = getColorStr(dark, 0.08 + w * 0.18);
        ctx.lineWidth = 0.5 + w * 1.5;
        ctx.beginPath(); ctx.moveTo(n1.x + r, n1.y); ctx.lineTo(n2.x - r, n2.y); ctx.stroke();
      });
    });
  }
  neurons.forEach(layer => {
    layer.forEach(n => {
      const a = n.active;
      ctx.fillStyle = getBgStr(dark); ctx.strokeStyle = getColorStr(dark, 0.15 + a * 0.6); ctx.lineWidth = 1 + a;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = getColorStr(dark, 0.3 + a * 0.7);
      ctx.beginPath(); ctx.arc(n.x, n.y, r * (0.3 + a * 0.5), 0, Math.PI * 2); ctx.fill();
    });
  });
  ctx.fillStyle = getColorStr(dark, 0.3); ctx.font = "10px DM Mono,monospace"; ctx.textAlign = "center";
  ["Input", "Hidden", "Hidden", "Output"].forEach((name, i) => ctx.fillText(name, layerX[i], H * 0.92));
}

function drawNNSim(
  canvas: HTMLCanvasElement,
  fn: ActivationFunction,
  input: number,
  weight: number,
  noise: number,
  dark: boolean
) {
  const W = canvas.parentElement?.offsetWidth || 580, H = 320;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  const ctx = canvas.getContext("2d")!; ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const layers = [
    [input, input * 0.7 + noise * (Math.random() - 0.5), input * 1.2 - noise * (Math.random() - 0.5)],
    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0]
  ];
  for (let li = 1; li < layers.length; li++) {
    for (let ni = 0; ni < layers[li].length; ni++) {
      let sum = 0;
      layers[li - 1].forEach(v => sum += v * (weight * (0.5 + Math.random() * 0.5)) + noise * (Math.random() - 0.5) * 0.3);
      layers[li][ni] = fn.formulaFn(sum / layers[li - 1].length, { alpha: 0.01, beta: 1, lambda: 1 });
    }
  }
  const layerNames = ["Input", "Layer 1", "Layer 2", "Output"];
  const rr = 16;
  const lx = [W * 0.12, W * 0.37, W * 0.62, W * 0.87];
  const allNeurons = layers.map((layer, li) => {
    const span = (layer.length - 1) * H * 0.22;
    return layer.map((v, ni) => ({ x: lx[li], y: H / 2 - span / 2 + ni * H * 0.22, v }));
  });

  for (let li = 0; li < layers.length - 1; li++) {
    allNeurons[li].forEach(n1 => {
      allNeurons[li + 1].forEach(n2 => {
        const strength = Math.abs(n1.v * n2.v);
        ctx.strokeStyle = getColorStr(dark, Math.min(0.5, 0.05 + strength * 0.2));
        ctx.lineWidth = Math.min(2.5, 0.5 + strength);
        ctx.beginPath(); ctx.moveTo(n1.x + rr, n1.y); ctx.lineTo(n2.x - rr, n2.y); ctx.stroke();
      });
    });
  }
  allNeurons.forEach(layer => {
    layer.forEach(n => {
      const av = n.v;
      const isDead = Math.abs(av) < 0.001;
      const isSat = Math.abs(av) > 0.95;
      const color = isDead ? "#ef4444" : isSat ? "#f59e0b" : "#22c55e";
      const alpha = isDead ? 0.4 : 0.15 + Math.min(0.7, Math.abs(av) * 0.7);
      ctx.fillStyle = getBgStr(dark); ctx.strokeStyle = getColorStr(dark, 0.2); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(n.x, n.y, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
      ctx.beginPath(); ctx.arc(n.x, n.y, rr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = getColorStr(dark, 0.85); ctx.font = "9px DM Mono,monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(Math.abs(av) < 100 ? av.toFixed(2) : "∞", n.x, n.y);
    });
  });
  ctx.fillStyle = getColorStr(dark, 0.3); ctx.font = "10px DM Mono,monospace"; ctx.textBaseline = "alphabetic";
  lx.forEach((x, i) => { ctx.textAlign = "center"; ctx.fillText(layerNames[i], x, H - 8); });
}

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════

const RISK_MAP: Record<string, string> = {
  "Very Low": "low", "Low": "low", "Moderate": "med",
  "High": "high", "Extreme": "high", "None (exploding risk)": "med",
  "Low (positive)": "low"
};

function Badge({ text }: { text: string }) {
  return (
    <span style={{
      fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "3px 8px", borderRadius: 4,
      border: "1px solid var(--border2)", color: "var(--text2)", display: "inline-block"
    }}>{text}</span>
  );
}

function GraphCard({ fn, dark }: { fn: ActivationFunction; dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const neuronRef = useRef<HTMLCanvasElement>(null);
  const [x, setX] = useState(0);
  const [params, setParams] = useState<Record<string, number>>(
    Object.fromEntries(fn.params.map(p => [p.name, p.default]))
  );
  const [hoverX, setHoverX] = useState<number | null>(null);

  const y = fn.formulaFn(x, params);

  useEffect(() => {
    if (canvasRef.current) drawGraph(canvasRef.current, fn, x, params, dark, hoverX);
  }, [fn, x, params, dark, hoverX]);

  useEffect(() => {
    if (neuronRef.current) drawNeuron(neuronRef.current, fn.id, x, isFinite(y) ? y : 0, dark);
  }, [fn, x, params, dark, y]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pad = { l: 44, r: 12 };
    const gw = rect.width - pad.l - pad.r;
    const px = e.clientX - rect.left - pad.l;
    const hx = -5 + (px / gw) * 10;
    setHoverX(Math.max(-5, Math.min(5, hx)));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 20 }}>
      <div className="card">
        <div className="card-label">Interactive Graph</div>
        <div style={{ position: "relative", width: "100%", height: 260 }}>
          <canvas
            ref={canvasRef}
            style={{ display: "block", borderRadius: 8, width: "100%", height: 260 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverX(null)}
          />
        </div>
        <div style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--text3)" }}>Hover for values · range: {fn.range}</div>
      </div>

      <div className="card">
        <div className="card-label">Live Simulation</div>
        <div style={{ marginBottom: 16 }}>
          <div className="slider-row">
            <span className="slider-label">Input x</span>
            <input type="range" min={-5} max={5} step={0.05} value={x}
              onChange={e => setX(parseFloat(e.target.value))} style={{ flex: 1, height: 2 }} />
            <span className="slider-val">{x.toFixed(2)}</span>
          </div>
          {fn.params.map(p => (
            <div className="slider-row" key={p.name}>
              <span className="slider-label">{p.label}</span>
              <input type="range" min={p.min} max={p.max} step={p.step} value={params[p.name]}
                onChange={e => setParams(prev => ({ ...prev, [p.name]: parseFloat(e.target.value) }))}
                style={{ flex: 1, height: 2 }} />
              <span className="slider-val">{params[p.name].toFixed(p.step < 0.01 ? 3 : 2)}</span>
            </div>
          ))}
        </div>
        <div className="output-display">
          <span className="output-label">f(x) output</span>
          <span className="output-val">{isFinite(y) ? y.toFixed(6) : "∞"}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="card-label">Neuron Visualization</div>
          <canvas ref={neuronRef} width={400} height={80} style={{ width: "100%", display: "block", borderRadius: 6, marginTop: 6 }} />
        </div>
      </div>
    </div>
  );
}

function FunctionSection({ fn, dark }: { fn: ActivationFunction; dark: boolean }) {
  return (
    <section id={`fn-${fn.id}`} style={{ padding: "60px 0", borderTop: "1px solid var(--border)", scrollMarginTop: 112 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1, marginBottom: 8 }}>{fn.name}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "1.05rem", background: "var(--bg2)", padding: "10px 16px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--text)", display: "inline-block" }}>{fn.formula}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
            {fn.badges.map(b => <Badge key={b} text={b} />)}
          </div>
        </div>
      </div>

      <GraphCard fn={fn} dark={dark} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 24 }}>
        {[
          { label: "Intuition", text: fn.intuition },
          { label: "Gradient Behavior", text: fn.gradient },
          { label: "Use Cases", text: fn.usecase_detail },
        ].map(({ label, text }) => (
          <div key={label} className="card" style={{ padding: 16 }}>
            <div className="card-label">{label}</div>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="card-label">Advantages</div>
          <ul style={{ listStyle: "none", marginTop: 4 }}>
            {fn.advantages.map(a => <li key={a} style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 4 }}>✓ {a}</li>)}
          </ul>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div className="card-label">Disadvantages</div>
          <ul style={{ listStyle: "none", marginTop: 4 }}>
            {fn.disadvantages.map(d => <li key={d} style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 4 }}>✗ {d}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { title: "Common Mistakes", text: fn.mistakes },
          { title: "Comparison with Similar Functions", text: fn.comparison },
        ].map(({ title, text }) => (
          <div key={title} style={{ padding: 14, background: "var(--bg2)", borderRadius: 6 }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "var(--text3)", marginBottom: 6 }}>{title}</div>
            <p style={{ fontSize: "0.82rem", color: "var(--text2)" }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)" }} id="comparison">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <h3 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)" }}>Comparison</h3>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.4rem,3vw,2.2rem)", marginBottom: 8 }}>Side-by-side analysis</h2>
      <p style={{ marginBottom: 28 }}>All fifteen activation functions across key performance dimensions.</p>
      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {["Function", "Output Range", "Differentiable", "Computational Cost", "Vanishing Gradient", "Best Use Case"].map(h => (
                <th key={h} style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", padding: "10px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FUNCTIONS.map(fn => {
              const dotClass = RISK_MAP[fn.vg] || "med";
              const dotColor = dotClass === "low" ? "#22c55e" : dotClass === "med" ? "#f59e0b" : "#ef4444";
              return (
                <tr key={fn.id} style={{ cursor: "default" }}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", fontWeight: 500, color: "var(--text)" }}>{fn.name}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", background: "var(--bg2)", padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", display: "inline-block" }}>{fn.range}</span>
                  </td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", color: "var(--text2)" }}>{fn.diff}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", color: "var(--text2)" }}>{fn.cost}</td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", color: "var(--text2)" }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: dotColor, marginRight: 6 }} />
                    {fn.vg}
                  </td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", color: "var(--text2)" }}>{fn.usecase}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NNSimulation({ dark }: { dark: boolean }) {
  const [simFnId, setSimFnId] = useState("relu");
  const [simInput, setSimInput] = useState(0.8);
  const [simWeight, setSimWeight] = useState(1.0);
  const [simNoise, setSimNoise] = useState(0.2);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fn = FUNCTIONS.find(f => f.id === simFnId)!;
  const testX = simInput * simWeight;
  const out = fn.formulaFn(testX, { alpha: 0.01, beta: 1 });
  const isDead = Math.abs(out) < 0.001 && fn.id !== "step";
  const isBounded = ["sigmoid", "tanh", "softsign", "step"].includes(fn.id);
  const satVal = isBounded ? (Math.abs(testX) > 3 ? "Saturated" : "Active") : "N/A";

  useEffect(() => {
    if (canvasRef.current) drawNNSim(canvasRef.current, fn, simInput, simWeight, simNoise, dark);
  }, [fn, simInput, simWeight, simNoise, dark]);

  return (
    <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)" }} id="nnSimulation">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <h3 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)" }}>Neural Network Simulation</h3>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.4rem,3vw,2.2rem)", marginBottom: 8 }}>Signal propagation</h2>
      <p style={{ marginBottom: 20 }}>Watch how different activation functions transform signals flowing through a neural network.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {FUNCTIONS.map(f => (
          <button key={f.id} onClick={() => setSimFnId(f.id)}
            style={{ fontSize: "0.68rem", fontFamily: "var(--mono)", padding: "4px 10px", borderRadius: 4, border: "1px solid var(--border2)", cursor: "pointer", background: f.id === simFnId ? "var(--text)" : "transparent", color: f.id === simFnId ? "var(--accent-inv)" : "var(--text2)", transition: "all 0.3s" }}>
            {f.short}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-label">Network Visualization</div>
          <canvas ref={canvasRef} width={580} height={320} style={{ width: "100%", borderRadius: 8, display: "block" }} />
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["#22c55e", "Active neuron"], ["#ef4444", "Dead / saturated"], ["var(--border2)", "Inactive"]].map(([color, label]) => (
              <div key={label as string} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "var(--text3)" }}>
                <span style={{ display: "inline-block", width: 10, height: 10, background: color as string, borderRadius: "50%" }} />
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Simulation Controls</div>
          {[
            { label: "Input signal", min: -3, max: 3, step: 0.1, value: simInput, onChange: setSimInput },
            { label: "Weight scale", min: 0.1, max: 2, step: 0.05, value: simWeight, onChange: setSimWeight },
            { label: "Noise level", min: 0, max: 1, step: 0.05, value: simNoise, onChange: setSimNoise },
          ].map(({ label, min, max, step, value, onChange }) => (
            <div className="slider-row" key={label}>
              <span className="slider-label">{label}</span>
              <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(parseFloat(e.target.value))} style={{ flex: 1, height: 2 }} />
              <span className="slider-val">{value.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
            {[
              { label: "Status", value: isDead ? "⚠ Dead Neuron" : "● Active", color: isDead ? "#ef4444" : "var(--text)" },
              { label: "Saturation", value: satVal, color: "var(--text)" },
              { label: "Output", value: isFinite(out) ? out.toFixed(4) : "∞", color: "var(--text)", mono: true },
              { label: "VG Risk", value: fn.vg, color: "var(--text)" },
            ].map(({ label, value, color, mono }) => (
              <div key={label} style={{ padding: 10, background: "var(--bg2)", borderRadius: 6 }}>
                <div style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: mono ? "0.9rem" : "0.82rem", fontFamily: mono ? "var(--mono)" : undefined, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Playground({ dark }: { dark: boolean }) {
  const [pgFnId, setPgFnId] = useState("relu");
  const [pgPoints, setPgPoints] = useState<{ x: number; y: number }[]>([]);
  const [drawing, setDrawing] = useState(false);
  const inputRef = useRef<HTMLCanvasElement>(null);
  const outputRef = useRef<HTMLCanvasElement>(null);

  const fn = FUNCTIONS.find(f => f.id === pgFnId)!;

  const drawGridOnCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const W = canvas.parentElement?.offsetWidth || 560, H = 300;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d")!; ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = getColorStr(dark, 0.06); ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(0, H * i / 4); ctx.lineTo(W, H * i / 4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W * i / 4, 0); ctx.lineTo(W * i / 4, H); ctx.stroke();
    }
    ctx.strokeStyle = getColorStr(dark, 0.12); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
  }, [dark]);

  useEffect(() => {
    const inC = inputRef.current, outC = outputRef.current;
    if (!inC || !outC) return;
    const W = inC.parentElement?.offsetWidth || 560, H = 300;
    const dpr = window.devicePixelRatio || 1;
    [inC, outC].forEach(c => {
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + "px"; c.style.height = H + "px";
    });
    const ctxIn = inC.getContext("2d")!;
    const ctxOut = outC.getContext("2d")!;
    ctxIn.scale(dpr, dpr); ctxOut.scale(dpr, dpr);
    ctxIn.clearRect(0, 0, W, H); ctxOut.clearRect(0, 0, W, H);

    [ctxIn, ctxOut].forEach(ctx => {
      ctx.strokeStyle = getColorStr(dark, 0.06); ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(0, H * i / 4); ctx.lineTo(W, H * i / 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W * i / 4, 0); ctx.lineTo(W * i / 4, H); ctx.stroke();
      }
      ctx.strokeStyle = getColorStr(dark, 0.12); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
    });

    if (pgPoints.length < 2) {
      ctxIn.fillStyle = getColorStr(dark, 0.2); ctxIn.font = "10px DM Mono,monospace"; ctxIn.textAlign = "left";
      ctxIn.fillText("Draw input here", 12, 20);
      return;
    }

    ctxIn.strokeStyle = getColorStr(dark, 0.8); ctxIn.lineWidth = 2; ctxIn.beginPath();
    pgPoints.forEach((pt, i) => { const px = pt.x * W, py = pt.y * H; if (i === 0) ctxIn.moveTo(px, py); else ctxIn.lineTo(px, py); });
    ctxIn.stroke();

    ctxOut.strokeStyle = getColorStr(dark, 0.8); ctxOut.lineWidth = 2; ctxOut.beginPath();
    pgPoints.forEach((pt, i) => {
      const rawY = (1 - pt.y * 2);
      const activated = fn.formulaFn(rawY * 5, { alpha: 0.01, beta: 1, lambda: 1 });
      const outY = ((1 - Math.max(-3, Math.min(3, activated)) / 3) / 2) * H;
      if (i === 0) ctxOut.moveTo(pt.x * W, outY); else ctxOut.lineTo(pt.x * W, outY);
    });
    ctxOut.stroke();
    ctxOut.fillStyle = getColorStr(dark, 0.3); ctxOut.font = "10px DM Mono,monospace"; ctxOut.textAlign = "left";
    ctxOut.fillText(fn.name + " applied", 12, 20);
  }, [pgPoints, fn, dark, drawGridOnCanvas]);

  const addPoint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = inputRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    setPgPoints(prev => [...prev, { x, y }]);
  };

  return (
    <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)" }} id="playground">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <h3 style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text3)" }}>Playground</h3>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.4rem,3vw,2.2rem)", marginBottom: 8 }}>Draw &amp; transform</h2>
      <p style={{ marginBottom: 20 }}>Draw a custom input curve by clicking and dragging. Select an activation function to see the transformation in real time.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {FUNCTIONS.map(f => (
          <button key={f.id} onClick={() => setPgFnId(f.id)}
            style={{ fontSize: "0.68rem", fontFamily: "var(--mono)", padding: "4px 10px", borderRadius: 4, border: "1px solid var(--border2)", cursor: "pointer", background: f.id === pgFnId ? "var(--text)" : "transparent", color: f.id === pgFnId ? "var(--accent-inv)" : "var(--text2)", transition: "all 0.3s" }}>
            {f.short}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 20 }}>
        {[
          { label: "Input (draw here)", ref: inputRef, isInput: true },
          { label: "Output (activated)", ref: outputRef, isInput: false },
        ].map(({ label, ref, isInput }) => (
          <div key={label} className="card" style={{ padding: 12 }}>
            <div className="card-label" style={{ marginBottom: 8 }}>{label}</div>
            <canvas
              ref={ref as React.RefObject<HTMLCanvasElement>}
              width={560} height={300}
              style={{ width: "100%", height: 300, cursor: isInput ? "crosshair" : "default", borderRadius: 8, display: "block" }}
              onMouseDown={isInput ? e => { setDrawing(true); setPgPoints([]); addPoint(e); } : undefined}
              onMouseMove={isInput ? e => { if (drawing) addPoint(e); } : undefined}
              onMouseUp={isInput ? () => setDrawing(false) : undefined}
              onMouseLeave={isInput ? () => setDrawing(false) : undefined}
            />
            {isInput && (
              <button onClick={() => setPgPoints([])}
                style={{ marginTop: 8, fontSize: "0.72rem", fontFamily: "var(--mono)", padding: "5px 12px", border: "1px solid var(--border2)", borderRadius: 4, background: "transparent", color: "var(--text2)", cursor: "pointer" }}>
                Clear
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function ActivationFunctions() {
  const [dark, setDark] = useState(false);
  const [activePill, setActivePill] = useState("");
  const [showBackTop, setShowBackTop] = useState(false);
  const heroRef = useRef<HTMLCanvasElement>(null);
  const heroAnimRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "");
  }, [dark]);

  const animateHero = useCallback(() => {
    if (heroRef.current) drawHeroNN(heroRef.current, dark);
    heroAnimRef.current = setTimeout(animateHero, 1800 + Math.random() * 1200);
  }, [dark]);

  useEffect(() => {
    animateHero();
    return () => { if (heroAnimRef.current) clearTimeout(heroAnimRef.current); };
  }, [animateHero]);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Client-only: safe access to `window`.
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;

    const setFromMq = () => setDark(mq.matches);
    setFromMq();

    // Keep in sync if OS theme changes.
    mq.addEventListener?.("change", setFromMq);
    return () => mq.removeEventListener?.("change", setFromMq);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id?.replace("fn-", "");
          if (id) setActivePill(id);
        }
      });
    }, { threshold: 0.15 });
    FUNCTIONS.forEach(fn => {
      const el = document.getElementById(`fn-${fn.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* Offline + embed-friendly: avoid external font imports. */
        :root {
          --bg:#fafaf8;--bg2:#f2f1ee;--bg3:#e8e7e3;--surface:#ffffff;
          --border:rgba(0,0,0,0.08);--border2:rgba(0,0,0,0.14);
          --text:#111110;--text2:#4a4a46;--text3:#888884;
          --accent:#111110;--accent-inv:#ffffff;
          --mono:'DM Mono',monospace;--serif:'DM Serif Display',serif;--sans:'Inter',sans-serif;
          --radius:12px;--radius-sm:6px;
          --shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 12px rgba(0,0,0,0.04);
          --transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        [data-theme="dark"] {
          --bg:#0e0e0d;--bg2:#161614;--bg3:#1e1e1c;--surface:#1a1a18;
          --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
          --text:#f0ede8;--text2:#a8a49e;--text3:#5a5a54;
          --accent:#f0ede8;--accent-inv:#111110;
          --shadow:0 1px 3px rgba(0,0,0,0.3),0 4px 12px rgba(0,0,0,0.2);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:var(--sans);background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden;}
        ::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
        p{font-size:0.9rem;color:var(--text2);line-height:1.75;}
        code{font-family:var(--mono);font-size:0.82em;background:var(--bg3);padding:2px 6px;border-radius:4px;}
        .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;transition:var(--transition);}
        .card-label{font-size:0.65rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--text3);margin-bottom:12px;}
        .slider-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
        .slider-label{font-size:0.75rem;font-family:var(--mono);color:var(--text2);min-width:80px;}
        .slider-val{font-size:0.75rem;font-family:var(--mono);color:var(--text);min-width:44px;text-align:right;}
        input[type=range]{flex:1;height:2px;-webkit-appearance:none;appearance:none;background:var(--border2);border-radius:1px;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--text);cursor:pointer;transition:transform 0.15s;}
        input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.3);}
        .output-display{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-top:8px;}
        .output-label{font-size:0.72rem;color:var(--text3);}
        .output-val{font-family:var(--mono);font-size:1.1rem;font-weight:500;}
        @media (max-width: 980px){ .af-hero{ grid-template-columns:1fr !important; } }
      `}</style>

      {/* FUNCTION NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", borderBottom: "1px solid var(--border)", overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 2, padding: "8px 24px", maxWidth: 1280, margin: "0 auto" }}>
          {FUNCTIONS.map(fn => (
            <button key={fn.id}
              onClick={() => document.getElementById(`fn-${fn.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: "1px solid transparent", fontSize: "0.72rem", fontWeight: 500, fontFamily: "var(--mono)", cursor: "pointer", background: activePill === fn.id ? "var(--text)" : "transparent", color: activePill === fn.id ? "var(--accent-inv)" : "var(--text2)", transition: "var(--transition)", letterSpacing: "0.02em" }}>
              {fn.short}
            </button>
          ))}
        </div>
      </nav>

      <main>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          {/* HERO */}
          <section className="af-hero" style={{ padding: "56px 0 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div style={{ maxWidth: 560 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text3)", marginBottom: 20 }}>Deep Learning Fundamentals</div>
              <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.2rem,6vw,4.8rem)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 20 }}>Activation<br /><em>Functions</em><br />Explained</h1>
              <p style={{ fontSize: "1rem", color: "var(--text2)", lineHeight: 1.7, maxWidth: 440, marginBottom: 32 }}>
                Activation functions decide whether a neuron fires — shaping what a network can learn, how gradients flow, and how quickly training converges. Without them, deep networks collapse into linear models.
              </p>
              <div style={{ display: "flex", gap: 32 }}>
                {[["15", "Functions"], ["∞", "Interactive"], ["01", "Reference"]].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 500, lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ aspectRatio: "1", maxWidth: 480, border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "var(--surface)" }}>
              <canvas ref={heroRef} width={480} height={480} style={{ display: "block" }} />
            </div>
          </section>

          {/* FUNCTION SECTIONS */}
          {FUNCTIONS.map(fn => <FunctionSection key={fn.id} fn={fn} dark={dark} />)}

          {/* COMPARISON */}
          <ComparisonTable />

          {/* NN SIMULATION */}
          <NNSimulation dark={dark} />

          {/* PLAYGROUND */}
          <Playground dark={dark} />
        </div>
      </main>

      <footer style={{ padding: "40px 0", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Deep Learning Reference · Activation Functions</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text3)", fontFamily: "var(--mono)" }}>15 functions · interactive</div>
        </div>
      </footer>

      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ position: "fixed", bottom: 24, right: 24, width: 40, height: 40, borderRadius: "50%", background: "var(--text)", color: "var(--accent-inv)", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "var(--transition)", opacity: showBackTop ? 1 : 0, pointerEvents: showBackTop ? "all" : "none", zIndex: 80, boxShadow: "var(--shadow)" }}>
        ↑
      </button>
    </>
  );
}

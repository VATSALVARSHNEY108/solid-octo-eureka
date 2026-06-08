$base = "C:\Users\VATSAL VARSHNEY\OneDrive\Desktop\CoreCode\content\artificial-intelligence"

$topics = @{
    "ai-foundations" = @(
        "01-math-linear-algebra-vectors",
        "02-math-linear-algebra-dot-products",
        "03-math-linear-algebra-eigenvalues",
        "04-math-linear-algebra-decomposition",
        "05-math-calculus-derivatives",
        "06-math-calculus-chain-rule",
        "07-math-calculus-partial-derivatives",
        "08-math-calculus-optimization",
        "09-math-probability-distributions",
        "10-math-probability-conditional",
        "11-math-probability-bayes",
        "12-math-probability-expectation",
        "13-math-statistics-hypothesis-testing",
        "14-math-statistics-regression-analysis",
        "15-math-statistics-sampling",
        "16-math-statistics-information-theory",
        "17-programming-python-oop",
        "18-programming-python-functional",
        "19-programming-python-concurrency",
        "20-data-structures-linear",
        "21-data-structures-nonlinear",
        "22-data-structures-hash-maps",
        "23-programming-algorithms-sorting-searching",
        "24-programming-algorithms-graph",
        "25-programming-algorithms-dynamic-programming",
        "26-numpy-operations-broadcasting",
        "27-pandas-dataframes-cleaning",
        "28-data-visualization-tools"
    )
    "machine-learning" = @(
        "01-supervised-regression-linear",
        "02-supervised-regression-polynomial",
        "03-supervised-regression-ridge-lasso",
        "04-supervised-classification-logistic",
        "05-supervised-classification-knn",
        "06-supervised-classification-naive-bayes",
        "07-supervised-classification-svm",
        "08-supervised-ensemble-random-forest",
        "09-supervised-ensemble-gradient-boosting",
        "10-supervised-ensemble-xgboost-lightgbm",
        "11-supervised-ensemble-bagging-stacking",
        "12-unsupervised-clustering-kmeans",
        "13-unsupervised-clustering-dbscan",
        "14-unsupervised-clustering-hierarchical",
        "15-unsupervised-dimensionality-pca",
        "16-unsupervised-dimensionality-tsne",
        "17-unsupervised-dimensionality-umap",
        "18-association-rules-apriori-fpgrowth",
        "19-semi-supervised-learning",
        "20-engineering-feature-engineering",
        "21-engineering-cross-validation",
        "22-engineering-hyperparameter-tuning",
        "23-engineering-class-imbalance",
        "24-engineering-pipelines"
    )
    "deep-learning" = @(
        "01-perceptron",
        "02-activation-functions",
        "03-forward-pass",
        "04-loss-functions",
        "05-gradient-descent",
        "06-backpropagation",
        "07-universal-approximation",
        "08-ann",
        "09-weight-initialization",
        "10-batch-normalization",
        "11-dropout-regularization",
        "12-cnn-image-classification",
        "13-cnn-detection",
        "14-cnn-segmentation",
        "15-rnn-vanilla",
        "16-rnn-lstm",
        "17-rnn-gru",
        "18-rnn-bidirectional",
        "19-rnn-seq2seq",
        "20-autoencoders-vanilla",
        "21-autoencoders-sparse-denoising",
        "22-autoencoders-vae",
        "23-frameworks-pytorch-tensorflow",
        "24-frameworks-jax-mixed-precision"
    )
    "transformers" = @(
        "01-attention-mechanism",
        "02-self-attention",
        "03-multi-head-attention",
        "04-cross-attention",
        "05-positional-encoding",
        "06-feed-forward-sublayers",
        "07-layer-normalization",
        "08-encoder-decoder",
        "09-bert-family",
        "10-gpt-family",
        "11-vision-transformers"
    )
    "nlp" = @(
        "01-text-processing",
        "02-tokenization",
        "03-embeddings",
        "04-sentiment-analysis",
        "05-named-entity-recognition",
        "06-dependency-parsing",
        "07-coreference-resolution",
        "08-information-retrieval",
        "09-question-answering",
        "10-summarization",
        "11-translation",
        "12-text-classification"
    )
    "computer-vision" = @(
        "01-image-processing",
        "02-image-augmentation",
        "03-feature-extraction-cnn",
        "04-object-detection",
        "05-ocr",
        "06-pose-estimation",
        "07-depth-estimation",
        "08-video-understanding",
        "09-three-d-vision"
    )
    "generative-ai" = @(
        "01-gans",
        "02-diffusion-models",
        "03-image-generation",
        "04-video-generation",
        "05-voice-generation",
        "06-llms-pretraining",
        "07-llms-instruction-tuning",
        "08-llms-prompt-engineering",
        "09-llms-context-window",
        "10-llms-rlhf-rlaif"
    )
    "multimodal-ai" = @(
        "01-vision-language",
        "02-audio-text",
        "03-video-text",
        "04-omni-models"
    )
    "reinforcement-learning" = @(
        "01-rl-core-concepts",
        "02-q-learning",
        "03-policy-gradient",
        "04-actor-critic",
        "05-ppo-deep-ppo",
        "06-dqn",
        "07-environment-simulation",
        "08-rlhf",
        "09-game-ai",
        "10-robotics-rl"
    )
    "rag-and-memory" = @(
        "01-rag-basics",
        "02-chunking-strategies",
        "03-vector-databases",
        "04-hybrid-search-bm25-dense",
        "05-reranking",
        "06-contextual-compression",
        "07-graph-rag",
        "08-rag-evaluation-ragas"
    )
    "agentic-ai" = @(
        "01-ai-agents",
        "02-tool-calling",
        "03-memory-systems",
        "04-planning",
        "05-multi-agent-systems",
        "06-autonomous-workflows"
    )
    "fine-tuning-and-adaptation" = @(
        "01-full-fine-tuning",
        "02-peft-lora",
        "03-distillation",
        "04-quantization",
        "05-context-length-extension"
    )
    "mlops" = @(
        "01-experiment-tracking",
        "02-feature-stores",
        "03-deployment",
        "04-docker",
        "05-kubernetes",
        "06-monitoring",
        "07-scaling",
        "08-llm-serving-vllm",
        "09-kv-cache-speculative-decoding",
        "10-ci-cd-for-ml"
    )
    "vector-embeddings" = @(
        "01-embedding-fundamentals",
        "02-word2vec-glove",
        "03-sentence-transformers",
        "04-contrastive-learning",
        "05-embedding-fine-tuning",
        "06-embedding-visualization"
    )
    "evaluation-and-benchmarking" = @(
        "01-eval-metrics-classification",
        "02-eval-metrics-nlp-bleu-rouge",
        "03-eval-perplexity",
        "04-eval-llm-as-judge",
        "05-eval-benchmarks-mmlu-hellaswag",
        "06-eval-human-evaluation",
        "07-eval-leaderboards-interpretation"
    )
    "ai-safety-and-robustness" = @(
        "01-adversarial-attacks",
        "02-prompt-injection",
        "03-jailbreaks-and-defenses",
        "04-model-robustness",
        "05-red-teaming",
        "06-hallucinations-and-grounding",
        "07-bias-and-fairness",
        "08-interpretability-and-explainability"
    )
    "speech-and-audio" = @(
        "01-audio-fundamentals-spectrograms",
        "02-automatic-speech-recognition",
        "03-whisper-architecture",
        "04-wav2vec-self-supervised",
        "05-text-to-speech",
        "06-speaker-recognition",
        "07-audio-classification"
    )
    "time-series-and-forecasting" = @(
        "01-time-series-basics",
        "02-arima-sarima",
        "03-lstm-for-time-series",
        "04-temporal-fusion-transformers",
        "05-anomaly-detection",
        "06-forecasting-evaluation",
        "07-multivariate-time-series"
    )
    "recommendation-systems" = @(
        "01-collaborative-filtering",
        "02-content-based-filtering",
        "03-matrix-factorization",
        "04-two-tower-models",
        "05-session-based-recommendations",
        "06-cold-start-problem",
        "07-recsys-evaluation"
    )
    "advanced-research" = @(
        "01-neuro-symbolic-ai",
        "02-self-supervised-learning",
        "03-federated-learning",
        "04-graph-neural-networks",
        "05-efficient-ai",
        "06-ai-ethics-governance",
        "07-ai-alignment",
        "08-agi"
    )
}

foreach ($topic in $topics.Keys) {
    $topicPath = Join-Path $base $topic
    New-Item -ItemType Directory -Force -Path $topicPath | Out-Null
    foreach ($lesson in $topics[$topic]) {
        $filePath = Join-Path $topicPath ($lesson + ".tsx")
        $content = @"
export default function Lesson() {
  return <div>Lesson placeholder for $lesson</div>
}
"@
        Set-Content -Path $filePath -Value $content -Force
    }
}

$topics = @{
    "ai-foundations" = @(
        "00-theory-history-of-ai",
        "00-theory-mathematical-foundations-overview",
        "01-math-linear-algebra-vectors",
        "01-theory-vector-spaces-and-fields",
        "02-math-linear-algebra-dot-products",
        "02-theory-inner-product-spaces",
        "03-math-linear-algebra-eigenvalues",
        "03-theory-spectral-theorem-proofs",
        "04-math-linear-algebra-decomposition",
        "04-theory-svd-derivation",
        "05-math-calculus-derivatives",
        "06-math-calculus-chain-rule",
        "07-math-calculus-partial-derivatives",
        "08-math-calculus-optimization",
        "08-theory-convexity-and-optimality-conditions",
        "09-math-probability-distributions",
        "09-theory-measure-theoretic-probability",
        "10-math-probability-conditional",
        "11-math-probability-bayes",
        "11-theory-bayesian-inference-foundations",
        "12-math-probability-expectation",
        "12-theory-laws-of-large-numbers-clt",
        "13-math-statistics-hypothesis-testing",
        "13-theory-statistical-decision-theory",
        "14-math-statistics-regression-analysis",
        "15-math-statistics-sampling",
        "16-math-statistics-information-theory",
        "17-programming-python-oop",
        "18-programming-python-functional",
        "19-programming-python-concurrency",
        "20-programming-data-structures-arrays-trees"
    )
    "machine-learning" = @(
        "00-theory-statistical-learning-theory",
        "00-theory-pac-learning-and-vc-dimension",
        "01-supervised-regression-linear",
        "01-theory-ols-derivation-and-gauss-markov",
        "02-supervised-regression-polynomial",
        "03-supervised-regression-ridge-lasso",
        "03-theory-regularization-and-bias-variance-tradeoff",
        "04-supervised-classification-logistic",
        "04-theory-logistic-regression-mle-derivation",
        "05-supervised-classification-knn",
        "06-supervised-classification-naive-bayes",
        "06-theory-naive-bayes-probabilistic-foundations",
        "07-supervised-classification-svm",
        "07-theory-svm-lagrangian-and-kernel-trick",
        "08-supervised-ensemble-random-forest",
        "08-theory-bias-variance-in-ensembles",
        "09-supervised-ensemble-gradient-boosting",
        "09-theory-functional-gradient-descent",
        "10-supervised-ensemble-xgboost-lightgbm",
        "11-supervised-ensemble-bagging-stacking",
        "11-theory-boosting-convergence-proofs",
        "12-theory-kmeans-convergence-and-optimality",
        "12-unsupervised-clustering-kmeans",
        "13-unsupervised-clustering-dbscan",
        "14-unsupervised-clustering-hierarchical",
        "15-theory-pca-variance-maximization-proof",
        "15-unsupervised-dimensionality-pca",
        "16-theory-tsne-kl-divergence-objective",
        "16-unsupervised-dimensionality-tsne",
        "17-theory-umap-riemannian-geometry-foundations",
        "17-unsupervised-dimensionality-umap",
        "18-unsupervised-association-apriori",
        "19-unsupervised-association-fpgrowth",
        "20-semi-supervised-self-training",
        "21-semi-supervised-pseudo-labeling",
        "22-semi-supervised-label-propagation",
        "22-theory-graph-based-semi-supervised-learning",
        "23-engineering-feature-engineering",
        "24-engineering-cross-validation",
        "24-theory-generalization-bounds-and-cross-validation",
        "25-engineering-hyperparameter-tuning",
        "25-theory-bayesian-optimization-theory",
        "26-engineering-class-imbalance",
        "27-engineering-pipelines",
        "17-neural-networks-mlp",
        "18-neural-networks-cnn",
        "19-reinforcement-learning-qlearning",
        "20-reinforcement-learning-dqn"
    )
    "deep-learning" = @() # placeholders for now
    "transformers" = @() 
    "nlp" = @()
    "computer-vision" = @()
    "generative-ai" = @()
    "neural-networks" = @()
    "agentic-ai" = @()
    "reinforcement-learning" = @()
    "deep-reinforcement-learning" = @()
    "multimodal-ai" = @()
    "mlops" = @()
    "fine-tuning-adaptation" = @()
    "rag-memory" = @()
    "advanced-research" = @()
}
foreach ($topic in $topics.Keys) {
    $topicPath = Join-Path $base $topic
    New-Item -ItemType Directory -Force -Path $topicPath | Out-Null
    foreach ($lesson in $topics[$topic]) {
        $filePath = Join-Path $topicPath ($lesson + ".tsx")
        $content = @"
export default function Lesson() {
  return <div>Lesson placeholder for $lesson</div>
}
"@
        Set-Content -Path $filePath -Value $content -Force
    }
}

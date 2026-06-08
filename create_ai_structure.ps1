$topics = @(
    @{ Name = '01-ai-foundations'; Lessons = @(
        '01-math-linear-algebra-vectors.tsx','02-math-linear-algebra-dot-products.tsx','03-math-linear-algebra-eigenvalues.tsx','04-math-linear-algebra-decomposition.tsx','05-math-calculus-derivatives.tsx','06-math-calculus-chain-rule.tsx','07-math-calculus-partial-derivatives.tsx','08-math-calculus-optimization.tsx','09-math-probability-distributions.tsx','10-math-probability-conditional.tsx','11-math-probability-bayes.tsx','12-math-probability-expectation.tsx','13-math-statistics-hypothesis-testing.tsx','14-math-statistics-regression-analysis.tsx','15-math-statistics-sampling.tsx','16-math-statistics-information-theory.tsx','17-programming-python-oop.tsx','18-programming-python-functional.tsx','19-programming-python-concurrency.tsx','20-data-structures-linear.tsx','21-data-structures-nonlinear.tsx','22-data-structures-hash-maps.tsx','23-programming-algorithms-sorting-searching.tsx','24-programming-algorithms-graph.tsx','25-programming-algorithms-dynamic-programming.tsx','26-numpy-operations-broadcasting.tsx','27-pandas-dataframes-cleaning.tsx','28-data-visualization-tools.tsx'
    )},
    @{ Name = '02-machine-learning'; Lessons = @(
        '01-supervised-regression-linear.tsx','02-supervised-regression-polynomial.tsx','03-supervised-regression-ridge-lasso.tsx','04-supervised-classification-logistic.tsx','05-supervised-classification-knn.tsx','06-supervised-classification-naive-bayes.tsx','07-supervised-classification-svm.tsx','08-supervised-ensemble-random-forest.tsx','09-supervised-ensemble-gradient-boosting.tsx','10-supervised-ensemble-xgboost-lightgbm.tsx','11-supervised-ensemble-bagging-stacking.tsx','12-unsupervised-clustering-kmeans.tsx','13-unsupervised-clustering-dbscan.tsx','14-unsupervised-clustering-hierarchical.tsx','15-unsupervised-dimensionality-pca.tsx','16-unsupervised-dimensionality-tsne.tsx','17-unsupervised-dimensionality-umap.tsx','18-association-rules-apriori-fpgrowth.tsx','19-semi-supervised-learning.tsx','20-engineering-feature-engineering.tsx','21-engineering-cross-validation.tsx','22-engineering-hyperparameter-tuning.tsx','23-engineering-class-imbalance.tsx','24-engineering-pipelines.tsx'
    )},
    @{ Name = '03-deep-learning'; Lessons = @(
        '01-perceptron.tsx','02-activation-functions.tsx','03-forward-pass.tsx','04-loss-functions.tsx','05-gradient-descent.tsx','06-backpropagation.tsx','07-universal-approximation.tsx','08-ann.tsx','09-weight-initialization.tsx','10-batch-normalization.tsx','11-dropout-regularization.tsx','12-cnn-image-classification.tsx','13-cnn-detection.tsx','14-cnn-segmentation.tsx','15-rnn-vanilla.tsx','16-rnn-lstm.tsx','17-rnn-gru.tsx','18-rnn-bidirectional.tsx','19-rnn-seq2seq.tsx','20-autoencoders-vanilla.tsx','21-autoencoders-sparse-denoising.tsx','22-autoencoders-vae.tsx','23-frameworks-pytorch-tensorflow.tsx','24-frameworks-jax-mixed-precision.tsx'
    )},
    @{ Name = '04-transformers'; Lessons = @(
        '01-attention-mechanism.tsx','02-self-attention.tsx','03-multi-head-attention.tsx','04-cross-attention.tsx','05-positional-encoding.tsx','06-feed-forward-sublayers.tsx','07-layer-normalization.tsx','08-encoder-decoder.tsx','09-bert-family.tsx','10-gpt-family.tsx','11-vision-transformers.tsx'
    )},
    @{ Name = '05-nlp'; Lessons = @(
        '01-text-processing.tsx','02-tokenization.tsx','03-embeddings.tsx','04-sentiment-analysis.tsx','05-named-entity-recognition.tsx','06-dependency-parsing.tsx','07-coreference-resolution.tsx','08-information-retrieval.tsx','09-question-answering.tsx','10-summarization.tsx','11-translation.tsx','12-text-classification.tsx'
    )},
    @{ Name = '06-computer-vision'; Lessons = @(
        '01-image-processing.tsx','02-image-augmentation.tsx','03-feature-extraction-cnn.tsx','04-object-detection.tsx','05-ocr.tsx','06-pose-estimation.tsx','07-depth-estimation.tsx','08-video-understanding.tsx','09-three-d-vision.tsx'
    )},
    @{ Name = '07-generative-ai'; Lessons = @(
        '01-gans.tsx','02-diffusion-models.tsx','03-image-generation.tsx','04-video-generation.tsx','05-voice-generation.tsx','06-llms-pretraining.tsx','07-llms-instruction-tuning.tsx','08-llms-prompt-engineering.tsx','09-llms-context-window.tsx','10-llms-rlhf-rlaif.tsx'
    )},
    @{ Name = '08-multimodal-ai'; Lessons = @(
        '01-vision-language.tsx','02-audio-text.tsx','03-video-text.tsx','04-omni-models.tsx'
    )},
    @{ Name = '09-reinforcement-learning'; Lessons = @(
        '01-rl-core-concepts.tsx','02-q-learning.tsx','03-policy-gradient.tsx','04-actor-critic.tsx','05-ppo-deep-ppo.tsx','06-dqn.tsx','07-environment-simulation.tsx','08-rlhf.tsx','09-game-ai.tsx','10-robotics-rl.tsx'
    )},
    @{ Name = '10-rag-and-memory'; Lessons = @(
        '01-rag-basics.tsx','02-chunking-strategies.tsx','03-vector-databases.tsx','04-hybrid-search-bm25-dense.tsx','05-reranking.tsx','06-contextual-compression.tsx','07-graph-rag.tsx','08-rag-evaluation-ragas.tsx'
    )},
    @{ Name = '11-agentic-ai'; Lessons = @(
        '01-ai-agents.tsx','02-tool-calling.tsx','03-memory-systems.tsx','04-planning.tsx','05-multi-agent-systems.tsx','06-autonomous-workflows.tsx'
    )},
    @{ Name = '12-fine-tuning-and-adaptation'; Lessons = @(
        '01-full-fine-tuning.tsx','02-peft-lora.tsx','03-distillation.tsx','04-quantization.tsx','05-context-length-extension.tsx'
    )},
    @{ Name = '13-mlops'; Lessons = @(
        '01-experiment-tracking.tsx','02-feature-stores.tsx','03-deployment.tsx','04-docker.tsx','05-kubernetes.tsx','06-monitoring.tsx','07-scaling.tsx','08-llm-serving-vllm.tsx','09-kv-cache-speculative-decoding.tsx','10-ci-cd-for-ml.tsx'
    )},
    @{ Name = '14-vector-embeddings'; Lessons = @(
        '01-embedding-fundamentals.tsx','02-word2vec-glove.tsx','03-sentence-transformers.tsx','04-contrastive-learning.tsx','05-embedding-fine-tuning.tsx','06-embedding-visualization.tsx'
    )},
    @{ Name = '15-evaluation-and-benchmarking'; Lessons = @(
        '01-eval-metrics-classification.tsx','02-eval-metrics-nlp-bleu-rouge.tsx','03-eval-perplexity.tsx','04-eval-llm-as-judge.tsx','05-eval-benchmarks-mmlu-hellaswag.tsx','06-eval-human-evaluation.tsx','07-eval-leaderboards-interpretation.tsx'
    )},
    @{ Name = '16-ai-safety-and-robustness'; Lessons = @(
        '01-adversarial-attacks.tsx','02-prompt-injection.tsx','03-jailbreaks-and-defenses.tsx','04-model-robustness.tsx','05-red-teaming.tsx','06-hallucinations-and-grounding.tsx','07-bias-and-fairness.tsx','08-interpretability-and-explainability.tsx'
    )},
    @{ Name = '17-speech-and-audio'; Lessons = @(
        '01-audio-fundamentals-spectrograms.tsx','02-automatic-speech-recognition.tsx','03-whisper-architecture.tsx','04-wav2vec-self-supervised.tsx','05-text-to-speech.tsx','06-speaker-recognition.tsx','07-audio-classification.tsx'
    )},
    @{ Name = '18-time-series-and-forecasting'; Lessons = @(
        '01-time-series-basics.tsx','02-arima-sarima.tsx','03-lstm-for-time-series.tsx','04-temporal-fusion-transformers.tsx','05-anomaly-detection.tsx','06-forecasting-evaluation.tsx','07-multivariate-time-series.tsx'
    )},
    @{ Name = '19-recommendation-systems'; Lessons = @(
        '01-collaborative-filtering.tsx','02-content-based-filtering.tsx','03-matrix-factorization.tsx','04-two-tower-models.tsx','05-session-based-recommendations.tsx','06-cold-start-problem.tsx','07-recsys-evaluation.tsx'
    )},
    @{ Name = '20-advanced-research'; Lessons = @(
        '01-neuro-symbolic-ai.tsx','02-self-supervised-learning.tsx','03-federated-learning.tsx','04-graph-neural-networks.tsx','05-efficient-ai.tsx','06-ai-ethics-governance.tsx','07-ai-alignment.tsx','08-agi.tsx'
    )}
)

$basePath = "C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/CoreCode/content/artificial-intelligence"

foreach ($topic in $topics) {
    $topicPath = Join-Path $basePath $topic.Name
    if (-not (Test-Path $topicPath)) {
        New-Item -ItemType Directory -Path $topicPath | Out-Null
    }
    foreach ($lesson in $topic.Lessons) {
        $filePath = Join-Path $topicPath $lesson
        if (-not (Test-Path $filePath)) {
            $content = "export default function Lesson() {\n  return <div>TODO: Add lesson content</div>;\n}\n"
            Set-Content -Path $filePath -Value $content -Encoding UTF8
        }
    }
}

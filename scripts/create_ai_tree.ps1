$base = 'C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content/artificial-intelligence'
$structure = @{
    '01-ai-foundations' = @(
        '01-math-linear-algebra-vectors',
        '02-math-linear-algebra-dot-products',
        '03-math-linear-algebra-eigenvalues',
        '04-math-linear-algebra-decomposition',
        '05-math-calculus-derivatives',
        '06-math-calculus-chain-rule',
        '07-math-calculus-partial-derivatives',
        '08-math-calculus-optimization',
        '09-math-probability-distributions',
        '10-math-probability-conditional',
        '11-math-probability-bayes',
        '12-math-probability-expectation',
        '13-math-statistics-hypothesis-testing',
        '14-math-statistics-regression-analysis',
        '15-math-statistics-sampling',
        '16-math-statistics-information-theory',
        '17-programming-python-oop',
        '18-programming-python-functional',
        '19-programming-python-concurrency',
        '20-programming-data-structures-arrays-trees',
        '21-programming-data-structures-graphs-heaps',
        '22-programming-data-structures-hash-maps',
        '23-programming-algorithms-sorting-searching',
        '24-programming-algorithms-graph',
        '25-programming-algorithms-dynamic-programming',
        '26-data-handling-numpy-operations',
        '27-data-handling-numpy-broadcasting',
        '28-data-handling-pandas-dataframes',
        '29-data-handling-pandas-cleaning',
        '30-data-handling-viz-matplotlib',
        '31-data-handling-viz-seaborn',
        '32-data-handling-viz-plotly'
    )
    '02-machine-learning' = @(
        '01-supervised-regression-linear',
        '02-supervised-regression-polynomial',
        '03-supervised-regression-ridge-lasso',
        '04-supervised-classification-logistic',
        '05-supervised-classification-knn',
        '06-supervised-classification-naive-bayes',
        '07-supervised-classification-svm',
        '08-supervised-ensemble-random-forest',
        '09-supervised-ensemble-gradient-boosting',
        '10-supervised-ensemble-xgboost-lightgbm',
        '11-supervised-ensemble-bagging-stacking',
        '12-unsupervised-clustering-kmeans',
        '13-unsupervised-clustering-dbscan',
        '14-unsupervised-clustering-hierarchical',
        '15-unsupervised-dimensionality-pca',
        '16-unsupervised-dimensionality-tsne',
        '17-unsupervised-dimensionality-umap',
        '18-unsupervised-association-apriori',
        '19-unsupervised-association-fpgrowth',
        '20-semi-supervised-self-training',
        '21-semi-supervised-pseudo-labeling',
        '22-semi-supervised-label-propagation',
        '23-engineering-feature-engineering',
        '24-engineering-cross-validation',
        '25-engineering-hyperparameter-tuning',
        '26-engineering-class-imbalance',
        '27-engineering-pipelines'
    )
    '03-neural-networks' = @('01-basics')
    '04-deep-learning' = @(
        '01-neural-networks-perceptron',
        '02-neural-networks-ann',
        '03-neural-networks-activation-functions',
        '04-neural-networks-backpropagation',
        '05-neural-networks-weight-initialization',
        '06-neural-networks-batch-norm',
        '07-neural-networks-dropout-regularization',
        '08-cnn-image-classification',
        '09-cnn-detection',
        '10-cnn-segmentation',
        '11-rnn-vanilla',
        '12-rnn-lstm',
        '13-rnn-gru',
        '14-rnn-bidirectional',
        '15-rnn-seq2seq',
        '16-autoencoders-vanilla',
        '17-autoencoders-sparse',
        '18-autoencoders-denoising',
        '19-autoencoders-vae',
        '20-frameworks-pytorch',
        '21-frameworks-tensorflow-keras',
        '22-frameworks-jax',
        '23-frameworks-mixed-precision'
    )
    '05-transformers' = @(
        '01-attention-mechanism',
        '02-self-attention',
        '03-multi-head-attention',
        '04-cross-attention',
        '05-positional-encoding',
        '06-feed-forward-sublayers',
        '07-layer-normalization',
        '08-encoder-decoder',
        '09-bert-family',
        '10-gpt-family',
        '11-vision-transformers'
    )
    '06-nlp' = @(
        '01-text-processing',
        '02-embeddings',
        '03-sentiment-analysis',
        '04-information-retrieval',
        '05-question-answering',
        '06-summarization',
        '07-translation'
    )
    '07-computer-vision' = @(
        '01-image-processing',
        '02-object-detection',
        '03-ocr',
        '04-pose-estimation',
        '05-video-understanding',
        '06-three-d-vision'
    )
    '08-generative-ai' = @(
        '01-gans',
        '02-diffusion-models',
        '03-image-generation',
        '04-video-generation',
        '05-voice-generation',
        '06-llms-pretraining',
        '07-llms-instruction-tuning',
        '08-llms-prompt-engineering',
        '09-llms-context-window',
        '10-llms-rlhf-rlaif'
    )
    '09-multimodal-ai' = @(
        '01-vision-language',
        '02-audio-text',
        '03-video-text',
        '04-omni-models'
    )
    '10-reinforcement-learning' = @(
        '01-core-concepts',
        '02-q-learning',
        '03-policy-gradient',
        '04-actor-critic',
        '05-ppo',
        '06-environment-simulation'
    )
    '11-deep-reinforcement-learning' = @(
        '01-dqn',
        '02-deep-ppo',
        '03-rlhf',
        '04-game-ai',
        '05-robotics-rl'
    )
    '12-rag-memory' = @(
        '01-rag-basics',
        '02-chunking-strategies',
        '03-vector-databases',
        '04-reranking',
        '05-graph-rag'
    )
    '13-agentic-ai' = @(
        '01-ai-agents',
        '02-tool-calling',
        '03-memory-systems',
        '04-planning',
        '05-multi-agent-systems',
        '06-autonomous-workflows'
    )
    '14-fine-tuning-adaptation' = @(
        '01-full-fine-tuning',
        '02-peft-lora',
        '03-distillation',
        '04-quantization',
        '05-context-length-extension'
    )
    '15-mlops' = @(
        '01-experiment-tracking',
        '02-feature-stores',
        '03-deployment',
        '04-docker',
        '05-kubernetes',
        '06-monitoring',
        '07-scaling'
    )
    '16-advanced-research' = @(
        '01-neuro-symbolic-ai',
        '02-self-supervised-learning',
        '03-federated-learning',
        '04-graph-neural-networks',
        '05-efficient-ai',
        '06-ai-ethics-governance',
        '07-ai-alignment',
        '08-agi'
    )
}
foreach ($folder in $structure.Keys) {
    $folderPath = Join-Path $base $folder
    New-Item -ItemType Directory -Force -Path $folderPath | Out-Null
    foreach ($lesson in $structure[$folder]) {
        $filePath = Join-Path $folderPath ($lesson + '.tsx')
        New-Item -ItemType File -Force -Path $filePath | Out-Null
    }
}

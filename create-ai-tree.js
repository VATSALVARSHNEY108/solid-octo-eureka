const fs = require('fs');
const path = require('path');

const tree = `AI/
├── Machine Learning/
│   ├── Supervised Learning/
│   │   ├── Regression/
│   │   │   ├── Linear Regression
│   │   │   ├── Polynomial Regression
│   │   │   ├── Ridge / Lasso / ElasticNet
│   │   │   ├── Support Vector Regression
│   │   │   └── Gaussian Process Regression
│   │   └── Classification/
│   │       ├── Logistic Regression
│   │       ├── Decision Trees
│   │       ├── Random Forests
│   │       ├── Gradient Boosting (XGBoost, LightGBM, CatBoost)
│   │       ├── Support Vector Machines (SVM)
│   │       ├── Naive Bayes
│   │       └── K-Nearest Neighbors (KNN)
│   ├── Unsupervised Learning/
│   │   ├── Clustering/
│   │   │   ├── K-Means
│   │   │   ├── DBSCAN
│   │   │   ├── Hierarchical Clustering
│   │   │   ├── Gaussian Mixture Models
│   │   │   └── Mean Shift
│   │   ├── Dimensionality Reduction/
│   │   │   ├── PCA
│   │   │   ├── t-SNE
│   │   │   ├── UMAP
│   │   │   ├── Autoencoders
│   │   │   ├── ICA
│   │   │   └── LDA
│   │   └── Anomaly Detection/
│   │       ├── Isolation Forest
│   │       ├── One-Class SVM
│   │       ├── Autoencoders
│   │       └── Local Outlier Factor (LOF)
│   ├── Semi-Supervised Learning/
│   │   ├── Label Propagation
│   │   ├── Self-Training
│   │   ├── Co-Training
│   │   └── Pseudo-Labeling
│   ├── Self-Supervised Learning/
│   │   ├── Contrastive Learning (SimCLR, MoCo)
│   │   ├── Masked Autoencoders
│   │   ├── BYOL / DINO
│   │   └── Pretext Tasks (Word2Vec, rotation prediction)
│   ├── Reinforcement Learning/
│   │   ├── Markov Decision Processes (MDP)
│   │   ├── Q-Learning
│   │   ├── Deep Q-Networks (DQN)
│   │   ├── Policy Gradient (REINFORCE)
│   │   ├── Actor-Critic (A2C, A3C)
│   │   ├── Proximal Policy Optimization (PPO)
│   │   ├── Soft Actor-Critic (SAC)
│   │   ├── Multi-Armed Bandits
│   │   ├── Inverse RL
│   │   ├── Model-Based RL
│   │   └── Hierarchical RL
│   ├── Ensemble Methods/
│   │   ├── Bagging
│   │   ├── Boosting
│   │   ├── Stacking
│   │   └── Voting Classifiers
│   ├── Bayesian Methods/
│   │   ├── Bayesian Inference
│   │   ├── Bayesian Networks
│   │   ├── MCMC
│   │   ├── Variational Inference
│   │   └── Gaussian Processes
│   └── ML Foundations/
│       ├── Feature Engineering
│       ├── Feature Selection
│       ├── Data Augmentation
│       ├── Cross-Validation
│       ├── Hyperparameter Tuning
│       ├── Model Evaluation Metrics
│       ├── Bias-Variance Tradeoff
│       └── Regularization
│
├── Deep Learning/
│   ├── Neural Networks/
│   │   ├── Perceptron
│   │   ├── Multilayer Perceptron (MLP)
│   │   ├── Backpropagation
│   │   ├── Activation Functions
│   │   ├── Weight Initialization
│   │   ├── Batch Normalization
│   │   ├── Dropout & Regularization
│   │   └── Residual Connections
│   ├── Convolutional Neural Networks/
│   │   ├── Conv / Pool / Flatten layers
│   │   ├── LeNet, AlexNet, VGG
│   │   ├── ResNet, DenseNet, EfficientNet
│   │   ├── MobileNet, SqueezeNet
│   │   ├── Inception / GoogLeNet
│   │   ├── Object Detection (YOLO, SSD, Faster R-CNN)
│   │   ├── Semantic Segmentation (U-Net, DeepLab)
│   │   └── Instance Segmentation (Mask R-CNN)
│   ├── Recurrent Neural Networks/
│   │   ├── Vanilla RNN
│   │   ├── LSTM
│   │   ├── GRU
│   │   ├── Bidirectional RNN
│   │   ├── Sequence-to-Sequence
│   │   └── Attention Mechanism (Bahdanau)
│   ├── Transformers/
│   │   ├── Self-Attention & Multi-Head Attention
│   │   ├── Positional Encoding
│   │   ├── Encoder-Decoder Architecture
│   │   ├── BERT & Variants (RoBERTa, ALBERT)
│   │   ├── GPT Family (GPT-2/3/4)
│   │   ├── T5, BART, mT5
│   │   ├── Vision Transformer (ViT)
│   │   ├── CLIP / ALIGN (vision-language)
│   │   ├── Swin Transformer
│   │   ├── FlashAttention
│   │   └── Sparse / Linear Attention
│   ├── Generative Models/
│   │   ├── Variational Autoencoders (VAE)
│   │   ├── Generative Adversarial Networks (GAN)
│   │   ├── Conditional GAN, StyleGAN, CycleGAN
│   │   ├── Diffusion Models (DDPM, DDIM)
│   │   ├── Score-Based Generative Models
│   │   ├── Stable Diffusion
│   │   ├── Normalizing Flows
│   │   └── Energy-Based Models
│   ├── Graph Neural Networks/
│   │   ├── Graph Convolutional Network (GCN)
│   │   ├── GraphSAGE
│   │   ├── Graph Attention Network (GAT)
│   │   ├── Message Passing Neural Networks
│   │   ├── Graph Transformers
│   │   └── Knowledge Graph Embeddings
│   └── Optimization/
│       ├── SGD, Momentum, Nesterov
│       ├── Adam, AdaGrad, RMSProp
│       ├── Learning Rate Schedules
│       ├── Gradient Clipping
│       ├── Second-Order Methods
│       └── Loss Landscapes
│
├── Large Language Models/
│   ├── Architecture & Training/
│   │   ├── Pretraining (next-token prediction)
│   │   ├── Causal vs Masked LMs
│   │   ├── Scaling Laws
│   │   ├── Tokenization (BPE, SentencePiece)
│   │   ├── Context Window & Long-Context
│   │   ├── Mixture of Experts (MoE)
│   │   ├── Rotary / ALiBi Positional Embeddings
│   │   └── KV Cache
│   ├── Fine-Tuning & Alignment/
│   │   ├── Supervised Fine-Tuning (SFT)
│   │   ├── RLHF
│   │   ├── DPO (Direct Preference Optimization)
│   │   ├── LoRA / QLoRA
│   │   ├── Prompt Tuning / Prefix Tuning
│   │   ├── Constitutional AI
│   │   └── Instruction Tuning
│   ├── Inference & Deployment/
│   │   ├── Quantization (INT4/INT8)
│   │   ├── Knowledge Distillation
│   │   ├── Speculative Decoding
│   │   ├── vLLM / PagedAttention
│   │   ├── Streaming & Batched Inference
│   │   └── ONNX / TensorRT
│   ├── Prompting Techniques/
│   │   ├── Zero-shot / Few-shot
│   │   ├── Chain-of-Thought (CoT)
│   │   ├── Tree of Thoughts
│   │   ├── ReAct
│   │   ├── Self-Consistency
│   │   ├── Role Prompting
│   │   └── Prompt Injection & Defense
│   ├── RAG & Agents/
│   │   ├── Retrieval-Augmented Generation (RAG)
│   │   ├── Vector Databases (Pinecone, Weaviate, Chroma)
│   │   ├── Embedding Models
│   │   ├── Hybrid Search (BM25 + Dense)
│   │   ├── Agentic Frameworks (LangChain, LlamaIndex)
│   │   ├── Tool Use / Function Calling
│   │   ├── Multi-Agent Systems
│   │   └── Memory & Context Management
│   └── LLM Evaluation/
│       ├── MMLU, HellaSwag, TruthfulQA
│       ├── HumanEval / MBPP (coding)
│       ├── MT-Bench, Chatbot Arena
│       ├── Hallucination Metrics
│       └── BERTScore, BLEU, ROUGE
│
├── Computer Vision/
│   ├── Image Classification
│   ├── Object Detection & Tracking
│   ├── Semantic / Instance Segmentation
│   ├── Keypoint Estimation & Pose
│   ├── Depth Estimation
│   ├── Optical Flow
│   ├── Image Generation & Super-Resolution
│   ├── 3D Vision & NeRF
│   ├── Video Understanding
│   ├── OCR & Document AI
│   └── Face Recognition & Analysis
│
├── Natural Language Processing/
│   ├── Tokenization & Text Preprocessing
│   ├── Part-of-Speech Tagging
│   ├── Named Entity Recognition (NER)
│   ├── Dependency Parsing
│   ├── Sentiment Analysis
│   ├── Text Classification
│   ├── Machine Translation
│   ├── Question Answering
│   ├── Summarization
│   ├── Information Extraction
│   ├── Coreference Resolution
│   ├── Word Embeddings (Word2Vec, GloVe, FastText)
│   └── Sentence Embeddings (SBERT)
│
├── Speech & Audio/
│   ├── Automatic Speech Recognition (ASR)
│   ├── Text-to-Speech (TTS)
│   ├── Speaker Identification & Verification
│   ├── Speech Translation
│   ├── Audio Classification
│   ├── Music Generation
│   └── Whisper, Wav2Vec 2.0, Conformer
│
├── Multimodal AI/
│   ├── Vision-Language Models (CLIP, LLaVA, GPT-4V)
│   ├── Text-to-Image (DALL·E, Stable Diffusion)
│   ├── Text-to-Video (Sora, Runway)
│   ├── Text-to-3D
│   ├── Audio-Visual Learning
│   ├── Multimodal Embeddings
│   └── Cross-Modal Retrieval
│
├── ML Systems & MLOps/
│   ├── Infrastructure/
│   │   ├── GPU / TPU Architecture
│   │   ├── Distributed Training (DDP, FSDP, Megatron)
│   │   ├── Data & Model Parallelism
│   │   ├── Mixed Precision Training
│   │   ├── Gradient Checkpointing
│   │   └── CUDA & cuDNN Fundamentals
│   ├── MLOps/
│   │   ├── Experiment Tracking (MLflow, W&B)
│   │   ├── Model Registry
│   │   ├── CI/CD for ML
│   │   ├── Feature Stores
│   │   ├── Data Versioning (DVC)
│   │   ├── Model Serving (TorchServe, BentoML)
│   │   ├── A/B Testing & Shadow Deployment
│   │   └── Monitoring & Drift Detection
│   └── Data Engineering/
│       ├── Data Collection & Labeling
│       ├── Data Pipelines (Spark, Beam)
│       ├── Data Quality & Validation
│       ├── Synthetic Data Generation
│       └── Data Deduplication & Filtering
│
├── Explainability & Fairness/
│   ├── SHAP
│   ├── LIME
│   ├── Grad-CAM
│   ├── Integrated Gradients
│   ├── Counterfactual Explanations
│   ├── Algorithmic Fairness Metrics
│   ├── Bias Detection & Mitigation
│   └── Model Cards & Datasheets
│
├── AI Safety & Ethics/
│   ├── Alignment Problem
│   ├── Reward Hacking & Specification Gaming
│   ├── Robustness & Adversarial Examples
│   ├── Interpretability Research
│   ├── Red-Teaming
│   ├── Watermarking & Provenance
│   ├── Responsible AI Frameworks
│   └── Governance & Regulation
│
└── Application Domains/
    ├── Healthcare & Medical Imaging
    ├── Drug Discovery
    ├── Finance & Trading
    ├── Robotics & Control
    ├── Autonomous Vehicles
    ├── Recommendation Systems
    ├── Search & Information Retrieval
    ├── Code Generation
    ├── Scientific AI (AlphaFold, climate)
    ├── Edge AI & TinyML
    └── Cybersecurity`;

const lines = tree.split('\n');
const rootDir = path.join('c:\\Users\\VATSAL VARSHNEY\\OneDrive\\Desktop\\Think++', 'content');

// Array to keep track of current path hierarchy based on indentation
let pathStack = [];

for (const line of lines) {
    if (!line.trim() || line.trim() === '│') continue;

    // Calculate depth based on the position of ├──, └── or first word char
    const match = line.match(/^(?:│\s*)*(?:├──\s*|└──\s*)?(.*)$/);
    if (!match) continue;

    let content = match[1].trim();
    if (!content) continue;

    // Determine indentation by counting the prefix length before the actual text
    const prefixMatch = line.match(/^(.*?)[a-zA-Z0-9]/);
    const prefixLength = prefixMatch ? prefixMatch[1].length : 0;
    
    // Convert prefix length to a level (approx 4 chars per level)
    const level = Math.floor(prefixLength / 4);

    pathStack = pathStack.slice(0, level);
    
    const isDir = content.endsWith('/');
    if (isDir) {
        content = content.slice(0, -1);
    }

    // Replace invalid characters for windows filenames if any, and convert to kebab case or leave as is?
    // Let's leave as is but remove invalid chars like /
    let safeName = content.replace(/[<>:"/\\|?*]/g, '-').trim();

    pathStack.push(safeName);

    const fullPath = path.join(rootDir, ...pathStack);

    if (isDir) {
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log("Created dir: " + fullPath);
        }
    } else {
        const parentDir = path.dirname(fullPath);
        if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
        }
        // It's a leaf node. We will make it a .tsx file as requested for content
        const filePath = fullPath + '.tsx';
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, 'export default function Lesson() { return <div>' + content + '</div>; }\n');
            console.log("Created file: " + filePath);
        }
    }
}

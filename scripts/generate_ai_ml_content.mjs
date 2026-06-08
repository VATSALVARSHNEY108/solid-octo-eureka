// generate_ai_ml_content.mjs
import { promises as fs } from 'fs';
import path from 'path';

const baseDir = path.resolve(process.cwd(), 'content', 'artificial-intelligence');

const structure = [
  {
    folder: '01-ai-foundations',
    files: [
      '00-theory-history-of-ai.tsx',
      '00-theory-mathematical-foundations-overview.tsx',
      '01-math-linear-algebra-vectors.tsx',
      '01-theory-vector-spaces-and-fields.tsx',
      '02-math-linear-algebra-dot-products.tsx',
      '02-theory-inner-product-spaces.tsx',
      '03-math-linear-algebra-eigenvalues.tsx',
      '03-theory-spectral-theorem-proofs.tsx',
      '04-math-linear-algebra-decomposition.tsx',
      '04-theory-svd-derivation.tsx',
      '05-math-calculus-derivatives.tsx',
      '06-math-calculus-chain-rule.tsx',
      '07-math-calculus-partial-derivatives.tsx',
      '08-math-calculus-optimization.tsx',
      '08-theory-convexity-and-optimality-conditions.tsx',
      '09-math-probability-distributions.tsx',
      '09-theory-measure-theoretic-probability.tsx',
      '10-math-probability-conditional.tsx',
      '11-math-probability-bayes.tsx',
      '11-theory-bayesian-inference-foundations.tsx',
      '12-math-probability-expectation.tsx',
      '12-theory-laws-of-large-numbers-clt.tsx',
      '13-math-statistics-hypothesis-testing.tsx',
      '13-theory-statistical-decision-theory.tsx',
      '14-math-statistics-regression-analysis.tsx',
      '15-math-statistics-sampling.tsx',
      '16-math-statistics-information-theory.tsx',
      '16-theory-entropy-kl-divergence-proofs.tsx',
      '17-programming-python-oop.tsx',
      '18-programming-python-functional.tsx',
      '19-programming-python-concurrency.tsx',
      '20-programming-data-structures-arrays-trees.tsx',
      '21-programming-data-structures-graphs-heaps.tsx',
      '22-programming-data-structures-hash-maps.tsx',
      '23-programming-algorithms-sorting-searching.tsx',
      '23-theory-algorithm-complexity-big-o.tsx',
      '24-programming-algorithms-graph.tsx',
      '25-programming-algorithms-dynamic-programming.tsx',
      '25-theory-dynamic-programming-optimality.tsx',
      '26-data-handling-numpy-operations.tsx',
      '27-data-handling-numpy-broadcasting.tsx',
      '28-data-handling-pandas-dataframes.tsx',
      '29-data-handling-pandas-cleaning.tsx',
      '30-data-handling-viz-matplotlib.tsx',
      '31-data-handling-viz-seaborn.tsx',
      '32-data-handling-viz-plotly.tsx'
    ]
  },
  {
    folder: '02-machine-learning',
    files: [
      '00-theory-statistical-learning-theory.tsx',
      '00-theory-pac-learning-and-vc-dimension.tsx',
      '01-supervised-regression-linear.tsx',
      '01-theory-ols-derivation-and-gauss-markov.tsx',
      '02-supervised-regression-polynomial.tsx',
      '03-supervised-regression-ridge-lasso.tsx',
      '03-theory-regularization-and-bias-variance-tradeoff.tsx',
      '04-supervised-classification-logistic.tsx',
      '04-theory-logistic-regression-mle-derivation.tsx',
      '05-supervised-classification-knn.tsx',
      '06-supervised-classification-naive-bayes.tsx',
      '06-theory-naive-bayes-probabilistic-foundations.tsx',
      '07-supervised-classification-svm.tsx',
      '07-theory-svm-lagrangian-and-kernel-trick.tsx',
      '08-supervised-ensemble-random-forest.tsx',
      '08-theory-bias-variance-in-ensembles.tsx',
      '09-supervised-ensemble-gradient-boosting.tsx',
      '09-theory-functional-gradient-descent.tsx',
      '10-supervised-ensemble-xgboost-lightgbm.tsx',
      '11-supervised-ensemble-bagging-stacking.tsx',
      '11-theory-boosting-convergence-proofs.tsx',
      '12-unsupervised-clustering-kmeans.tsx',
      '12-theory-kmeans-convergence-and-optimality.tsx',
      '13-unsupervised-clustering-dbscan.tsx',
      '14-unsupervised-clustering-hierarchical.tsx',
      '15-unsupervised-dimensionality-pca.tsx',
      '15-theory-pca-variance-maximization-proof.tsx',
      '16-unsupervised-dimensionality-tsne.tsx',
      '16-theory-tsne-kl-divergence-objective.tsx',
      '17-unsupervised-dimensionality-umap.tsx',
      '17-theory-umap-riemannian-geometry-foundations.tsx',
      '18-unsupervised-association-apriori.tsx',
      '19-unsupervised-association-fpgrowth.tsx',
      '20-semi-supervised-self-training.tsx',
      '21-semi-supervised-pseudo-labeling.tsx',
      '22-semi-supervised-label-propagation.tsx',
      '22-theory-graph-based-semi-supervised-learning.tsx',
      '23-engineering-feature-engineering.tsx',
      '24-engineering-cross-validation.tsx',
      '24-theory-generalization-bounds-and-cross-validation.tsx',
      '25-engineering-hyperparameter-tuning.tsx',
      '25-theory-bayesian-optimization-theory.tsx',
      '26-engineering-class-imbalance.tsx',
      '27-engineering-pipelines.tsx'
    ]
  },
  // Additional subfolders omitted for brevity – add similar entries for the remaining topics (03-neural-networks, 04-deep-learning, ...)
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function createFile(filePath) {
  const content = `export default function Lesson() {
  return (
    <section className="prose prose-lg mx-auto py-12">
      <h1>${path.basename(filePath, '.tsx')}</h1>
      <p>TODO: Add detailed content.</p>
    </section>
  );
}`;
  await fs.writeFile(filePath, content, 'utf8');
}

async function main() {
  for (const section of structure) {
    const folderPath = path.join(baseDir, section.folder);
    await ensureDir(folderPath);
    for (const file of section.files) {
      await createFile(path.join(folderPath, file));
    }
  }
  console.log('AI/ML content generation complete');
}

main().catch(err => {
  console.error('Error generating content:', err);
  process.exit(1);
});

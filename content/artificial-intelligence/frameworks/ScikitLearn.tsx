import FrameworkLessonLayout, {
  type FrameworkLessonMeta,
} from "@/components/frameworks/FrameworkLessonLayout";

const meta: FrameworkLessonMeta = {
  subjectId: "artificial-intelligence",
  topicId: "frameworks",
  lessonId: "ScikitLearn",
  title: "scikit-learn",
  tagline:
    "scikit-learn is the go-to library for classical machine learning: preprocessing, feature engineering, models, evaluation, and pipelines.",
  install: {
    steps: [
      "Create a virtual environment (recommended) and activate it.",
      "Install: `pip install scikit-learn`.",
      "For the full tabular ML stack: `pip install scikit-learn pandas numpy matplotlib seaborn`.",
      "Verify: `python -c \"import sklearn; print(sklearn.__version__)\"`.",
    ],
    notes: [
      "For tabular ML, pair this with Pandas for ETL and NumPy for array math.",
      "Pin `scikit-learn==X.Y.Z` in requirements.txt — minor version changes can shift model defaults.",
      "For gradient boosting on tabular data, also consider `pip install xgboost lightgbm` — they follow the same fit/predict API.",
    ],
  },
  helloWorld: {
    code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0, stratify=y
)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])

# 5-fold cross-validation on training set
cv_scores = cross_val_score(pipe, X_train, y_train, cv=5)
print(f"CV accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

pipe.fit(X_train, y_train)
print(classification_report(y_test, pipe.predict(X_test)))`,
    notes: [
      "Always use stratify=y in train_test_split for classification to preserve class ratios.",
      "Wrap preprocessing in a Pipeline before cross-validating — prevents data leakage from the scaler.",
      "classification_report shows per-class precision, recall, and F1 — more informative than raw accuracy.",
    ],
  },
  bestFor: [
    "Classical ML baselines: linear models, trees, ensembles, SVMs, KNN.",
    "Evaluation, cross-validation, and model selection (GridSearchCV, RandomizedSearchCV).",
    "Packaging preprocessing and models with Pipeline to prevent data leakage.",
    "Feature engineering: scaling, encoding, imputation, polynomial features.",
    "Interpretable models where coefficients and feature importances matter.",
    "Small-to-medium tabular datasets where neural networks are overkill.",
  ],
  notFor: [
    "Large neural nets and GPU-heavy training (use PyTorch / TensorFlow).",
    "End-to-end fine-tuning of LLMs (use Hugging Face + PyTorch).",
    "Unstructured data like raw images, audio, or text at scale.",
    "Online / streaming learning at very large scale (consider river or Vowpal Wabbit).",
  ],
  pitfalls: [
    "Data leakage: fitting the scaler on the full dataset before splitting — always use Pipeline.",
    "Wrong metric for the business goal — accuracy is misleading on imbalanced data; use F1, AUC-ROC, or PR curve.",
    "Not using cross-validation when data is limited — a single split gives a noisy estimate.",
    "Ignoring class imbalance — use stratified splits, class_weight='balanced', or SMOTE.",
    "Overfitting the validation set during hyperparameter search — use nested CV for unbiased estimates.",
    "Forgetting random_state — results are not reproducible without fixing it.",
    "Using default hyperparameters and calling it done — most estimators benefit from even light tuning.",
  ],
  related: [
    {
      title: "Pandas",
      href: "/curriculum/artificial-intelligence/frameworks/Pandas",
      desc: "ETL and feature engineering for tabular ML.",
    },
    {
      title: "NumPy",
      href: "/curriculum/artificial-intelligence/frameworks/NumPy",
      desc: "Array math under the hood of many sklearn workflows.",
    },
    {
      title: "PyTorch",
      href: "/curriculum/artificial-intelligence/frameworks/PyTorch",
      desc: "For neural nets when classical ML is not enough.",
    },
    {
      title: "XGBoost / LightGBM",
      href: "/curriculum/artificial-intelligence/frameworks/XGBoost",
      desc: "Gradient boosting libraries with sklearn-compatible APIs — often the best baseline for tabular data.",
    },
  ],
  prev: { title: "Pandas", lessonId: "Pandas" },
  next: { title: "PyTorch", lessonId: "PyTorch" },
};

// ─── Code snippets ────────────────────────────────────────────────────────────

const snippets = {
  pipeline: `
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier

numeric_features = ["age", "income", "tenure"]
categorical_features = ["country", "plan"]

numeric_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_transformer = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore")),
])

preprocessor = ColumnTransformer([
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features),
])

pipe = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=200, random_state=0)),
])

pipe.fit(X_train, y_train)
pipe.score(X_test, y_test)
`.trim(),

  modelSelection: `
from sklearn.model_selection import RandomizedSearchCV
from sklearn.ensemble import GradientBoostingClassifier
from scipy.stats import randint, uniform

param_dist = {
    "classifier__n_estimators": randint(50, 500),
    "classifier__max_depth": randint(2, 8),
    "classifier__learning_rate": uniform(0.01, 0.3),
    "classifier__subsample": uniform(0.6, 0.4),
}

search = RandomizedSearchCV(
    pipe,
    param_distributions=param_dist,
    n_iter=50,
    cv=5,
    scoring="roc_auc",
    n_jobs=-1,
    random_state=0,
    verbose=1,
)
search.fit(X_train, y_train)
print(f"Best AUC: {search.best_score_:.4f}")
print(search.best_params_)
`.trim(),

  evaluation: `
from sklearn.metrics import (
    classification_report,
    ConfusionMatrixDisplay,
    RocCurveDisplay,
    PrecisionRecallDisplay,
)
import matplotlib.pyplot as plt

y_pred = pipe.predict(X_test)
y_proba = pipe.predict_proba(X_test)[:, 1]

print(classification_report(y_test, y_pred))

fig, axes = plt.subplots(1, 3, figsize=(15, 4))
ConfusionMatrixDisplay.from_predictions(y_test, y_pred, ax=axes[0])
RocCurveDisplay.from_predictions(y_test, y_proba, ax=axes[1])
PrecisionRecallDisplay.from_predictions(y_test, y_proba, ax=axes[2])
plt.tight_layout()
`.trim(),

  featureImportance: `
import pandas as pd
import numpy as np

# For tree-based models inside a Pipeline
rf = pipe.named_steps["classifier"]
feature_names = (
    numeric_features
    + pipe.named_steps["preprocessor"]
      .named_transformers_["cat"]
      .named_steps["encoder"]
      .get_feature_names_out(categorical_features)
      .tolist()
)

importance_df = pd.DataFrame({
    "feature": feature_names,
    "importance": rf.feature_importances_,
}).sort_values("importance", ascending=False)

print(importance_df.head(10))

# Model-agnostic: permutation importance
from sklearn.inspection import permutation_importance
result = permutation_importance(pipe, X_test, y_test, n_repeats=10, random_state=0)
`.trim(),

  customTransformer: `
from sklearn.base import BaseEstimator, TransformerMixin
import numpy as np

class LogTransformer(BaseEstimator, TransformerMixin):
    """Log1p-transform skewed numeric columns."""

    def __init__(self, columns=None):
        self.columns = columns

    def fit(self, X, y=None):
        return self  # stateless

    def transform(self, X):
        X = X.copy()
        cols = self.columns or X.columns.tolist()
        X[cols] = np.log1p(X[cols].clip(lower=0))
        return X

# Drop into any Pipeline
pipe = Pipeline([
    ("log", LogTransformer(columns=["income", "tenure"])),
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression()),
])
`.trim(),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScikitLearn() {
  return (
    <FrameworkLessonLayout meta={meta}>

      {/* ── Strengths ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Strengths</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Consistent API",
              desc: "Every estimator follows fit / predict / transform. Switch models by changing one class name — the rest of your code stays the same.",
            },
            {
              title: "Broad algorithm coverage",
              desc: "Linear models, decision trees, ensembles, SVMs, KNN, naive Bayes, clustering, dimensionality reduction — all in one library.",
            },
            {
              title: "Pipeline system",
              desc: "Chain preprocessing and models into a single object. Prevents data leakage, simplifies cross-validation, and makes deployment clean.",
            },
            {
              title: "Evaluation tooling",
              desc: "Cross-validation, GridSearchCV, RandomizedSearchCV, and 30+ metrics out of the box. The standard for reproducible ML evaluation.",
            },
            {
              title: "Composable preprocessing",
              desc: "ColumnTransformer applies different transformers to different columns in a single step — essential for mixed numeric/categorical data.",
            },
            {
              title: "Interoperability",
              desc: "Outputs are NumPy arrays; inputs accept Pandas DataFrames. Plays well with XGBoost, LightGBM, and any sklearn-compatible estimator.",
            },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-[1.5rem] bg-[var(--bg-secondary)]/40 border border-[var(--border-subtle)] p-6"
            >
              <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[var(--text-primary)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pipeline pattern ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          The pipeline pattern
        </h2>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          A <code>Pipeline</code> chains preprocessing and a model into one object. When you call <code>fit</code>, each step is fitted on training data only — the scaler never sees test data, eliminating the most common source of data leakage. <code>ColumnTransformer</code> lets you apply different transforms to different column types in one step.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.pipeline}</code>
        </pre>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Pipeline", note: "Sequential chain of (name, estimator) tuples. Last step must be an estimator; all others must implement transform." },
            { label: "ColumnTransformer", note: "Apply different transformers to different subsets of columns and concatenate the results." },
            { label: "FunctionTransformer", note: "Wrap any stateless function (e.g. np.log1p) as a pipeline-compatible transformer." },
          ].map(({ label, note }) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="text-xs font-bold text-[var(--text-primary)]">{label}</code>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Model cheat-sheet ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Estimator cheat-sheet
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Start with a simple baseline, then move to ensembles. All follow the same <code>fit</code> / <code>predict</code> interface.
        </p>
        <div className="mt-5 space-y-2">
          {[
            { group: "Linear", items: [
              { name: "LogisticRegression", task: "Classification", note: "Strong baseline; interpretable coefficients; fast." },
              { name: "Ridge / Lasso", task: "Regression", note: "Ridge = L2 regularisation; Lasso = L1 + feature selection." },
              { name: "SGDClassifier", task: "Classification", note: "Scales to millions of samples with partial_fit." },
            ]},
            { group: "Tree-based", items: [
              { name: "DecisionTreeClassifier", task: "Classification", note: "Interpretable; prone to overfitting without pruning." },
              { name: "RandomForestClassifier", task: "Both", note: "Robust ensemble; good out-of-the-box; built-in feature importance." },
              { name: "GradientBoostingClassifier", task: "Both", note: "High accuracy; slower than RF; tune n_estimators + learning_rate." },
              { name: "HistGradientBoosting*", task: "Both", note: "sklearn's fast GBDT for large datasets; handles NaNs natively." },
            ]},
            { group: "Other", items: [
              { name: "SVC", task: "Classification", note: "Strong on high-dimensional data; doesn't scale past ~100k rows." },
              { name: "KNeighborsClassifier", task: "Both", note: "Simple, no training phase; slow at inference on large data." },
              { name: "MLPClassifier", task: "Both", note: "Shallow neural net; use PyTorch instead for anything serious." },
            ]},
          ].map(({ group, items }) => (
            <div key={group}>
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-1 pt-4 pb-1">{group}</div>
              {items.map(({ name, task, note }) => (
                <div key={name} className="flex gap-4 items-start rounded-xl border border-[var(--border-subtle)] p-3 mb-2">
                  <code className="shrink-0 text-xs font-bold text-[var(--text-primary)] w-52">{name}</code>
                  <span className="shrink-0 text-xs rounded-full px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">{task}</span>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--text-tertiary)]">* HistGradientBoostingClassifier / Regressor — sklearn s fastest tree method for &gt;10k rows.</p>
      </section>

      {/* ── Model selection ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Hyperparameter search
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Prefer <code>RandomizedSearchCV</code> over <code>GridSearchCV</code> — it samples the parameter space randomly, finding good regions much faster than exhaustive grid search and scaling to large param spaces. Set <code>n_jobs=-1</code> to use all CPU cores.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.modelSelection}</code>
        </pre>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: "GridSearchCV", note: "Exhaustive — tries every combination. Fine for 2–3 params with a few values; explodes otherwise." },
            { label: "RandomizedSearchCV", note: "Samples n_iter combinations at random. Scales well; often finds better results in fewer evaluations." },
            { label: "HalvingRandomSearchCV", note: "Successive halving — eliminates weak candidates early. Faster than RandomizedSearchCV for large budgets." },
            { label: "Nested CV", note: "Outer CV evaluates generalisation; inner CV tunes hyperparams. Prevents overfitting the validation set." },
          ].map(({ label, note }) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="text-xs font-bold text-[var(--text-primary)]">{label}</code>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Evaluation ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Evaluation & metrics
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Always plot a confusion matrix, ROC curve, and precision-recall curve together. ROC AUC is optimistic on imbalanced data — PR AUC is more informative when the positive class is rare.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.evaluation}</code>
        </pre>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Accuracy", note: "Misleading when classes are imbalanced. Use as a secondary metric only." },
            { label: "ROC AUC", note: "Threshold-free ranking metric. Good general-purpose metric for binary classification." },
            { label: "F1 / PR AUC", note: "Precision-recall trade-off — use when false positives and false negatives have different costs." },
            { label: "R² / MAE / RMSE", note: "For regression. MAE is robust to outliers; RMSE penalises large errors more heavily." },
            { label: "Log loss", note: "Measures calibration of probability estimates — important when you need reliable probabilities." },
            { label: "Cohen's kappa", note: "Agreement corrected for chance — useful for multi-class problems with class imbalance." },
          ].map(({ label, note }) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] p-4">
              <code className="text-xs font-bold text-[var(--text-primary)]">{label}</code>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature importance ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Feature importance & inspection
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Tree-based models expose <code>feature_importances_</code> (impurity-based — can be biased toward high-cardinality features). Use <code>permutation_importance</code> as a model-agnostic, unbiased alternative. For linear models, inspect <code>coef_</code> after scaling.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.featureImportance}</code>
        </pre>
      </section>

      {/* ── Custom transformers ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Writing custom transformers
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          Subclass <code>BaseEstimator</code> and <code>TransformerMixin</code>. Implement <code>fit</code> (return self) and <code>transform</code>. Your custom transformer is now a first-class Pipeline citizen — it participates in cross-validation, cloning, and serialisation.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[var(--bg-secondary)] p-5 text-xs leading-relaxed text-[var(--text-secondary)]">
          <code>{snippets.customTransformer}</code>
        </pre>
        <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          Key rule: <code>fit</code> must only learn from <code>X</code> (the training data) and must return <code>self</code>. Never store test-time data in <code>fit</code>. If your transformer is stateless (like a log transform), <code>fit</code> can simply return <code>self</code> immediately.
        </p>
      </section>

      {/* ── Preprocessing reference ── */}
      <section className="rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 sm:p-10 shadow-premium">
        <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Preprocessing reference
        </h2>
        <div className="mt-5 space-y-2">
          {[
            { name: "StandardScaler", when: "Linear models, SVMs, KNN, PCA", note: "Zero mean, unit variance. Sensitive to outliers." },
            { name: "MinMaxScaler", when: "Neural nets, image pixels", note: "Scales to [0, 1]. Distorted by outliers." },
            { name: "RobustScaler", when: "Data with outliers", note: "Uses median + IQR — not affected by extreme values." },
            { name: "OneHotEncoder", when: "Nominal categories", note: "Creates one binary column per category. Use handle_unknown='ignore' for unseen categories." },
            { name: "OrdinalEncoder", when: "Ordinal categories", note: "Encodes as integers. Only use when order is meaningful." },
            { name: "SimpleImputer", when: "Missing values", note: "Strategies: mean, median, most_frequent, constant." },
            { name: "IterativeImputer", when: "Complex missingness", note: "Models each feature as a function of others — more accurate, more expensive." },
            { name: "PolynomialFeatures", when: "Linear model + interactions", note: "Creates x², x³, x·y interaction terms. Degree=2 is usually sufficient." },
            { name: "PCA", when: "Dimensionality reduction", note: "Unsupervised. Useful before KNN or SVMs on high-dimensional data." },
          ].map(({ name, when, note }) => (
            <div key={name} className="flex gap-4 items-start rounded-xl border border-[var(--border-subtle)] p-3">
              <code className="shrink-0 text-xs font-bold text-[var(--text-primary)] w-44">{name}</code>
              <span className="shrink-0 hidden sm:inline-block text-xs rounded-full px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] whitespace-nowrap">{when}</span>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

    </FrameworkLessonLayout>
  );
}
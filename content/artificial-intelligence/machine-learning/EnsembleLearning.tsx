import MLLessonTemplate from "./_shared/MLLessonTemplate";

export default function EnsembleLearning() {
  return (
    <>
      <MLLessonTemplate
        title="Ensemble Learning"
        summary="Ensemble learning combines multiple models to achieve higher accuracy and reliability than any single model."
        keyIdeas={[

          "Bagging reduces variance by training models on bootstrapped subsets",
          "Boosting reduces bias by sequentially focusing on mistakes",
          "Stacking learns a meta‑model to combine diverse base learners",
          "Improves generalization, robustness to noise, and reduces overfitting"
        ]}
        workflow={[
          "Select base learners and ensemble strategy",
          "Prepare data and optionally apply feature engineering",
          "Train individual models according to method (parallel for bagging, sequential for boosting)",
          "Combine predictions via voting, averaging, or meta‑model",
          "Evaluate ensemble performance and tune hyper‑parameters"
        ]}
        useCases={[
          "Classification and regression tasks",
          "Handling imbalanced datasets",
          "Improving weak learners",
          "Competitions and production ML pipelines"
        ]}
      />
        <img src="/assets/ensemble_learning.webp" alt="Ensemble Learning" className="mt-4 w-full max-w-2xl mx-auto" />
        <p className="text-[var(--text-secondary)] text-sm">Last Updated: 2 May, 2026</p>

      {/* Detailed Content Sections */}
      <section className="max-w-6xl mx-auto mt-12 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Overview</h2>
        <p className="text-[var(--text-secondary)]">
          Ensemble learning is a method where multiple models are combined instead of using just one. Even if individual models are weak, combining their results gives more accurate and reliable predictions.
        </p>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2 mt-4">
          <li>Uses multiple models together to improve overall accuracy.</li>
          <li>Reduces errors by balancing mistakes across models.</li>
          <li>Works on a simple idea similar to combining opinions from a group.</li>
        </ul>
      </section>

      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Types of Ensemble Learning</h2>
        <p className="text-[var(--text-secondary)]">
          There are three main types of ensemble methods:
        </p>
        <ol className="list-decimal pl-6 text-[var(--text-secondary)] space-y-2 mt-4">
          <li><strong>Bagging (Bootstrap Aggregating)</strong>: Models are trained independently on different random subsets of the training data. Their results are combined by averaging (regression) or voting (classification).</li>
          <li><strong>Boosting</strong>: Models are trained sequentially, each new model focuses on fixing the errors made by the previous ones. The final prediction is a weighted combination of all models.</li>
          <li><strong>Stacking (Stacked Generalization)</strong>: Multiple different models are trained; their predictions become inputs to a meta‑model that learns how to best combine them.</li>
        </ol>
      </section>

      {/* Bagging Algorithm */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Bagging Algorithm</h2>
        <p className="text-[var(--text-secondary)]">Implementation using scikit‑learn:</p>
        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load data
data = load_iris()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Base classifier
base_clf = DecisionTreeClassifier()

# Bagging ensemble
bagging = BaggingClassifier(base_clf, n_estimators=10, random_state=42)
bagging.fit(X_train, y_train)

# Evaluate
y_pred = bagging.predict(X_test)
print("Bagging Accuracy:", accuracy_score(y_test, y_pred))
`}</code></pre>
      </section>

      {/* Boosting Algorithm */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Boosting Algorithm (AdaBoost)</h2>
        <p className="text-[var(--text-secondary)]">Implementation using scikit‑learn:</p>
        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load data
data = load_iris()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Weak learner (decision stump)
weak_clf = DecisionTreeClassifier(max_depth=1)

# AdaBoost ensemble
adaboost = AdaBoostClassifier(weak_clf, n_estimators=50, learning_rate=1.0, random_state=42)
adaboost.fit(X_train, y_train)

# Evaluate
y_pred = adaboost.predict(X_test)
print("AdaBoost Accuracy:", accuracy_score(y_test, y_pred))
`}</code></pre>
      </section>

      {/* Importance */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Why Ensemble Learning Matters</h2>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>Reduces overfitting by aggregating diverse models.</li>
          <li>Improves generalization to unseen data.</li>
          <li>Increases predictive accuracy.</li>
          <li>Robustness to noisy data.</li>
          <li>Flexibility to combine different model families.</li>
          <li>Balances bias‑variance trade‑off.</li>
        </ul>
      </section>

      {/* Techniques Table */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Ensemble Learning Techniques</h2>
        <table className="w-full border-collapse border border-[var(--text-primary)]">
          <thead>
            <tr className="bg-[var(--bg-primary)]">
              <th className="border border-[var(--text-primary)] p-2 text-left">Technique</th>
              <th className="border border-[var(--text-primary)] p-2 text-left">Category</th>
              <th className="border border-[var(--text-primary)] p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[var(--text-primary)] p-2">Random Forest</td>
              <td className="border border-[var(--text-primary)] p-2">Bagging</td>
              <td className="border border-[var(--text-primary)] p-2">Multiple decision trees trained on bootstrapped subsets; predictions are averaged/voted.</td>
            </tr>
            <tr className="bg-[var(--bg-primary)]">
              <td className="border border-[var(--text-primary)] p-2">Gradient Boosting Machines (GBM)</td>
              <td className="border border-[var(--text-primary)] p-2">Boosting</td>
              <td className="border border-[var(--text-primary)] p-2">Sequential trees where each corrects errors of the previous, optimizing a loss function.</td>
            </tr>
            <tr>
              <td className="border border-[var(--text-primary)] p-2">XGBoost</td>
              <td className="border border-[var(--text-primary)] p-2">Boosting</td>
              <td className="border border-[var(--text-primary)] p-2">Optimized GBM with regularization, parallelization, and tree pruning.</td>
            </tr>
            <tr className="bg-[var(--bg-primary)]">
              <td className="border border-[var(--text-primary)] p-2">AdaBoost</td>
              <td className="border border-[var(--text-primary)] p-2">Boosting</td>
              <td className="border border-[var(--text-primary)] p-2">Weights misclassified samples higher; combines weak learners via weighted vote.</td>
            </tr>
            <tr>
              <td className="border border-[var(--text-primary)] p-2">CatBoost</td>
              <td className="border border-[var(--text-primary)] p-2">Boosting</td>
              <td className="border border-[var(--text-primary)] p-2">Handles categorical features natively; reduces overfitting with ordered boosting.</td>
            </tr>
          </tbody>
        </table>
      </section>

    </>
  );
}

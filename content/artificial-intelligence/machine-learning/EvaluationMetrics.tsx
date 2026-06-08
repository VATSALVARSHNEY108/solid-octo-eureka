import MLLessonTemplate from "./_shared/MLLessonTemplate";

export default function EvaluationMetrics() {
  return (
    <>
      <MLLessonTemplate
        title="Evaluation Metrics"
        summary="Evaluation metrics are used to measure how well a machine learning model performs. They help assess whether the model is making accurate predictions and meeting the desired goals."
        keyIdeas={[
          "Model performance measurement",
          "Metric choice depends on task (classification, regression, clustering)",
          "Proper metrics guide better decisions",
          "Avoid misleading conclusions from single metrics",
        ]}
        workflow={[
          "Identify the problem type (classification, regression, clustering)",
          "Select appropriate evaluation metrics",
          "Compute metrics on validation/test data",
          "Interpret results and iterate on model improvements",
        ]}
        useCases={[
          "Assessing classification models",
          "Evaluating regression accuracy",
          "Measuring clustering quality",
        ]}
      />

      {/* Header */}
      <section className="max-w-6xl mx-auto mt-12 px-6 md:px-10">
        <p className="text-[var(--text-secondary)] text-sm">Last Updated: 30 Mar, 2026</p>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 mt-2">Why Evaluation Metrics Matter</h2>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>Model Performance – Measures how well the model works</li>
          <li>Different Tasks – Used for classification, regression and clustering</li>
          <li>Right Metric Choice – Helps select the best way to evaluate a model</li>
          <li>Better Decisions – Ensures the model meets its objectives</li>
        </ul>
      </section>

      {/* Classification Metrics */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Classification Metrics</h2>
        <p className="text-[var(--text-secondary)] mb-2">Classification problems aim to predict discrete categories.</p>
        <ol className="list-decimal pl-6 text-[var(--text-secondary)] space-y-2">
          <li>
            <strong>Accuracy</strong>
            <p>Proportion of correct predictions out of all predictions.</p>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`Accuracy = Number_of_Correct_Predictions / Total_Number_of_Predictions`}</code></pre>
            <p>Note: Accuracy can be misleading on imbalanced datasets.</p>
          </li>
          <li>
            <strong>Precision</strong>
            <p>How many of the positive predictions are actually correct.</p>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`Precision = TP / (TP + FP)`}</code></pre>
          </li>
          <li>
            <strong>Recall (Sensitivity)</strong>
            <p>How many actual positive cases were correctly identified.</p>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`Recall = TP / (TP + FN)`}</code></pre>
          </li>
          <li>
            <strong>F1 Score</strong>
            <p>Harmonic mean of precision and recall.</p>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`F1 = 2 * (Precision * Recall) / (Precision + Recall)`}</code></pre>
          </li>
          <li>
            <strong>Logarithmic Loss (Log Loss)</strong>
            <p>Penalises low probability assigned to the correct class.</p>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`LogLoss = - (1/N) * Σ_i Σ_j y_ij * log(p_ij)`}</code></pre>
          </li>
          <li>
            <strong>ROC Curve & AUC</strong>
            <p>Measures the ability of the model to discriminate between classes.</p>
          </li>
        </ol>
      </section>

      {/* Detailed ROC / TPR / TNR / FPR / FNR */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h3 className="text-xl font-semibold mt-4 text-[var(--text-primary)]">ROC‑Related Rates</h3>
        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li><strong>True Positive Rate (TPR)</strong> = TP / (TP + FN)</li>
          <li><strong>True Negative Rate (TNR)</strong> = TN / (TN + FP)</li>
          <li><strong>False Positive Rate (FPR)</strong> = FP / (FP + TN)</li>
          <li><strong>False Negative Rate (FNR)</strong> = FN / (FN + TP)</li>
        </ul>
      </section>

      {/* Confusion Matrix */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h3 className="text-xl font-semibold mt-4 text-[var(--text-primary)]">Confusion Matrix</h3>
        <p className="text-[var(--text-secondary)] mb-2">A 2×2 matrix for binary classification:</p>
        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`               Predicted No   Predicted Yes
Actual No          TN               FP
Actual Yes         FN               TP`}</code></pre>
      </section>

      {/* Regression Metrics */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Regression Metrics</h2>
        <ol className="list-decimal pl-6 text-[var(--text-secondary)] space-y-2">
          <li>
            <strong>Mean Absolute Error (MAE)</strong>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`MAE = (1/N) * Σ_j |y_j - ŷ_j|`}</code></pre>
          </li>
          <li>
            <strong>Mean Squared Error (MSE)</strong>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`MSE = (1/N) * Σ_j (y_j - ŷ_j)^2`}</code></pre>
          </li>
          <li>
            <strong>Root Mean Squared Error (RMSE)</strong>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`RMSE = sqrt(MSE)`}</code></pre>
          </li>
          <li>
            <strong>Root Mean Squared Logarithmic Error (RMSLE)</strong>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`RMSLE = sqrt( (1/N) * Σ_j (log(y_j + 1) - log(Ŷ_j + 1))^2 )`}</code></pre>
          </li>
          <li>
            <strong>R² (Coefficient of Determination)</strong>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`R² = 1 - Σ_j (y_j - ŷ_j)^2 / Σ_j (y_j - ȳ)^2`}</code></pre>
          </li>
        </ol>
      </section>

      {/* Clustering Metrics */}
      <section className="max-w-6xl mx-auto mt-8 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Clustering Metrics</h2>
        <ol className="list-decimal pl-6 text-[var(--text-secondary)] space-y-2">
          <li>
            <strong>Silhouette Score</strong>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`Silhouette = (b - a) / max(a, b)`}</code></pre>
          </li>
          <li>
            <strong>Davies‑Bouldin Index</strong>
            <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]"><code>{`DB = (1/N) * Σ_i max_{j≠i} (σ_i + σ_j) / d(c_i, c_j)`}</code></pre>
          </li>
        </ol>
      </section>
    </>
  );
}

import MLLessonTemplate from "./_shared/MLLessonTemplate";

export default function ModelSelection() {
  return (
    <>
      <MLLessonTemplate
        title="Model Selection for Machine Learning"
        summary="Model selection is the process of choosing the most suitable machine learning model for a given problem. The selected model should provide high accuracy, good generalization and efficient computation while avoiding overfitting and underfitting."
        keyIdeas={[
          "Different machine learning problems require different models",
          "Proper model selection improves prediction accuracy and reliability",
          "Overly simple models underfit while complex models may overfit",
          "Evaluation metrics help compare model performance",
          "Cross-validation improves reliability of model evaluation"
        ]}
        workflow={[
          "Understand the problem and dataset",
          "Identify whether the task is regression, classification or clustering",
          "Select suitable machine learning models",
          "Train and evaluate models using train-test split",
          "Apply cross-validation for robust evaluation",
          "Compare performance metrics and choose the best model"
        ]}
        useCases={[
          "Fraud detection systems",
          "Recommendation systems",
          "Medical diagnosis",
          "Customer segmentation",
          "Predictive analytics"
        ]}
      />

      {/* Importance */}
      <section className="max-w-6xl mx-auto mt-12 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Importance of Model Selection
        </h2>

        <p className="text-[var(--text-secondary)] leading-7">
          Model selection is a key step in machine learning because it affects
          how well a system can learn from data and make accurate predictions.
          Different models process data differently and choosing the right one
          ensures better performance and efficiency.
        </p>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          A simple model may fail to capture important patterns and lead to
          underfitting, while an overly complex model may overfit by memorizing
          training data instead of learning general patterns.
        </p>

        <ul className="list-disc pl-6 mt-6 text-[var(--text-secondary)] space-y-2">
          <li>Improves prediction accuracy and reliability.</li>
          <li>Helps prevent overfitting and underfitting.</li>
          <li>Enhances computational efficiency.</li>
          <li>Makes AI systems more robust in real-world scenarios.</li>
          <li>Optimizes training time and resource usage.</li>
        </ul>
      </section>

      {/* Understanding Problem */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Steps in Model Selection
        </h2>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          1. Understanding the Problem and Data
        </h3>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          Before selecting a model, it is important to understand the type of
          machine learning problem.
        </p>

        <ul className="list-disc pl-6 mt-4 text-[var(--text-secondary)] space-y-2">
          <li>
            <strong>Regression:</strong> Predict continuous values such as house
            prices or temperature.
          </li>

          <li>
            <strong>Classification:</strong> Predict categorical labels such as
            spam or non-spam emails.
          </li>

          <li>
            <strong>Clustering:</strong> Group similar data points such as
            customer segmentation.
          </li>
        </ul>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          Understanding the dataset is equally important. We should analyze
          missing values, categorical variables, numerical features and data
          distribution before selecting a model.
        </p>
      </section>

      {/* Selecting Models */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
          2. Selecting Suitable Models
        </h3>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          Different machine learning problems require different models.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">
              Regression Models
            </h4>

            <ul className="list-disc pl-6 mt-2 text-[var(--text-secondary)] space-y-2">
              <li>Linear Regression</li>
              <li>Decision Trees</li>
              <li>Random Forest</li>
              <li>Neural Networks</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">
              Classification Models
            </h4>

            <ul className="list-disc pl-6 mt-2 text-[var(--text-secondary)] space-y-2">
              <li>Logistic Regression</li>
              <li>Support Vector Machines (SVM)</li>
              <li>k-Nearest Neighbors (k-NN)</li>
              <li>Neural Networks</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)]">
              Clustering Models
            </h4>

            <ul className="list-disc pl-6 mt-2 text-[var(--text-secondary)] space-y-2">
              <li>k-Means</li>
              <li>Hierarchical Clustering</li>
              <li>DBSCAN</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">
          3. Model Evaluation
        </h3>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          After selecting models, we evaluate how well they perform on unseen
          data.
        </p>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">
            Dataset Splitting
          </h4>

          <ul className="list-disc pl-6 mt-3 text-[var(--text-secondary)] space-y-2">
            <li>
              <strong>Training Set:</strong> Used to train the machine learning
              model.
            </li>

            <li>
              <strong>Testing Set:</strong> Used to evaluate model performance
              on unseen data.
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">
            k-Fold Cross Validation
          </h4>

          <p className="mt-3 text-[var(--text-secondary)] leading-7">
            In k-fold cross-validation, the dataset is divided into k subsets.
            The model is trained on k-1 subsets and tested on the remaining
            subset. This process repeats k times to reduce bias caused by a
            single train-test split.
          </p>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-[var(--text-primary)]">
            Evaluation Metrics
          </h4>

          <div className="mt-4 space-y-5">
            <div>
              <h5 className="font-semibold text-[var(--text-primary)]">
                Regression Metrics
              </h5>

              <ul className="list-disc pl-6 mt-2 text-[var(--text-secondary)] space-y-2">
                <li>Mean Squared Error (MSE)</li>
                <li>Mean Absolute Error (MAE)</li>
                <li>R-squared Score</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-[var(--text-primary)]">
                Classification Metrics
              </h5>

              <ul className="list-disc pl-6 mt-2 text-[var(--text-secondary)] space-y-2">
                <li>Accuracy</li>
                <li>Precision</li>
                <li>Recall</li>
                <li>F1-Score</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Techniques */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Model Selection Techniques in Machine Learning
        </h2>

        <div className="space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              1. Grid Search
            </h3>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              Grid Search systematically tests different combinations of
              hyperparameters and selects the combination that gives the best
              performance.
            </p>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              Although effective, it becomes computationally expensive when
              dealing with many parameters or large datasets.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              2. Random Search
            </h3>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              Random Search evaluates randomly selected combinations instead of
              checking all possible combinations.
            </p>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              It is generally faster than Grid Search and can still produce very
              strong results.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              3. Bayesian Optimization
            </h3>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              Bayesian Optimization uses probability models to intelligently
              predict which hyperparameters are likely to perform best.
            </p>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              This method focuses on promising parameter combinations and often
              achieves better performance with fewer evaluations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              4. Cross-Validation Based Selection
            </h3>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              Cross-validation evaluates models across multiple train-test
              splits instead of relying on a single split.
            </p>

            <p className="mt-3 text-[var(--text-secondary)] leading-7">
              Averaging results across multiple folds provides a more reliable
              estimate of how the model will perform on unseen data and reduces
              overfitting risk.
            </p>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="max-w-6xl mx-auto mt-10 mb-16 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Challenges in Model Selection
        </h2>

        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>
            Complex models may require high computational resources and training
            time.
          </li>

          <li>
            Choosing too simple a model can lead to underfitting.
          </li>

          <li>
            Choosing overly complex models can cause overfitting.
          </li>

          <li>
            Large datasets require efficient evaluation and optimization
            strategies.
          </li>

          <li>
            Balancing accuracy, speed and interpretability is often difficult.
          </li>
        </ul>
      </section>
    </>
  );
}
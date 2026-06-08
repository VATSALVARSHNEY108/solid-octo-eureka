import MLLessonTemplate from "./_shared/MLLessonTemplate";

export default function HyperparameterTuning() {
  return (
    <>
      <MLLessonTemplate
        title="Hyperparameter Tuning"
        summary="Hyperparameter tuning is the process of selecting the optimal values for a machine learning model's hyperparameters. These parameters control how the model learns and directly affect model accuracy, generalization and efficiency."
        keyIdeas={[
          "Hyperparameters are configured before training begins",
          "Tuning improves model accuracy and generalization",
          "GridSearchCV tests all parameter combinations",
          "RandomizedSearchCV explores random combinations efficiently",
          "Bayesian Optimization learns from previous trials to guide search"
        ]}
        workflow={[
          "Define the machine learning model",
          "Select important hyperparameters to tune",
          "Choose a tuning strategy like Grid Search or Random Search",
          "Train models using different hyperparameter combinations",
          "Evaluate models using cross-validation",
          "Select the best-performing hyperparameter configuration"
        ]}
        useCases={[
          "Improving classification accuracy",
          "Optimizing deep learning models",
          "Reducing overfitting and underfitting",
          "Improving recommendation systems",
          "Fine-tuning NLP and computer vision models"
        ]}
      />

      {/* Introduction */}
      <section className="max-w-6xl mx-auto mt-12 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Techniques for Hyperparameter Tuning
        </h2>

        <p className="text-[var(--text-secondary)] leading-7">
          Models can have many hyperparameters and finding the best combination
          can be treated as a search problem.
        </p>

        <ul className="list-disc pl-6 mt-4 text-[var(--text-secondary)] space-y-2">
          <li>GridSearchCV</li>
          <li>RandomizedSearchCV</li>
          <li>Bayesian Optimization</li>
        </ul>
      </section>

      {/* Grid Search */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          1. GridSearchCV
        </h2>

        <p className="text-[var(--text-secondary)] leading-7">
          GridSearchCV is a brute-force technique for hyperparameter tuning.
          It trains the model using all possible combinations of specified
          hyperparameter values to find the best-performing setup.
        </p>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          It is slow and computationally expensive because it evaluates every
          possible combination of parameters.
        </p>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Working Process
        </h3>

        <ol className="list-decimal pl-6 mt-3 text-[var(--text-secondary)] space-y-2">
          <li>Create a grid of possible hyperparameter values.</li>
          <li>Train the model on every combination.</li>
          <li>Evaluate each model using cross-validation.</li>
          <li>Select the combination with the highest score.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Example Parameter Space
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
<code>{`C = [0.1, 0.2, 0.3, 0.4, 0.5]
penalty = [0.01, 0.1, 0.5, 1.0]

Total Models = 5 × 4 = 20`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Example: Logistic Regression with GridSearchCV
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
<code>{`from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV
import numpy as np
from sklearn.datasets import make_classification

X, y = make_classification(
    n_samples=1000,
    n_features=20,
    n_informative=10,
    n_classes=2,
    random_state=42
)

c_space = np.logspace(-5, 8, 15)

param_grid = {
    'C': c_space,
    'penalty': ['l1', 'l2']
}

logreg = LogisticRegression(solver='liblinear')

logreg_cv = GridSearchCV(
    logreg,
    param_grid,
    cv=5
)

logreg_cv.fit(X, y)

print(
    "Tuned Logistic Regression Parameters: {}".format(
        logreg_cv.best_params_
    )
)

print(
    "Best score is {}".format(
        logreg_cv.best_score_
    )
)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Output
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
<code>{`Tuned Logistic Regression Parameters:
{'C': 0.006105402296585327}

Best score is 0.853`}</code>
        </pre>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          The best score of 0.853 means the model achieved 85.3% validation
          accuracy using the optimal hyperparameter combination.
        </p>
      </section>

      {/* Random Search */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          2. RandomizedSearchCV
        </h2>

        <p className="text-[var(--text-secondary)] leading-7">
          RandomizedSearchCV randomly selects combinations of hyperparameters
          instead of checking every possible combination like GridSearchCV.
        </p>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Working Process
        </h3>

        <ol className="list-decimal pl-6 mt-3 text-[var(--text-secondary)] space-y-2">
          <li>Select random hyperparameter combinations.</li>
          <li>Train and evaluate the model.</li>
          <li>Track the performance of each configuration.</li>
          <li>Choose the best-performing setup.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Example: Decision Tree with RandomizedSearchCV
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
<code>{`import numpy as np
from sklearn.datasets import make_classification

X, y = make_classification(
    n_samples=1000,
    n_features=20,
    n_informative=10,
    n_classes=2,
    random_state=42
)

from scipy.stats import randint
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import RandomizedSearchCV

param_dist = {
    "max_depth": [3, None],
    "max_features": randint(1, 9),
    "min_samples_leaf": randint(1, 9),
    "criterion": ["gini", "entropy"]
}

tree = DecisionTreeClassifier()

tree_cv = RandomizedSearchCV(
    tree,
    param_dist,
    cv=5
)

tree_cv.fit(X, y)

print(
    "Tuned Decision Tree Parameters: {}".format(
        tree_cv.best_params_
    )
)

print(
    "Best score is {}".format(
        tree_cv.best_score_
    )
)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Output
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
<code>{`Tuned Decision Tree Parameters:
{
  'criterion': 'entropy',
  'max_depth': None,
  'max_features': 6,
  'min_samples_leaf': 6
}

Best score is 0.8`}</code>
        </pre>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          A score of 0.8 means the tuned model achieved 80% validation accuracy
          with the selected hyperparameters.
        </p>
      </section>

      {/* Bayesian Optimization */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          3. Bayesian Optimization
        </h2>

        <p className="text-[var(--text-secondary)] leading-7">
          Grid Search and Random Search can be inefficient because they try many
          unnecessary combinations.
        </p>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          Bayesian Optimization uses previous results to intelligently decide
          which hyperparameter combination should be tested next.
        </p>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Working Process
        </h3>

        <ol className="list-decimal pl-6 mt-3 text-[var(--text-secondary)] space-y-2">
          <li>Build a probabilistic surrogate model.</li>
          <li>Predict performance using previous evaluations.</li>
          <li>Select the most promising hyperparameters.</li>
          <li>Update the model after every evaluation.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Surrogate Function
        </h3>

        <pre className="bg-[var(--bg-primary)] p-4 rounded overflow-x-auto text-[var(--text-secondary)]">
<code>{`P(score(y) | hyperparameters(x))`}</code>
        </pre>

        <p className="mt-4 text-[var(--text-secondary)] leading-7">
          Here, x represents hyperparameters and y represents model performance.
        </p>

        <h3 className="text-xl font-semibold mt-6 text-[var(--text-primary)]">
          Common Surrogate Models
        </h3>

        <ul className="list-disc pl-6 mt-3 text-[var(--text-secondary)] space-y-2">
          <li>Gaussian Processes</li>
          <li>Random Forest Regression</li>
          <li>Tree-structured Parzen Estimators (TPE)</li>
        </ul>
      </section>

      {/* Advantages */}
      <section className="max-w-6xl mx-auto mt-10 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Advantages of Hyperparameter Tuning
        </h2>

        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>Improves model accuracy and robustness.</li>
          <li>Helps prevent overfitting and underfitting.</li>
          <li>Improves generalization on unseen data.</li>
          <li>Optimizes computational resources efficiently.</li>
          <li>Makes models easier to interpret and understand.</li>
        </ul>
      </section>

      {/* Challenges */}
      <section className="max-w-6xl mx-auto mt-10 mb-16 px-6 md:px-10">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Challenges
        </h2>

        <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>
            Large hyperparameter spaces increase computational cost and training
            time.
          </li>
          <li>
            Complex models require significant memory and processing power.
          </li>
          <li>
            Prior knowledge is often needed to narrow the search space.
          </li>
          <li>
            Dynamic tuning strategies like learning rate scheduling add extra
            complexity.
          </li>
        </ul>
      </section>
    </>
  );
}
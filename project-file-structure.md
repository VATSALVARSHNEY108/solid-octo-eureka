# Project File Structure

Repository tree for the current code space.

Excluded from this view: `.git`, `.next`, `node_modules`, `venv`, `__pycache__`, `tsconfig.tsbuildinfo`, and the generated `project-file-structure.md` itself.

```text
.
|-- .sixth/
|   `-- skills/
|-- .vscode/
|   `-- settings.json
|-- app/
|   |-- api/
|   |   `-- content/
|   |       `-- route.ts
|   |-- creators/
|   |   `-- page.tsx
|   |-- curriculum/
|   |   |-- [subject]/
|   |   |   |-- [topic]/
|   |   |   |   |-- [lesson]/
|   |   |   |   |   |-- loading.tsx
|   |   |   |   |   `-- page.tsx
|   |   |   |   |-- loading.tsx
|   |   |   |   `-- page.tsx
|   |   |   |-- loading.tsx
|   |   |   `-- page.tsx
|   |   |-- loading.tsx
|   |   `-- page.tsx
|   |-- dashboard/
|   |   |-- loading.tsx
|   |   `-- page.tsx
|   |-- notes/
|   |   |-- loading.tsx
|   |   `-- page.tsx
|   |-- playground/
|   |   |-- loading.tsx
|   |   `-- page.tsx
|   |-- profile/
|   |   |-- loading.tsx
|   |   `-- page.tsx
|   |-- styles/
|   |   |-- animations.css
|   |   |-- base.css
|   |   |-- buttons.css
|   |   |-- cards.css
|   |   |-- dark.css
|   |   |-- effects.css
|   |   |-- lessons.css
|   |   |-- light.css
|   |   |-- panels.css
|   |   |-- scrollbar.css
|   |   `-- theme.css
|   |-- globals.css
|   |-- Home.css
|   |-- layout.tsx
|   |-- loading.tsx
|   |-- page.tsx
|   `-- sitemap.ts
|-- backend/
|   |-- .vscode/
|   |   `-- settings.json
|   |-- data/
|   |   `-- knowledge_base.json
|   |-- __init__.py
|   |-- ingest.py
|   |-- main.py
|   |-- rag_utils.py
|   |-- requirements.txt
|   `-- test_rag.py
|-- brain/
|   |-- 1b8d6302-06bd-426c-9766-d3a38047d838/
|   |   `-- scratch/
|   |       |-- gen_all_custom.py
|   |       |-- gen_theory.py
|   |       |-- generate_full.py
|   |       |-- generate_linked_list.py
|   |       `-- generate_ll_files.py
|   `-- 6992b313-a49c-4cfe-88d8-e622bab6d37e/
|       `-- scratch/
|           |-- fix_code_tracker_cpp_full.py
|           |-- fix_code_tracker_cpp.py
|           |-- fix_code_tracker.py
|           |-- fix_layout.py
|           |-- fix_mouse_move.py
|           |-- fix_resize.py
|           |-- fix_tracker_title.py
|           `-- generate_strings.py
|-- components/
|   |-- home/
|   |   |-- DisciplinesSection.tsx
|   |   |-- FooterCTA.tsx
|   |   `-- StatsSection.tsx
|   |-- AIBot.tsx
|   |-- AlgorithmLab.tsx
|   |-- ArrayInput.tsx
|   |-- ArrayRenderer.tsx
|   |-- BackgroundEffect.tsx
|   |-- BrandLogo.tsx
|   |-- ClientSideEffects.tsx
|   |-- CodeTabs.tsx
|   |-- CodeTracker.tsx
|   |-- ComplexityPlotter.tsx
|   |-- CoursesList.tsx
|   |-- CoursesSkeleton.tsx
|   |-- DashboardClient.tsx
|   |-- DynamicProgrammingLessonLab.tsx
|   |-- Footer.tsx
|   |-- GraphRenderer.tsx
|   |-- GraphSimulation.tsx
|   |-- HashingLessonLab.tsx
|   |-- InteractiveGraphPlotter.tsx
|   |-- LessonList.tsx
|   |-- LessonListSkeleton.tsx
|   |-- LessonLoader.tsx
|   |-- LinkedListLab.tsx
|   |-- LinkedListLessonStudio.tsx
|   |-- Magnetic.tsx
|   |-- MinimalSimulationStudio.tsx
|   |-- Navbar.css
|   |-- Navbar.tsx
|   |-- PlaygroundEditor.tsx
|   |-- Providers.tsx
|   |-- QueueRenderer.tsx
|   |-- RecursionBacktrackingLessonLab.tsx
|   |-- SearchingSortingLessonLab.tsx
|   |-- SearchModal.tsx
|   |-- SimulationLab.tsx
|   |-- SimulationSkeleton.tsx
|   |-- SimulationStudio.tsx
|   |-- SimulationUI.tsx
|   |-- Skeleton.tsx
|   |-- StackQueueLessonLab.tsx
|   |-- StackRenderer.tsx
|   |-- ThemeProvider.tsx
|   |-- ThemeToggle.css
|   |-- ThemeToggle.tsx
|   |-- TheorySection.tsx
|   |-- TopicExplorer.tsx
|   |-- TopicListSkeleton.tsx
|   `-- TreesLessonLab.tsx
|-- content/
|   |-- artificial-intelligence/
|   |   |-- advanced-research/
|   |   |   |-- agi.tsx
|   |   |   |-- ai-alignment.tsx
|   |   |   |-- ai-ethics-governance.tsx
|   |   |   |-- efficient-ai.tsx
|   |   |   |-- federated-learning.tsx
|   |   |   |-- graph-neural-networks.tsx
|   |   |   |-- neuro-symbolic-ai.tsx
|   |   |   `-- self-supervised-learning.tsx
|   |   |-- agentic-ai/
|   |   |   |-- ai-agents.tsx
|   |   |   |-- autonomous-workflows.tsx
|   |   |   |-- memory-systems.tsx
|   |   |   |-- multi-agent-systems.tsx
|   |   |   |-- planning.tsx
|   |   |   `-- tool-calling.tsx
|   |   |-- ai-foundations/
|   |   |   |-- data-handling-numpy-broadcasting.tsx
|   |   |   |-- data-handling-numpy-operations.tsx
|   |   |   |-- data-handling-pandas-cleaning.tsx
|   |   |   |-- data-handling-pandas-dataframes.tsx
|   |   |   |-- data-handling-viz-matplotlib.tsx
|   |   |   |-- data-handling-viz-plotly.tsx
|   |   |   |-- data-handling-viz-seaborn.tsx
|   |   |   |-- math-calculus-chain-rule.tsx
|   |   |   |-- math-calculus-derivatives.tsx
|   |   |   |-- math-calculus-optimization.tsx
|   |   |   |-- math-calculus-partial-derivatives.tsx
|   |   |   |-- math-linear-algebra-decomposition.tsx
|   |   |   |-- math-linear-algebra-dot-products.tsx
|   |   |   |-- math-linear-algebra-eigenvalues.tsx
|   |   |   |-- math-linear-algebra-vectors.tsx
|   |   |   |-- math-probability-bayes.tsx
|   |   |   |-- math-probability-conditional.tsx
|   |   |   |-- math-probability-distributions.tsx
|   |   |   |-- math-probability-expectation.tsx
|   |   |   |-- math-statistics-hypothesis-testing.tsx
|   |   |   |-- math-statistics-information-theory.tsx
|   |   |   |-- math-statistics-regression-analysis.tsx
|   |   |   |-- math-statistics-sampling.tsx
|   |   |   |-- programming-algorithms-dynamic-programming.tsx
|   |   |   |-- programming-algorithms-graph.tsx
|   |   |   |-- programming-algorithms-sorting-searching.tsx
|   |   |   |-- programming-data-structures-arrays-trees.tsx
|   |   |   |-- programming-data-structures-graphs-heaps.tsx
|   |   |   |-- programming-data-structures-hash-maps.tsx
|   |   |   |-- programming-python-concurrency.tsx
|   |   |   |-- programming-python-functional.tsx
|   |   |   `-- programming-python-oop.tsx
|   |   |-- computer-vision/
|   |   |   |-- image-processing.tsx
|   |   |   |-- object-detection.tsx
|   |   |   |-- ocr.tsx
|   |   |   |-- pose-estimation.tsx
|   |   |   |-- three-d-vision.tsx
|   |   |   `-- video-understanding.tsx
|   |   |-- deep-learning/
|   |   |   |-- autoencoders-denoising.tsx
|   |   |   |-- autoencoders-sparse.tsx
|   |   |   |-- autoencoders-vae.tsx
|   |   |   |-- autoencoders-vanilla.tsx
|   |   |   |-- cnn-detection.tsx
|   |   |   |-- cnn-image-classification.tsx
|   |   |   |-- cnn-segmentation.tsx
|   |   |   |-- frameworks-jax.tsx
|   |   |   |-- frameworks-mixed-precision.tsx
|   |   |   |-- frameworks-pytorch.tsx
|   |   |   |-- frameworks-tensorflow-keras.tsx
|   |   |   |-- neural-networks-activation-functions.tsx
|   |   |   |-- neural-networks-ann.tsx
|   |   |   |-- neural-networks-backpropagation.tsx
|   |   |   |-- neural-networks-batch-norm.tsx
|   |   |   |-- neural-networks-dropout-regularization.tsx
|   |   |   |-- neural-networks-perceptron.tsx
|   |   |   |-- neural-networks-weight-initialization.tsx
|   |   |   |-- rnn-bidirectional.tsx
|   |   |   |-- rnn-gru.tsx
|   |   |   |-- rnn-lstm.tsx
|   |   |   |-- rnn-seq2seq.tsx
|   |   |   `-- rnn-vanilla.tsx
|   |   |-- deep-reinforcement-learning/
|   |   |   |-- deep-ppo.tsx
|   |   |   |-- dqn.tsx
|   |   |   |-- game-ai.tsx
|   |   |   |-- rlhf.tsx
|   |   |   `-- robotics-rl.tsx
|   |   |-- fine-tuning-adaptation/
|   |   |   |-- context-length-extension.tsx
|   |   |   |-- distillation.tsx
|   |   |   |-- full-fine-tuning.tsx
|   |   |   |-- peft-lora.tsx
|   |   |   `-- quantization.tsx
|   |   |-- generative-ai/
|   |   |   |-- diffusion-models.tsx
|   |   |   |-- gans.tsx
|   |   |   |-- image-generation.tsx
|   |   |   |-- llms-context-window.tsx
|   |   |   |-- llms-instruction-tuning.tsx
|   |   |   |-- llms-pretraining.tsx
|   |   |   |-- llms-prompt-engineering.tsx
|   |   |   |-- llms-rlhf-rlaif.tsx
|   |   |   |-- video-generation.tsx
|   |   |   `-- voice-generation.tsx
|   |   |-- machine-learning/
|   |   |   |-- engineering-class-imbalance.tsx
|   |   |   |-- engineering-cross-validation.tsx
|   |   |   |-- engineering-feature-engineering.tsx
|   |   |   |-- engineering-hyperparameter-tuning.tsx
|   |   |   |-- engineering-pipelines.tsx
|   |   |   |-- semi-supervised-label-propagation.tsx
|   |   |   |-- semi-supervised-pseudo-labeling.tsx
|   |   |   |-- semi-supervised-self-training.tsx
|   |   |   |-- supervised-classification-knn.tsx
|   |   |   |-- supervised-classification-logistic.tsx
|   |   |   |-- supervised-classification-naive-bayes.tsx
|   |   |   |-- supervised-classification-svm.tsx
|   |   |   |-- supervised-ensemble-bagging-stacking.tsx
|   |   |   |-- supervised-ensemble-gradient-boosting.tsx
|   |   |   |-- supervised-ensemble-random-forest.tsx
|   |   |   |-- supervised-ensemble-xgboost-lightgbm.tsx
|   |   |   |-- supervised-regression-linear.tsx
|   |   |   |-- supervised-regression-polynomial.tsx
|   |   |   |-- supervised-regression-ridge-lasso.tsx
|   |   |   |-- unsupervised-association-apriori.tsx
|   |   |   |-- unsupervised-association-fpgrowth.tsx
|   |   |   |-- unsupervised-clustering-dbscan.tsx
|   |   |   |-- unsupervised-clustering-hierarchical.tsx
|   |   |   |-- unsupervised-clustering-kmeans.tsx
|   |   |   |-- unsupervised-dimensionality-pca.tsx
|   |   |   |-- unsupervised-dimensionality-tsne.tsx
|   |   |   `-- unsupervised-dimensionality-umap.tsx
|   |   |-- mlops/
|   |   |   |-- deployment.tsx
|   |   |   |-- docker.tsx
|   |   |   |-- experiment-tracking.tsx
|   |   |   |-- feature-stores.tsx
|   |   |   |-- kubernetes.tsx
|   |   |   |-- monitoring.tsx
|   |   |   `-- scaling.tsx
|   |   |-- multimodal-ai/
|   |   |   |-- audio-text.tsx
|   |   |   |-- omni-models.tsx
|   |   |   |-- video-text.tsx
|   |   |   `-- vision-language.tsx
|   |   |-- neural-networks/
|   |   |   `-- basics.tsx
|   |   |-- nlp/
|   |   |   |-- embeddings.tsx
|   |   |   |-- information-retrieval.tsx
|   |   |   |-- question-answering.tsx
|   |   |   |-- sentiment-analysis.tsx
|   |   |   |-- summarization.tsx
|   |   |   |-- text-processing.tsx
|   |   |   `-- translation.tsx
|   |   |-- rag-memory/
|   |   |   |-- chunking-strategies.tsx
|   |   |   |-- graph-rag.tsx
|   |   |   |-- rag-basics.tsx
|   |   |   |-- reranking.tsx
|   |   |   `-- vector-databases.tsx
|   |   |-- reinforcement-learning/
|   |   |   |-- actor-critic.tsx
|   |   |   |-- core-concepts.tsx
|   |   |   |-- environment-simulation.tsx
|   |   |   |-- policy-gradient.tsx
|   |   |   |-- ppo.tsx
|   |   |   `-- q-learning.tsx
|   |   `-- transformers/
|   |       |-- attention-mechanism.tsx
|   |       |-- bert-family.tsx
|   |       |-- cross-attention.tsx
|   |       |-- encoder-decoder.tsx
|   |       |-- feed-forward-sublayers.tsx
|   |       |-- gpt-family.tsx
|   |       |-- layer-normalization.tsx
|   |       |-- multi-head-attention.tsx
|   |       |-- positional-encoding.tsx
|   |       |-- self-attention.tsx
|   |       `-- vision-transformers.tsx
|   |-- cn/
|   |   `-- cn/
|   |       `-- introduction.tsx
|   |-- coa/
|   |   `-- coa/
|   |       `-- introduction.tsx
|   |-- communication-systems/
|   |   `-- communication-systems/
|   |       `-- introduction.tsx
|   |-- compiler-design/
|   |   `-- compiler-design/
|   |       `-- introduction.tsx
|   |-- control-systems/
|   |   `-- control-systems/
|   |       `-- introduction.tsx
|   |-- dbms/
|   |   `-- dbms/
|   |       `-- introduction.tsx
|   |-- digital-electronics/
|   |   `-- digital-electronics/
|   |       `-- introduction.tsx
|   |-- dsa/
|   |   |-- arrays/
|   |   |   |-- array-deletion.tsx
|   |   |   |-- array-input-output.tsx
|   |   |   |-- array-insertion.tsx
|   |   |   |-- array-introduction.tsx
|   |   |   |-- array-traversal.tsx
|   |   |   |-- array-update.tsx
|   |   |   |-- binary-search.tsx
|   |   |   |-- bubble-sort.tsx
|   |   |   |-- container-with-most-water.tsx
|   |   |   |-- dynamic-array.tsx
|   |   |   |-- equilibrium-index.tsx
|   |   |   |-- find-duplicate.tsx
|   |   |   |-- find-min-max.tsx
|   |   |   |-- fixed-window-sum.tsx
|   |   |   |-- kadane-algorithm.tsx
|   |   |   |-- largest-number.tsx
|   |   |   |-- linear-search.tsx
|   |   |   |-- longest-subarray-k.tsx
|   |   |   |-- longest-subarray-sum-k.tsx
|   |   |   |-- majority-element.tsx
|   |   |   |-- max-consecutive-ones.tsx
|   |   |   |-- maximum-product-subarray.tsx
|   |   |   |-- maximum-subarray-sum.tsx
|   |   |   |-- merge-intervals.tsx
|   |   |   |-- merge-sorted-arrays.tsx
|   |   |   |-- minimum-window-substring.tsx
|   |   |   |-- missing-number.tsx
|   |   |   |-- move-zeroes.tsx
|   |   |   |-- next-permutation.tsx
|   |   |   |-- prefix-sum-basics.tsx
|   |   |   |-- product-except-self.tsx
|   |   |   |-- product-of-array-except-self.tsx
|   |   |   |-- range-sum-query.tsx
|   |   |   |-- remove-duplicates.tsx
|   |   |   |-- reverse-array.tsx
|   |   |   |-- rotate-array.tsx
|   |   |   |-- sliding-window-maximum.tsx
|   |   |   |-- sort-colors.tsx
|   |   |   |-- spiral-matrix.tsx
|   |   |   |-- static-array.tsx
|   |   |   |-- subarray-sum-equals-k.tsx
|   |   |   |-- three-sum.tsx
|   |   |   |-- trapping-rain-water.tsx
|   |   |   |-- two-sum.tsx
|   |   |   `-- union-of-arrays.tsx
|   |   |-- cpp-fundamentals/
|   |   |   |-- abstraction.tsx
|   |   |   |-- access-specifiers.tsx
|   |   |   |-- arithmetic-operators.tsx
|   |   |   |-- arrays.tsx
|   |   |   |-- assignment-operators.tsx
|   |   |   |-- auto-keyword.tsx
|   |   |   |-- best-practices.tsx
|   |   |   |-- bitwise-operators.tsx
|   |   |   |-- c-style-strings.tsx
|   |   |   |-- character-arrays.tsx
|   |   |   |-- class-templates.tsx
|   |   |   |-- classes-objects.tsx
|   |   |   |-- comments-in-cpp.tsx
|   |   |   |-- compilation-process.tsx
|   |   |   |-- conditional-statements.tsx
|   |   |   |-- constants-literals.tsx
|   |   |   |-- constructors.tsx
|   |   |   |-- copy-constructor.tsx
|   |   |   |-- course-introduction.tsx
|   |   |   |-- data-types.tsx
|   |   |   |-- debugging-basics.tsx
|   |   |   |-- default-arguments.tsx
|   |   |   |-- destructors.tsx
|   |   |   |-- do-while-loop.tsx
|   |   |   |-- dynamic-memory-allocation.tsx
|   |   |   |-- else-if-ladder.tsx
|   |   |   |-- encapsulation.tsx
|   |   |   |-- enumerations.tsx
|   |   |   |-- escape-sequences.tsx
|   |   |   |-- exception-handling.tsx
|   |   |   |-- file-handling.tsx
|   |   |   |-- for-loop.tsx
|   |   |   |-- friend-function.tsx
|   |   |   |-- function-calling.tsx
|   |   |   |-- function-declaration-definition.tsx
|   |   |   |-- function-overloading.tsx
|   |   |   |-- function-overriding.tsx
|   |   |   |-- function-templates.tsx
|   |   |   |-- functions.tsx
|   |   |   |-- getting-started.tsx
|   |   |   |-- global-variables.tsx
|   |   |   |-- header-files.tsx
|   |   |   |-- header-guards.tsx
|   |   |   |-- if-else-statement.tsx
|   |   |   |-- if-statement.tsx
|   |   |   |-- increment-decrement-operators.tsx
|   |   |   |-- inheritance.tsx
|   |   |   |-- inline-functions.tsx
|   |   |   |-- input-output.tsx
|   |   |   |-- introduction-to-cpp.tsx
|   |   |   |-- iterators.tsx
|   |   |   |-- keywords-identifiers.tsx
|   |   |   |-- lambda-functions.tsx
|   |   |   |-- local-variables.tsx
|   |   |   |-- logical-operators.tsx
|   |   |   |-- loop-control.tsx
|   |   |   |-- loops.tsx
|   |   |   |-- macros.tsx
|   |   |   |-- multidimensional-arrays.tsx
|   |   |   |-- namespaces.tsx
|   |   |   |-- nested-if.tsx
|   |   |   |-- nested-loops.tsx
|   |   |   |-- null-pointers.tsx
|   |   |   |-- one-d-arrays.tsx
|   |   |   |-- oop-basics.tsx
|   |   |   |-- operator-overloading.tsx
|   |   |   |-- operator-precedence.tsx
|   |   |   |-- operators.tsx
|   |   |   |-- pairs.tsx
|   |   |   |-- parameters-arguments.tsx
|   |   |   |-- pass-by-reference.tsx
|   |   |   |-- pointer-arithmetic.tsx
|   |   |   |-- pointer-basics.tsx
|   |   |   |-- pointers-and-arrays.tsx
|   |   |   |-- pointers.tsx
|   |   |   |-- polymorphism.tsx
|   |   |   |-- preprocessor-directives.tsx
|   |   |   |-- range-based-loops.tsx
|   |   |   |-- reading-from-files.tsx
|   |   |   |-- recursion.tsx
|   |   |   |-- reference-variables.tsx
|   |   |   |-- references.tsx
|   |   |   |-- relational-operators.tsx
|   |   |   |-- return-values.tsx
|   |   |   |-- setting-up-environment.tsx
|   |   |   |-- smart-pointers.tsx
|   |   |   |-- static-members.tsx
|   |   |   |-- stl-algorithms.tsx
|   |   |   |-- stl-deque.tsx
|   |   |   |-- stl-introduction.tsx
|   |   |   |-- stl-map.tsx
|   |   |   |-- stl-priority-queue.tsx
|   |   |   |-- stl-queue.tsx
|   |   |   |-- stl-set.tsx
|   |   |   |-- stl-stack.tsx
|   |   |   |-- storage-classes.tsx
|   |   |   |-- string-class.tsx
|   |   |   |-- string-functions.tsx
|   |   |   |-- strings.tsx
|   |   |   |-- structure-of-cpp-program.tsx
|   |   |   |-- structures.tsx
|   |   |   |-- summary-next-steps.tsx
|   |   |   |-- switch-statement.tsx
|   |   |   |-- templates.tsx
|   |   |   |-- ternary-operator.tsx
|   |   |   |-- this-pointer.tsx
|   |   |   |-- time-complexity-basics.tsx
|   |   |   |-- two-d-arrays.tsx
|   |   |   |-- type-casting.tsx
|   |   |   |-- type-modifiers.tsx
|   |   |   |-- typedef.tsx
|   |   |   |-- types-of-inheritance.tsx
|   |   |   |-- unions.tsx
|   |   |   |-- variable-scope.tsx
|   |   |   |-- variables-types.tsx
|   |   |   |-- variables.tsx
|   |   |   |-- vectors.tsx
|   |   |   |-- virtual-functions.tsx
|   |   |   |-- while-loop.tsx
|   |   |   `-- writing-to-files.tsx
|   |   |-- dynamic-programming/
|   |   |   |-- base-cases.tsx
|   |   |   |-- best-time-to-buy-sell-stock-i.tsx
|   |   |   |-- best-time-to-buy-sell-stock-ii.tsx
|   |   |   |-- best-time-to-buy-sell-stock-iii.tsx
|   |   |   |-- best-time-to-buy-sell-stock-iv.tsx
|   |   |   |-- bitmask-dp.tsx
|   |   |   |-- bitmasking-plus-dp.tsx
|   |   |   |-- bitonic-subsequence.tsx
|   |   |   |-- boolean-parenthesization.tsx
|   |   |   |-- burst-balloons.tsx
|   |   |   |-- cherry-pickup.tsx
|   |   |   |-- climbing-stairs.tsx
|   |   |   |-- coin-change-i.tsx
|   |   |   |-- coin-change-ii.tsx
|   |   |   |-- coin-change.tsx
|   |   |   |-- convex-hull-trick.tsx
|   |   |   |-- count-subsets-sum-k.tsx
|   |   |   |-- dag-dp.tsx
|   |   |   |-- decode-ways.tsx
|   |   |   |-- diameter-based-dp.tsx
|   |   |   |-- digit-dp.tsx
|   |   |   |-- distinct-subsequences.tsx
|   |   |   |-- divide-and-conquer-optimization.tsx
|   |   |   |-- dp-on-1d-arrays.tsx
|   |   |   |-- dp-on-2d-grids.tsx
|   |   |   |-- dp-on-graphs.tsx
|   |   |   |-- dp-on-lis-pattern.tsx
|   |   |   |-- dp-on-partition.tsx
|   |   |   |-- dp-on-stocks.tsx
|   |   |   |-- dp-on-strings.tsx
|   |   |   |-- dp-on-subsequences.tsx
|   |   |   |-- dp-on-trees.tsx
|   |   |   |-- dp-optimization-techniques.tsx
|   |   |   |-- dp-with-binary-search.tsx
|   |   |   |-- edit-distance.tsx
|   |   |   |-- fibonacci-dp.tsx
|   |   |   |-- frog-jump.tsx
|   |   |   |-- game-theory-dp.tsx
|   |   |   |-- grid-unique-paths.tsx
|   |   |   |-- house-robber-tree.tsx
|   |   |   |-- house-robber.tsx
|   |   |   |-- integer-break.tsx
|   |   |   |-- interval-dp.tsx
|   |   |   |-- introduction-to-dp.tsx
|   |   |   |-- introduction-to-dynamic-programming.tsx
|   |   |   |-- kadanes-algorithm-dp.tsx
|   |   |   |-- knapsack-0-1.tsx
|   |   |   |-- knuth-optimization.tsx
|   |   |   |-- largest-divisible-subset.tsx
|   |   |   |-- longest-common-subsequence.tsx
|   |   |   |-- longest-common-substring.tsx
|   |   |   |-- longest-increasing-subsequence.tsx
|   |   |   |-- longest-palindromic-subsequence.tsx
|   |   |   |-- longest-string-chain.tsx
|   |   |   |-- matrix-chain-multiplication.tsx
|   |   |   |-- max-path-sum-tree.tsx
|   |   |   |-- maximum-path-sum-matrix.tsx
|   |   |   |-- memoization.tsx
|   |   |   |-- min-cost-climbing-stairs.tsx
|   |   |   |-- min-cost-cut-stick.tsx
|   |   |   |-- minimum-path-sum.tsx
|   |   |   |-- number-of-lis.tsx
|   |   |   |-- optimal-substructure.tsx
|   |   |   |-- overlapping-subproblems.tsx
|   |   |   |-- palindrome-partitioning.tsx
|   |   |   |-- partition-array-max-sum.tsx
|   |   |   |-- partition-equal-subset-sum.tsx
|   |   |   |-- perfect-squares.tsx
|   |   |   |-- print-lcs.tsx
|   |   |   |-- print-lis.tsx
|   |   |   |-- probability-dp.tsx
|   |   |   |-- problem-recognition.tsx
|   |   |   |-- recursion-vs-dp.tsx
|   |   |   |-- rerooting-dp.tsx
|   |   |   |-- rod-cutting.tsx
|   |   |   |-- shortest-common-supersequence.tsx
|   |   |   |-- sos-dp.tsx
|   |   |   |-- space-optimization.tsx
|   |   |   |-- state-compression-dp.tsx
|   |   |   |-- state-definition.tsx
|   |   |   |-- stock-with-cooldown.tsx
|   |   |   |-- stock-with-transaction-fee.tsx
|   |   |   |-- subset-sum.tsx
|   |   |   |-- tabulation.tsx
|   |   |   |-- target-sum.tsx
|   |   |   |-- transition-relation.tsx
|   |   |   |-- tree-dp-basics.tsx
|   |   |   |-- triangle-minimum-path-sum.tsx
|   |   |   |-- tsp.tsx
|   |   |   |-- unbounded-knapsack.tsx
|   |   |   |-- unique-binary-search-trees.tsx
|   |   |   |-- unique-paths-ii.tsx
|   |   |   |-- unique-paths-obstacles.tsx
|   |   |   |-- unique-paths.tsx
|   |   |   |-- wildcard-matching.tsx
|   |   |   |-- word-break.tsx
|   |   |   `-- zero-one-knapsack.tsx
|   |   |-- graphs/
|   |   |   |-- adjacency-list.tsx
|   |   |   |-- adjacency-matrix.tsx
|   |   |   |-- alien-dictionary.tsx
|   |   |   |-- articulation-points.tsx
|   |   |   |-- bellman-ford-algorithm.tsx
|   |   |   |-- bfs.tsx
|   |   |   |-- bipartite-graph.tsx
|   |   |   |-- bridges.tsx
|   |   |   |-- clone-graph.tsx
|   |   |   |-- complexity-graph-algorithms.tsx
|   |   |   |-- connected-components.tsx
|   |   |   |-- course-schedule.tsx
|   |   |   |-- cycle-detection-directed.tsx
|   |   |   |-- cycle-detection-undirected.tsx
|   |   |   |-- detect-cycle-grid.tsx
|   |   |   |-- dfs.tsx
|   |   |   |-- dijkstra-algorithm.tsx
|   |   |   |-- disjoint-set-union.tsx
|   |   |   |-- euler-path-circuit.tsx
|   |   |   |-- flood-fill.tsx
|   |   |   |-- floyd-warshall-algorithm.tsx
|   |   |   |-- graph-coloring.tsx
|   |   |   |-- graph-condensation.tsx
|   |   |   |-- graph-definition.tsx
|   |   |   |-- graph-degrees.tsx
|   |   |   |-- grid-based-graphs.tsx
|   |   |   |-- hamiltonian-path-cycle.tsx
|   |   |   |-- mst-kruskal.tsx
|   |   |   |-- mst-prim.tsx
|   |   |   |-- multi-source-bfs.tsx
|   |   |   |-- network-flow.tsx
|   |   |   |-- number-of-islands.tsx
|   |   |   |-- rotten-oranges.tsx
|   |   |   |-- scc-kosaraju.tsx
|   |   |   |-- scc-tarjan.tsx
|   |   |   |-- shortest-path-dag.tsx
|   |   |   |-- shortest-path-matrix.tsx
|   |   |   |-- shortest-path-unweighted.tsx
|   |   |   |-- topological-sort-dfs.tsx
|   |   |   |-- topological-sort-kahns.tsx
|   |   |   |-- transitive-closure.tsx
|   |   |   |-- types-of-graphs.tsx
|   |   |   |-- vertices-and-edges.tsx
|   |   |   |-- word-ladder.tsx
|   |   |   `-- zero-one-bfs.tsx
|   |   |-- hashing/
|   |   |   |-- bitmask-hashing.tsx
|   |   |   |-- bucket-concept.tsx
|   |   |   |-- character-hashing.tsx
|   |   |   |-- collision-in-hashing.tsx
|   |   |   |-- collision-resolution.tsx
|   |   |   |-- coordinate-compression-hashing.tsx
|   |   |   |-- count-subarrays-sum-k.tsx
|   |   |   |-- counting-frequencies.tsx
|   |   |   |-- custom-hash-functions.tsx
|   |   |   |-- direct-addressing.tsx
|   |   |   |-- double-hashing-strings.tsx
|   |   |   |-- double-hashing.tsx
|   |   |   |-- duplicate-detection.tsx
|   |   |   |-- first-non-repeating-char.tsx
|   |   |   |-- frequency-array.tsx
|   |   |   |-- frequency-map.tsx
|   |   |   |-- good-hash-function.tsx
|   |   |   |-- group-anagrams.tsx
|   |   |   |-- hash-collision-strings.tsx
|   |   |   |-- hash-function.tsx
|   |   |   |-- hash-table.tsx
|   |   |   |-- hashing-binary-search-problems.tsx
|   |   |   |-- hashing-for-caching.tsx
|   |   |   |-- hashing-greedy-problems.tsx
|   |   |   |-- hashing-in-stl.tsx
|   |   |   |-- hashing-pair-problems.tsx
|   |   |   |-- hashing-practice-patterns.tsx
|   |   |   |-- hashmap-unordered-map.tsx
|   |   |   |-- hashset-unordered-set.tsx
|   |   |   |-- integer-hashing.tsx
|   |   |   |-- introduction-to-hashing.tsx
|   |   |   |-- iterating-hashmaps.tsx
|   |   |   |-- linear-probing.tsx
|   |   |   |-- load-factor.tsx
|   |   |   |-- longest-consecutive-sequence.tsx
|   |   |   |-- longest-subarray-sum-k.tsx
|   |   |   |-- lru-cache-basics.tsx
|   |   |   |-- multiset-unordered-multiset.tsx
|   |   |   |-- need-for-hashing.tsx
|   |   |   |-- open-addressing.tsx
|   |   |   |-- ordered-vs-unordered-map.tsx
|   |   |   |-- pattern-matching-hashing.tsx
|   |   |   |-- polynomial-rolling-hash.tsx
|   |   |   |-- prefix-hashing.tsx
|   |   |   |-- prefix-sum-hashing.tsx
|   |   |   |-- quadratic-probing.tsx
|   |   |   |-- rabin-karp-algorithm.tsx
|   |   |   |-- rehashing.tsx
|   |   |   |-- separate-chaining.tsx
|   |   |   |-- set-vs-unordered-set.tsx
|   |   |   |-- sliding-window-hashing.tsx
|   |   |   |-- string-hashing-intro.tsx
|   |   |   |-- string-hashing.tsx
|   |   |   |-- subarray-problems-hashing.tsx
|   |   |   |-- three-sum-basics.tsx
|   |   |   |-- time-complexity-hashing.tsx
|   |   |   `-- two-sum-hashing.tsx
|   |   |-- linked-list/
|   |   |   |-- add-two-numbers.tsx
|   |   |   |-- advantages-disadvantages.tsx
|   |   |   |-- check-palindrome.tsx
|   |   |   |-- circular-doubly-linked-list.tsx
|   |   |   |-- circular-linked-list.tsx
|   |   |   |-- circular-operations.tsx
|   |   |   |-- clone-with-random-pointer.tsx
|   |   |   |-- delete-nth-node-from-end.tsx
|   |   |   |-- deletion-by-position.tsx
|   |   |   |-- deletion-by-value.tsx
|   |   |   |-- deletion-from-beginning.tsx
|   |   |   |-- deletion-from-end.tsx
|   |   |   |-- deletion-in-dll.tsx
|   |   |   |-- detect-loop.tsx
|   |   |   |-- doubly-linked-list.tsx
|   |   |   |-- doubly-operations.tsx
|   |   |   |-- dynamic-memory-allocation.tsx
|   |   |   |-- flatten-linked-list.tsx
|   |   |   |-- floyd-cycle-detection.tsx
|   |   |   |-- header-linked-list.tsx
|   |   |   |-- insertion-at-beginning.tsx
|   |   |   |-- insertion-at-end.tsx
|   |   |   |-- insertion-at-position.tsx
|   |   |   |-- insertion-in-dll.tsx
|   |   |   |-- intersection-of-lists.tsx
|   |   |   |-- intersection-point.tsx
|   |   |   |-- introduction-to-linked-list.tsx
|   |   |   |-- iterator-linked-list.tsx
|   |   |   |-- length.tsx
|   |   |   |-- linked-list-basics.tsx
|   |   |   |-- loop-start-point.tsx
|   |   |   |-- lru-using-dll.tsx
|   |   |   |-- memory-representation.tsx
|   |   |   |-- merge-sort-linked-list.tsx
|   |   |   |-- merge-sorted-lists.tsx
|   |   |   |-- middle-of-linked-list.tsx
|   |   |   |-- multiply-linked-lists.tsx
|   |   |   |-- node-structure.tsx
|   |   |   |-- nth-node-from-end.tsx
|   |   |   |-- odd-even-linked-list.tsx
|   |   |   |-- partition-linked-list.tsx
|   |   |   |-- polynomial-linked-list.tsx
|   |   |   |-- practice-patterns.tsx
|   |   |   |-- queue-using-linked-list.tsx
|   |   |   |-- recursive-reversal.tsx
|   |   |   |-- remove-duplicates-sorted.tsx
|   |   |   |-- remove-duplicates-unsorted.tsx
|   |   |   |-- remove-loop.tsx
|   |   |   |-- reverse-dll.tsx
|   |   |   |-- reverse-in-k-groups.tsx
|   |   |   |-- reverse-linked-list.tsx
|   |   |   |-- rotate-linked-list.tsx
|   |   |   |-- searching.tsx
|   |   |   |-- segregate-even-odd.tsx
|   |   |   |-- singly-linked-list.tsx
|   |   |   |-- skip-list-basics.tsx
|   |   |   |-- sort-linked-list.tsx
|   |   |   |-- sparse-matrix-linked-list.tsx
|   |   |   |-- stack-using-linked-list.tsx
|   |   |   |-- stl-list.tsx
|   |   |   |-- swap-nodes-in-pairs.tsx
|   |   |   |-- traversal.tsx
|   |   |   |-- types-of-linked-list.tsx
|   |   |   |-- updating-nodes.tsx
|   |   |   `-- xor-linked-list-basics.tsx
|   |   |-- problem-solving-basics/
|   |   |   |-- ad-hoc-problems.tsx
|   |   |   |-- algorithmic-thinking.tsx
|   |   |   |-- array-manipulation-basics.tsx
|   |   |   |-- backtracking-basics.tsx
|   |   |   |-- basic-mathematics.tsx
|   |   |   |-- best-average-worst-case.tsx
|   |   |   |-- binary-number-basics.tsx
|   |   |   |-- binary-search-basics.tsx
|   |   |   |-- bit-manipulation-basics.tsx
|   |   |   |-- breaking-problems-subproblems.tsx
|   |   |   |-- brute-force-approach.tsx
|   |   |   |-- code-readability.tsx
|   |   |   |-- competitive-programming-basics.tsx
|   |   |   |-- constraints-analysis.tsx
|   |   |   |-- constructive-thinking.tsx
|   |   |   |-- debugging-techniques.tsx
|   |   |   |-- divide-and-conquer-basics.tsx
|   |   |   |-- dry-run-technique.tsx
|   |   |   |-- edge-case-handling.tsx
|   |   |   |-- factors-and-multiples.tsx
|   |   |   |-- flowcharts.tsx
|   |   |   |-- frequency-counting.tsx
|   |   |   |-- gcd-and-lcm.tsx
|   |   |   |-- greedy-basics.tsx
|   |   |   |-- hashing-basics.tsx
|   |   |   |-- implementation-problems.tsx
|   |   |   |-- input-optimization.tsx
|   |   |   |-- input-output-analysis.tsx
|   |   |   |-- introduction-to-problem-solving.tsx
|   |   |   |-- iterative-thinking.tsx
|   |   |   |-- logical-thinking.tsx
|   |   |   |-- mathematical-observation.tsx
|   |   |   |-- matrix-traversal-basics.tsx
|   |   |   |-- modular-arithmetic-basics.tsx
|   |   |   |-- number-properties.tsx
|   |   |   |-- observation-building.tsx
|   |   |   |-- optimization-techniques.tsx
|   |   |   |-- optimized-approach-thinking.tsx
|   |   |   |-- overflow-handling.tsx
|   |   |   |-- pattern-recognition.tsx
|   |   |   |-- practice-strategy.tsx
|   |   |   |-- prefix-sum-basics.tsx
|   |   |   |-- prime-numbers.tsx
|   |   |   |-- problem-solving-patterns.tsx
|   |   |   |-- problem-understanding.tsx
|   |   |   |-- pseudocode.tsx
|   |   |   |-- recursive-thinking.tsx
|   |   |   |-- searching-basics.tsx
|   |   |   |-- simulation-problems.tsx
|   |   |   |-- sliding-window-basics.tsx
|   |   |   |-- sorting-basics.tsx
|   |   |   |-- space-complexity-basics.tsx
|   |   |   |-- stl-basics.tsx
|   |   |   |-- string-manipulation-basics.tsx
|   |   |   |-- test-case-generation.tsx
|   |   |   |-- time-complexity-basics.tsx
|   |   |   `-- two-pointer-basics.tsx
|   |   |-- recursion-backtracking/
|   |   |   |-- backtracking-introduction.tsx
|   |   |   |-- backtracking-on-arrays.tsx
|   |   |   |-- backtracking-on-grids.tsx
|   |   |   |-- backtracking-on-strings.tsx
|   |   |   |-- backtracking-template.tsx
|   |   |   |-- base-case.tsx
|   |   |   |-- binary-search-recursion.tsx
|   |   |   |-- branch-and-bound-basics.tsx
|   |   |   |-- call-stack.tsx
|   |   |   |-- combination-sum-ii.tsx
|   |   |   |-- combination-sum.tsx
|   |   |   |-- constraint-checking.tsx
|   |   |   |-- decision-tree-visualization.tsx
|   |   |   |-- dry-run-recursion.tsx
|   |   |   |-- expression-add-operators.tsx
|   |   |   |-- factorial.tsx
|   |   |   |-- fibonacci.tsx
|   |   |   |-- functional-recursion.tsx
|   |   |   |-- generate-all-permutations.tsx
|   |   |   |-- generate-all-subsequences.tsx
|   |   |   |-- generate-all-subsets.tsx
|   |   |   |-- generate-parentheses.tsx
|   |   |   |-- generate-power-set.tsx
|   |   |   |-- head-recursion.tsx
|   |   |   |-- indirect-recursion.tsx
|   |   |   |-- introduction-to-recursion.tsx
|   |   |   |-- knights-tour.tsx
|   |   |   |-- letter-combinations.tsx
|   |   |   |-- m-coloring.tsx
|   |   |   |-- maze-solving.tsx
|   |   |   |-- memoization-basics.tsx
|   |   |   |-- multiple-recursion-calls.tsx
|   |   |   |-- n-queens.tsx
|   |   |   |-- nested-recursion.tsx
|   |   |   |-- palindrome-check-recursion.tsx
|   |   |   |-- palindrome-partitioning-recursion.tsx
|   |   |   |-- parameterized-recursion.tsx
|   |   |   |-- partition-problems.tsx
|   |   |   |-- permutations-duplicates.tsx
|   |   |   |-- pick-not-pick.tsx
|   |   |   |-- power-calculation.tsx
|   |   |   |-- practice-patterns-backtracking.tsx
|   |   |   |-- practice-patterns-recursion.tsx
|   |   |   |-- print-numbers.tsx
|   |   |   |-- rat-in-a-maze.tsx
|   |   |   |-- recurrence-relation-basics.tsx
|   |   |   |-- recursion-on-arrays.tsx
|   |   |   |-- recursion-on-strings.tsx
|   |   |   |-- recursion-tree-method.tsx
|   |   |   |-- recursion-vs-backtracking.tsx
|   |   |   |-- recursive-case.tsx
|   |   |   |-- recursive-dp-intro.tsx
|   |   |   |-- recursive-function-calls.tsx
|   |   |   |-- recursive-pattern-problems.tsx
|   |   |   |-- recursive-thinking.tsx
|   |   |   |-- restore-ip-addresses.tsx
|   |   |   |-- reverse-array-recursion.tsx
|   |   |   |-- reverse-string-recursion.tsx
|   |   |   |-- space-complexity-recursion.tsx
|   |   |   |-- stack-overflow.tsx
|   |   |   |-- state-space-tree.tsx
|   |   |   |-- subsequence-problems.tsx
|   |   |   |-- subset-sum-recursion.tsx
|   |   |   |-- sudoku-solver.tsx
|   |   |   |-- sum-of-n-numbers.tsx
|   |   |   |-- tail-recursion.tsx
|   |   |   |-- time-complexity-recursion.tsx
|   |   |   |-- tree-recursion.tsx
|   |   |   |-- undo-backtrack-step.tsx
|   |   |   `-- word-search.tsx
|   |   |-- searching-sorting/
|   |   |   |-- adaptive-sorting.tsx
|   |   |   |-- aggressive-cows.tsx
|   |   |   |-- allocate-minimum-pages.tsx
|   |   |   |-- binary-search-descending.tsx
|   |   |   |-- binary-search-on-answer.tsx
|   |   |   |-- binary-search-searching.tsx
|   |   |   |-- binary-search-stl.tsx
|   |   |   |-- bubble-sort.tsx
|   |   |   |-- bucket-sort.tsx
|   |   |   |-- capacity-to-ship-packages.tsx
|   |   |   |-- count-occurrences.tsx
|   |   |   |-- counting-sort.tsx
|   |   |   |-- custom-comparator.tsx
|   |   |   |-- dutch-national-flag.tsx
|   |   |   |-- external-sorting-basics.tsx
|   |   |   |-- first-occurrence.tsx
|   |   |   |-- floor-and-ceil.tsx
|   |   |   |-- greedy-sorting.tsx
|   |   |   |-- heap-sort.tsx
|   |   |   |-- hoare-partition.tsx
|   |   |   |-- inplace-vs-outplace-sorting.tsx
|   |   |   |-- insertion-sort.tsx
|   |   |   |-- internal-vs-external-sorting.tsx
|   |   |   |-- introduction-to-searching.tsx
|   |   |   |-- introduction-to-sorting.tsx
|   |   |   |-- inversion-count.tsx
|   |   |   |-- iterative-sorting.tsx
|   |   |   |-- koko-eating-bananas.tsx
|   |   |   |-- kth-largest-element.tsx
|   |   |   |-- kth-smallest-element.tsx
|   |   |   |-- last-occurrence.tsx
|   |   |   |-- linear-search-searching.tsx
|   |   |   |-- lomuto-partition.tsx
|   |   |   |-- lower-bound.tsx
|   |   |   |-- lower-upper-bound-stl.tsx
|   |   |   |-- median-two-sorted-arrays.tsx
|   |   |   |-- merge-sort.tsx
|   |   |   |-- merge-two-sorted-arrays.tsx
|   |   |   |-- min-in-rotated-array.tsx
|   |   |   |-- nth-root-binary-search.tsx
|   |   |   |-- order-agnostic-binary-search.tsx
|   |   |   |-- painters-partition.tsx
|   |   |   |-- partial-sort.tsx
|   |   |   |-- partitioning-techniques.tsx
|   |   |   |-- peak-element.tsx
|   |   |   |-- practice-patterns-searching.tsx
|   |   |   |-- practice-patterns-sorting.tsx
|   |   |   |-- quick-select.tsx
|   |   |   |-- quick-sort.tsx
|   |   |   |-- radix-sort.tsx
|   |   |   |-- recursive-sorting.tsx
|   |   |   |-- reverse-pairs.tsx
|   |   |   |-- row-with-max-ones.tsx
|   |   |   |-- search-2d-matrix.tsx
|   |   |   |-- search-in-nearly-sorted.tsx
|   |   |   |-- search-in-rotated-array.tsx
|   |   |   |-- search-insert-position.tsx
|   |   |   |-- selection-sort.tsx
|   |   |   |-- shell-sort.tsx
|   |   |   |-- single-element-sorted.tsx
|   |   |   |-- sort-012.tsx
|   |   |   |-- sqrt-binary-search.tsx
|   |   |   |-- stability-in-sorting.tsx
|   |   |   |-- stable-sort.tsx
|   |   |   |-- stl-sort.tsx
|   |   |   |-- two-pointer-sorting.tsx
|   |   |   `-- upper-bound.tsx
|   |   |-- stack-queue/
|   |   |   |-- applications-queue.tsx
|   |   |   |-- applications-stack.tsx
|   |   |   |-- backtracking-stack.tsx
|   |   |   |-- balanced-parentheses.tsx
|   |   |   |-- bfs-using-queue.tsx
|   |   |   |-- circular-queue.tsx
|   |   |   |-- circular-tour.tsx
|   |   |   |-- complexity-stack.tsx
|   |   |   |-- cpu-scheduling.tsx
|   |   |   |-- deque-basics.tsx
|   |   |   |-- dequeue-operation.tsx
|   |   |   |-- dynamic-queue.tsx
|   |   |   |-- dynamic-stack.tsx
|   |   |   |-- enqueue-operation.tsx
|   |   |   |-- evaluate-postfix.tsx
|   |   |   |-- evaluate-prefix.tsx
|   |   |   |-- fifo-principle.tsx
|   |   |   |-- first-negative-window.tsx
|   |   |   |-- front-and-rear.tsx
|   |   |   |-- infix-expression.tsx
|   |   |   |-- infix-to-postfix.tsx
|   |   |   |-- infix-to-prefix.tsx
|   |   |   |-- introduction-to-queue.tsx
|   |   |   |-- introduction-to-stack.tsx
|   |   |   |-- isempty-isfull.tsx
|   |   |   |-- k-queue-one-array.tsx
|   |   |   |-- largest-rectangle-histogram.tsx
|   |   |   |-- lifo-principle.tsx
|   |   |   |-- lru-cache-queue.tsx
|   |   |   |-- maximal-rectangle.tsx
|   |   |   |-- min-stack.tsx
|   |   |   |-- monotonic-queue.tsx
|   |   |   |-- monotonic-stack.tsx
|   |   |   |-- multiple-stack-problems.tsx
|   |   |   |-- next-greater-element-circular.tsx
|   |   |   |-- next-greater-element.tsx
|   |   |   |-- next-smaller-element.tsx
|   |   |   |-- parent-validation.tsx
|   |   |   |-- peek-operation.tsx
|   |   |   |-- peek-top-operation.tsx
|   |   |   |-- pop-operation.tsx
|   |   |   |-- postfix-expression.tsx
|   |   |   |-- postfix-to-infix.tsx
|   |   |   |-- postfix-to-prefix.tsx
|   |   |   |-- practice-patterns-queue.tsx
|   |   |   |-- practice-patterns-stack.tsx
|   |   |   |-- prefix-expression.tsx
|   |   |   |-- prefix-to-infix.tsx
|   |   |   |-- prefix-to-postfix.tsx
|   |   |   |-- previous-greater-element.tsx
|   |   |   |-- previous-smaller-element.tsx
|   |   |   |-- printer-queue.tsx
|   |   |   |-- priority-queue-heap.tsx
|   |   |   |-- priority-queue-intro.tsx
|   |   |   |-- priority-queue.tsx
|   |   |   |-- push-operation.tsx
|   |   |   |-- queue-arrays.tsx
|   |   |   |-- queue-basics.tsx
|   |   |   |-- queue-data-structure.tsx
|   |   |   |-- queue-linked-list.tsx
|   |   |   |-- queue-operations.tsx
|   |   |   |-- queue-reversal.tsx
|   |   |   |-- queue-using-stack.tsx
|   |   |   |-- queue-using-stacks.tsx
|   |   |   |-- recursion-call-stack.tsx
|   |   |   |-- redundant-brackets.tsx
|   |   |   |-- remove-k-digits.tsx
|   |   |   |-- reverse-first-k.tsx
|   |   |   |-- reverse-stack.tsx
|   |   |   |-- reverse-string-stack.tsx
|   |   |   |-- sliding-window-max.tsx
|   |   |   |-- special-stack.tsx
|   |   |   |-- stack-arrays.tsx
|   |   |   |-- stack-basics.tsx
|   |   |   |-- stack-data-structure.tsx
|   |   |   |-- stack-linked-list.tsx
|   |   |   |-- stack-operations.tsx
|   |   |   |-- stack-using-queue-queue.tsx
|   |   |   |-- stack-using-queue.tsx
|   |   |   |-- stl-deque.tsx
|   |   |   |-- stl-priority-queue-stl.tsx
|   |   |   |-- stl-queue.tsx
|   |   |   |-- stl-stack.tsx
|   |   |   |-- stock-span.tsx
|   |   |   |-- trapping-rain-water.tsx
|   |   |   |-- two-stack-one-array.tsx
|   |   |   `-- valid-parentheses.tsx
|   |   |-- strings/
|   |   |   |-- anagram-check.tsx
|   |   |   |-- ascii-values.tsx
|   |   |   |-- balanced-string-problems.tsx
|   |   |   |-- basic-calculator-ii.tsx
|   |   |   |-- basic-calculator-strings.tsx
|   |   |   |-- binary-string-problems.tsx
|   |   |   |-- buddy-strings.tsx
|   |   |   |-- case-conversion.tsx
|   |   |   |-- character-arrays-strings.tsx
|   |   |   |-- character-hashing-strings.tsx
|   |   |   |-- check-if-string-is-transformable.tsx
|   |   |   |-- compare-version-numbers.tsx
|   |   |   |-- count-and-say.tsx
|   |   |   |-- count-palindromic-substrings.tsx
|   |   |   |-- count-vowels-consonants.tsx
|   |   |   |-- distinct-subsequences-strings.tsx
|   |   |   |-- double-hashing-strings.tsx
|   |   |   |-- edit-distance-strings.tsx
|   |   |   |-- expressive-words.tsx
|   |   |   |-- first-unique-character.tsx
|   |   |   |-- frequency-of-characters.tsx
|   |   |   |-- group-anagrams-strings.tsx
|   |   |   |-- implement-strstr-kmp.tsx
|   |   |   |-- integer-to-roman.tsx
|   |   |   |-- integer-to-string.tsx
|   |   |   |-- interleaving-string.tsx
|   |   |   |-- introduction-to-strings.tsx
|   |   |   |-- isomorphic-strings.tsx
|   |   |   |-- kmp-algorithm.tsx
|   |   |   |-- largest-number-strings.tsx
|   |   |   |-- lexicographical-order.tsx
|   |   |   |-- longest-common-prefix.tsx
|   |   |   |-- longest-common-subsequence-strings.tsx
|   |   |   |-- longest-happy-prefix.tsx
|   |   |   |-- longest-happy-string.tsx
|   |   |   |-- longest-palindromic-subsequence-strings.tsx
|   |   |   |-- longest-palindromic-subsequence.tsx
|   |   |   |-- longest-palindromic-substring.tsx
|   |   |   |-- longest-repeating-character-replacement.tsx
|   |   |   |-- longest-substring-no-repeat.tsx
|   |   |   |-- longest-valid-parentheses.tsx
|   |   |   |-- longest-word-in-dictionary-through-deleting.tsx
|   |   |   |-- longest-word-in-dictionary.tsx
|   |   |   |-- longest-word-in-string.tsx
|   |   |   |-- minimum-insertion-steps-palindrome.tsx
|   |   |   |-- minimum-window-substring.tsx
|   |   |   |-- multiply-large-numbers.tsx
|   |   |   |-- multiply-strings.tsx
|   |   |   |-- naive-pattern-matching.tsx
|   |   |   |-- number-of-distinct-substrings.tsx
|   |   |   |-- orderly-queue.tsx
|   |   |   |-- palindrome-permutation.tsx
|   |   |   |-- palindrome-string-problems.tsx
|   |   |   |-- palindrome-string.tsx
|   |   |   |-- parentheses-string-problems.tsx
|   |   |   |-- parsing-strings.tsx
|   |   |   |-- pattern-searching-problems.tsx
|   |   |   |-- permutation-in-string.tsx
|   |   |   |-- polynomial-rolling-hash-strings.tsx
|   |   |   |-- practice-patterns-strings.tsx
|   |   |   |-- prefix-function-lps.tsx
|   |   |   |-- rabin-karp-algorithm-strings.tsx
|   |   |   |-- regular-expression-basics.tsx
|   |   |   |-- regular-expression-matching.tsx
|   |   |   |-- remove-all-adjacent-duplicates-ii.tsx
|   |   |   |-- remove-duplicates-string.tsx
|   |   |   |-- remove-spaces.tsx
|   |   |   |-- reorganize-string.tsx
|   |   |   |-- repeated-string-match.tsx
|   |   |   |-- reverse-string.tsx
|   |   |   |-- reverse-words-in-a-string.tsx
|   |   |   |-- roman-to-integer.tsx
|   |   |   |-- rotate-string.tsx
|   |   |   |-- run-length-encoding.tsx
|   |   |   |-- scramble-string.tsx
|   |   |   |-- shifting-letters.tsx
|   |   |   |-- shortest-palindrome.tsx
|   |   |   |-- simplify-path.tsx
|   |   |   |-- sliding-window-strings.tsx
|   |   |   |-- split-string.tsx
|   |   |   |-- stl-string-functions.tsx
|   |   |   |-- string-comparison.tsx
|   |   |   |-- string-compression.tsx
|   |   |   |-- string-concatenation.tsx
|   |   |   |-- string-copy.tsx
|   |   |   |-- string-dp-basics.tsx
|   |   |   |-- string-hashing-strings.tsx
|   |   |   |-- string-input-output.tsx
|   |   |   |-- string-length.tsx
|   |   |   |-- string-matching-basics.tsx
|   |   |   |-- string-searching.tsx
|   |   |   |-- string-sorting.tsx
|   |   |   |-- string-streams.tsx
|   |   |   |-- string-to-integer-atoi.tsx
|   |   |   |-- string-to-integer.tsx
|   |   |   |-- string-traversal.tsx
|   |   |   |-- subsequence-vs-substring.tsx
|   |   |   |-- substring-search-overview.tsx
|   |   |   |-- substrings.tsx
|   |   |   |-- suffix-array-basics.tsx
|   |   |   |-- suffix-trie-basics.tsx
|   |   |   |-- toggle-case.tsx
|   |   |   |-- tokenization.tsx
|   |   |   |-- trie-basics-strings.tsx
|   |   |   |-- valid-palindrome-ii.tsx
|   |   |   |-- valid-parentheses-strings.tsx
|   |   |   |-- verifying-an-alien-dictionary.tsx
|   |   |   |-- wildcard-matching-strings.tsx
|   |   |   |-- wildcard-matching.tsx
|   |   |   |-- word-break-ii.tsx
|   |   |   |-- word-break-strings.tsx
|   |   |   |-- word-ladder.tsx
|   |   |   |-- word-search-strings.tsx
|   |   |   |-- z-algorithm.tsx
|   |   |   `-- zigzag-conversion.tsx
|   |   |-- time-space-complexity/
|   |   |   |-- amortized-complexity.tsx
|   |   |   |-- auxiliary-space.tsx
|   |   |   |-- average-case-complexity.tsx
|   |   |   |-- best-case-complexity.tsx
|   |   |   |-- best-practices-tsc.tsx
|   |   |   |-- big-o-notation.tsx
|   |   |   |-- big-omega-notation.tsx
|   |   |   |-- big-theta-notation.tsx
|   |   |   |-- brute-force-vs-optimized.tsx
|   |   |   |-- choosing-efficient-algorithms.tsx
|   |   |   |-- complexity-arrays.tsx
|   |   |   |-- complexity-comparison.tsx
|   |   |   |-- complexity-competitive-programming.tsx
|   |   |   |-- complexity-graph.tsx
|   |   |   |-- complexity-hashing.tsx
|   |   |   |-- complexity-heap.tsx
|   |   |   |-- complexity-linked-lists.tsx
|   |   |   |-- complexity-nested-loops.tsx
|   |   |   |-- complexity-of-loops.tsx
|   |   |   |-- complexity-queue.tsx
|   |   |   |-- complexity-recursion.tsx
|   |   |   |-- complexity-searching.tsx
|   |   |   |-- complexity-sequential-loops.tsx
|   |   |   |-- complexity-sorting.tsx
|   |   |   |-- complexity-stack.tsx
|   |   |   |-- complexity-stl-algorithms.tsx
|   |   |   |-- complexity-stl-containers.tsx
|   |   |   |-- complexity-strings.tsx
|   |   |   |-- complexity-trees.tsx
|   |   |   |-- constant-time.tsx
|   |   |   |-- cubic-time.tsx
|   |   |   |-- dry-run-complexity.tsx
|   |   |   |-- exponential-time.tsx
|   |   |   |-- factorial-time.tsx
|   |   |   |-- identifying-bottlenecks.tsx
|   |   |   |-- ignore-constants.tsx
|   |   |   |-- ignore-lower-order.tsx
|   |   |   |-- inplace-algorithms-complexity.tsx
|   |   |   |-- input-size-growth-rate.tsx
|   |   |   |-- input-space.tsx
|   |   |   |-- introduction-to-space-complexity.tsx
|   |   |   |-- introduction-to-time-complexity.tsx
|   |   |   |-- iterative-vs-recursive.tsx
|   |   |   |-- linear-time.tsx
|   |   |   |-- linearithmic-time.tsx
|   |   |   |-- logarithmic-time.tsx
|   |   |   |-- master-theorem-basics.tsx
|   |   |   |-- mle-basics.tsx
|   |   |   |-- optimization-techniques-tsc.tsx
|   |   |   |-- practice-complexity.tsx
|   |   |   |-- quadratic-time.tsx
|   |   |   |-- recurrence-relation-basics-complexity.tsx
|   |   |   |-- recursive-stack-space.tsx
|   |   |   |-- rules-for-calculating.tsx
|   |   |   |-- space-complexity-basics-tsc.tsx
|   |   |   |-- time-space-tradeoff.tsx
|   |   |   |-- tle-basics.tsx
|   |   |   |-- why-complexity-analysis.tsx
|   |   |   `-- worst-case-complexity.tsx
|   |   `-- trees/
|   |       |-- ancestor-descendant.tsx
|   |       |-- array-representation.tsx
|   |       |-- avl-tree.tsx
|   |       |-- balanced-binary-tree-check.tsx
|   |       |-- balanced-binary-tree.tsx
|   |       |-- bfs-traversal.tsx
|   |       |-- binary-lifting.tsx
|   |       |-- binary-tree-construction.tsx
|   |       |-- binary-tree.tsx
|   |       |-- bottom-view.tsx
|   |       |-- boundary-traversal.tsx
|   |       |-- bst-basics.tsx
|   |       |-- bst-iterator.tsx
|   |       |-- bst-simulator.tsx
|   |       |-- build-heap.tsx
|   |       |-- ceil-in-bst.tsx
|   |       |-- child-node.tsx
|   |       |-- children-sum-property.tsx
|   |       |-- complete-binary-tree.tsx
|   |       |-- construct-from-traversals.tsx
|   |       |-- count-nodes.tsx
|   |       |-- degenerate-binary-tree.tsx
|   |       |-- degree-of-node.tsx
|   |       |-- delete-in-bst.tsx
|   |       |-- depth-of-node.tsx
|   |       |-- dfs-traversal.tsx
|   |       |-- diagonal-traversal.tsx
|   |       |-- diameter-binary-tree.tsx
|   |       |-- dp-on-trees.tsx
|   |       |-- dsu-tree.tsx
|   |       |-- euler-tour.tsx
|   |       |-- fenwick-tree-basics.tsx
|   |       |-- floor-in-bst.tsx
|   |       |-- full-binary-tree.tsx
|   |       |-- heap-basics.tsx
|   |       |-- heap-operations.tsx
|   |       |-- heap-sort.tsx
|   |       |-- heapify.tsx
|   |       |-- heavy-light-decomposition.tsx
|   |       |-- height-binary-tree.tsx
|   |       |-- height-of-tree.tsx
|   |       |-- identical-trees.tsx
|   |       |-- inorder-successor-predecessor.tsx
|   |       |-- inorder-traversal.tsx
|   |       |-- insert-in-bst.tsx
|   |       |-- insert-in-trie.tsx
|   |       |-- internal-node.tsx
|   |       |-- introduction-to-trees.tsx
|   |       |-- invert-binary-tree.tsx
|   |       |-- iterative-traversals.tsx
|   |       |-- kth-largest-bst.tsx
|   |       |-- kth-largest-smallest-heap.tsx
|   |       |-- kth-smallest-bst.tsx
|   |       |-- lazy-propagation.tsx
|   |       |-- lca-binary-tree.tsx
|   |       |-- lca-bst.tsx
|   |       |-- lcp-using-trie.tsx
|   |       |-- leaf-node.tsx
|   |       |-- left-view.tsx
|   |       |-- level-of-node.tsx
|   |       |-- level-order-traversal.tsx
|   |       |-- linked-representation.tsx
|   |       |-- max-depth.tsx
|   |       |-- max-heap.tsx
|   |       |-- max-path-sum.tsx
|   |       |-- merge-k-sorted-arrays.tsx
|   |       |-- merge-k-sorted-lists.tsx
|   |       |-- merge-two-bsts.tsx
|   |       |-- min-depth.tsx
|   |       |-- min-heap.tsx
|   |       |-- mirror-tree.tsx
|   |       |-- morris-traversal.tsx
|   |       |-- n-ary-tree.tsx
|   |       |-- parent-node.tsx
|   |       |-- path-in-trees.tsx
|   |       |-- perfect-binary-tree.tsx
|   |       |-- postorder-traversal.tsx
|   |       |-- practice-patterns-trees.tsx
|   |       |-- prefix-search.tsx
|   |       |-- prefix-sum-queries.tsx
|   |       |-- preorder-traversal.tsx
|   |       |-- priority-queue.tsx
|   |       |-- range-min-query.tsx
|   |       |-- range-sum-query.tsx
|   |       |-- recover-bst.tsx
|   |       |-- recursive-traversals.tsx
|   |       |-- red-black-tree.tsx
|   |       |-- right-view.tsx
|   |       |-- root-node.tsx
|   |       |-- root-to-leaf-paths.tsx
|   |       |-- root-to-node-path.tsx
|   |       |-- search-in-bst.tsx
|   |       |-- search-in-trie.tsx
|   |       |-- segment-tree-basics.tsx
|   |       |-- serialize-deserialize.tsx
|   |       |-- sibling-node.tsx
|   |       |-- skewed-binary-tree.tsx
|   |       |-- subtree.tsx
|   |       |-- sum-of-nodes.tsx
|   |       |-- symmetric-tree.tsx
|   |       |-- top-view.tsx
|   |       |-- tree-dp-basics-tree.tsx
|   |       |-- tree-representation.tsx
|   |       |-- tree-terminology.tsx
|   |       |-- tree-traversal-basics.tsx
|   |       |-- trie-basics.tsx
|   |       |-- types-of-trees.tsx
|   |       |-- update-queries.tsx
|   |       |-- validate-bst.tsx
|   |       |-- vertical-order-traversal.tsx
|   |       |-- word-dictionary.tsx
|   |       `-- zigzag-traversal.tsx
|   |-- os/
|   |   `-- os/
|   |       `-- introduction.tsx
|   `-- signals-and-systems/
|       `-- signals-and-systems/
|           `-- introduction.tsx
|-- lib/
|   |-- content-registry.ts
|   |-- content-types.ts
|   |-- lesson-loaders.generated.ts
|   `-- useProgress.ts
|-- public/
|   |-- _redirects
|   |-- background.jpg
|   |-- bg.jpg
|   |-- THINK++-mark.svg
|   |-- do-not-click.html
|   |-- fa.ico
|   |-- favicon.ico
|   |-- file.svg
|   |-- globe.svg
|   |-- next.svg
|   |-- profile_photo.jpg
|   |-- robots.txt
|   |-- vercel.svg
|   `-- window.svg
|-- scratch/
|   |-- fill_complexity_content.py
|   |-- fill_strings_content.py
|   |-- final_final_rebuild.py
|   |-- final_fix.py
|   |-- fix_encoding.py
|   |-- fix_implicit_returns.py
|   |-- fix_jsx_semicolons.py
|   |-- fix_stack_queue_lessons.py
|   |-- fix_syntax.py
|   |-- fix-all-titles.js
|   |-- fix-drag.js
|   |-- fix-height.js
|   |-- fix-scroll.js
|   |-- fix-top-10.js
|   |-- list_gemini_models.py
|   |-- mass_general_migrator.py
|   |-- mass_graph_migrator.py
|   |-- mass_ll_migrator.py
|   |-- migrate_trees.py
|   |-- optimize_recursion_visualizers.py
|   |-- REBUILD_ALL_STRINGS.py
|   |-- refactor_to_graph_style.py
|   |-- refined_cleanup.py
|   |-- repair_all.py
|   |-- strip-theory.js
|   |-- super_fix.py
|   |-- test_backend.py
|   |-- test-registry.ts
|   |-- tree_template.txt
|   |-- ultimate_rebuild.py
|   |-- ultimate_restorer.py
|   |-- update_first5_ll.py
|   `-- update_simulations.py
|-- scripts/
|   |-- generate-lesson-loaders.mjs
|   `-- generate-project-structure.mjs
|-- .env
|-- .gitignore
|-- add_padding.py
|-- AGENTS.md
|-- ai-ml-file-structure.md
|-- build_output.txt
|-- CLAUDE.md
|-- clean_styles.py
|-- comupter-network-file-structure.md
|-- design.md
|-- DOCUMENTATION.md
|-- eslint.config.mjs
|-- fix_padding.py
|-- generate_linked_list_files.py
|-- generate_stack_queue_simulations.py
|-- netlify.toml
|-- next-env.d.ts
|-- next.config.js.bak
|-- next.config.mjs
|-- optimize_trees_visualizers.py
|-- package-lock.json
|-- package.json
|-- patch_inputs.js
|-- postcss.config.mjs
|-- Procfile
|-- pyproject.toml
|-- pyrightconfig.json
|-- README.md
|-- requirements.txt
|-- standardize_padding.py
|-- start.bat
|-- theme_ify_aggressive.py
|-- theme_ify.py
|-- theme-and-features.md
|-- tsc-errors-utf8.txt
|-- tsc-errors.txt
`-- tsconfig.json
```

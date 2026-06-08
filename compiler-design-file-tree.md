compiler-design/
│
├─ 01-introduction/
│  ├─ 01-introduction-to-compilers.tsx
│  ├─ 02-language-processing-system.tsx
│  ├─ 03-compiler-vs-interpreter.tsx
│  ├─ 04-compiler-vs-assembler.tsx
│  ├─ 05-phases-of-compiler.tsx
│  ├─ 06-structure-of-compiler.tsx
│  ├─ 07-bootstrapping.tsx
│  ├─ 08-cross-compiler.tsx
│  ├─ 09-source-program.tsx
│  ├─ 10-target-program.tsx
│  ├─ 11-error-handling-overview.tsx
│  ├─ 12-grouped-phases.tsx
│  ├─ 13-front-end-vs-back-end.tsx
│  ├─ 14-compiler-construction-tools.tsx
│  ├─ 15-symbol-table-introduction.tsx
│  ├─ 16-lexical-analysis-overview.tsx
│  ├─ 17-syntax-analysis-overview.tsx
│  ├─ 18-semantic-analysis-overview.tsx
│  ├─ 19-intermediate-code-overview.tsx
│  ├─ 20-code-optimization-overview.tsx
│  └─ 21-code-generation-overview.tsx
│
├─ 02-lexical-analysis/
│  ├─ 01-lexical-analyzer.tsx
│  ├─ 02-role-of-lexical-analyzer.tsx
│  ├─ 03-tokens.tsx
│  ├─ 04-lexemes.tsx
│  ├─ 05-patterns.tsx
│  ├─ 06-finite-automata.tsx
│  ├─ 07-deterministic-finite-automata.tsx
│  ├─ 08-nondeterministic-finite-automata.tsx
│  ├─ 09-epsilon-nfa.tsx
│  ├─ 10-regular-expressions.tsx
│  ├─ 11-regular-grammar.tsx
│  ├─ 12-regex-to-nfa.tsx
│  ├─ 13-nfa-to-dfa.tsx
│  ├─ 14-dfa-minimization.tsx
│  ├─ 15-transition-diagrams.tsx
│  ├─ 16-lexical-errors.tsx
│  ├─ 17-input-buffering.tsx
│  ├─ 18-buffering-techniques.tsx
│  ├─ 19-lex-tool.tsx
│  ├─ 20-flex-tool.tsx
│  ├─ 21-token-recognition.tsx
│  ├─ 22-reserved-keywords.tsx
│  ├─ 23-identifiers.tsx
│  ├─ 24-literals.tsx
│  ├─ 25-operators.tsx
│  ├─ 26-delimiters.tsx
│  ├─ 27-comments-handling.tsx
│  ├─ 28-whitespace-handling.tsx
│  ├─ 29-symbol-table-management.tsx
│  └─ 30-lexical-analysis-algorithms.tsx
│
├─ 03-syntax-analysis/
│  ├─ 01-parser-introduction.tsx
│  ├─ 02-context-free-grammar.tsx
│  ├─ 03-derivation.tsx
│  ├─ 04-leftmost-derivation.tsx
│  ├─ 05-rightmost-derivation.tsx
│  ├─ 06-parse-tree.tsx
│  ├─ 07-ambiguity-in-grammar.tsx
│  ├─ 08-ambiguous-grammar.tsx
│  ├─ 09-operator-precedence.tsx
│  ├─ 10-left-recursion.tsx
│  ├─ 11-removing-left-recursion.tsx
│  ├─ 12-left-factoring.tsx
│  ├─ 13-top-down-parsing.tsx
│  ├─ 14-recursive-descent-parser.tsx
│  ├─ 15-predictive-parser.tsx
│  ├─ 16-ll1-parser.tsx
│  ├─ 17-first-and-follow.tsx
│  ├─ 18-parsing-table-construction.tsx
│  ├─ 19-error-recovery-parsing.tsx
│  ├─ 20-bottom-up-parsing.tsx
│  ├─ 21-shift-reduce-parser.tsx
│  ├─ 22-handle-pruning.tsx
│  ├─ 23-operator-precedence-parser.tsx
│  ├─ 24-lr-parser.tsx
│  ├─ 25-slr-parser.tsx
│  ├─ 26-clr-parser.tsx
│  ├─ 27-lalr-parser.tsx
│  ├─ 28-canonical-items.tsx
│  ├─ 29-parser-generator-tools.tsx
│  ├─ 30-yacc-tool.tsx
│  ├─ 31-bison-tool.tsx
│  └─ 32-syntax-directed-translation.tsx
│
├─ 04-semantic-analysis/
│  ├─ 01-semantic-analysis-introduction.tsx
│  ├─ 02-syntax-directed-definition.tsx
│  ├─ 03-syntax-directed-translation.tsx
│  ├─ 04-attributed-grammar.tsx
│  ├─ 05-inherited-attributes.tsx
│  ├─ 06-synthesized-attributes.tsx
│  ├─ 07-dependency-graph.tsx
│  ├─ 08-type-checking.tsx
│  ├─ 09-static-type-checking.tsx
│  ├─ 10-dynamic-type-checking.tsx
│  ├─ 11-type-conversion.tsx
│  ├─ 12-type-coercion.tsx
│  ├─ 13-semantic-errors.tsx
│  ├─ 14-declaration-processing.tsx
│  ├─ 15-scope-management.tsx
│  ├─ 16-nested-scopes.tsx
│  ├─ 17-symbol-table.tsx
│  ├─ 18-symbol-table-implementation.tsx
│  ├─ 19-semantic-rules.tsx
│  ├─ 20-intermediate-representations.tsx
│  ├─ 21-abstract-syntax-tree.tsx
│  ├─ 22-decorated-parse-tree.tsx
│  ├─ 23-storage-allocation.tsx
│  ├─ 24-activation-record.tsx
│  ├─ 25-parameter-passing.tsx
│  ├─ 26-runtime-environment.tsx
│  ├─ 27-heap-management.tsx
│  ├─ 28-stack-management.tsx
│  └─ 29-garbage-collection.tsx
│
├─ 05-intermediate-code-generation/
│  ├─ 01-intermediate-code-introduction.tsx
│  ├─ 02-syntax-tree.tsx
│  ├─ 03-dag-representation.tsx
│  ├─ 04-postfix-notation.tsx
│  ├─ 05-three-address-code.tsx
│  ├─ 06-quadruples.tsx
│  ├─ 07-triples.tsx
│  ├─ 08-indirect-triples.tsx
│  ├─ 09-translation-of-expressions.tsx
│  ├─ 10-boolean-expressions.tsx
│  ├─ 11-control-flow-statements.tsx
│  ├─ 12-switch-case-translation.tsx
│  ├─ 13-loops-translation.tsx
│  ├─ 14-backpatching.tsx
│  ├─ 15-procedure-calls.tsx
│  ├─ 16-parameter-passing-icg.tsx
│  ├─ 17-array-reference-translation.tsx
│  ├─ 18-pointer-translation.tsx
│  ├─ 19-type-conversion-icg.tsx
│  ├─ 20-intermediate-code-optimization.tsx
│  └─ 21-code-generation-preparation.tsx
│
├─ 06-code-optimization/
│  ├─ 01-optimization-introduction.tsx
│  ├─ 02-machine-independent-optimization.tsx
│  ├─ 03-machine-dependent-optimization.tsx
│  ├─ 04-local-optimization.tsx
│  ├─ 05-global-optimization.tsx
│  ├─ 06-peephole-optimization.tsx
│  ├─ 07-common-subexpression-elimination.tsx
│  ├─ 08-dead-code-elimination.tsx
│  ├─ 09-copy-propagation.tsx
│  ├─ 10-constant-propagation.tsx
│  ├─ 11-constant-folding.tsx
│  ├─ 12-loop-optimization.tsx
│  ├─ 13-strength-reduction.tsx
│  ├─ 14-induction-variable-elimination.tsx
│  ├─ 15-code-motion.tsx
│  ├─ 16-unreachable-code-elimination.tsx
│  ├─ 17-algebraic-simplification.tsx
│  ├─ 18-data-flow-analysis.tsx
│  ├─ 19-reaching-definitions.tsx
│  ├─ 20-live-variable-analysis.tsx
│  ├─ 21-available-expressions.tsx
│  ├─ 22-basic-blocks.tsx
│  ├─ 23-flow-graph.tsx
│  ├─ 24-dominators.tsx
│  ├─ 25-register-allocation.tsx
│  ├─ 26-graph-coloring-register-allocation.tsx
│  ├─ 27-instruction-scheduling.tsx
│  ├─ 28-optimization-of-loops.tsx
│  └─ 29-optimization-case-studies.tsx
│
├─ 07-code-generation/
│  ├─ 01-code-generator-introduction.tsx
│  ├─ 02-target-machine.tsx
│  ├─ 03-runtime-memory-management.tsx
│  ├─ 04-storage-organization.tsx
│  ├─ 05-instruction-selection.tsx
│  ├─ 06-register-allocation-codegen.tsx
│  ├─ 07-addressing-modes.tsx
│  ├─ 08-code-emission.tsx
│  ├─ 09-target-code-generation.tsx
│  ├─ 10-stack-machine-code.tsx
│  ├─ 11-assembly-code-generation.tsx
│  ├─ 12-code-generation-for-expressions.tsx
│  ├─ 13-code-generation-for-control-flow.tsx
│  ├─ 14-procedure-call-generation.tsx
│  ├─ 15-parameter-passing-codegen.tsx
│  ├─ 16-activation-record-codegen.tsx
│  ├─ 17-machine-code-optimization.tsx
│  ├─ 18-instruction-cost.tsx
│  ├─ 19-register-descriptor.tsx
│  ├─ 20-address-descriptor.tsx
│  ├─ 21-object-code.tsx
│  ├─ 22-linking-and-loading.tsx
│  ├─ 23-relocation.tsx
│  ├─ 24-static-linking.tsx
│  ├─ 25-dynamic-linking.tsx
│  └─ 26-just-in-time-compilation.tsx
│
├─ 08-runtime-environment/
│  ├─ 01-runtime-environment-introduction.tsx
│  ├─ 02-storage-organization-runtime.tsx
│  ├─ 03-static-allocation.tsx
│  ├─ 04-stack-allocation.tsx
│  ├─ 05-heap-allocation.tsx
│  ├─ 06-activation-tree.tsx
│  ├─ 07-activation-records.tsx
│  ├─ 08-stack-frame.tsx
│  ├─ 09-calling-sequences.tsx
│  ├─ 10-parameter-passing-mechanisms.tsx
│  ├─ 11-dynamic-memory-allocation.tsx
│  ├─ 12-garbage-collection-techniques.tsx
│  ├─ 13-reference-counting.tsx
│  ├─ 14-mark-and-sweep.tsx
│  ├─ 15-copying-garbage-collection.tsx
│  ├─ 16-generational-garbage-collection.tsx
│  ├─ 17-exception-handling-runtime.tsx
│  ├─ 18-runtime-error-handling.tsx
│  └─ 19-runtime-support-system.tsx
│
├─ 09-compiler-construction-tools/
│  ├─ 01-lex-introduction.tsx
│  ├─ 02-flex-introduction.tsx
│  ├─ 03-yacc-introduction.tsx
│  ├─ 04-bison-introduction.tsx
│  ├─ 05-parser-generators.tsx
│  ├─ 06-scanner-generators.tsx
│  ├─ 07-syntax-tree-generators.tsx
│  ├─ 08-compiler-debugging-tools.tsx
│  ├─ 09-llvm-introduction.tsx
│  ├─ 10-gcc-architecture.tsx
│  ├─ 11-clang-overview.tsx
│  ├─ 12-intermediate-representation-tools.tsx
│  ├─ 13-build-automation.tsx
│  └─ 14-compiler-testing.tsx
│
├─ 10-advanced-topics/
│  ├─ 01-jit-compilation.tsx
│  ├─ 02-bytecode-compilation.tsx
│  ├─ 03-virtual-machines.tsx
│  ├─ 04-llvm-ir.tsx
│  ├─ 05-static-single-assignment.tsx
│  ├─ 06-parallelizing-compilers.tsx
│  ├─ 07-vectorization.tsx
│  ├─ 08-speculative-optimization.tsx
│  ├─ 09-profile-guided-optimization.tsx
│  ├─ 10-interprocedural-optimization.tsx
│  ├─ 11-compiler-security.tsx
│  ├─ 12-sandboxing.tsx
│  ├─ 13-incremental-compilation.tsx
│  ├─ 14-cross-compilation.tsx
│  ├─ 15-transpilers.tsx
│  ├─ 16-domain-specific-languages.tsx
│  ├─ 17-functional-language-compilers.tsx
│  ├─ 18-object-oriented-language-compilers.tsx
│  ├─ 19-garbage-collected-languages.tsx
│  └─ 20-ai-assisted-compilation.tsx
│
├─ 11-practical-labs/
│  ├─ 01-implement-lexical-analyzer.tsx
│  ├─ 02-implement-dfa.tsx
│  ├─ 03-regex-to-nfa-lab.tsx
│  ├─ 04-first-follow-program.tsx
│  ├─ 05-recursive-descent-parser-lab.tsx
│  ├─ 06-ll1-parser-program.tsx
│  ├─ 07-shift-reduce-parser-lab.tsx
│  ├─ 08-slr-parser-program.tsx
│  ├─ 09-symbol-table-implementation-lab.tsx
│  ├─ 10-intermediate-code-generation-lab.tsx
│  ├─ 11-three-address-code-lab.tsx
│  ├─ 12-code-optimization-lab.tsx
│  ├─ 13-peephole-optimization-lab.tsx
│  ├─ 14-register-allocation-lab.tsx
│  ├─ 15-yacc-parser-lab.tsx
│  ├─ 16-lex-programs.tsx
│  ├─ 17-mini-compiler-project.tsx
│  ├─ 18-syntax-tree-construction.tsx
│  ├─ 19-semantic-analysis-lab.tsx
│  └─ 20-compiler-project-architecture.tsx
│
└─ 12-interview-prep/
   ├─ 01-phases-of-compiler-interview.tsx
   ├─ 02-compiler-vs-interpreter-interview.tsx
   ├─ 03-lexical-analysis-interview.tsx
   ├─ 04-regex-vs-cfg.tsx
   ├─ 05-first-vs-follow.tsx
   ├─ 06-top-down-vs-bottom-up-parsing.tsx
   ├─ 07-ll1-vs-lr-parser.tsx
   ├─ 08-ambiguity-in-grammar-interview.tsx
   ├─ 09-left-recursion-vs-left-factoring.tsx
   ├─ 10-symbol-table-interview.tsx
   ├─ 11-syntax-directed-translation-interview.tsx
   ├─ 12-intermediate-code-interview.tsx
   ├─ 13-three-address-code-interview.tsx
   ├─ 14-code-optimization-interview.tsx
   ├─ 15-machine-independent-vs-machine-dependent.tsx
   ├─ 16-register-allocation-interview.tsx
   ├─ 17-garbage-collection-interview.tsx
   ├─ 18-runtime-environment-interview.tsx
   ├─ 19-activation-record-interview.tsx
   └─ 20-parser-types-interview.tsx

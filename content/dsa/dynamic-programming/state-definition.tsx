import { TheorySection } from "@/components/TheorySection";

export default function StateDefinitionLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="State Definition"
        definition="The first DP decision is the most important one: define exactly what your state represents before you write the recurrence."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={[
          "A state must contain everything needed to solve the current subproblem.",
          "Good states are usually compact, stable, and easy to transition from.",
          "Index-based states work well for arrays, strings, and prefix problems.",
          "If the state is unclear, the rest of the DP solution usually becomes messy."
        ]}
        breadcrumbs="DYNAMIC PROGRAMMING › FOUNDATIONS"
      />
    </main>
  );
}

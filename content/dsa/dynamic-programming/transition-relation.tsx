import { TheorySection } from "@/components/TheorySection";

export default function TransitionRelationLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="Transition Relation"
        definition="Once the state is defined, the transition tells you how to move from smaller solved states to the current answer."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={[
          "Write the recurrence by asking what choice is made at each step.",
          "Every transition should depend only on already solved subproblems.",
          "Most DP recurrences are built from take, skip, extend, or split decisions.",
          "A clean transition is what turns recursion into tabulation."
        ]}
        breadcrumbs="DYNAMIC PROGRAMMING › FOUNDATIONS"
      />
    </main>
  );
}

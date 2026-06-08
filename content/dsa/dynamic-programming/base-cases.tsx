import { TheorySection } from "@/components/TheorySection";

export default function BaseCasesLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="Base Cases"
        definition="Base cases seed the DP table and stop recursion from falling into infinite or undefined subproblems."
        timeComplexity="O(1)"
        spaceComplexity="O(1)"
        keyPoints={[
          "The smallest inputs should have direct answers without recursion.",
          "Initialize impossible states with safe sentinel values.",
          "Bad base cases poison every later transition.",
          "Always test n = 0, n = 1, empty strings, and first-row or first-column cases."
        ]}
        breadcrumbs="DYNAMIC PROGRAMMING › FOUNDATIONS"
      />
    </main>
  );
}

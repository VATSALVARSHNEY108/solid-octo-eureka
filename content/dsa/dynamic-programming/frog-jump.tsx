import { TheorySection } from "@/components/TheorySection";

export default function FrogJumpLesson() {
  return (
    <main style={{ background: "#0a0d14", minHeight: "100vh" }}>
      <TheorySection
        title="Frog Jump"
        definition="A frog can jump 1 or 2 steps at a time. Each jump has a cost, and the goal is to reach the end with the minimum total cost."
        timeComplexity="O(N)"
        spaceComplexity="O(N) or O(1)"
        keyPoints={[
          "At each stone, compare the cost of coming from the previous one or two positions.",
          "This is a minimum-cost DP rather than a counting DP.",
          "The first two stones form the base cases for the recurrence.",
          "The same pattern extends to variable jump lengths and path-cost problems."
        ]}
        breadcrumbs="DYNAMIC PROGRAMMING › 1D ARRAYS"
      />
    </main>
  );
}

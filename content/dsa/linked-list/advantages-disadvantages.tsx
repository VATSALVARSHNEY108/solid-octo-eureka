import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Concepts - Tradeoffs",
    definition:
      "Advantages and disadvantages compare linked lists against contiguous arrays: flexible insertion and memory growth, but slower lookup and extra pointer storage.",
    time: "Access O(n), Insert/Delete O(1) after pointer",
    space: "O(n) plus pointer fields",
    mode: "structure",
    variant: "advantages-disadvantages-file",
    cards: [
      { title: "Dynamic Growth", body: "Nodes can be allocated as needed instead of reserving one contiguous block." },
      { title: "Cheap Local Edits", body: "Once a pointer is at the right place, insertion or deletion changes only nearby links.", highlight: true },
      { title: "Sequential Access", body: "There is no direct index jump; finding an item usually means walking node by node." },
      { title: "Pointer Overhead", body: "Every node spends memory on links, and pointer-heavy traversal can be cache unfriendly." },
    ],
    code: ["array[index] is direct", "list access walks from head", "insert after prev: new.next = prev.next", "prev.next = new", "extra memory stores links"],
  },
  nodes: [
    { id: "N1", value: "A", x: 90, y: 230 },
    { id: "N2", value: "B", x: 220, y: 230 },
    { id: "N3", value: "C", x: 350, y: 230 },
    { id: "N4", value: "D", x: 480, y: 230 },
  ],
  steps: [
    { message: "Linked lists start from head and move through links, so random access is sequential.", line: 1, active: ["N1"], pointers: { head: "N1", targetIndex: "3" } },
    { message: "To reach D, the cursor must pass A, B, and C first.", line: 1, active: ["N2", "N3"], done: ["N1"], pointers: { current: "N3", cost: "3 hops" } },
    { message: "The advantage appears after you already have prev: inserting only rewires local pointers.", line: 2, active: ["N2", "NEW"], pointers: { prev: "N2", newNode: "NEW" } },
    { message: "The tradeoff is extra link memory on every node.", line: 4, done: ["N1", "N2", "N3", "N4"], pointers: { data: "value", overhead: "next pointer" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="advantages-disadvantages" title="Advantages Disadvantages" scenario={scenario} />;
}

import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Operations - Circular List",
    definition:
      "Circular operations update a ring where tail.next points back to head, so insertions and deletions must preserve the cycle.",
    time: "O(1) with tail, O(n) to search",
    space: "O(1)",
    mode: "structure",
    variant: "circular-operations-file",
    cards: [
      { title: "Tail Controls The Ring", body: "A tail pointer gives direct access to both the last node and head through tail.next." },
      { title: "Insert After Tail", body: "New nodes can join the end by pointing to head, then becoming the new tail.", highlight: true },
      { title: "Delete Head", body: "Deleting head means changing tail.next to the next node." },
      { title: "Stop Condition", body: "Traversal stops when the cursor returns to the starting node." },
    ],
    code: ["new.next = tail.next", "tail.next = new", "tail = new", "if delete head: tail.next = head.next", "stop when curr == head"],
  },
  nodes: [
    { id: "N1", value: "11", x: 110, y: 215 },
    { id: "N2", value: "22", x: 250, y: 180 },
    { id: "N3", value: "33", x: 430, y: 180 },
    { id: "N4", value: "44", x: 570, y: 215 },
  ],
  links: [
    { from: "N1", to: "N2" },
    { from: "N2", to: "N3" },
    { from: "N3", to: "N4" },
    { from: "N4", to: "N1", kind: "loop", label: "tail.next" },
  ],
  steps: [
    { message: "The tail points back to head, so the list forms a ring.", line: 0, active: ["N4", "N1"], pointers: { head: "N1", tail: "N4", "tail.next": "N1" } },
    { message: "Prepare a new node for insertion after tail.", line: 0, active: ["NEW", "N4"], pointers: { tail: "N4", newNode: "NEW" } },
    { message: "Point the new node to head before changing tail.next.", line: 0, active: ["NEW", "N1"], pointers: { "new.next": "N1", head: "N1" } },
    { message: "Connect tail to the new node and promote new to tail.", line: 1, active: ["N4", "NEW"], done: ["N1", "N2", "N3"], pointers: { "oldTail.next": "NEW", tail: "NEW" } },
    { message: "For head deletion, tail.next jumps over the old head.", line: 3, active: ["N4", "N2"], warn: ["N1"], pointers: { removed: "N1", "tail.next": "N2" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="circular-operations" title="Circular Operations" scenario={scenario} />;
}

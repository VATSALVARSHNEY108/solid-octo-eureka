import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Structure - Circular DLL",
    definition:
      "A circular doubly linked list gives every node both next and prev links, while the tail and head also point back to each other.",
    time: "Traversal O(n), local insert/delete O(1)",
    space: "O(n) with two links per node",
    mode: "structure",
    variant: "circular-doubly-file",
    cards: [
      { title: "Two Directions", body: "Each node has next and prev, so traversal can move forward or backward." },
      { title: "Closed Ring", body: "The tail links to head and head.prev links to tail, removing null ends.", highlight: true },
      { title: "Fast Local Updates", body: "Given a node, insertion and deletion repair four neighboring links." },
      { title: "Careful Boundaries", body: "Single-node and empty-list cases need special handling because links point back to self." },
    ],
    code: ["head.prev = tail", "tail.next = head", "node.next.prev = node", "node.prev.next = node", "stop after returning to head"],
  },
  nodes: [
    { id: "N1", value: "10", x: 110, y: 210 },
    { id: "N2", value: "20", x: 250, y: 170 },
    { id: "N3", value: "30", x: 430, y: 170 },
    { id: "N4", value: "40", x: 570, y: 210 },
  ],
  links: [
    { from: "N1", to: "N2", label: "next" },
    { from: "N2", to: "N3", label: "next" },
    { from: "N3", to: "N4", label: "next" },
    { from: "N4", to: "N1", kind: "loop", label: "tail.next" },
    { from: "N2", to: "N1", kind: "prev", label: "prev" },
    { from: "N3", to: "N2", kind: "prev", label: "prev" },
    { from: "N4", to: "N3", kind: "prev", label: "prev" },
    { from: "N1", to: "N4", kind: "prev", label: "head.prev" },
  ],
  steps: [
    { message: "Head has a prev link too; in a circular DLL it points to tail.", line: 0, active: ["N1", "N4"], pointers: { head: "N1", "head.prev": "N4" } },
    { message: "Forward next links eventually return from tail to head.", line: 1, active: ["N4", "N1"], pointers: { tail: "N4", "tail.next": "N1" } },
    { message: "Backward prev links let traversal move from a node to its predecessor.", line: 2, active: ["N3", "N2"], done: ["N4"], pointers: { current: "N3", "current.prev": "N2" } },
    { message: "Traversal stops when the cursor returns to head, not when it sees null.", line: 4, done: ["N1", "N2", "N3", "N4"], pointers: { stopCondition: "current == head" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="circular-doubly-linked-list" title="Circular Doubly Linked List" scenario={scenario} />;
}

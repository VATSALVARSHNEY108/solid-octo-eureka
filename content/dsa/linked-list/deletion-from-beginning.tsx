import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Operations - Delete Head",
    definition:
      "Deletion From Beginning removes the head node by moving head to head.next, making it the simplest linked-list deletion.",
    time: "O(1)",
    space: "O(1)",
    mode: "delete",
    variant: "delete-beginning-file",
    cards: [
      { title: "Direct Access", body: "Head already points at the node to delete." },
      { title: "Move Head", body: "The new head becomes oldHead.next.", highlight: true },
      { title: "Detach Old Node", body: "Clearing oldHead.next prevents accidental access to the chain." },
      { title: "Empty List", body: "If head is null, no deletion is possible." },
    ],
    code: ["if head == null: return", "oldHead = head", "head = head.next", "oldHead.next = null"],
  },
  nodes: [
    { id: "N1", value: "18", x: 90, y: 230 },
    { id: "N2", value: "7", x: 210, y: 230 },
    { id: "N3", value: "42", x: 330, y: 230 },
    { id: "N4", value: "5", x: 450, y: 230 },
  ],
  steps: [
    { message: "Head directly identifies the node to remove.", line: 1, active: ["N1"], pointers: { head: "N1", oldHead: "N1" } },
    { message: "Move head forward to the second node.", line: 2, active: ["N2"], warn: ["N1"], pointers: { head: "N2", oldHead: "N1" } },
    { message: "Detach the old head from the remaining chain.", line: 3, done: ["N2", "N3", "N4"], warn: ["N1"], pointers: { "oldHead.next": "null" } },
    { message: "The operation is complete in constant time.", line: 3, done: ["N2", "N3", "N4"], pointers: { complexity: "O(1)", head: "N2" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="deletion-from-beginning" title="Deletion From Beginning" scenario={scenario} />;
}

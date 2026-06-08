import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Operations - Delete Tail",
    definition:
      "Deletion From End traverses to the node before tail, disconnects the old tail, and promotes the predecessor as the new tail.",
    time: "O(n)",
    space: "O(1)",
    mode: "delete",
    variant: "delete-end-file",
    cards: [
      { title: "Need Predecessor", body: "A singly linked list cannot jump from tail back to the previous node." },
      { title: "Stop Early", body: "Traversal stops when current.next is the tail.", highlight: true },
      { title: "Break Tail Link", body: "prev.next becomes null." },
      { title: "Single Node Case", body: "If there is only one node, deleting tail also clears head." },
    ],
    code: ["if head.next == null: head = null", "curr = head", "while curr.next.next:", "  curr = curr.next", "curr.next = null"],
  },
  nodes: [
    { id: "N1", value: "3", x: 90, y: 230 },
    { id: "N2", value: "8", x: 210, y: 230 },
    { id: "N3", value: "13", x: 330, y: 230 },
    { id: "N4", value: "21", x: 450, y: 230 },
    { id: "N5", value: "34", x: 570, y: 230 },
  ],
  steps: [
    { message: "Start at head and look ahead for the tail predecessor.", line: 1, active: ["N1"], pointers: { curr: "N1", tail: "unknown" } },
    { message: "Keep moving while curr.next.next exists.", line: 2, active: ["N3"], done: ["N1", "N2"], pointers: { curr: "N3", "curr.next": "N4" } },
    { message: "Current is now before tail.", line: 2, active: ["N4", "N5"], pointers: { prevTail: "N4", tail: "N5" } },
    { message: "Set prevTail.next to null to remove the old tail.", line: 4, active: ["N4"], warn: ["N5"], pointers: { "N4.next": "null", removed: "N5" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="deletion-from-end" title="Deletion From End" scenario={scenario} />;
}

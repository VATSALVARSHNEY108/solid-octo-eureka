import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Algorithms - Two Pointer Deletion",
    definition:
      "Delete Nth Node From End keeps a fixed gap between fast and slow pointers so slow lands just before the node to remove.",
    time: "O(n)",
    space: "O(1)",
    mode: "delete",
    variant: "delete-nth-end-file",
    cards: [
      { title: "Create Gap", body: "Move fast n steps ahead so the distance between fast and slow equals n." },
      { title: "Walk Together", body: "When fast reaches null, slow is before the deletion target.", highlight: true },
      { title: "Bypass Target", body: "The removal is one pointer rewrite: slow.next = slow.next.next." },
      { title: "Dummy Head", body: "A dummy node handles deleting the actual head cleanly." },
    ],
    code: ["dummy.next = head", "move fast n + 1 steps", "while fast:", "  slow = slow.next; fast = fast.next", "slow.next = slow.next.next"],
  },
  nodes: [
    { id: "N1", value: "5", x: 90, y: 230 },
    { id: "N2", value: "12", x: 210, y: 230 },
    { id: "N3", value: "8", x: 330, y: 230 },
    { id: "N4", value: "19", x: 450, y: 230 },
    { id: "N5", value: "3", x: 570, y: 230 },
  ],
  steps: [
    { message: "Start from a dummy node so head deletion also works.", line: 0, active: ["N1"], pointers: { dummy: "before N1", slow: "dummy", fast: "dummy" } },
    { message: "Advance fast n + 1 steps to keep slow before the target.", line: 1, active: ["N3"], pointers: { n: "2", slow: "dummy", fast: "N3" } },
    { message: "Move both pointers until fast reaches null.", line: 2, active: ["N3", "N5"], done: ["N1", "N2"], pointers: { slow: "N3", fast: "N5" } },
    { message: "Slow.next is the nth node from the end, so bypass it.", line: 4, active: ["N3", "N5"], warn: ["N4"], pointers: { target: "N4", "slow.next": "N5" } },
    { message: "The target is removed and the list remains connected.", line: 4, done: ["N1", "N2", "N3", "N5"], warn: ["N4"], pointers: { result: "5 -> 12 -> 8 -> 3" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="delete-nth-node-from-end" title="Delete Nth Node From End" scenario={scenario} />;
}

import LinkedListLessonStudio, { type LessonScenario } from "@/components/LinkedListLessonStudio";

const scenario: LessonScenario = {
  profile: {
    eyebrow: "Linked List Algorithms - Random Pointer Clone",
    definition:
      "Clone With Random Pointer duplicates a list where every node has next and random links, without losing the original relationship graph.",
    time: "O(n)",
    space: "O(1) extra with interleaving",
    mode: "structure",
    variant: "clone-random-file",
    cards: [
      { title: "Interleave Clones", body: "Each copy is inserted directly after its original so original-to-copy lookup is local." },
      { title: "Copy Random Links", body: "A clone's random pointer becomes original.random.next.", highlight: true },
      { title: "Separate Chains", body: "The final pass restores originals and extracts the clone list." },
      { title: "No Hash Map Needed", body: "Interleaving avoids O(n) auxiliary map storage." },
    ],
    code: ["copy = Node(curr.val)", "copy.next = curr.next", "curr.next = copy", "copy.random = curr.random.next", "split original and copy"],
  },
  nodes: [
    { id: "N1", value: "A", x: 90, y: 190 },
    { id: "N2", value: "B", x: 250, y: 190 },
    { id: "N3", value: "C", x: 410, y: 190 },
    { id: "N4", value: "A'", x: 90, y: 315 },
    { id: "N5", value: "B'", x: 250, y: 315 },
  ],
  links: [
    { from: "N1", to: "N2", label: "next" },
    { from: "N2", to: "N3", label: "next" },
    { from: "N1", to: "N3", kind: "random", label: "random" },
    { from: "N2", to: "N1", kind: "random", label: "random" },
    { from: "N4", to: "N5", label: "clone" },
    { from: "N4", to: "N3", kind: "random", label: "copied random" },
  ],
  steps: [
    { message: "Start with original next links A -> B -> C and random links across the list.", line: 0, active: ["N1", "N2", "N3"], pointers: { originalHead: "N1", "A.random": "N3" } },
    { message: "Create clone A' for original A.", line: 0, active: ["N1", "N4"], pointers: { original: "N1", clone: "N4" } },
    { message: "Create clone B' and keep clone next links in the copied chain.", line: 2, active: ["N2", "N5"], done: ["N4"], pointers: { original: "N2", clone: "N5" } },
    { message: "Copy random pointers by following original.random to the matching clone target.", line: 3, active: ["N4", "N3"], done: ["N1", "N2"], pointers: { "A.random": "C", "A'.random": "C'" } },
    { message: "Separate the copied chain from the original chain.", line: 4, done: ["N1", "N2", "N3", "N4", "N5"], pointers: { originalHead: "A", cloneHead: "A'" } },
  ],
};

export default function Lesson() {
  return <LinkedListLessonStudio lessonId="clone-with-random-pointer" title="Clone With Random Pointer" scenario={scenario} />;
}

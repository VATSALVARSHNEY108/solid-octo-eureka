"use client";

import StackQueueLessonLab from "@/components/StackQueueLessonLab";

export default function PracticePatternsStackLesson() {
  return (
    <StackQueueLessonLab
      lessonId="practice-patterns-stack"
      title="Practice Patterns Stack"
      definition="A stack is a linear data structure that follows LIFO (Last-In-First-Out): items are added and removed from the top."
      timeComplexity="O(1) Core Operations"
      spaceComplexity="O(N) Total Storage"
      keyPoints={['LIFO access pattern', 'Push/Pop happen at the top', 'Peek/top reads without removing']}
    />
  );
}

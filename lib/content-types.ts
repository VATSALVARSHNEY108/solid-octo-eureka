export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  name: string;
  topicId: string;
  subjectId: string;
  path: string;
  description?: string;
}

export interface LessonData {
  title: string;
  theory: string;
  formulas?: { expr: string; description: string }[];
  visualIntuition: string;
  visualization?: React.ReactNode;
  parameters?: { name: string; default: string; description: string }[];
  failureCases?: string;
  applications?: string;
}

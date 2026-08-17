export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionType = 'MCQ' | 'Short' | 'Essay' | 'Definition' | 'FillBlank';

export type TeacherStyle = 'Conceptual' | 'Strict Exam' | 'Direct Recall' | 'Real-World Application';

export interface MCQOption {
  id: string;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
}

export interface QuestionItem {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  answer: string;
  explanation: string;
  keyTakeaways: string[];
  mnemonic?: string;
  options?: MCQOption[]; // For MCQs
  blankAnswer?: string; // For FillBlank
  learned?: boolean;
  markedForReview?: boolean;
  userSelectedOptionId?: string | null; // For interactive MCQ choice
  topicTag: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  learned?: boolean;
}

export interface VisualAidDiagram {
  id: string;
  title: string;
  description: string;
  type: 'flowchart' | 'hierarchy' | 'cycle' | 'comparison' | 'matrix';
  svgType: 'heart' | 'photosynthesis' | 'mitosis' | 'tcpip' | 'generic';
  tags: string[];
  searchQueryTag: string; // e.g. "Diagram: Human Heart Blood Flow Labeled"
  keyComponents: { label: string; detail: string }[];
}

export interface GeneratedStudyKit {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  difficulty: Difficulty;
  questions: QuestionItem[];
  flashcards: Flashcard[];
  diagrams: VisualAidDiagram[];
  originalText: string;
}

export interface GeneratorOptions {
  difficulty: Difficulty;
  questionTypes: QuestionType[];
  questionCount: number; // 3, 5, 8, 10
  teacherStyle?: TeacherStyle;
  customDirective?: string;
  includeFlashcards: boolean;
  includeDiagrams: boolean;
}

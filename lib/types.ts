// Quiz data types
export interface Question {
  id: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  isCompleted: boolean;
  selectedCount: number;
}

export interface QuizResults {
  correct: number;
  incorrect: number;
  percentage: number;
  questions: Question[];
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
}

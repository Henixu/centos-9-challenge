import { QuizState } from './types';

const STORAGE_KEY = 'centos_quiz_state';
const QUESTIONS_KEY = 'centos_quiz_questions';

export function saveQuizState(state: QuizState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save quiz state:', error);
  }
}

export function loadQuizState(): QuizState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load quiz state:', error);
    return null;
  }
}

export function clearQuizState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(QUESTIONS_KEY);
  } catch (error) {
    console.error('Failed to clear quiz state:', error);
  }
}

export function saveQuestions(questions: any[]): void {
  try {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error('Failed to save questions:', error);
  }
}

export function loadQuestions(): any[] | null {
  try {
    const saved = localStorage.getItem(QUESTIONS_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load questions:', error);
    return null;
  }
}

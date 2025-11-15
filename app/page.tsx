'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/file-upload';
import { QuestionCountSelector } from '@/components/question-count-selector';
import { QuizCard } from '@/components/quiz-card';
import { ResultsScreen } from '@/components/results-screen';
import { Question, QuizState, QuizResults } from '@/lib/types';
import { selectRandomQuestions } from '@/lib/excel-parser';
import {
  saveQuizState,
  loadQuizState,
  clearQuizState,
  saveQuestions,
  loadQuestions,
} from '@/lib/quiz-storage';
import { motion } from 'framer-motion';

type AppState = 'upload' | 'selectCount' | 'quiz' | 'results';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    isCompleted: false,
    selectedCount: 0,
  });
  const [results, setResults] = useState<QuizResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const savedState = loadQuizState();
    const savedQuestions = loadQuestions();

    if (savedState && savedQuestions && !savedState.isCompleted) {
      setQuizState(savedState);
      setAllQuestions(savedQuestions);
      setAppState('quiz');
    }
  }, []);

  const handleQuestionsLoaded = (questions: Question[]) => {
    setIsLoading(true);
    setAllQuestions(questions);
    saveQuestions(questions);
    setTimeout(() => {
      setAppState('selectCount');
      setIsLoading(false);
    }, 500);
  };

  const handleStartQuiz = (count: number) => {
    setIsLoading(true);
    const selectedQuestions = selectRandomQuestions(allQuestions, count);
    const newQuizState: QuizState = {
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      selectedCount: count,
    };
    setQuizState(newQuizState);
    saveQuizState(newQuizState);
    setTimeout(() => {
      setAppState('quiz');
      setIsLoading(false);
    }, 300);
  };

  const handleAnswer = (choice: 'A' | 'B' | 'C' | 'D') => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const updatedAnswers = {
      ...quizState.answers,
      [currentQuestion.id]: choice,
    };
    const updatedState = {
      ...quizState,
      answers: updatedAnswers,
    };
    setQuizState(updatedState);
    saveQuizState(updatedState);
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      const updatedState = {
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1,
      };
      setQuizState(updatedState);
      saveQuizState(updatedState);
    } else {
      // Quiz complete
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      const updatedState = {
        ...quizState,
        currentQuestionIndex: quizState.currentQuestionIndex - 1,
      };
      setQuizState(updatedState);
      saveQuizState(updatedState);
    }
  };

  const completeQuiz = () => {
    const correct = quizState.questions.filter(
      (q) => quizState.answers[q.id] === q.correct
    ).length;
    const incorrect = quizState.questions.length - correct;
    const percentage = Math.round((correct / quizState.questions.length) * 100);

    const quizResults: QuizResults = {
      correct,
      incorrect,
      percentage,
      questions: quizState.questions,
      userAnswers: quizState.answers,
    };

    setResults(quizResults);
    const completedState = { ...quizState, isCompleted: true };
    setQuizState(completedState);
    saveQuizState(completedState);
    setAppState('results');
  };

  const handleRetake = () => {
    const newQuizState: QuizState = {
      ...quizState,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
    };
    setQuizState(newQuizState);
    setResults(null);
    saveQuizState(newQuizState);
    setAppState('quiz');
  };

  const handleUploadNew = () => {
    clearQuizState();
    setAllQuestions([]);
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false,
      selectedCount: 0,
    });
    setResults(null);
    setAppState('upload');
  };

  const handleRestart = () => {
    handleUploadNew();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center mb-2">
            CentOS 9 Commands Quiz
          </h1>
          <p className="text-center text-muted-foreground">
            Test your knowledge of CentOS 9 system administration
          </p>
        </motion.div>

        <div className="flex justify-center">
          {appState === 'upload' && (
            <FileUpload onQuestionsLoaded={handleQuestionsLoaded} isLoading={isLoading} />
          )}
          {appState === 'selectCount' && (
            <QuestionCountSelector
              totalQuestions={allQuestions.length}
              onConfirm={handleStartQuiz}
              isLoading={isLoading}
            />
          )}
          {appState === 'quiz' && (
            <QuizCard
              question={quizState.questions[quizState.currentQuestionIndex]}
              questionNumber={quizState.currentQuestionIndex + 1}
              totalQuestions={quizState.questions.length}
              userAnswer={
                quizState.answers[
                  quizState.questions[quizState.currentQuestionIndex].id
                ] || null
              }
              onAnswer={handleAnswer}
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoBack={quizState.currentQuestionIndex > 0}
              isLastQuestion={
                quizState.currentQuestionIndex ===
                quizState.questions.length - 1
              }
            />
          )}
          {appState === 'results' && results && (
            <ResultsScreen
              results={results}
              onRetake={handleRetake}
              onUploadNew={handleUploadNew}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </main>
  );
}

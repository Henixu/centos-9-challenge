'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Question } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: 'A' | 'B' | 'C' | 'D' | null;
  onAnswer: (choice: 'A' | 'B' | 'C' | 'D') => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  isLastQuestion: boolean;
}

const choiceLabels: Record<string, string> = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
};

const choiceKeys: Record<string, 'A' | 'B' | 'C' | 'D'> = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D',
};

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswer,
  onNext,
  onPrevious,
  canGoBack,
  isLastQuestion,
}: QuizCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'C' | 'D' | null>(userAnswer);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key in choiceKeys) {
        const choice = choiceKeys[e.key];
        setSelectedChoice(choice);
        onAnswer(choice);
      }
      if (e.key === 'ArrowRight' && !isLastQuestion) {
        onNext();
      }
      if (e.key === 'ArrowLeft' && canGoBack) {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onAnswer, onNext, onPrevious, canGoBack, isLastQuestion]);

  const handleChoice = (choice: 'A' | 'B' | 'C' | 'D') => {
    setSelectedChoice(choice);
    onAnswer(choice);
  };

  const choices: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl"
    >
      <Card className="p-8 space-y-6">
        {/* Progress and counter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-primary"
            />
          </div>
        </div>

        {/* Question */}
        <div>
          <h2 className="text-2xl font-bold leading-tight mb-2">
            {question.question}
          </h2>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">
            Use number keys (1-4) or arrow keys to navigate
          </div>
          <div className="space-y-2 pt-2">
            {choices.map((choice, idx) => (
              <motion.button
                key={choice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleChoice(choice)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleChoice(choice);
                  }
                }}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedChoice === choice
                    ? 'border-primary bg-primary/10 font-semibold'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                aria-pressed={selectedChoice === choice}
                aria-label={`Choice ${choice}: ${question.choices[choice]}`}
              >
                <div className="flex gap-3">
                  <span className="font-semibold text-primary w-6 text-center">
                    {choiceLabels[choice]}
                  </span>
                  <span>{question.choices[choice]}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoBack}
            className="flex-1"
            aria-label="Previous question"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!selectedChoice || isLastQuestion}
            className="flex-1"
            aria-label={isLastQuestion ? 'Submit quiz' : 'Next question'}
          >
            {isLastQuestion ? 'Submit' : 'Next'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

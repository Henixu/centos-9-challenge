'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizResults, Question } from '@/lib/types';
import { motion } from 'framer-motion';
import { RotateCcw, Upload, Eye } from 'lucide-react';
import { ReviewModal } from './review-modal';
import Confetti from 'react-confetti';

interface ResultsScreenProps {
  results: QuizResults;
  onRetake: () => void;
  onUploadNew: () => void;
  onRestart: () => void;
}

export function ResultsScreen({
  results,
  onRetake,
  onUploadNew,
  onRestart,
}: ResultsScreenProps) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const isExcellent = results.percentage >= 80;

  useEffect(() => {
    if (isExcellent) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isExcellent]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedScore((prev) => {
        if (prev < results.percentage) {
          return Math.min(prev + 2, results.percentage);
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [results.percentage]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl"
    >
      {showConfetti && (
        <Confetti
          numberOfPieces={200}
          recycle={false}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}

      <Card className="p-8 space-y-8">
        {/* Score Section */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className={`text-6xl font-bold ${
                isExcellent ? 'text-green-600 dark:text-green-400' : 'text-blue-600'
              }`}
            >
              {displayedScore}%
            </motion.div>
            <p className="text-muted-foreground">
              {isExcellent
                ? 'Outstanding performance!'
                : 'Great effort, keep practicing!'}
            </p>
          </div>
        </div>

        {/* Results Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-muted">
            <div className="text-3xl font-bold text-green-600">
              {results.correct}
            </div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </Card>
          <Card className="p-4 text-center bg-muted">
            <div className="text-3xl font-bold text-red-600">
              {results.incorrect}
            </div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </Card>
          <Card className="p-4 text-center bg-muted">
            <div className="text-3xl font-bold text-blue-600">
              {results.questions.length}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>Progress</span>
            <span>{results.correct}/{results.questions.length}</span>
          </div>
          <Progress
            value={results.percentage}
            className="h-3"
          />
        </div>

        {/* Question Review */}
        <div className="space-y-3">
          <h3 className="font-semibold">Review Answers</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.questions.map((question, idx) => {
              const userAnswer = results.userAnswers[question.id];
              const isCorrect = userAnswer === question.correct;
              return (
                <motion.button
                  key={question.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedQuestion(question)}
                  className={`w-full p-3 text-left rounded-lg border transition-all ${
                    isCorrect
                      ? 'border-green-200 bg-green-50 dark:bg-green-950'
                      : 'border-red-200 bg-red-50 dark:bg-red-950'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium line-clamp-2">
                      Q{idx + 1}: {question.question}
                    </span>
                    <span className={`text-sm font-semibold ml-2 ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onRetake} size="lg" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
          <Button onClick={onUploadNew} variant="outline" size="lg" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload New File
          </Button>
          <Button onClick={onRestart} variant="ghost" size="lg" className="w-full">
            Start Over
          </Button>
        </div>
      </Card>

      {selectedQuestion && (
        <ReviewModal
          question={selectedQuestion}
          userAnswer={results.userAnswers[selectedQuestion.id]}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </motion.div>
  );
}

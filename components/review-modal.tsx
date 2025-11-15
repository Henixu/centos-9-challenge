'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/lib/types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ReviewModalProps {
  question: Question;
  userAnswer: 'A' | 'B' | 'C' | 'D' | null;
  onClose: () => void;
}

export function ReviewModal({ question, userAnswer, onClose }: ReviewModalProps) {
  const isCorrect = userAnswer === question.correct;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {question.question}
          </DialogTitle>
          <DialogDescription>
            {isCorrect ? 'Correct answer' : 'Incorrect answer'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Your answer */}
          <div>
            <h4 className="font-semibold mb-2">Your Answer</h4>
            {userAnswer ? (
              <div className={`p-3 rounded-lg border ${
                isCorrect
                  ? 'border-green-200 bg-green-50 dark:bg-green-950'
                  : 'border-red-200 bg-red-50 dark:bg-red-950'
              }`}>
                <Badge className="mb-2">
                  {userAnswer}
                </Badge>
                <p>{question.choices[userAnswer]}</p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">No answer selected</p>
            )}
          </div>

          {/* Correct answer (if wrong) */}
          {!isCorrect && (
            <div>
              <h4 className="font-semibold mb-2">Correct Answer</h4>
              <div className="p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950">
                <Badge className="mb-2 bg-green-600">
                  {question.correct}
                </Badge>
                <p>{question.choices[question.correct]}</p>
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div>
              <h4 className="font-semibold mb-2">Explanation</h4>
              <p className="p-3 rounded-lg bg-muted text-muted-foreground">
                {question.explanation}
              </p>
            </div>
          )}

          {/* All choices */}
          <div>
            <h4 className="font-semibold mb-2">All Choices</h4>
            <div className="space-y-2">
              {(['A', 'B', 'C', 'D'] as const).map((choice) => {
                const isUserChoice = userAnswer === choice;
                const isCorrectChoice = choice === question.correct;
                return (
                  <div
                    key={choice}
                    className={`p-3 rounded-lg border flex gap-3 ${
                      isCorrectChoice
                        ? 'border-green-200 bg-green-50 dark:bg-green-950'
                        : isUserChoice
                        ? 'border-red-200 bg-red-50 dark:bg-red-950'
                        : 'border-muted-foreground/25'
                    }`}
                  >
                    <span className="font-semibold w-6">{choice}</span>
                    <span className="flex-1">{question.choices[choice]}</span>
                    {isCorrectChoice && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {isUserChoice && !isCorrectChoice && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

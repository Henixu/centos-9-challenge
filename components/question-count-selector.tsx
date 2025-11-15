'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface QuestionCountSelectorProps {
  totalQuestions: number;
  onConfirm: (count: number) => void;
  isLoading?: boolean;
}

export function QuestionCountSelector({
  totalQuestions,
  onConfirm,
  isLoading = false,
}: QuestionCountSelectorProps) {
  const [count, setCount] = useState(Math.min(10, totalQuestions));

  const handleConfirm = () => {
    if (count >= 1 && count <= totalQuestions) {
      onConfirm(count);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md space-y-6 p-6 rounded-lg border bg-card"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Question Count</h2>
        <p className="text-muted-foreground">
          How many questions would you like to answer? ({totalQuestions} available)
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="question-count">Questions to answer</Label>
        <Input
          id="question-count"
          type="number"
          min="1"
          max={totalQuestions}
          value={count}
          onChange={(e) => setCount(Math.min(totalQuestions, Math.max(1, parseInt(e.target.value) || 1)))}
          className="text-lg"
          aria-label="Number of questions to answer"
        />
        <p className="text-xs text-muted-foreground">
          Min: 1, Max: {totalQuestions}
        </p>
      </div>

      <Button
        onClick={handleConfirm}
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        Start Quiz
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
}

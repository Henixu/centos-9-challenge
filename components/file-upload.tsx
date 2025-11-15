'use client';

import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { parseExcelFile } from '@/lib/excel-parser';
import { Question } from '@/lib/types';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onQuestionsLoaded: (questions: Question[]) => void;
  isLoading?: boolean;
}

export function FileUpload({ onQuestionsLoaded, isLoading = false }: FileUploadProps) {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    setError('');
    setSuccess('');

    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload an Excel (.xlsx) file');
      return;
    }

    try {
      const questions = await parseExcelFile(file);
      setSuccess(`Successfully loaded ${questions.length} questions!`);
      setTimeout(() => onQuestionsLoaded(questions), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-muted/50'
        }`}
      >
        <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="font-semibold mb-2">Upload Excel File</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop or click to select an .xlsx file
        </p>
        <label>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
            aria-label="Upload Excel file"
          />
          <Button asChild disabled={isLoading} variant="outline">
            <span className="cursor-pointer">
              {isLoading ? 'Loading...' : 'Select File'}
            </span>
          </Button>
        </label>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Alert className="border-green-200 bg-green-50 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
}

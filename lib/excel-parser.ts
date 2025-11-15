import { read, utils } from 'xlsx';
import { Question } from './types';

export function parseExcelFile(file: File): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = utils.sheet_to_json(worksheet, { header: 0 }) as any[];
        
        const questions = rows
          .filter(row => row[0] && row[1] && row[2] && row[3] && row[4] && row[5]) // Validate required columns
          .map((row, idx) => ({
            id: `q-${idx}`,
            question: String(row[0]).trim(),
            choices: {
              A: String(row[1]).trim(),
              B: String(row[2]).trim(),
              C: String(row[3]).trim(),
              D: String(row[4]).trim(),
            },
            correct: String(row[5]).trim().toUpperCase() as 'A' | 'B' | 'C' | 'D',
            explanation: row[6] ? String(row[6]).trim() : undefined,
          }));
        
        if (questions.length === 0) {
          reject(new Error('No valid questions found in Excel file'));
        } else {
          resolve(questions);
        }
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Select unique questions using Fisher-Yates
export function selectRandomQuestions(questions: Question[], count: number): Question[] {
  if (count > questions.length) {
    throw new Error('Cannot select more questions than available');
  }
  return shuffleArray(questions).slice(0, count);
}

import { shuffleArray, selectRandomQuestions } from '@/lib/excel-parser';
import { Question } from '@/lib/types';

describe('Excel Parser Utils', () => {
  const mockQuestions: Question[] = [
    {
      id: 'q-1',
      question: 'What is the command to list files?',
      choices: { A: 'ls', B: 'list', C: 'dir', D: 'show' },
      correct: 'A',
      explanation: 'ls lists directory contents',
    },
    {
      id: 'q-2',
      question: 'What is the command to change directory?',
      choices: { A: 'cd', B: 'chdir', C: 'move', D: 'goto' },
      correct: 'A',
    },
    {
      id: 'q-3',
      question: 'What is the command to print working directory?',
      choices: { A: 'pwd', B: 'dir', C: 'where', D: 'here' },
      correct: 'A',
    },
    {
      id: 'q-4',
      question: 'What is the command to create a directory?',
      choices: { A: 'mkdir', B: 'newdir', C: 'createdir', D: 'mkfold' },
      correct: 'A',
    },
    {
      id: 'q-5',
      question: 'What is the command to remove a file?',
      choices: { A: 'rm', B: 'del', C: 'delete', D: 'remove' },
      correct: 'A',
    },
  ];

  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const shuffled = shuffleArray(mockQuestions);
      expect(shuffled).toHaveLength(mockQuestions.length);
    });

    it('should contain all original elements', () => {
      const shuffled = shuffleArray(mockQuestions);
      const ids = shuffled.map((q) => q.id).sort();
      const originalIds = mockQuestions.map((q) => q.id).sort();
      expect(ids).toEqual(originalIds);
    });

    it('should produce different order (with high probability)', () => {
      const shuffled = shuffleArray(mockQuestions);
      let sameOrder = true;
      for (let i = 0; i < mockQuestions.length; i++) {
        if (mockQuestions[i].id !== shuffled[i].id) {
          sameOrder = false;
          break;
        }
      }
      // This might occasionally fail due to randomness, but very unlikely
      expect(sameOrder).toBe(false);
    });

    it('should not mutate the original array', () => {
      const original = [...mockQuestions];
      shuffleArray(mockQuestions);
      expect(mockQuestions).toEqual(original);
    });
  });

  describe('selectRandomQuestions', () => {
    it('should return the correct number of questions', () => {
      const selected = selectRandomQuestions(mockQuestions, 3);
      expect(selected).toHaveLength(3);
    });

    it('should return unique questions', () => {
      const selected = selectRandomQuestions(mockQuestions, 5);
      const ids = selected.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(5);
    });

    it('should throw error when requesting more questions than available', () => {
      expect(() => selectRandomQuestions(mockQuestions, 10)).toThrow();
    });

    it('should work with count = 1', () => {
      const selected = selectRandomQuestions(mockQuestions, 1);
      expect(selected).toHaveLength(1);
    });

    it('should work with count = total questions', () => {
      const selected = selectRandomQuestions(mockQuestions, mockQuestions.length);
      expect(selected).toHaveLength(mockQuestions.length);
    });
  });
});

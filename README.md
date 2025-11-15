# CentOS 9 Commands Quiz Application

A comprehensive, interactive quiz application for testing CentOS 9 system administration knowledge with Excel file support, animations, and persistent state management.

## Features

- **Excel File Upload**: Parse `.xlsx` files with drag-and-drop support
- **Question Formatting**: Expects Excel columns: Question | Choice A | Choice B | Choice C | Choice D | Correct Answer | Explanation
- **Random Selection**: Fisher-Yates shuffle algorithm ensures unique, randomized questions
- **Interactive Quiz UI**: 
  - Single question per animated card
  - Keyboard support (1-4 for choices, arrow keys for navigation)
  - Visual feedback on selection
  - Progress bar tracking
- **Comprehensive Results**:
  - Score with animated counter
  - Confetti animation for ≥80% correct
  - Per-question review with explanations
  - Side-by-side answer comparison
- **State Persistence**: Quiz state persists to localStorage across page refreshes
- **Accessibility**: 
  - Full keyboard navigation support
  - ARIA labels and roles
  - Screen reader friendly
  - Focus management
- **Animations**: 
  - Card slide/flip transitions
  - Micro-animations on buttons
  - Smooth number animations
  - Framer Motion for all transitions
- **Tailwind CSS**: Modern, responsive design with dark mode support

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Main app component with state management
│   └── globals.css             # Global styles
├── components/
│   ├── file-upload.tsx         # Excel file upload with drag-drop
│   ├── question-count-selector.tsx  # Question count selector
│   ├── quiz-card.tsx           # Single quiz question card
│   ├── results-screen.tsx      # Results and review screen
│   ├── review-modal.tsx        # Question review modal
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── excel-parser.ts         # Excel parsing & shuffle logic
│   └── quiz-storage.ts         # localStorage management
├── __tests__/
│   └── excel-parser.test.ts    # Unit tests
├── public/
│   └── sample-quiz.xlsx        # Sample Excel template
└── package.json
\`\`\`

## Installation

1. **Clone or download the project**
2. **Install dependencies**:
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`
3. **Run the development server**:
   \`\`\`bash
   npm run dev
   # or
   pnpm dev
   \`\`\`
4. **Open http://localhost:3000** in your browser

## Usage

### Preparing Your Excel File

Create an `.xlsx` file with the following structure:

| Question | Choice A | Choice B | Choice C | Choice D | Correct | Explanation |
|----------|----------|----------|----------|----------|---------|-------------|
| What command lists files? | ls | list | dir | show | A | ls is the standard command |
| What is the pwd command for? | Print working directory | Process ID | Page width | Print window display | A | pwd shows current path |

**Column Details**:
- **Column 0 (Question)**: The quiz question text
- **Columns 1-4 (Choices)**: The four answer options
- **Column 5 (Correct)**: The correct answer (A/B/C/D)
- **Column 6 (Explanation)**: Optional explanation for the answer

### Taking a Quiz

1. **Click "Select File"** or drag-drop your `.xlsx` file
2. **Choose the number of questions** (1 to total available)
3. **Answer each question**:
   - Click to select an answer or use number keys (1-4)
   - Use arrow keys to navigate (← Previous, → Next)
   - Click "Next" or press arrow right to proceed
4. **Review results**:
   - See your overall score and statistics
   - Click on any question to view detailed feedback
   - See your answer vs. the correct answer and explanation
5. **Retake, upload new file, or restart**

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1-4 | Select choice A-D |
| ← Arrow | Previous question |
| → Arrow | Next question |
| Tab | Navigate between elements |
| Enter | Confirm selection (on buttons) |

## State Persistence

- Quiz progress is automatically saved to `localStorage` after every action
- Refreshing the page resumes your quiz from where you left off
- Completing a quiz saves the final results
- Use "Upload New File" to clear saved state and start fresh

## Animations & Visual Feedback

- **Card Transitions**: Questions slide in/out with smooth animations
- **Choice Selection**: Visual feedback with border and background changes
- **Progress Bar**: Animated progress indicator
- **Score Display**: Animated number counter at results screen
- **Confetti**: Celebration animation when scoring ≥80%
- **Button Hover**: Micro-animations on interactive elements
- **Modal**: Smooth reveal for question review

## Accessibility Features

- **Keyboard Navigation**: Full quiz playable via keyboard
- **ARIA Labels**: All interactive elements properly labeled
- **Screen Reader Support**: Semantic HTML and ARIA roles
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant color scheme
- **Semantic HTML**: Proper use of buttons, labels, and sections

## Technologies Used

- **Next.js 16**: React framework with app router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations and transitions
- **SheetJS (xlsx)**: Excel file parsing
- **React Confetti**: Celebration animations
- **shadcn/ui**: Component library
- **Jest**: Unit testing

## Testing

Run unit tests:

\`\`\`bash
npm run test
# or
pnpm test
\`\`\`

Tests cover:
- Excel parser functions
- Fisher-Yates shuffle algorithm
- Question selection logic
- No duplicate questions
- Edge cases (1 question, all questions)

## Sample Excel Template

A sample `sample-quiz.xlsx` file is included in the `public` folder with CentOS 9 commands. You can:
- Download it and modify with your own questions
- Use it as a reference for the Excel format
- Upload it directly to test the application

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **In-browser parsing**: No server required for file parsing
- **Optimized rendering**: React components only render when needed
- **localStorage efficiency**: Minimal storage footprint
- **Lazy animations**: Framer Motion handles smooth 60fps transitions

## Future Enhancements

- Export quiz results as PDF
- Category/tag filtering
- Timed quiz mode
- Leaderboard/scoring history
- Question bank management UI
- Multiple language support
- Dark mode refinements

## License

MIT - Feel free to use this project for educational purposes

## Support

For issues or questions, please refer to the project documentation or open an issue on the repository.
\`\`\`

```xlsx file="public/sample-quiz.xlsx" query="CentOS 9 system administration commands quiz with categories"

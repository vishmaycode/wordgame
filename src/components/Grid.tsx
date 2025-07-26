interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
}

export function Grid({ guesses, currentGuess, targetWord }: GridProps) {
  const emptyRowsCount = Math.max(0, 6 - guesses.length - 1);
  const empties = Array(emptyRowsCount).fill('');
  const rows = [...guesses, currentGuess, ...empties].slice(0, 6);

  return (
    <div className="grid grid-rows-6 gap-2 sm:gap-2.5 w-full max-w-xs sm:max-w-lg mx-auto p-2">
      {rows.map((guess, i) => {
        // Always highlight the first empty row (the next row to be filled)
        const isActiveRow = i === guesses.length;
        const activeRowClass = isActiveRow
          ? 'ring-2 ring-blue-400 dark:ring-blue-300 inset-ring-2 ring-offset-transparent transition-all duration-200 scale-105 rounded-[4px] p-1'
          : '';
        // Find the current input column in the active row
        const inputCol = isActiveRow ? (currentGuess.length < 5 ? currentGuess.length : 4) : -1;
        return (
          <div
            key={i}
            className={`grid grid-cols-5 gap-2 sm:gap-2.5 ${activeRowClass}`}
          >
          {Array(5).fill('').map((_, j) => {
            const letter = guess[j] || '';
            let status = 'empty';

            if (guess === rows[i] && i < guesses.length) {
              const lowerGuess = guess.toLowerCase();
              const lowerTarget = targetWord.toLowerCase();

              if (lowerGuess[j] === lowerTarget[j]) {
                status = 'correct';
              } else if (lowerTarget.includes(lowerGuess[j])) {
                const letterCount = lowerTarget.split(lowerGuess[j]).length - 1;
                const correctPositions = lowerGuess.split('').filter((l: string, idx: number) =>
                  l === lowerGuess[j] && lowerTarget[idx] === l
                ).length;
                const presentCount = lowerGuess.slice(0, j + 1).split('').filter((l: string, idx: number) =>
                  l === lowerGuess[j] &&
                  lowerTarget.includes(l) &&
                  lowerTarget[idx] !== l
                ).length;

                if (presentCount + correctPositions <= letterCount) {
                  status = 'present';
                } else {
                  status = 'absent';
                }
              } else {
                status = 'absent';
              }
            }

            // Define style classes for light and dark themes
            // Remove border-2 if this is the input cell, so border-b-4 is visible
            const isInputCell = isActiveRow && j === inputCol;
            const baseClass = [
              'w-full aspect-square flex items-center justify-center',
              'text-xl sm:text-2xl font-bold rounded',
              'transform transition-all duration-300',
              letter ? 'scale-100' : 'scale-95',
              isInputCell ? 'border-b-4 border-b-blue-500 dark:border-b-blue-300 border-2 border-transparent' : 'border-2',
            ].join(' ');

            const statusClass = {
              empty: 'bg-gray-200 border-gray-300 text-black dark:bg-gray-700 dark:border-gray-700 dark:text-white',
              correct: 'bg-green-500 border-green-600 text-white shadow-lg scale-105 dark:bg-green-600 dark:border-green-700',
              present: 'bg-yellow-500 border-yellow-600 text-white shadow-md scale-105 dark:bg-yellow-600 dark:border-yellow-700',
              absent: 'bg-gray-400 border-gray-500 text-white dark:bg-gray-900 dark:border-gray-700',
            }[status];

            return (
              <div key={j} className={`${baseClass} ${statusClass}`}>
                {letter.toUpperCase()}
              </div>
            );
          })}
          </div>
        );
      })}
    </div>
  );
}

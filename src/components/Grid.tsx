import React from 'react';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
}

export function Grid({ guesses, currentGuess, targetWord }: GridProps) {
  const empties = Array(6 - guesses.length - 1).fill('');
  const rows = [...guesses, currentGuess, ...empties].slice(0, 6);

  return (
    <div className="grid grid-rows-6 gap-2 w-full max-w-sm mx-auto p-2">
      {rows.map((guess, i) => (
        <div key={i} className="grid grid-cols-5 gap-2">
          {Array(5).fill('').map((_, j) => {
            const letter = guess[j] || '';
            let status = 'empty';
            
            if (guess === rows[i] && i < guesses.length) {
              const lowerGuess = guess.toLowerCase();
              const lowerTarget = targetWord.toLowerCase();
              
              // First pass: mark correct letters
              if (lowerGuess[j] === lowerTarget[j]) {
                status = 'correct';
              } 
              // Second pass: mark present letters (only if they haven't been marked as correct elsewhere)
              else if (lowerTarget.includes(lowerGuess[j])) {
                const letterCount = lowerTarget.split(lowerGuess[j]).length - 1;
                const correctPositions = lowerGuess.split('').filter((l, idx) => 
                  l === lowerGuess[j] && lowerTarget[idx] === l
                ).length;
                const presentCount = lowerGuess.slice(0, j + 1).split('').filter((l, idx) => 
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

            return (
              <div
                key={j}
                className={`
                  w-full aspect-square flex items-center justify-center
                  text-2xl font-bold border-2 rounded
                  transform transition-all duration-300
                  ${letter ? 'scale-100' : 'scale-95'}
                  ${status === 'empty' ? 
                    'bg-gray-800 border-gray-700 text-white' :
                    status === 'correct' ? 
                    'bg-green-600 border-green-700 text-white shadow-lg scale-105' :
                    status === 'present' ? 
                    'bg-yellow-600 border-yellow-700 text-white shadow-md scale-105' :
                    'bg-gray-600 border-gray-700 text-white'
                  }
                `}
              >
                {letter.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
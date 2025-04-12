import { KeyboardKey } from '../types';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStates: Record<string, KeyboardKey['status']>;
}

export function Keyboard({ onKeyPress, keyStates }: KeyboardProps) {
  return (
    <div className="w-full max-w-xl mx-auto p-2">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => {
            const status = keyStates[key.toLowerCase()] || 'unused';
            const isSpecialKey = key === 'Enter' || key === '⌫';

            const baseClass = `
              ${isSpecialKey ? 'px-4' : 'px-3'}
              py-4 rounded font-bold text-sm
              transform transition-all duration-200
              active:scale-95 hover:scale-105
            `;

            const statusClass = {
              correct: 'bg-green-500 text-white shadow-lg dark:bg-green-600',
              present: 'bg-yellow-500 text-white shadow-md dark:bg-yellow-600',
              absent: 'bg-gray-400 text-black dark:bg-gray-800 dark:text-white',
              unused: 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-600 dark:text-white hover:dark:bg-gray-500',
            }[status];

            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`${baseClass} ${statusClass}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

}
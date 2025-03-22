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
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`
                  ${isSpecialKey ? 'px-4' : 'px-3'} 
                  py-4 rounded font-bold text-sm
                  transform transition-all duration-200
                  active:scale-95 hover:scale-105
                  ${status === 'correct' ? 
                    'bg-green-600 text-white shadow-lg' :
                    status === 'present' ? 
                    'bg-yellow-600 text-white shadow-md' :
                    status === 'absent' ? 
                    'bg-gray-800 text-white' :
                    'bg-gray-600 text-white hover:bg-gray-600'
                  }
                `}
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
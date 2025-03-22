export interface GameState {
  currentGuess: string;
  guesses: string[];
  history: string[];
  targetWord: string;
  gameOver: boolean;
  won: boolean;
  error: string;
}

export interface KeyboardKey {
  key: string;
  status: 'correct' | 'present' | 'absent' | 'unused';
}

export type Theme = 'dark';
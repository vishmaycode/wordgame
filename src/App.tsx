import { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { useTheme } from './hooks/useTheme';
import { checkGuess, getWordOfTheDay, isValidWord } from './utils';
import { GameState, KeyboardKey } from './types';
import WORD_LIST from './wordlist';
import { Sun, Moon } from 'lucide-react';

function App() {
  // Load saved game state or start a new game
  const [gameState, setGameState] = useState<GameState>(() => {
    // Get stored state from localStorage
    const savedState = localStorage.getItem('wordleGameState');

    // Get today's word
    const { word, dayNumber } = getWordOfTheDay(WORD_LIST);

    // If we have saved state, check if it's from today
    if (savedState) {
      const parsedState = JSON.parse(savedState);

      // Check if the saved state is from the current day
      if (parsedState.dayNumber === dayNumber) {
        return {
          ...parsedState,
          targetWord: word  // Ensure we have the correct word
        };
      }
      // If it's a new day, start fresh
    }

    // Initialize a new game state
    return {
      currentGuess: '',
      guesses: [],
      history: [],
      targetWord: word,
      dayNumber: dayNumber,  // Store the day number for comparison
      gameOver: false,
      won: false,
      error: ''
    };
  });

  const { theme, toggleTheme } = useTheme();
  const [keyStates, setKeyStates] = useState<Record<string, KeyboardKey['status']>>({});

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wordleGameState', JSON.stringify(gameState));
  }, [gameState]);

  const handleKeyPress = useCallback((key: string) => {
    if (gameState.gameOver) return;

    if (key === '⌫') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
        error: ''
      }));
    } else if (key === 'Enter') {
      if (gameState.currentGuess.length !== 5) {
        setGameState(prev => ({
          ...prev,
          error: 'Word must be 5 letters long'
        }));
        return;
      }

      if (!isValidWord(gameState.currentGuess)) {
        setGameState(prev => ({
          ...prev,
          error: 'Not a valid English word'
        }));
        return;
      }

      const newGuesses = [...gameState.guesses, gameState.currentGuess];
      const won = gameState.currentGuess.toLowerCase() === gameState.targetWord.toLowerCase();

      // Update key states
      const result = checkGuess(gameState.currentGuess.toLowerCase(), gameState.targetWord.toLowerCase());
      const newKeyStates = { ...keyStates };

      gameState.currentGuess.toLowerCase().split('').forEach((letter, i) => {
        const currentStatus = newKeyStates[letter];
        const newStatus = result[i];

        if (currentStatus === 'correct') return;
        if (currentStatus === 'present' && newStatus !== 'correct') return;

        newKeyStates[letter] = newStatus;
      });

      setKeyStates(newKeyStates);

      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        currentGuess: '',
        gameOver: won || newGuesses.length === 6,
        won,
        error: ''
      }));
    } else if (gameState.currentGuess.length < 5) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key.toLowerCase(),
        error: ''
      }));
    }
  }, [gameState, keyStates]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') handleKeyPress('⌫');
      else if (e.key === 'Enter') handleKeyPress('Enter');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKeyPress(e.key.toUpperCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <header className="border-b border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-300 p-4">
        <div className="flex justify-between items-center relative">
          <h1 className="text-2xl font-bold text-center w-full">WordGame</h1>
          <button
            onClick={toggleTheme}
            className="absolute right-4 text-black dark:text-white hover:text-gray-400 dark:hover:text-gray-600 transition scale-150"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {gameState.gameOver && (
          <div className="text-center mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-colors duration-300">
            <p className="text-xl font-bold">
              {gameState.won ? 'Congratulations!' : 'Better luck next time!'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              The word was: <span className="font-mono font-bold">{gameState.targetWord.toUpperCase()}</span>
            </p>
          </div>
        )}

        {gameState.error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-4 py-2 mt-12 rounded shadow-lg border border-red-300 dark:border-red-700 transition-all duration-300">
              {gameState.error}
            </div>
          </div>
        )}

        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          targetWord={gameState.targetWord}
        />

        <div className="mt-8">
          <Keyboard
            onKeyPress={handleKeyPress}
            keyStates={keyStates}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

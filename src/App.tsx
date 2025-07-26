import { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { useTheme } from './hooks/useTheme';
import DeveloperBadge from "./components/DeveloperBadge.tsx";
import { checkGuess, getWordOfTheDay, isValidWord } from './utils';
import { GameState, KeyboardKey } from './types';
import WORD_LIST from './wordlist';
import { Sun, Moon, Keyboard as KeyboardIcon } from 'lucide-react';

function App() {
  // Load saved game state or start a new game
  const [gameState, setGameState] = useState<GameState>(() => {
    // Get stored state from localStorage
    const savedState = localStorage.getItem('wordGameState');

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
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wordGameState', JSON.stringify(gameState));
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
    <>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <header className="border-b border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-300 p-4">
          <div className="flex justify-between items-center relative">
            {/* How to Play Button */}
            <button
              onClick={() => setShowHowToPlay(true)}
              className="absolute left-4 text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-300 transition text-2xl font-bold"
              aria-label="How to Play"
            >
              ?
            </button>
            <h1 className="text-2xl font-bold text-center w-full">WordGame</h1>
            <div className="absolute right-4 flex items-center gap-4">
              {/* Hide keyboard toggle button on mobile when keyboard is visible */}
              <button
                onClick={() => setShowKeyboard((prev) => !prev)}
                className="text-black dark:text-white hover:text-gray-400 dark:hover:text-gray-600 transition scale-150 sm:inline-block hidden mr-2"
                aria-label={showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
              >
                <KeyboardIcon />
              </button>
              <button
                onClick={toggleTheme}
                className="text-black dark:text-white hover:text-gray-400 dark:hover:text-gray-600 transition scale-150"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun /> : <Moon />}
              </button>
            </div>
          </div>
          {/* How to Play Modal */}
          {showHowToPlay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in">
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
                  aria-label="Close How to Play"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>
                <ol className="list-decimal list-inside space-y-2 text-base text-gray-800 dark:text-gray-200">
                  <li>Guess the <b>5-letter word</b> in 6 tries or less.</li>
                  <li>Each guess must be a valid English word. Type your guess and press <b>Enter</b>.</li>
                  <li>After each guess, the color of the tiles will change to show how close your guess was to the word:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li><span className="inline-block w-5 h-5 bg-green-500 border border-green-700 rounded mr-2 align-middle"></span> <b>Green</b>: Correct letter in the correct spot.</li>
                      <li><span className="inline-block w-5 h-5 bg-yellow-500 border border-yellow-700 rounded mr-2 align-middle"></span> <b>Yellow</b>: Correct letter in the wrong spot.</li>
                      <li><span className="inline-block w-5 h-5 bg-gray-400 border border-gray-700 rounded mr-2 align-middle"></span> <b>Gray</b>: Letter is not in the word.</li>
                    </ul>
                  </li>
                  <li>Use the on-screen or physical keyboard to type your guesses.</li>
                  <li>The word is the same for everyone each day. Come back tomorrow for a new word!</li>
                </ol>
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">Good luck and have fun!</div>
              </div>
            </div>
          )}
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

          {/* Always show keyboard on mobile, toggle on desktop */}
          <div className="mt-8 sm:hidden">
            <Keyboard
              onKeyPress={handleKeyPress}
              keyStates={keyStates}
            />
          </div>

          {showKeyboard && (
            <div className="mt-8 hidden sm:block">
              <Keyboard
                onKeyPress={handleKeyPress}
                keyStates={keyStates}
              />
            </div>
          )}
        </main>
      </div>

      <DeveloperBadge />
    </>
  );
}

export default App;

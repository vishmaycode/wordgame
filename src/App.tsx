import { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { checkGuess, getWordOfTheDay, isValidWord } from './utils';
import { GameState, KeyboardKey } from './types';
import WORD_LIST from './wordlist';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const { word } = getWordOfTheDay(WORD_LIST);
    return {
      currentGuess: '',
      guesses: [],
      history: [],
      targetWord: word,
      gameOver: false,
      won: false,
      error: ''
    };
  });

  const [keyStates, setKeyStates] = useState<Record<string, KeyboardKey['status']>>({});

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
    <div className="min-h-screen bg-gray-900">
      <header className="border-b border-gray-800 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-white text-center">Daily Wordle</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {gameState.gameOver && (
          <div className="text-center mb-8 bg-gray-800 rounded-lg p-4 shadow-lg">
            <p className="text-xl font-bold text-white">
              {gameState.won ? 'Congratulations!' : 'Better luck next time!'}
            </p>
            <p className="text-gray-400 mt-2">
              The word was: <span className="font-mono font-bold">{gameState.targetWord.toUpperCase()}</span>
            </p>
          </div>
        )}

        {gameState.error && (
          <div className="text-center mb-4">
            <p className="text-red-500 font-semibold">{gameState.error}</p>
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
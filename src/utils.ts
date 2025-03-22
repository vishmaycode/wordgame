import words from 'an-array-of-english-words';

const FIVE_LETTER_WORDS = words.filter(word => word.length === 5);

export function getWordOfTheDay(wordList: string[]): { word: string; usedWords: string[] } {
  // Get stored state
  const storedState = localStorage.getItem('wordleState');
  const state = storedState ? JSON.parse(storedState) : { usedWords: [], lastDate: '' };
  
  const today = new Date().toDateString();
  
  // If it's a new day, select a new word
  if (today !== state.lastDate) {
    // Filter out used words
    const availableWords = wordList.filter(word => !state.usedWords.includes(word));
    
    // If all words have been used, reset the list
    if (availableWords.length === 0) {
      state.usedWords = [];
      state.word = wordList[Math.floor(Math.random() * wordList.length)];
    } else {
      state.word = availableWords[Math.floor(Math.random() * availableWords.length)];
    }
    
    state.usedWords.push(state.word);
    state.lastDate = today;
    
    localStorage.setItem('wordleState', JSON.stringify(state));
  }
  
  return { word: state.word, usedWords: state.usedWords };
}

export function checkGuess(guess: string, target: string): ('correct' | 'present' | 'absent')[] {
  const result = new Array(5).fill('absent');
  const targetChars = [...target];
  const guessChars = [...guess];

  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = 'correct';
      targetChars[i] = '*';
      guessChars[i] = '*';
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] !== '*') {
      const targetIndex = targetChars.indexOf(guessChars[i]);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetChars[targetIndex] = '*';
      }
    }
  }

  return result;
}

export function isValidWord(word: string): boolean {
  return FIVE_LETTER_WORDS.includes(word.toLowerCase());
}
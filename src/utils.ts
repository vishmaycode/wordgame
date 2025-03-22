import words from 'an-array-of-english-words';

const FIVE_LETTER_WORDS = words.filter(word => word.length === 5);

export function getWordOfTheDay(wordList: string[]): { word: string; dayNumber: number } {
  // Get today's date and reset time to midnight
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Calculate days since a fixed reference date (Mar 1, 2025)
  const referenceDate = new Date(2025, 2, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysSinceReference = Math.floor((today.getTime() - referenceDate.getTime()) / millisecondsPerDay);
  
  // Use the day number to select a word deterministically
  const wordIndex = daysSinceReference % wordList.length;
  const word = wordList[wordIndex];
  
  // Optionally store the selected word in localStorage to avoid recalculation
  localStorage.setItem('wordleState', JSON.stringify({
    lastDate: today.toDateString(),
    word,
    dayNumber: daysSinceReference
  }));
  
  return { word, dayNumber: daysSinceReference };
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
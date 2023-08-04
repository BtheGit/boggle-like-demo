const LETTER_FREQUENCY = {
  a: 5,
  e: 5,
  i: 5,
  o: 5,
  u: 3,
  b: 3,
  c: 3,
  d: 4,
  f: 2,
  g: 4,
  h: 3,
  j: 1,
  k: 2,
  l: 4,
  m: 4,
  n: 4,
  p: 3,
  q: 1,
  r: 4,
  s: 4,
  t: 4,
  v: 2,
  w: 3,
  x: 1,
  y: 3,
  z: 1,
}
const LETTERS = (Object.entries(LETTER_FREQUENCY) as any).reduce((acc: string, [letter, frequency]: [string, number]) => {
  return acc.concat(letter.repeat(frequency))
}, "");

export const generateLetter = (): string => {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

export const generateLetterPool = (length: number): string[] => {
  const arr = [];
  for(let i = 0; i < length; i++){
    arr.push(generateLetter());
  }
  return arr;
}

export const verifyUsesAvailableLetters = (userInput: string, letterPool: string[]): boolean => {
  let mutableLetterPool = [...letterPool];
  const userLetters = userInput.split('');
  for(const letter of userLetters){
    const poolIndex = mutableLetterPool.indexOf(letter);
    if(poolIndex >= 0){
      mutableLetterPool.splice(poolIndex, 1)
    } else {
      return false;
    }
  }
  return true
}
// TODO: Refactor this to throw, when not valid and make above redundant (refactor usage too, natch);
export const calculateRemainingLetters = (userInput: string, letterPool: string[]): string[] => {
  let mutableLetterPool = [...letterPool];
  const userLetters = userInput.split('');
  for(const letter of userLetters){
    const poolIndex = mutableLetterPool.indexOf(letter);
    mutableLetterPool.splice(poolIndex, 1)
  }
  return mutableLetterPool;
}
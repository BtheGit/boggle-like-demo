import { TrieNode, TrieTree, getLetterIndex } from './Trie';
const WORD_LIST_SRC = '/wordlist.txt';

export interface IDictionary {
  isWord(word: string): boolean;
  getAllAvailableWords(letterPool: string[], minimumLength?: number): string[];
}

// TODO: Could also make dictionary sync and require it to take a wordlist as input.
export const Dictionary = async (): Promise<IDictionary> => {
  const rawFileContents = await fetch(WORD_LIST_SRC);
  const data = await rawFileContents.text();
  const formattedData = data.split('\r\n');
  const dictionary: TrieTree = new TrieTree();
  for(const word of formattedData){
    dictionary.insert(word);
  }
  const isWord = (word: string, minimumLength: number = 3): boolean => (word.length >= minimumLength && dictionary.search(word));
  // TODO: Move to a dictionary module.
  const getAllAvailableWords = (letterPool: string[], minimumLength: number = 3): string[] => {
    const validWords: string[] = []; // TODO: can pass this recursively instead
    // TODO: If more than one of a letter type, no need to start a depth traversal again.
    // Could cache all substrings already checked for example.

    // We want to recursively check words using all unique letters at a given depth.
    // Ie, for [a,a,z,x,i], we will make 4 checks at this depth
    // But we don't want to permanently remove duplicates, as they may still occur at multiple
    // levels.
    
    const findPermutations = (letters: string[], currentNode: TrieNode, currentSubstr: string) => {
      if(currentNode.wordTerminus && currentSubstr.length >= minimumLength){
        validWords.push(currentSubstr)
      }

      if(!letters.length) {
        // In the case that all letters have been used already, no need to go further.
        // Simply saves one cycle of converting an empty array to a set and back.
        return;
      }

      // TODO:
      // Which I could test if it was a leaf more directly, rather than checking if there are any children
      // one by one.

      const uniqueLetters = [...new Set(letters)];
      for(const uniqueLetter of uniqueLetters){
        const index = getLetterIndex(uniqueLetter);
        if(currentNode.children[index] === null) {
          continue;
        }
        // Use full list of letters (with duplicates) minus the one found now.
        const remainingLetters = letters.filter((letter, index) => {
          if (letter === uniqueLetter && letters.indexOf(uniqueLetter) === index){
            return false;
          }
          return true;
        })
        findPermutations(remainingLetters, currentNode.children[index], currentSubstr.concat(uniqueLetter));
      }
    }
    findPermutations(letterPool, dictionary.root, '')
    return validWords;
  }

  return { 
    isWord,
    getAllAvailableWords,
  }
}

export default Dictionary;
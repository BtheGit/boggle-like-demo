// TRIE

// QUESTION: How do I indicate that a substring is a valid word, but not a leafNode?

// NOTE: No use of parent node currently (since I'm tracking substrings already). Remove
// if no case comes up.

// Utils
export const getLetterIndex = (letter: string): number => parseInt(letter, 36) - 10;

// Node
export class TrieNode {
  parent: null|TrieNode;
  value: null|string;
  wordTerminus: boolean;
  children: TrieNode[];

  constructor(value?: string, parent?: TrieNode){
    this.parent = parent ?? null;
    this.value = value ?? null;
    this.wordTerminus = false;
    this.children = new Array(26).fill(null);
  }
}

// Tree
export class TrieTree {
  root: TrieNode;
  
  constructor() {
    this.root = new TrieNode();
  }

  // Convert word into array of letters immediately using spread operator.
  // (Noted because confusing syntax for some)
  insert(word: string){
    // Starting from the root, continue through each letter until we cannot match a child and then
    // begin inserting.
    let currNode = this.root;
    for(const letter of word){
      const index = getLetterIndex(letter);
      if(currNode.children[index] !== null){
        currNode = currNode.children[index];
      } else {
        const newChildNode = new TrieNode(letter, currNode);
        currNode.children[index] = newChildNode;
        currNode = newChildNode;
      }
    }
    currNode.wordTerminus = true;
    // console.debug(`Inserted ${ word }`)
  }

  search(word: string){
    let currNode = this.root;
    for(const letter of word) {
      const index = getLetterIndex(letter);
      if(currNode.children[index]){
        currNode = currNode.children[index];
      } else {
        // console.debug(`${ word } is not a valid word.`)
        return false
      }
    }
    if(!currNode.wordTerminus){
      // console.debug(`${ word } is not a valid word.`)
      return false;
    }
    // console.debug(`${ word } is a valid word.`)
    return true;
  }
}
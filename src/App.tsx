import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import { generateLetterPool, verifyUsesAvailableLetters, calculateRemainingLetters } from './utils/letters';
import Dictionary, { IDictionary } from './utils/Dictionary';
import { v4 as uuid } from 'uuid';


function App() {
  // https://stackoverflow.com/questions/33796267/how-to-use-refs-in-react-with-typescript
  const inputRef = useRef<HTMLInputElement>(null);
  const [ userWordInput, setUserWordInput ] = useState('');
  const [ baseLetterPool, setBaseLetterPool ] = useState<string[]>([]);
  // We can either calculate the remaining letters on the fly or simply maintain a duplicate.
  // Going with the more redundant way for the nonce, but bear note.
  const [ remainingLetterPool, setRemainingLetterPool ] = useState<string[]>([]);
  const [ dictionary, setDictionary ] = useState<IDictionary | null>(null);
  const [ availableWordPool, setAvailableWordPool ] = useState<string[]>([]); // TODO: Do we need this?
  const [ organizedAvailableWordPool, setOrganizedAvailableWordPool ] = useState<object>({})
  // TODO: Capture guessed words and record their lengths so we can show '2 out of 83 3 letter words found'...
  const [ guessedWordPool, setGuessedWordPool ] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const letters = generateLetterPool(15);
      const dictionary: IDictionary = await Dictionary();
      setDictionary(dictionary);
      const words = dictionary.getAllAvailableWords(letters);
      const organizedAvailableWords = words.reduce((acc: any, curr: string) => {
        const wordLength = curr.length;
        if(!acc[wordLength]){
          acc[wordLength] = [];
        }
        acc[wordLength].push(curr);
        return acc;
      }, {});
      setOrganizedAvailableWordPool(organizedAvailableWords);
      setBaseLetterPool(letters);
      setRemainingLetterPool(letters);
      // TODO: Can/Should I make this more explicitly dependent?
      setAvailableWordPool(words);
    })()
    // Focus input on text bar as soon as page loads.
    // (NOTE: Ref should not be null in callback (only on initial mount). But TS...)
    inputRef?.current?.focus();
  }, []);
  const onUserTextInputKeypress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      const currentValue = event.currentTarget.value;
      if(dictionary?.isWord(currentValue) && !guessedWordPool.includes(currentValue)){
          setGuessedWordPool((prevState) => ([
            ...prevState,
            currentValue
          ]))
        setUserWordInput('');
        setRemainingLetterPool(baseLetterPool);
      }
    }
  }
  const onUserTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // If enter, then check if existing input is valid word, record, and reset input.
    // Else, validate current input.
    // 1. Convert to lowerCase for consistency
    const lowercaseValue = event.target.value.toLowerCase()
    const isValid = verifyUsesAvailableLetters(lowercaseValue, baseLetterPool)
    if(isValid){
      setUserWordInput(lowercaseValue);
      setRemainingLetterPool(() => calculateRemainingLetters(lowercaseValue, baseLetterPool));
    }
    // TODO: Could add error butterbar to indicate invalid input.
  }
  return (
    <>
      <main>
        <br/>
        <div>
          <label>Guess:</label>
          <br/>
          <input
            ref={inputRef}
            type="text"
            value={ userWordInput.toUpperCase() }
            onChange={ onUserTextInputChange }
            onKeyPress={ onUserTextInputKeypress }
            className={ `${ !guessedWordPool.includes(userWordInput.toUpperCase()) && (dictionary && dictionary.isWord(userWordInput)) ? 'valid-word' : '' }`}
          >
          </input>
        </div>
        <hr/>
        <div>Available Letters</div>
        <br/>
        <div className ="letters__outer">
          { remainingLetterPool.map((char) => (
            <div 
              key={ uuid() }
              className="letters__tile"
            >
              { char }
            </div>
          )) }
        </div>
        <hr/>
        <div>Captured Words</div>
        <br/>
        { guessedWordPool.toString() }
        <hr/>
        <div>Hints</div>
        <ul>
          {
            organizedAvailableWordPool && Object.entries(organizedAvailableWordPool).map(([count, list]) => 
              <li key ={count}>
                <h2>{`${ (list as string[]).length } words with ${ count } letters.`}</h2>
                {/* Temp disable rendering answers while I decide experience */}
                <ul style={ {display: 'none'} }>
                  {
                    list.map((word: string) => <li key={word}>{ word }</li>)
                  }
                </ul>
              </li>
            )
          }
        </ul>
      </main>
    </>
  );
}

export default App;

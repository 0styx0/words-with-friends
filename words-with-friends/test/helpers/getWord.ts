import * as casual from 'casual';
import * as wordList from 'word-list-json';

/**
 *
 * @param length - of word to get. If 0, get random word
 *
 * @return valid words-with-friends word with length `length`
 */
export default function getWord(length: number = 0): string {

    const indexOfWordWithLength = wordList.lengths[length - 1];

    const word: string = (length === 0) ?
        casual.random_element(wordList as {} as string[]) :
        wordList[indexOfWordWithLength];

    return word.toUpperCase();
}
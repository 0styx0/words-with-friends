const dictionary = require('dictionary');

/**
 *
 * @param length - of word to get
 *
 * @return valid words-with-friends word with length `length`
 */
export default function getWord(length: number) {

    return (dictionary.words as string[])[dictionary.lengths[length]];
}
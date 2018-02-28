import Board from './Board';
import Player from './Player';
import Validate from './Validate';
import * as wordList from 'word-list-json';
import placeWord from '../test/helpers/placeWord';
import Word from './Word';

type highestWordType = {
    points: number;
    word: string
};

interface Coordinate {
    [key: string]: number[]
}

/**
 *
 * For each tile on board
 *   Check how much empty space there is (plus 1 since must be space after word, just call validateWord)
 *   Use dictionary to figure out highest point word that can go there (probably O^n)
 *   In case smaller words might be worth more points, repeat for every length until 0
 *     if find word worth more than previous highest word, save current word coordinates
 * Place highest word found
 *
 * For every word in the dictionary equal or less than maximumLength
 *  Check if (letters in word) are also in (this.tiles)
 *    if yes, the word is in Computer's hand
 */

/**
 * 1) I have a coordinate
 * 2) Plug it in to see how many open spaces are on either side
 * 3) Now that I know the length and index of the letter by adding borders and stuff
 * 4) Do dictionary.get(length).get(letter).get(index)
 * 5) Now I have all possible words that can be placed there
 * 6) Iterate through those words, sorting them and comparing them against sorted Computer.tiles
 * 7) Find the most valuable of those words that Computer has in his hand
 * 8) Repeat from step 4, substituting length for length--
 * 9) Now I have the real most valuable word (even if it's smaller than the lengthiest word)
 * 10) Repeat again for every coordinate on the board
 */

class Computer extends Player {

    // private orderedDictionary = this.orderDictionary();

    /**
     * @private
     * @return {Set} of all coordinates that have tiles in them
     */
    getAllFilledCoordinates(board: Board) {

        // so recursion in checkTileTree doesn't go on forever. Must be string since can't use arrays in Set
        const coordinatesTried = new Set<string>();

        /**
         * Recursively checks all paths, finding coordinates of tiles in them
         *
         * @return return value of @see #getAllFilledCoordinates
         */
        const checkTileTree = (coordinates: number[]): boolean => {

            const space = board.get(coordinates);

            if (space && space.filled && !coordinatesTried.has(JSON.stringify(coordinates))) {

                coordinatesTried.add(JSON.stringify(coordinates));

                return checkTileTree([coordinates[0] + 1, coordinates[1]]) ||
                    checkTileTree([coordinates[0], coordinates[1] + 1]) ||
                    checkTileTree([coordinates[0] - 1, coordinates[1]]) ||
                    checkTileTree([coordinates[0], coordinates[1] - 1]);
            }

            return false;
        };

        const centerCoordinates = [7, 7];
        checkTileTree(centerCoordinates);

        return new Set([...coordinatesTried].map(coordinate => JSON.parse(coordinate)));
    }

    /**
     * @private
     *
     * @return left and rightmost first filled coordinates.
     *  If coordinate is at the edge and filled, the *most will be that coordinate,
     *   otherwise even if coordinate is filled it will not be counted
     */
    getBorderingTileCoordinates(board: Board, coordinate: ReadonlyArray<number>) {

        const validate = new Validate(board);

        const leftmostFilledCoordinate = (function getLeftmostCoordinate() {

            const leftFirstFilledCoordinate = validate.travelHorizontally(
              [Math.max(0, coordinate[0] - 1), coordinate[1]],
              (tileInfo, currentCoordinate) => !!currentCoordinate[0] && !tileInfo.filled,
              false
            );

            return [leftFirstFilledCoordinate[0] - 1, leftFirstFilledCoordinate[1]];
        })();

        const rightmostFilledCoordinate = (function getRightmostCoordinate() {

            const rightFirstFilledCoordinate = validate.travelHorizontally(
              [Math.min(coordinate[0] + 1, +process.env.REACT_APP_BOARD_DIMENSIONS!), coordinate[1]],
              (tileInfo, currentCoordinate) => !!currentCoordinate[0] && !tileInfo.filled,
              true
            );

            return [rightFirstFilledCoordinate[0] - 1, rightFirstFilledCoordinate[1]];
        })();

        return {
            leftmostFilledCoordinate,
            rightmostFilledCoordinate
        };
    }

    /**
     * @private
     *
     * @return maximum length of a word that contains letter at coordinate
     */
    getMaximumWordLength(board: Board, coordinate: ReadonlyArray<number>) {

        const { leftmostFilledCoordinate, rightmostFilledCoordinate } =
            this.getBorderingTileCoordinates(board, coordinate);
        let spacesAfterBothBorders = 2;

        const compareCoordinates = (border: ReadonlyArray<number>) =>
          border.every((coord, i) => coordinate[i] === coord);

        if (
            compareCoordinates(leftmostFilledCoordinate) ||
            compareCoordinates(rightmostFilledCoordinate)
        ) {

            spacesAfterBothBorders = 0;
        }

        return rightmostFilledCoordinate[0] - leftmostFilledCoordinate[0] - spacesAfterBothBorders - 1;
    }

    /**
     * @private
     *
     * @return index of coordinate if it would be in a word of length `maximumLength`
     */
    getIndexOfCoordinate(xOrYCoordinate: number, maximumLength: number) {

        // t|r|y --> find index of r --> maximumLength=3, xOrYCoordinate=1 --> 3-1-1=1
        return maximumLength - xOrYCoordinate - 1; // -1 since 0 indexed
    }

    /*
     * @param firstLetter - the letter of the tile that will connect the word being placed to the rest of the board
     * @param lengthWanted - How long the words should be
     *
     * @return all real words that exist in Computer.tiles
     */
    getAllValidWords(letter: string, indexOfLetter: number, lengthWanted: number) {

        let possibleWords = new Set<string>();

        try {
            // TODO: add back
            // possibleWords = this.orderedDictionary.get(lengthWanted)!.get(firstLetter)!;
        } finally {
            if (!possibleWords || possibleWords.size < 1) {
                return new Set<string>();
            }
        }

        // TODO: need to include firstLetter in the calculation
        // need to have firstLetter be anywhere in the word
        // and need to account for it *not* being the first word which might change getMaximumHorizontalWordLength
        const lettersInHand = this.tiles
          .map(tile => tile.letter)
          .sort()
          .join('');

        const allValidWords = [...possibleWords].reduce((validWords, word) => {

            const sortedWord = word.split('').sort().join('');

            if (lettersInHand.includes(sortedWord)) {
                validWords.concat([word]);
            }

            return validWords;

        }, [] as string[]);

        return new Set<string>(allValidWords);
    }

    /**
     * @private
     * @return wordList organized into a sort of hashtable where
     * results.get(lengthOfWordWanted).get(letter).get(number) is a Set
     * of words of the desired length that have letter at index of number
     */
    orderDictionary() {

        // dictionary.get(length).get(letter).get(indexOfLetter) = Set
        type dictionary = Map<number, Map<string, Map<number, Set<string>>>>;
        let lengthToLetterToWordDictionary: dictionary = new Map();


        const wordListLengthIndices = Object.values(wordList.lengths);

        wordListLengthIndices.forEach((indexOfWordsOfLength: number, i: number) => {

            const currentWordsOfLength = (wordList as {} as string[])
                .slice(indexOfWordsOfLength, wordListLengthIndices[i + 1]);

            currentWordsOfLength.forEach((currentWord: string, j: number) => {

                const wordLength = currentWord.length;

                // go through each letter of word
                for (let letterIndex = 0; letterIndex < wordLength; letterIndex++) {

                    // think of the following as a sandwich: start from the end,
                    // put something in the middle, then close it all up

                    const mapByLetter = lengthToLetterToWordDictionary.get(wordLength) ||
                      new Map<string, Map<number, Set<string>>>();

                    const mapByIndex = mapByLetter.get(currentWord[letterIndex]) ||
                        new Map<number, Set<string>>();

                    const words = mapByIndex.get(letterIndex) ||
                      new Set<string>();
                    words.add(currentWord);

                    mapByIndex.set(letterIndex, words);

                    mapByLetter.set(currentWord[letterIndex], mapByIndex);

                    lengthToLetterToWordDictionary.set(wordLength, mapByLetter);
                }
            });
        });

        return lengthToLetterToWordDictionary;
    }

    // TODO: need support for vertical words as well

    /**
     * @private
     *
     * Finds highest word in `possibleWords`
     *
     * @param possibleWords - Words that are valid if placed on `board` at `startCoordinate`
     *
     * @returns {object} containing `points` and `word` of the highest possible entry in `possibleWords`
     *  if placed at `startCoordinate`
     */
    getHighestWord(
        possibleWords: Set<string>, board: Board, startCoordinate: number[], currentTurn: number
    ) {

        return [...possibleWords].reduce((highestScoringWord: highestWordType, currentWord: string) => {

            const boardCopy = board.clone();
            const wordInfo = placeWord(currentWord.toUpperCase(), startCoordinate, true, boardCopy, currentTurn);
            const currentWordPoints = Word.tallyPoints(wordInfo.board, wordInfo.coordinates);

            if (currentWordPoints > highestScoringWord.points) {

                return {
                    word: currentWord.toUpperCase(),
                    points: currentWordPoints
                };
            }

            return highestScoringWord;

        }, { points: 0 } as highestWordType);
    }

    /**
     * Finds the highest scoring word in entire dictionary
     */
    /* public findHighestPossibleWord(board: Board, currentTurn: number) {

        const orderedDictionary = this.orderDictionary();
        const allFilledCoordinates = this.getAllFilledCoordinates(board);

        /**
         * Iterates through all coordinates, goes through every possible word
         * for every possible coordinate, and picks the one worth the most points
         *
        return [...allFilledCoordinates].reduce((highestWordInfo: highestWordType, coordinate) => {

            const maximumLength = this.getMaximumHorizontalWordLength(board, coordinate);
            const firstLetterOfPossibleWord = board.get(coordinate)!.tile!.letter.toLowerCase();

            let currentHighestWord: highestWordType = highestWordInfo;

            // check every length, since sometimes a shorter word might be worth more
            for (let possibleLength = maximumLength; possibleLength >= maximumLength; possibleLength--) {

                let possibleWords;

                try {

                    possibleWords = orderedDictionary
                        .get(possibleLength)!
                        .get(firstLetterOfPossibleWord);
                } catch {/* do nothing. Easier than two if statements *}

                if (possibleWords) {

                    const highestWord = this
                      .getHighestWord(possibleWords, board, coordinate, currentTurn);

                    if (highestWord.points >= currentHighestWord.points) {
                        currentHighestWord = highestWord;
                    }
                }
            }

            return currentHighestWord;

        }, { points: 0, word: '' });
    }*/
}

export default Computer;

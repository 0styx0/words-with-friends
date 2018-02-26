import Board from './Board';
import Player from './Player';
import TileInfo from './TileInfo';
import Validate from './Validate';
import * as wordList from 'word-list-json';
import placeWord from '../test/helpers/placeWord';
import Word from './Word';

type highestWordType = {
    points: number;
    word: string
};


/**
 *
 * For each tile on board
 *   Check how much empty space there is (plus 1 since must be space after word, just call validateWord)
 *   Use dictionary to figure out highest point word that can go there (probably O^n)
 *   In case smaller words might be worth more points, repeat for every length until 0
 *     if find word worth more than previous highest word, save current word coordinates
 * Place highest word found
 */

class Computer extends Player {

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
     * @return maximum horizontal length of word if it starts with letter at `coordinate`
     */
    getMaximumHorizontalWordLength(board: Board, coordinate: number[]) {

        const validate = new Validate(board);
        const lastFilledCoordinate = validate.travelHorizontally(coordinate,
         (tileInfo: TileInfo, currentCoordinate) =>  !!currentCoordinate[0] && tileInfo.filled);

        const offset = (board.get(lastFilledCoordinate)!.filled) ? -1 : 1; // if filled, don't include letter

        return lastFilledCoordinate[0] + offset - coordinate[0];
    }

    /**
     * @private
     * @return wordList organized into a sort of hashtable where
     * results.get(lengthOfWordWanted).get(firstLetterOfWordWanted) is a Set
     * of words of the desired length that start with the desired letter
     */
    orderDictionary() {

        type dictionary = Map<number, Map<string, Set<string>>>;
        let lengthToLetterToWordDictionary: dictionary = new Map();


        const wordListLengthIndices = Object.values(wordList.lengths);

        wordListLengthIndices.forEach((indexOfWordsOfLength: number, i: number) => {

            const currentWordsOfLength = (wordList as {} as string[])
                .slice(indexOfWordsOfLength, wordListLengthIndices[i + 1]);

            currentWordsOfLength.forEach((currentWord: string, j: number) => {

                const wordLength = currentWord.length;

                const currentWordSetsOfLength = lengthToLetterToWordDictionary.get(wordLength) ||
                    new Map<string, Set<string>>();

                const currentSet = currentWordSetsOfLength.get(currentWord[0]) || new Set<string>();
                currentSet.add(currentWord);

                currentWordSetsOfLength.set(currentWord[0], currentSet);

                lengthToLetterToWordDictionary.set(wordLength, currentWordSetsOfLength);
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
    public findHighestPossibleWord(board: Board, currentTurn: number) {

        const orderedDictionary = this.orderDictionary();
        const allFilledCoordinates = this.getAllFilledCoordinates(board);

        /**
         * Iterates through all coordinates, goes through every possible word
         * for every possible coordinate, and picks the one worth the most points
         */
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
                } catch {/* do nothing. Easier than two if statements */}

                if (possibleWords) {

                    const highestWord = this.getHighestWord(possibleWords, board, coordinate, currentTurn);

                    if (highestWord.points >= currentHighestWord.points) {
                        currentHighestWord = highestWord;
                    }
                }
            }

            return currentHighestWord;

        }, { points: 0, word: '' });
    }
}

export default Computer;

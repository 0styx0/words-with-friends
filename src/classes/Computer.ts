import Board from './Board';
import Player from './Player';
import TileInfo from './TileInfo';
import Validate from './Validate';
import * as wordList from 'word-list-json';



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
     * @return maximum horizontal length of word if it starts with letter at `coordinate`
     */
    getMaximumHorizontalWordLength(board: Board, coordinate: number[]) {

        const validate = new Validate(board);
        const lastFilledCoordinate = validate.travelHorizontally(coordinate,
         (tileInfo: TileInfo, currentCoordinate) =>  !!currentCoordinate[0] && tileInfo.filled);

        console.log('filled', board.get(lastFilledCoordinate)!.filled);

        const offset = (board.get(lastFilledCoordinate)!.filled) ? -1 : 1; // if filled, don't include letter

        return lastFilledCoordinate[0] + offset - coordinate[0];
    }

    // length => firstLetter => [wordsOrderedByPoints]

    /**
     * @return wordList organized into a sort of hashtable where
     * results.get(lengthOfWordWanted).get(firstLetterOfWordWanted) is a Set
     * of words of the desired length that start with the desired letter
     */
    orderDictionary() {

        type dictionary = Map<number, Map<string, Set<string>>>;
        let lengthToLetterToWordDictionary: dictionary = new Map();


        const wordListLengthIndices = Object.values(wordList.lengths);

        wordListLengthIndices.forEach((indexOfWordsOfLength: number, i: number) => {

            const currentWordsOfLength = wordList.slice(indexOfWordsOfLength, wordListLengthIndices[i + 1]);

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

    /**
     *
     * @return all valid words of length `length` that start with `startingLetter`
     */
    getAllWords(startingLetter: string, length: number) {

        const wordsOfValidLength = wordList[wordList.lengths[length]] || [];

        return wordsOfValidLength.reduce((accum: string[], word: string) =>
            (word[0] === startingLetter) ? accum.concat([word]) : accum);
    }

    // findHighestWord(board: Board) {

    // }
}

export default Computer;

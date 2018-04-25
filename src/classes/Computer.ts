import Board from './Board';
import Player from './Player';
import Validate from './Validate';
import * as wordList from 'word-list-json';
import placeWord from '../test/helpers/placeWord';
import Word from './Word';

type highestWordType = {
    points: number;
    word: string;
    startCoordinate: number[];
};


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

    private orderedDictionary = this.orderDictionary();

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

        return new Set<number[]>([...coordinatesTried].map(coordinate => JSON.parse(coordinate)));
    }

    isCoordinateOnHorizontal(board: Board, coordinate: ReadonlyArray<number>) {

        const adjacentHorizontalTile = board.get([coordinate[0] + 1, coordinate[1]]) ||
          board.get([coordinate[0] - 1, coordinate[1]]);

        return adjacentHorizontalTile && adjacentHorizontalTile.filled;
    }

    /**
     * @private
     *
     * @return left and rightmost first filled coordinates.
     *  If coordinate is at the edge and filled, the *most will be that coordinate,
     *   otherwise even if coordinate is filled it will not be counted
     *   If there are no filled bordering coordinates, then the farthest coordinates will be used
     */
    getBorderingTileCoordinates(board: Board, coordinate: ReadonlyArray<number>) {

        // NOTE: if have time, can remove lots of duplicate code in this method

        const validate = new Validate(board);

        function getTopmostCoordinate() {

            const topFirstFilledCoordinate = validate.travelVertically(
              [coordinate[0], Math.max(0, coordinate[1] - 1)],
              (tileInfo, currentCoordinate) => !!currentCoordinate[1] && !tileInfo.filled,
              false
            );

            return [topFirstFilledCoordinate[0], topFirstFilledCoordinate[1] - 1];
        }

        function getBottommostCoordinate() {

            const bottomFirstFilledCoordinate = validate.travelVertically(
              [coordinate[0], Math.min(coordinate[1] + 1, +process.env.REACT_APP_BOARD_DIMENSIONS!)],
              (tileInfo, currentCoordinate) =>
                currentCoordinate[1] < +process.env.REACT_APP_BOARD_DIMENSIONS! &&
                !tileInfo.filled,
              true
            );

            return [bottomFirstFilledCoordinate[0], bottomFirstFilledCoordinate[1] - 1];
        }

        function getLeftmostCoordinate() {

            const leftFirstFilledCoordinate = validate.travelHorizontally(
              [Math.max(0, coordinate[0] - 1), coordinate[1]],
              (tileInfo, currentCoordinate) => !!currentCoordinate[0] && !tileInfo.filled,
              false
            );

            return [leftFirstFilledCoordinate[0] - 1, leftFirstFilledCoordinate[1]];
        }

        function getRightmostCoordinate() {

            const rightFirstFilledCoordinate = validate.travelHorizontally(
              [Math.min(coordinate[0] + 1, +process.env.REACT_APP_BOARD_DIMENSIONS!), coordinate[1]],
              (tileInfo, currentCoordinate) =>
                currentCoordinate[0] < +process.env.REACT_APP_BOARD_DIMENSIONS! &&
                !tileInfo.filled,
              true
            );

            return [rightFirstFilledCoordinate[0] - 1, rightFirstFilledCoordinate[1]];
        }

        const coordinateIsOnHorizontal = this.isCoordinateOnHorizontal(board, coordinate);

        return {
            leftmostFilledCoordinate: coordinateIsOnHorizontal ? getTopmostCoordinate() :
              getLeftmostCoordinate(),
            rightmostFilledCoordinate: coordinateIsOnHorizontal ? getBottommostCoordinate() :
              getRightmostCoordinate()
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

        return this.isCoordinateOnHorizontal(board, coordinate) ?
            rightmostFilledCoordinate[1] - leftmostFilledCoordinate[1] - spacesAfterBothBorders - 1 :
            rightmostFilledCoordinate[0] - leftmostFilledCoordinate[0] - spacesAfterBothBorders - 1;
    }

    /**
     * @private
     *
     * @return index of coordinate if it would be in a word of length `maximumLength`
     */
    getIndexOfCoordinate(xOrYCoordinate: number, leftBorder: number) {

        // make a non-zero based array, where leftBorder is first index and it goes until maximumLength
        // leftBorder=3,xOrYCoordinate=5,maximumLength=6 --> [3, 4, 5, 6, 7, 8] -->
        // it would be the second coordinate out of 6 since 5-3

        return xOrYCoordinate - (leftBorder);
    }

    /*
     * @private
     *
     * Given a length, a letter, and the location where the letter should be, return all words that match
     *  and are in the hand
     *
     * @param letter - the letter of the tile that will connect the word being placed to the rest of the board
     * @param indexOfLetter - where in the word `letter` is
     * @param lengthWanted - How long the words should be
     *
     * @return all real words that exist in Computer.tiles
     */
    getAllValidWords(letter: string, indexOfLetter: number, lengthWanted: number) {

        // will be all words of `lengthWanted` with proper `letter` at `indexOfLetter`
        let possibleWords = new Set<string>();

        try {
            possibleWords = this.orderedDictionary
              .get(lengthWanted)!
              .get(letter.toLowerCase())!
              .get(indexOfLetter)!;

        } finally {

            if (!possibleWords || possibleWords.size < 1) {
                return new Set<string>();
            }
        }

        const lettersInHand = this.tiles
          .map(tile => tile.letter)
          .concat([letter])
          .sort()
          .join('')
          .toLowerCase();

        function checkIfWordIsInHand(word: string) {

            let wordArr = [...word.split('')];

            let lettersSoFar = '';
            [...lettersInHand].forEach(letterInHand => {

                if (wordArr.includes(letterInHand)) {
                     lettersSoFar += letterInHand;
                     wordArr.splice(wordArr.indexOf(letterInHand), 1);
                }
            });

            const wordIsInHand = lettersSoFar.includes(wordArr.sort().join(''));

            return wordIsInHand;
        }


        const allValidWords = [...possibleWords].reduce((validWords: string[], word, i) => {

            const sortedWord = word.split('').sort().join('');

            if (checkIfWordIsInHand(sortedWord)) {
                return validWords.concat([word.toUpperCase()]);
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


    /**
     * @private
     *
     * Finds highest word in `possibleWords` that has valid tile placement on board
     *
     * @param possibleWords - Words that are valid if placed on `board` at `startCoordinate`
     *
     * @returns {object} containing `points` and `word` of the highest possible entry in `possibleWords`
     *  if placed at `startCoordinate`
     */
    getHighestWord(
        possibleWords: Set<{startCoordinate: number[], word: string}>,
        board: Board,
        currentTurn: number
    ) {

        return [...possibleWords].reduce((highestScoringWord: highestWordType, currentWord) => {

            const boardCopy = board.clone();
            const wordInfo = placeWord(
                currentWord.word.toUpperCase(), currentWord.startCoordinate, true, boardCopy, currentTurn
            );

            const validate = new Validate(wordInfo.board);
            if (
                !validate.checkTilePlacementValidity(wordInfo.coordinates, currentTurn) ||
                !validate.validateWords(wordInfo.coordinates)
               ) {

                return highestScoringWord;
            }

            const currentWordPoints = Word.tallyPoints(wordInfo.board, wordInfo.coordinates);

            if (currentWordPoints > highestScoringWord.points) {

                return {
                    word: currentWord.word.toUpperCase(),
                    points: currentWordPoints,
                    startCoordinate: currentWord.startCoordinate
                };
            }

            return highestScoringWord;

        }, { points: 0 } as highestWordType);
    }
/*

            // index is where in the possible word will coordinate be
            // maximumLength uses only originalIndex
            // maximumLength-1 starts 1 position less than originalIndex and goes 1 position more
            // maximumLength-2 starts 2 position less than originalIndex and goes 2 position more
            // maximumLength-3 starts 3 position less than originalIndex and goes 3 position more

            /*
             * Word: table, coordinate: [7, 7], left border is [2, 7], right border is [10, 7]
             * First time around it starts at [4, 7], with length of 5 (since 10-1=9, so 9-4=5)
             *  Index will then be 3, since 7-4=3
             *  Extra space will be 5-5=0 (5 is maximumLength, other 5 is current length)
             *  Start at 4-(2+2)=0
               (2 is left border,
                other 2 is accounting for the space that must be between words, and the 4 is where it starts at.
                The 0 is how much "wiggle room there is)
             * Second time around it starts at [5, 7], with length of 4 (since 10-1=9, so 9-5=4)
               * Index will then be 2, since 7-5=2
               * Extra space will be 5-4=1 (5 is maximumLength, other 4 is current length)
               * Start at 5-(2+2)=1, so [4, 7] and has 1 wiggle room
                 so with the same length it can also use [5, 7]
             * Fourth time around it starts at [7, 7], with a length of 2 (since 10-1=9, so 9-7=2)
               * Index will then be 0, since 7-7=0
               * Extra space will be 5-2=3 (5 is maximumLength, other 2 is current length)
               * Start at 7-(2+2)=3, so [6, 7] has 3 wiggle room
             * Fifth time around it starts at [8, 7], with a length of 1 (since 10-1=9, so 9-8=1)
               * Index will then be -1 since 7-8=-1
               * Error: Undefined index. Must stop before coordinate=originalCoordinate
             */

    /**
     * Finds the best word that can made from tiles in hand
     */
    public getPossibleWords(board: Board, currentTurn: number) {

        const allFilledCoordinates = this.getAllFilledCoordinates(board);
        const validWords: {startCoordinate: number[], word: string}[] = [];

        // switch back when get it working to allFilledCoordinates
        return [
            ...allFilledCoordinates
        ].reduce((allValidWordsInHand, coordinate) => {

            const maximumLength = this.getMaximumWordLength(board, coordinate);
            // console.log('max leng', maximumLength);

            // const { leftmostFilledCoordinate, rightmostFilledCoordinate } =
            //   this.getBorderingTileCoordinates(board, coordinate);
            // const originalIndex =
              // this.getIndexOfCoordinate(coordinate[0], leftmostFilledCoordinate[0]);
            const word = board.get(coordinate)!.tile!.letter;

            for (let length = 2; length < maximumLength; length++) {

                const wordsFound = this.getAllValidWords(word, 0, length);

                const wordInfo = [...wordsFound].map(currentWord => ({
                    startCoordinate: coordinate,
                    word: currentWord
                }));

                validWords.push(...wordInfo);
            }

            return new Set([...allValidWordsInHand].concat(...validWords));
        }, new Set<{startCoordinate: number[], word: string}>());
    }
}

export default Computer;

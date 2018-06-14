import Board from './Board';
import Player from './Player';
import Validate from './Validate';
import * as wordList from 'word-list-json';
import placeWord from '../test/helpers/placeWord';
import Word from './Word';

import store, { getState } from '../store';
import actions from '../actions/';
import Tile from '../interfaces/Tile';


type highestWordType = {
    points: number;
    word: string;
    startCoordinate: number[];
    horizontal: boolean;
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

    private static highestWordsCache: Map<number, highestWordType[]> = new Map(); // key is turn
    public tilesCoordinatesPlacedLastTurn = [] as number[][];
    private orderedDictionary: Map<number, Map<string, Map<number, Set<string>>>>;
    private checkedByShift = new Map<string, {startCoordinate: number[], word: string}[]>();


    constructor(turn: boolean, playerIndex: number, cloning?: boolean) {
        super(turn, playerIndex);

        if (!cloning) {
            this.orderedDictionary = this.orderDictionary();
        }
    }

    get name() {
        return 'Computer';
    }

    clone() {

        const playerClone = new Computer(this.turn, this.playerIndex, true);

        return Object.assign(playerClone, {
            _score: this._score,
            _tiles: JSON.parse(JSON.stringify(this._tiles)),
            orderedDictionary: this.orderedDictionary,
            checkedByShift: this.checkedByShift,
        });
    }

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

        const centerCoordinates =
          [+process.env.REACT_APP_CENTER_COORDINATE!, +process.env.REACT_APP_CENTER_COORDINATE!];
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

        const allValidWords = [...possibleWords].reduce((validWords: string[], word, i) => {

            const sortedWord = word.split('').sort().join('');

            if (this.wordIsInHand(sortedWord, letter)) {
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

        return [...possibleWords]
            .reduce((words: highestWordType[], currentWord) => {

                const boardCopy = board.clone();
                const horizontal = this.isCoordinateOnHorizontal(board, currentWord.startCoordinate);
                const wordInfo = placeWord(
                    currentWord.word.toUpperCase(), currentWord.startCoordinate, !horizontal, boardCopy, currentTurn
                );

                const validate = new Validate(wordInfo.board);

                if (
                    !validate.checkTilePlacementValidity(wordInfo.coordinates, currentTurn) ||
                    !validate.validateWords(wordInfo.coordinates) ||
                    this.newWordOverwritesTiles(boardCopy, wordInfo) ||
                    !this.atLeastOneTileWasPlaced(boardCopy, wordInfo)
                ) {

                    return words;
                }

                const currentWordPoints = Word.tallyPoints(wordInfo.board, wordInfo.coordinates);

                return words.concat([{
                    word: currentWord.word.toUpperCase(),
                    points: currentWordPoints,
                    startCoordinate: currentWord.startCoordinate,
                    horizontal: !!horizontal
                }]);

            }, [] as highestWordType[])
            .sort((wordOne, wordTwo) => wordTwo.points - wordOne.points);
    }

    /**
     * Finds the best word that can made from tiles in hand
     */
    public getPossibleWords(board: Board, currentTurn: number) {

        const allFilledCoordinates = this.getAllFilledCoordinates(board);
//        const validWords: {startCoordinate: number[], word: string}[] = [];

        // switch back when get it working to allFilledCoordinates
        return [
            ...allFilledCoordinates
        ].reduce((allValidWordsInHand, coordinate) => {

            // console.log(new Set([...allValidWordsInHand].concat(...this.shiftWord(board, coordinate))));
            return new Set([...allValidWordsInHand].concat(...this.shiftWord(board, coordinate)));
/*
            const maximumLength = this.getMaximumWordLength(board, coordinate);

            // const { leftmostFilledCoordinate, rightmostFilledCoordinate } =
            //   this.getBorderingTileCoordinates(board, coordinate);
            // const originalIndex =
              // this.getIndexOfCoordinate(coordinate[0], leftmostFilledCoordinate[0]);
            const word = board.get(coordinate)!.tile!.letter;

            for (let length = 2; length < maximumLength; length++) {

                const wordsFound = this.getAllValidWords(word, 0, length);

                // console.log(coordinate);
                const wordInfo = [...wordsFound].map(currentWord => ({
                    startCoordinate: coordinate,
                    word: currentWord
                }));

                validWords.push(...wordInfo);
            }

            return new Set([...allValidWordsInHand].concat(...validWords));
*/
        }, new Set<{startCoordinate: number[], word: string}>());
    }

    shiftWord(board: Board, coordinate: number[]) {

        // const checkedByShiftKey = `${coordinate[0]}, ${coordinate[1]}`;
        // const resultCached = this.checkedByShift.has(checkedByShiftKey);
        // const newlyPlaced = this.tilesCoordinatesPlacedLastTurn.find(coor =>
          // coor[0] === coordinate[0] && coor[1] === coordinate[1]);

        // if (!newlyPlaced && resultCached) {

        //     return this.checkedByShift.get(checkedByShiftKey)!.reduce((stillValidWords, currentInfo) =>
        //         // make sure words are still valid while trying to cut down on lag
        //         this.wordIsInHand(currentInfo.word, board.get(coordinate)!.tile!.letter!) ?
        //           stillValidWords.concat(currentInfo)
        //           : stillValidWords
        //     , [] as {startCoordinate: number[], word: string}[]);
        // }

        function nearTile(offset: number, horizontal: boolean = true) {

            const coordinateToCheck = (horizontal) ? [coordinate[0] + offset - 1, coordinate[1]]
              : [coordinate[0], coordinate[1] + offset - 1];

            return board.get(coordinateToCheck) &&
                !board.get(coordinate)!.filled;
        }

        function getCoordinate(offset: number, horizontal: boolean = true) {
            return (horizontal) ? [coordinate[0] + offset, coordinate[1]]
              : [coordinate[0], coordinate[1] + offset];
        }

        const shift = (horizontal: boolean) => {

            // although these can go outside function, neater inside
            const maximumLength = this.getMaximumWordLength(board, coordinate);
            const letter = board.get(coordinate)!.tile!.letter;

            let found: {startCoordinate: number[], word: string}[] = [];
            let offset = 0;

            // goes as far back as possible (until would hit occupied tile)
            while (
                !this.pastBoardEdge(getCoordinate(offset, horizontal)) &&
                !nearTile(offset, horizontal)
            ) {

                for (let length = 2; length < maximumLength; length++) {

                    if (this.pastBoardEdge(getCoordinate(length))) {
                        break;
                    }

                    const wordsFound = this.getAllValidWords(letter, Math.abs(offset), length);

                    const wordInfo = [...wordsFound].map(currentWord => ({
                        startCoordinate: getCoordinate(offset, horizontal),
                        word: currentWord
                    }));

                    found = found.concat(wordInfo);
                }

                offset--;
            }

            return found;
        };

        const info = shift(true).concat(shift(false));
        // this.checkedByShift.set(checkedByShiftKey, info);

        return info;
    }

    /**
     * @param highestWordsIndex - index of word to use (0 is highest possible, 1 is second-highest etc)
     */
    public play(board: Board, highestWordsIndex: number = 0): highestWordType | undefined {

        const state = getState();

        const highestWords = Computer.highestWordsCache.get(state.turn) ||
            this.getHighestWord(
                this.getPossibleWords(board, state.turn), board, state.turn
            );
        Computer.highestWordsCache.set(state.turn, highestWords);

        if (highestWordsIndex >= highestWords.length) {
            console.log('PAST INDEX', highestWordsIndex, highestWords.length);
            return;
        }

        const highestWord = highestWords[highestWordsIndex];
        const horizontal = highestWord.horizontal;
        console.log('highest', highestWord, this.tiles);

        if (this.wordGoesPastBoardEnd(highestWord)) {
            console.log('PAST END');
            return this.play(board, highestWordsIndex + 1);
        }

        const actionInfo: {tile: Tile, coordinate: ReadonlyArray<number>}[] = [];

        for (
            let i = highestWord.startCoordinate[ (horizontal) ? 1 : 0 ];
            i < highestWord.startCoordinate[ (horizontal) ? 1 : 0 ] + highestWord.word.length;
            i++
        ) {

            const currentCoordinate = (horizontal) ? [highestWord.startCoordinate[0], i] :
              [i, highestWord.startCoordinate[1]];

            const tile = (board.get(currentCoordinate)!.filled && board.get(currentCoordinate)!.tile) ||
              this.tiles.find(currentTile =>
                currentTile.letter === highestWord.word[i - highestWord.startCoordinate[ (horizontal) ? 1 : 0 ]]);

            console.log(494, i, tile, currentCoordinate, highestWord.word[i]);

            if (!tile) {
                console.log('No tile', tile);
                return this.play(board, highestWordsIndex + 1);
            }

            actionInfo.push({tile, coordinate: currentCoordinate});
        }

        actionInfo.forEach(info => {

            console.log(info.coordinate);
            store.dispatch(
                actions.putTileOnBoard(info.tile, info.coordinate, state.Players, state.turn)
            );

            store.dispatch(actions.removeTileFromHand(state.Players, info.tile));
        });

        return highestWord;
    }

    private wordIsInHand(word: string, pretendLetterInHand: string) {

        const lettersInHand = this.tiles
            .map(tile => tile.letter)
            .concat([pretendLetterInHand])
            .sort()
            .join('')
            .toLowerCase();

        let unusedLettersOfWord = [...word.split('')];

        let lettersInHandAndInWord = '';
        [...lettersInHand].forEach(letterInHand => {

            if (unusedLettersOfWord.includes(letterInHand)) {

                lettersInHandAndInWord += letterInHand;
                unusedLettersOfWord.splice(unusedLettersOfWord.indexOf(letterInHand), 1);
            }
        });

        const wordIsInHand = lettersInHandAndInWord.split('').sort().join('') === word;

        return wordIsInHand;
    }

    /**
     * @param wordInfo: typeof result of placeWord
     */
    private newWordOverwritesTiles(oldBoard: Board, wordInfo: any) {

        return wordInfo.coordinates
          .some((coordinate: ReadonlyArray<number>, i: number) => {

              return !!oldBoard.get(coordinate) &&
                oldBoard.get(coordinate)!.filled &&
                oldBoard.get(coordinate)!.tile!.letter !== wordInfo.tileInfos[i].tile.letter;
          });
    }

    private wordGoesPastBoardEnd(word: highestWordType) {

        const endX = word.startCoordinate[0] + word.word.length;
        const endY = word.startCoordinate[1] + word.word.length;

        return this.pastBoardEdge([endX, endY]);
    }

    private pastBoardEdge(coordinate: number[]) {

        return Math.min(coordinate[0], coordinate[1]) < 0 ||
          Math.max(coordinate[0], coordinate[1]) > +process.env.REACT_APP_BOARD_DIMENSIONS!;
    }

    private atLeastOneTileWasPlaced(oldBoard: Board, wordInfo: any) {

        return wordInfo.coordinates
          .some((coordinate: ReadonlyArray<number>, i: number) => {

              return !!oldBoard.get(coordinate) &&
                !oldBoard.get(coordinate)!.filled;
          });
    }
}

export default Computer;

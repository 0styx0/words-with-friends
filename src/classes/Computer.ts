import Board from './Board';
import Player from './Player';
import Validate from './Validate';
import * as wordList from 'word-list-json';
import placeWord from '../test/helpers/placeWord';
import Word from './Word';

import store, { getState } from '../store';
import actions from '../actions/';
import Tile from '../interfaces/Tile';
import Tilebag from './Tilebag';


type highestWordType = {
    points: number;
    word: string;
    startCoordinate: number[];
    horizontal: boolean;
};

class Computer extends Player {

    // only public so can clear it in Computer.test.ts
    static checkedByShift = new Map<string, {startCoordinate: number[], word: string}[]>();

    private static highestWordsCache: Map<number, highestWordType[]> = new Map(); // key is turn
    public tilesCoordinatesPlacedLastTurn = [] as number[][];
    private orderedDictionary: Map<number, Map<string, Map<number, Set<string>>>>;


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
            checkedByShift: Computer.checkedByShift,
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
    public getPossibleWords(board: Board) {

        const allFilledCoordinates = this.getAllFilledCoordinates(board);

        return [
            ...allFilledCoordinates
        ].reduce((allValidWordsInHand, coordinate) =>
            new Set([...allValidWordsInHand].concat(...this.shiftWord(board, coordinate)))
        , new Set<{startCoordinate: number[], word: string}>());
    }

    shiftWord(board: Board, coordinate: number[]) {

        if (
            Computer.checkedByShift.get(JSON.stringify(coordinate))/* && (
                this.tilesCoordinatesPlacedLastTurn.every(coor => {

                    const withinThreeTilesHorizontally = coordinate[0] >= coor[0] - 1 && coor[0] <= coordinate[0] + 1;
                    const withinThreeTilesVertically = coordinate[1] >= coor[1] - 1 && coor[1] <= coordinate[1] + 1;

                    return !withinThreeTilesHorizontally && !withinThreeTilesVertically;
                })
            )*/
        ) {
            // console.log('skipped for ', coordinate);

            return Computer.checkedByShift.get(JSON.stringify(coordinate))!;
        }

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

                for (let length = 1; length < maximumLength; length++) {

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

        Computer.checkedByShift.set(JSON.stringify(coordinate), info);

        return info;
    }

    public generateHand(tileBag: Tilebag) {

        super.generateHand(tileBag);

        this.gatherPossibleWordsInBackground(getState().board);
    }

    /**
     * To be called right after computer has play()ed and has refilled its hand
     *
     * Calls #this.shiftWord on chunks of coordinates at intervals so browser doesn't complain about slow js
     */
    public gatherPossibleWordsInBackground(board: Board) {

        const allFilledCoordinates = [...this.getAllFilledCoordinates(board)];
        const lengthOfEachSection = 30;
        let timesRun = 0;

        const intervalId = window.setInterval(() => {

            const startIdx = timesRun * lengthOfEachSection;
            const endIdx = Math.min(startIdx + lengthOfEachSection, allFilledCoordinates.length);

            const filledCoordinateChunk = allFilledCoordinates.slice(startIdx, endIdx);

            filledCoordinateChunk.map((coordinate) =>
                this.shiftWord(board, coordinate));

            if (endIdx === allFilledCoordinates.length) {
                console.log('stopped', endIdx);
                clearInterval(intervalId);
            }
            console.log('interval', startIdx, startIdx);

            timesRun++;

        }, 100);
    }

    /**
     * @param highestWordsIndex - index of word to use (0 is highest possible, 1 is second-highest etc)
     */
    public play(board: Board, highestWordsIndex: number = 0): highestWordType | undefined {

        const state = getState();

        const highestWords = Computer.highestWordsCache.get(state.turn) ||
            this.getHighestWord(
                this.getPossibleWords(board), board, state.turn
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

            if (!tile) {
                console.log('No tile', tile);
                return this.play(board, highestWordsIndex + 1);
            }

            actionInfo.push({tile, coordinate: currentCoordinate});
        }

        actionInfo.forEach(info => {

            store.dispatch(
                actions.putTileOnBoard(info.tile, info.coordinate, state.Players, state.turn)
            );

            store.dispatch(actions.removeTileFromHand(state.Players, info.tile));
        });

        Computer.checkedByShift.clear();

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

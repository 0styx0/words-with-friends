import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import Computer from './Computer';
import * as wordList from 'word-list-json';
import * as casual from 'casual';
import Word from './Word';
import Board from './Board';
import TileInfo from './TileInfo';
import Powerup from './Powerup';

describe(`Computer`, () => {

    describe(`#findAllTiles`, () => {

        // put down random words
        it(`finds all words`, () => {

            const center = [7, 7];

            const words = [getWord(3)];
            const firstPlacement = placeWord(words[0], center, true);

            const lastLetterOfFirstWord = words[0][words[0].length - 1];

            do {
                words[1] = getWord();
            }
            while (words[1][0] !== lastLetterOfFirstWord);


            const secondWordCoordinates = [center[0] + words[0].length - 1, center[1]];
            const secondPlacement = placeWord(words[1], secondWordCoordinates, false, firstPlacement.board);


            const allCoordinates = new Set(
                firstPlacement.coordinates.
                    concat(secondPlacement.coordinates)
                    .filter((coordinate: number[], i: number, coordinates: number[][]) => {

                        const firstIndexOfCoordinate = coordinates.
                            findIndex(currentCoordinate =>
                                coordinate.toString() === currentCoordinate.toString());

                        return firstIndexOfCoordinate === i;
                    })
            );

            const coordinatesFoundByComputer = (new Computer(true, 1)).getAllFilledCoordinates(secondPlacement.board);

            expect(coordinatesFoundByComputer).toEqual(allCoordinates);
        });
    });

    describe(`#getMaximumHorizontalWordLength gets length of first coordinate + blank spaces`, () => {

        it(`until the last blank (if there's a word after the last blank)`, () => {

            const words = [getWord(3), getWord(3)];
            const coordinate = [[0, 7], [3, 7]];

            const firstPlacement = placeWord(words[0], coordinate[0], false);
            const secondPlacement = placeWord(words[1], coordinate[1], false, firstPlacement.board);

            const maximumLength = (new Computer(true, 1)).getMaximumHorizontalWordLength(secondPlacement.board, coordinate[0])


            const inclusiveCoordinateLength = coordinate[1][0] - coordinate[0][0];

            expect(maximumLength).toBe(inclusiveCoordinateLength - 1);
        });

        it(`goes until the edge of screen if needed`, () => {

            const word = getWord(3);
            const distanceFromEdge = 3;
            const coordinate = [+process.env.REACT_APP_BOARD_DIMENSIONS! - distanceFromEdge, 0];

            const firstPlacement = placeWord(word, coordinate, false);

            const maximumLength = (new Computer(true, 1)).
                getMaximumHorizontalWordLength(firstPlacement.board, coordinate);

            expect(maximumLength).toBe(distanceFromEdge);
        });

        it(`returns 0 if there's no blank spaces after`, () => {

            const word = getWord(3);
            const coordinate = [0, 0];

            const firstPlacement = placeWord(word, coordinate, true);

            const maximumLength = (new Computer(true, 1)).
                getMaximumHorizontalWordLength(firstPlacement.board, coordinate);

            expect(maximumLength).toBe(0);
        });
    });

    describe(`#orderDictionary`, () => {

        /**
         * Goes through the orderedDictionary calling `callback` on every word found
         *
         */
        function travelThroughOrderedDictionary(
            callback: (expectedLength: number, letter: string, word: string) => boolean
        ) {

            const orderedDictionary = (new Computer(true, 1)).orderDictionary();

            expect([...orderedDictionary.entries()].every(([expectedLength, mapOfSetsOfWords]) =>

                [...mapOfSetsOfWords.entries()].every(([letter, setOfWords]) =>

                    [...setOfWords].every(word =>
                        callback(expectedLength, letter, word)
                    )
                )
            )).toBeTruthy();
        }

        it(`every word in Set starts with the letter that is its key`, () => {

            travelThroughOrderedDictionary((expectedLength: number, letter: string, word: string) =>
                word[0] === letter
            );
        });


        test(`word length matches its key`, () => {

            travelThroughOrderedDictionary((expectedLength: number, letter: string, word: string) =>
                word.length === expectedLength
            );
        });
    });

    describe(`#getHighestWord`, () => {

        it(`gets highest scoring when there's no powerups`, () => {

            const words = new Set<string>();
            const wordListArr = wordList as {} as string[];

            for (let i = 0; i < casual.integer(1, 10); i++) { // 10 is random
                words.add(wordListArr[i]);
            }

            const longestWord = wordListArr[wordListArr.length - 2].toUpperCase();
            words.add(longestWord);

            const longestWordPlaced = placeWord(longestWord, [0, 0]);
            const longestWordPoints = Word.tallyPoints(longestWordPlaced.board, longestWordPlaced.coordinates);

            const expectedHighestWord = {
                word: longestWord,
                points: longestWordPoints
            };

            const capitalizedWords = new Set<string>([...words].map(word => word.toUpperCase()));

            const { coordinates, board } = placeWord(longestWord[0], [0, 0]);
            const highestWord = (new Computer(true, 1))
                .getHighestWord(capitalizedWords, board, coordinates[0], casual.integer());

            expect(expectedHighestWord).toEqual(highestWord);
        });

        it(`gets highest scoring when there is powerups`, () => {

            const words = new Set<string>(['KL', 'HK']); // [5, 2] => 7, 12 OR [3, 5] => 8, 11
            const board = new Board();
            const startCoordinate = [0, 1];

            const tileInfo = new TileInfo();
            const powerup = new Powerup('letter', 2);
            tileInfo.powerup = powerup;
            board.set(startCoordinate, tileInfo);

            const highestWord = (new Computer(true, 1)).getHighestWord(words, board, startCoordinate, 1);

            expect(highestWord.word).toBe('KL');
        });
    });
});

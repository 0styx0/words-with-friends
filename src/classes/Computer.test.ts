import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import Computer from './Computer';
import * as wordList from 'word-list-json';
import * as casual from 'casual';
import Word from './Word';
import Board from './Board';
import TileInfo from './TileInfo';
import Powerup from './Powerup';
import visualizeBoard from '../test/helpers/board.visualize';

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

    fdescribe(`#getBorderingTileCoordinates`, () => {
        // note: 3 is a magic number in getWord

        /**
         * Places each word on the board at coordinate whose index matches the word's
         */
        function fillPlacements(words: string[], coordinates: number[][]) {

            const placements: typeof placeWordType[] = [];
            const placeWordType = placeWord('RANDOM', [0, 0]);

            words.forEach((word, i) =>
              placements.push(
                  placeWord(
                      words[i],
                      coordinates[i],
                      false,
                      i === 0 ? undefined : placements[i - 1].board
                  )
              )
            );

            return placements;
        }

        it(`returns the first left and rightmost coordinates`, () => {

            const words = [getWord(3), getWord(3), getWord(3), getWord(3)];
            const coordinates = [[0, 7], [3, 7], [9, 7], [12, 7]];

            const placements = fillPlacements(words, coordinates);

            const borderInfo = (new Computer(true, 1))
              .getBorderingTileCoordinates(placements[3].board, [6, 7]);

            // 3|6|9
            expect(borderInfo.leftmostFilledCoordinate).toEqual(coordinates[1]);
            expect(borderInfo.rightmostFilledCoordinate).toEqual(coordinates[2]);
        });

        it(`goes until the edge of screen if needed`, () => {

            const words = [getWord(3), getWord(3)];
            const coordinates = [[3, 0], [6, 0]];

            const placements = fillPlacements(words, coordinates);

            const borderInfo = (new Computer(true, 1))
              .getBorderingTileCoordinates(placements[1].board, coordinates[0]);

            expect(borderInfo.leftmostFilledCoordinate).toEqual([0, 0]);
            expect(borderInfo.rightmostFilledCoordinate).toEqual(coordinates[1]);
        });

        it(`*mostCoordinate *is* coordinate if *mostCoordinate is at the edge`, () => {

            const words = [getWord(3), getWord(3)];
            const coordinates = [[0, 7], [3, 7]];

            const placements = fillPlacements(words, coordinates);
            const borderInfo = (new Computer(true, 1))
              .getBorderingTileCoordinates(placements[1].board, coordinates[0]);

            expect(borderInfo.leftmostFilledCoordinate).toEqual(coordinates[0]);
            expect(borderInfo.rightmostFilledCoordinate).toEqual(coordinates[1]);
        });
    });

    fdescribe(`#orderDictionary`, () => {

        /**
         * Goes through the orderedDictionary calling `callback` on every word found
         *
         */
        function travelThroughOrderedDictionary(
            callback: (expectedLength: number, letter: string, index: number, word: string) => boolean
        ) {

            const orderedDictionary = (new Computer(true, 1)).orderDictionary();

            expect([...orderedDictionary.entries()].every(([expectedLength, mapByLetter]) =>

                [...mapByLetter.entries()].every(([letter, mapByIndex]) =>

                    [...mapByIndex.entries()].every(([index, wordSet]) =>

                        [...wordSet].every(word =>
                            callback(expectedLength, letter, index, word)
                        )
                    )
                )
            )).toBeTruthy();
        }

        test(`word length matches its key`, () => {

            travelThroughOrderedDictionary((expectedLength: number, letter: string, index: number, word: string) =>
                word.length === expectedLength
            );
        });

        it(`every word in Set has letter at index`, () => {

            travelThroughOrderedDictionary((expectedLength: number, letter: string, index: number, word: string) =>
                word[index] === letter
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

    describe(`#getPossibleWords`, () => {

        it(`finds all possible words that Computer.tiles can be`, () => {

            // TODO: write test
        });

        it(`accounts for dulplicate letters`, () => {

        });
    });

    describe(`#findHighestPossibleWord`, () => {

        it(`finds highest word horizontally`, () => {

            const coordinate = [7, 7];

            const firstPlacement = placeWord('VOR', coordinate, false);
            visualizeBoard(firstPlacement.board);

            const highestWord = (new Computer(true, 1)).findHighestPossibleWord(firstPlacement.board, 1);

            expect(highestWord).toEqual({
                word: 'VEX',
                points: 21
            });
        });

        it(`finds highest word vertically`, () => {

            // TODO: write test
        });

        it(`finds highest word when horizontal and vertical options`, () => {

            // TODO: write test
        });
    });
});

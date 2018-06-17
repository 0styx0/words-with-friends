import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import Computer from './Computer';
import * as wordList from 'word-list-json';
import * as casual from 'casual';
import Word from './Word';
import Board from './Board';
import TileInfo from './TileInfo';
import Powerup from './Powerup';
import Tilebag from './Tilebag';

/**
 * Places each word on the board at coordinate whose index matches the word's
 */
function fillPlacements(words: string[], coordinates: number[][]) {

    const placeWordType = placeWord('RANDOM', [0, 0]);
    const placements: typeof placeWordType[] = [];

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

function giveHandToComputer(tiles: {letter: string, points: number}[]) {

    const tilebag = new Tilebag();
    // can't set computer.tiles, so just giving it a tilebag with only the tiles I want
    tilebag.tiles = tiles;

    const computer = (new Computer(true, 1));
    computer.generateHand(tilebag);

    return computer;
}

const centerCoordinates =
  [+process.env.REACT_APP_CENTER_COORDINATE!, +process.env.REACT_APP_CENTER_COORDINATE!];

afterEach(() => {
    Computer.checkedByShift.clear();
});

describe(`Computer`, () => {

    describe(`#findAllTiles`, () => {

        // put down random words
        it(`finds all words`, () => {

            const words = [getWord(3)];
            const firstPlacement = placeWord(words[0], centerCoordinates, true);

            const lastLetterOfFirstWord = words[0][words[0].length - 1];

            do {
                words[1] = getWord();
            }
            while (words[1][0] !== lastLetterOfFirstWord);


            const secondWordCoordinates = [centerCoordinates[0] + words[0].length - 1, centerCoordinates[1]];
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

    describe(`#getBorderingTileCoordinates`, () => {
        // note: 3 is a magic number in getWord

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

        it(`returns coordinate for both *most if there is no bordering coordinate`, () => {

            const words = [getWord(3)];
            const coordinates = [[3, 7]];

            const placements = fillPlacements(words, coordinates);
            const borderInfo = (new Computer(true, 1))
              .getBorderingTileCoordinates(placements[0].board, coordinates[0]);

            expect(borderInfo.leftmostFilledCoordinate).toEqual([0, 7]);
            expect(borderInfo.rightmostFilledCoordinate).toEqual(
                [+process.env.REACT_APP_BOARD_DIMENSIONS!, 7]
            );
        });
    });

    describe(`#getMaximumWordLength`, () => {

        it(`gets correct length when coordinate is between two other filled ones`, () => {

            const words = [getWord(3), getWord(3), getWord(3)];
            const coordinates = [[3, 7], centerCoordinates, [11, 7]];

            const placements = fillPlacements(words, coordinates);

            const maximumLength = (new Computer(true, 1))
              .getMaximumWordLength(placements[2].board, coordinates[1]);

            expect(maximumLength).toBe(5);
        });

        it(`gets correct length when coordinate is at the edge`, () => {

            const words = [getWord(3), getWord(3)];
            const coordinates = [[0, 0], [3, 0]];

            const placements = fillPlacements(words, coordinates);

            const maximumLength = (new Computer(true, 1))
              .getMaximumWordLength(placements[1].board, coordinates[0]);

            expect(maximumLength).toBe(2);
        });
    });

    describe(`#orderDictionary`, () => {

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

        function setupWords(words: Set<String>, startCoordinate: number[]) {

            return new Set<{word: string, startCoordinate: number[]}>(
                [...words].map(word => ({
                    word: word.toUpperCase(),
                    startCoordinate
                }))
            );
        }

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
                points: longestWordPoints,
                startCoordinate: centerCoordinates,
                horizontal: false
            };

            const { coordinates, board } = placeWord(longestWord[0], centerCoordinates);

            const capitalizedWords = setupWords(words, coordinates[0]);

            const highestWord = (new Computer(true, 1))
                .getHighestWord(capitalizedWords, board, casual.integer());

            expect(highestWord[0]).toEqual(expectedHighestWord);
        });

        it(`gets highest scoring when there is powerups`, () => {

            const startCoordinate = centerCoordinates;
            const words = new Set<string>(['HO', 'OB']); // [3, 1], [1, 4] => [6, 1], [2, 4]
            const capitalizedWords = setupWords(words, startCoordinate);

            const board = new Board();

            const tileInfo = new TileInfo();
            const powerup = new Powerup('letter', 2);
            tileInfo.powerup = powerup;
            board.set(startCoordinate, tileInfo);

            const highestWord = (new Computer(true, 1)).getHighestWord(capitalizedWords, board, 1);

            expect(highestWord[0].word).toBe('HO');
        });
    });

    describe(`#getAllValidWords`, () => {

        it(`finds all possible words that Computer.tiles can be`, () => {

            // can't set computer.tiles, so just giving it a tilebag with only the tiles I want
            const tiles = [{letter: 'T'}, {letter: 'R'}, {letter: 'E'}, {letter: 'E'}];

            const computer = giveHandToComputer(tiles.map(tile => Object.assign(tile, {points: 0})));

            const validWords = computer.getAllValidWords('T', 0, 4);

            expect([...validWords].sort()).toEqual(['TREE', 'TETE', 'TRET', 'TEER'].sort());
        });

        it(`can search for words with a letter at any index`, () => {

            const tiles = [{letter: 'T'}, {letter: 'R'}, {letter: 'E'}, {letter: 'E'}];

            const computer = giveHandToComputer(tiles.map(tile => Object.assign(tile, {points: 0})));
            const validWords = computer.getAllValidWords('T', 2, 4);

            expect([...validWords].sort()).toEqual(['RETE', 'TETE'].sort());
        });
    });

    function fillHand(
        tiles: {letter: string, points: number}[] = [
            {letter: 'V', points: 10},
            {letter: 'T', points: 2},
            {letter: 'E', points: 2},
            {letter: 'X', points: 3}
        ]
    ) {

        const computer = giveHandToComputer(tiles);

        const coordinate = centerCoordinates;

        return {
            computer,
            coordinate
        };
    }

    describe(`#getHighestPossibleWord`, () => {

        function placeWordOnBoard(horizontally: boolean) {

            const { computer, coordinate } = fillHand();

            const firstPlacement = placeWord('VOR', coordinate, horizontally);

            const highestWord = computer.getHighestWord(
                 computer.getPossibleWords(firstPlacement.board), firstPlacement.board, 1
             );

            return {
                 highestWord,
                 expectedHighestWord: 'VEXT'
             };
        }

        it(`doesn't overwrite words`, () => {

            const computerTiles = [
                { letter: 'D', points: 1 },
                { letter: 'O', points: 1 },
            ];

            const { computer, coordinate } = fillHand(computerTiles);

            const firstPlacement = placeWord('ROW', coordinate, false);
            const secondPlacement = placeWord('MITS', [8, 8], true, firstPlacement.board, 3);
            const thirdPlacement = placeWord('ONISH', [8, 9], false, secondPlacement.board, 3);

            const highestWord = computer.getHighestWord(
                 computer.getPossibleWords(thirdPlacement.board), thirdPlacement.board, 2
             );

            // it was picking "MOD" and overwriting "MONISH" with "MODISH" before fixed
            expect(highestWord[0].word).toBe('HOD');
        });


          // possibly obsolete, or too lazy to redo test to fit new code
//        it(`doesn't create invalid side-effect words`, () => {

//             const computerTiles = [
//                 { letter: 'A', points: 1 },
//                 { letter: 'T', points: 1 },
//                 { letter: 'T', points: 1 },
//             ];

//             const { computer, coordinate } = fillHand(computerTiles);

//             const firstPlacement = placeWord('PEN', coordinate, false);
//             const secondPlacement = placeWord('RAM', [8, 7], true, firstPlacement.board, 2);
//             const thirdPlacement = placeWord('OST', [10, 8], false, secondPlacement.board, 3);

//             const highestWord = computer.getHighestWord(
//                  computer.getPossibleWords(thirdPlacement.board, 4), thirdPlacement.board, 4
//              );

//             expect(highestWord[0].word).toBe('NAT'); // it was picking "ATT" before I fixed it
//         });

        it(`does not use same letters in hand over`, () => {

            const computerTiles = [
                { letter: 'I', points: 100 },
                { letter: 'M', points: 100 },
                { letter: 'T', points: 1 },
            ];

            const { computer, coordinate } = fillHand(computerTiles);

            const firstPlacement = placeWord('LEND', coordinate, false);

            const highestWord = computer.getHighestWord(
                 computer.getPossibleWords(firstPlacement.board), firstPlacement.board, 1
             );

            // it was picking "EMMET" before I fixed it.
            // This test might be broken since update allowing placing of tile sanywhere
            expect(highestWord[0].word).toBe('MILT');
        });

        it(`gets best word vertically`, () => {

            const { highestWord, expectedHighestWord } = placeWordOnBoard(true);

            // if word is horizontal, computer must put vertical word
            // must change borderingCoordinates, then can tell in other functions whether x or y is changed
            expect(highestWord[0].word).toEqual(expectedHighestWord);
        });

        it(`finds highest word horizontally`, () => {

            const { highestWord, expectedHighestWord } = placeWordOnBoard(false);

            expect(highestWord[0].word).toEqual(expectedHighestWord);
        });

        it(`finds highest word when horizontal and vertical options`, () => {

            const { computer, coordinate } = fillHand();
            const firstPlacement = placeWord('ITEM', coordinate, true);
            const secondPlacement = placeWord('VY', [coordinate[0], coordinate[1] + 1], false, firstPlacement.board);

            const highestWord = computer.getHighestWord(
                computer.getPossibleWords(secondPlacement.board), secondPlacement.board, 1
            );

            expect(highestWord[0].word).toEqual('VEX');
        });
    });

    describe(`#play`, () => {

        /*
        // this test might be obsolete, since used before computer could could start word from anywhere
        it(`picks second highest word if first doesn't fit on board`, () => {

            const computerTiles = [
                { letter: 'M', points: 1 },
                { letter: 'E', points: 1 },
                { letter: 'V', points: 1 },
                { letter: 'E', points: 1 },
                { letter: 'S', points: 1 },
            ];

            const { computer } = fillHand(computerTiles);

            const firstPlacement = placeWord('FLAPS', [7, 6]);
            const secondPlacement = placeWord('HT', [10, 7], false, firstPlacement.board, 2);
            const thirdPlacement = placeWord('EEP', [11, 7], false, secondPlacement.board, 3);
            const fourthPlacement = placeWord('UB', [12, 9], true, thirdPlacement.board, 4);
            const fifthPlacement = placeWord('MUS', [12, 10], false, fourthPlacement.board, 5);
            const sixthPlacement = placeWord('RIBS', [9, 12], true, fifthPlacement.board, 5);
            const seventhPlacement = placeWord('ELT', centerCoordinates, false, sixthPlacement.board, 5);


            // const highestWord = computer.getHighestWord(
            //     computer.getPossibleWords(seventhPlacement.board, 6), seventhPlacement.board, 6
            // );

            const chosenWord = computer.play(seventhPlacement.board);

            // expect(highestWord[0].word).toBe('MEVES');
            expect(chosenWord!.word).toBe('MEM');
        });*/

        it (`passes when no word is found`, () => {

            const { computer, coordinate } = fillHand();

            const firstPlacement = placeWord('Q', coordinate);

            const chosenWord = computer.play(firstPlacement.board);

            expect(chosenWord).toBeUndefined();
        });


        // fit(`must place at least one tile`, () => {

        //     const computerTiles = [
        //         { letter: 'X', points: 1 },
        //         { letter: 'E', points: 1 },
        //         { letter: 'N', points: 1 },
        //         { letter: 'I', points: 1 },
        //         { letter: 'A', points: 1 },
        //         { letter: 'L', points: 1 },
        //     ];

        //     const { computer, coordinate } = fillHand(computerTiles);
        //     const firstPlacement = placeWord('XENIAL', coordinate);
        //     const secondPlacement = placeWord('XENIAL', coordinate, false, firstPlacement.board);

        //     const chosenWord = computer.play(secondPlacement.board);
        //     visualizeBoard(secondPlacement.board);
        //     visualizeBoard(getState().board);
        //     console.log(chosenWord);
        //     // TODO: write test
        // });
    });
});

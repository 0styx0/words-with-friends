import placeWord from '../../test/helpers/placeWord';
import getWord from '../../test/helpers/getWord';
import Validate from './Validate';
import TileInfo from './TileInfo';
import * as sinon from 'sinon';
import * as casual from 'casual';
import Board from './Board';

casual.define('upperLetter', () => casual.letter.toUpperCase());

const customCasual: typeof casual & { upperLetter: string } = casual;

describe('Validate', () => {

    type randomWordType = {
        validate: Validate;
        board: Board;
        tileInfos: TileInfo[];
        randomWord: string;
        startCoordinate: [number, number];
        coordinates: [number, number][];
    };

    /**
     * Generic stuff for setting up. Puts random word on board
     *
     * @param horizontal - if word should be placed horizontally or vertically
     */
    function setupRandomWord(
        horizontal: boolean = true,
        startCoordinate: [number, number] = [0, 0],
        boardMap?: Board
    ): randomWordType {

        const randomWord = getWord();

        const { board, tileInfos, coordinates } = placeWord(randomWord, startCoordinate, horizontal, boardMap);

        return {
            validate: new Validate(board),
            board,
            tileInfos,
            randomWord,
            startCoordinate,
            coordinates
        };
    }

    describe('#travel', () => {

        /**
         * Tests if it travels through coordinates that it's expected to
         *
         * @param horizontal - if word should be placed horizontally or vertically
         */
        function testCallbackControls(horizontal: boolean = true) {

            const { randomWord, startCoordinate, validate } = setupRandomWord(horizontal);

            const expectedCallbackTimes = customCasual.integer(
                1, Math.min(randomWord.length, +process.env.BOARD_DIMENSIONS!)
            );

            const spy = sinon.spy();

            const mock = (tileInfo: TileInfo, currentCoordinate: typeof startCoordinate) => {
                spy();
                return (horizontal) ?
                    currentCoordinate[1] < expectedCallbackTimes - 1 :
                    currentCoordinate[0] < expectedCallbackTimes - 1;
            };

            horizontal ?
                validate.travelHorizontally(startCoordinate, mock) :
                validate.travelVertically(startCoordinate, mock);

            expect(spy.callCount).toBe(expectedCallbackTimes);
        }

        /**
         * Tests that callback provided to travel* gets correct tile for spaces travelled on
         *
         * @param horizontal - if word should be placed horizontally or vertically
         */
        function testCallbackGetsCorrectTile(horizontal: boolean = true) {

            const { board, randomWord, startCoordinate, validate } = setupRandomWord(horizontal);

            const spy = sinon.spy();

            const mock = (tileInfo: TileInfo, currentCoordinate: typeof startCoordinate) => {

                spy();
                const expected = board.get(currentCoordinate);

                expect(tileInfo).toEqual(expected === undefined ? new TileInfo() : expected);
                return !!tileInfo.filled;
            };

            horizontal ?
                validate.travelHorizontally(startCoordinate, mock) :
                validate.travelVertically(startCoordinate, mock);

            expect(spy.callCount).toBe(randomWord.length + 1);
        }

        function testCanGoOppositeDirection(horizontal: boolean = true) {

            const { randomWord, startCoordinate, validate, tileInfos } = setupRandomWord(horizontal);

            const spy = sinon.spy();

            let i = randomWord.length - 1;
            const mock = (tileInfo: TileInfo, currentCoordinate: typeof startCoordinate) => {
                spy();

                tileInfos[i] ? expect(tileInfo).toEqual(tileInfos[i]) : expect(tileInfo).toEqual(new TileInfo());
                i--;
                return tileInfo.filled;
            };

            horizontal ?
                validate.travelHorizontally([startCoordinate[1], randomWord.length - 1], mock, false) :
                validate.travelVertically([randomWord.length - 1, startCoordinate[0]], mock, false);

            expect(spy.callCount).toBe(randomWord.length + 1);
        }

        describe('Horizontally', () => {

            it('stops if callback returns `false`', () => testCallbackControls());

            it('Puts proper tile into callback', () => testCallbackGetsCorrectTile());

            it('can go backwards', () => testCanGoOppositeDirection());
        });

        describe('Vertically', () => {

            it('stops if callback returns `false`', () => testCallbackControls(false));

            it('Puts proper tile into callback', () => testCallbackGetsCorrectTile(false));

            it('can go backwards', () => testCanGoOppositeDirection(false));
        });
    });

    describe('#getWords', () => {

        describe('gets full word when given a coordinate in the middle of a', () => {

            function runTest(horizontal: boolean = true) {

                const randomWord = getWord(3);

                const startCoordinate: [number, number] = [0, 0];
                const { board, tileInfos } = placeWord(randomWord, startCoordinate, horizontal);

                const validate = new Validate(board);

                const middleCoordinate: [number, number][] = horizontal ?
                    [[startCoordinate[1], 1]] :
                    [[1, startCoordinate[0]]];

                const words = validate.getWords(middleCoordinate);

                expect(words).toEqual([tileInfos]);
            }

            it('horizontal word', () => runTest());

            it('vertical word', () => runTest(false));
        });

        it('gets all words that connect directly to coordinates (perpendicularly)', () => {

            const firstPlacement = setupRandomWord();

            const secondWord = getWord();

            const secondWordCoordinates: [number, number] =
                [customCasual.integer(0, firstPlacement.randomWord.length - 1), firstPlacement.startCoordinate[1]];

            const secondPlacement = placeWord(secondWord, secondWordCoordinates, false, firstPlacement.board, 2);

            const validate = new Validate(secondPlacement.board);
            const actualTileInfos = validate.getWords(secondPlacement.coordinates);

            // replaces letter in the first word that was overwritten by the second word
            firstPlacement.tileInfos[secondWordCoordinates[0]] = secondPlacement.tileInfos[0];

            const expectedTileInfos = [
                firstPlacement.tileInfos,
                secondPlacement.tileInfos
            ];

            expect(actualTileInfos).toEqual(expect.arrayContaining(expectedTileInfos));
        });

        it('gets all words that connect directly to coordinates (parallel)', () => {

            const firstPlacement = setupRandomWord();

            const secondWord = getWord(firstPlacement.randomWord.length);

            const secondWordCoordinates: [number, number] =
                [firstPlacement.startCoordinate[0], firstPlacement.startCoordinate[1] + 1];

            const secondPlacement = placeWord(secondWord, secondWordCoordinates, true, firstPlacement.board, 2);

            const validate = new Validate(secondPlacement.board);
            const actualTileInfos = validate.getWords(secondPlacement.coordinates);

            const allExpectedTileInfoArrs = secondPlacement
                .tileInfos
                .reduce((accum: TileInfo[][], tileInfo, i) =>
                    accum.concat([[firstPlacement.tileInfos[i], tileInfo]])
                , [secondPlacement.tileInfos]);

            expect(actualTileInfos).toEqual(expect.arrayContaining(allExpectedTileInfoArrs));
        });
    });

    describe('#checkForCenterTile', () => {

        describe('returns false if', () => {

            it('center is not filled', () => {

                const placement = setupRandomWord();

                expect(placement.validate.checkForCenterTile(placement.startCoordinate)).toBeFalsy();
            });

            it(`tile doesn't connect to center`, () => {

                const centerPlacement = setupRandomWord(true, [7, 7]);
                const secondPlacement = setupRandomWord(true, [0, 0], centerPlacement.board);

                expect(secondPlacement.validate.checkForCenterTile(secondPlacement.startCoordinate)).toBeFalsy();
            });
        });

        describe('returns true if', () => {

            it('center is filled', () => {

                const placement = setupRandomWord(true, [7, 7]);

                expect(placement.validate.checkForCenterTile(placement.startCoordinate)).toBeTruthy();
            });

            it('word connects to a word that is in center', () => {

                const centerPlacement = setupRandomWord(true, [7, 7]);
                const secondPlacement = setupRandomWord(
                    false, [centerPlacement.randomWord.length, 7], centerPlacement.board
                );

                expect(secondPlacement.validate.checkForCenterTile(secondPlacement.startCoordinate)).toBeFalsy();
            });
        });
    });

    describe('#checkTilePlacementValidity', () => {

        describe('returns false if', () => {

            it('tiles are diagonal', () => {

                const wordCoordinates: [number, number][] = [[7, 7], [8, 8]];

                const firstLetter = placeWord(customCasual.upperLetter, wordCoordinates[0]);
                const secondLetter = placeWord(customCasual.upperLetter, wordCoordinates[1], true, firstLetter.board);

                const validate = new Validate(secondLetter.board);

                expect(validate.checkTilePlacementValidity(wordCoordinates)).toBeFalsy();
            });

            // can't have one tile attached to one word and another tile from that same turn attached
            // to a completely different word
            it('tiles are attached to to other (valid) words (in a valid manner)', () => {

                const coordinatesToTest: [number, number][] = [[7, 8], [8, 6]];
                const firstPlacement = setupRandomWord(true, [7, 7]);
                const secondPlacement = placeWord(
                    customCasual.upperLetter, coordinatesToTest[0], true, firstPlacement.board, 2
                );
                const thirdPlacement = placeWord(
                    customCasual.upperLetter, coordinatesToTest[1], true, secondPlacement.board, 2
                );

                const validate = new Validate(thirdPlacement.board);
                expect(validate.checkTilePlacementValidity(coordinatesToTest)).toBeFalsy();
            });
        });
    });

    describe('#validateWords', () => {

        function findWordStartingWithLetter(firstPlacement: randomWordType) {

            let placement;

            do {
                placement = setupRandomWord(true, firstPlacement.startCoordinate, firstPlacement.board);
            }
            while (placement.tileInfos[0].tile!.letter !== firstPlacement.tileInfos[0].tile!.letter);

            return placement;
        }

        describe('marks word as valid when', () => {

            it(`it's horizontal`, () => {

                const placement = setupRandomWord();
                const validate = new Validate(placement.board);

                expect(validate.validateWords(placement.coordinates)).toBeTruthy();
            });

            it(`it's vertical`, () => {

                const placement = setupRandomWord(false);
                const validate = new Validate(placement.board);

                expect(validate.validateWords(placement.coordinates)).toBeTruthy();
            });

            it('is connected to another word perpendicularly', () => {

                const firstPlacement = setupRandomWord(false);

                const secondPlacement = findWordStartingWithLetter(firstPlacement);

                const validate = new Validate(secondPlacement.board);
                expect(validate.validateWords(secondPlacement.coordinates)).toBeTruthy();
            });

            it('is connected to another word in parallel', () => {

                const firstPlacement = placeWord('AWE', [0, 0]);
                const secondPlacement = placeWord('RED', [0, 1], true, firstPlacement.board);

                const validate = new Validate(secondPlacement.board);
                expect(validate.validateWords(secondPlacement.coordinates)).toBeTruthy();
            });
        });

        describe('marks word as invalid when', () => {

            it(`it's not a real word`, () => {

                const firstPlacement = placeWord('QWRTYP', [0, 0]);

                const validate = new Validate(firstPlacement.board);
                expect(validate.validateWords(firstPlacement.coordinates)).toBeFalsy();
            });

            it('intersects a word, making that word invalid', () => {

                const firstPlacement = placeWord('AWE', [0, 0], false);
                const secondPlacement = placeWord('WAR', [0, 3], true, firstPlacement.board);

                const validate = new Validate(secondPlacement.board);
                expect(validate.validateWords(secondPlacement.coordinates)).toBeFalsy();
            });
        });
    });
});
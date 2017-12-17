import placeWord from '../../test/helpers/placeWord';
import getWord from '../../test/helpers/getWord';
import Validate from './Validate';
import TileInfo from './TileInfo';
import * as sinon from 'sinon';
import * as casual from 'casual';
import visualizeBoard from '../../test/helpers/board.visualize';

describe('Validate', () => {

    /**
     * Generic stuff for setting up. Puts random word on board
     *
     * @param horizontal - if word should be placed horizontally or vertically
     */
    function setupRandomWord(horizontal: boolean = true) {

        const randomWord = getWord();

        const startCoordinate: [number, number] = [0, 0];
        const { board, tileInfos } = placeWord(randomWord, startCoordinate, horizontal);

        return {
            validate: new Validate(board),
            board,
            tileInfos,
            randomWord,
            startCoordinate
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

            const expectedCallbackTimes = casual.integer(
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
                const expected = board.get(`${currentCoordinate[0]}, ${currentCoordinate[1]}`);

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
                [casual.integer(0, firstPlacement.randomWord.length - 1), firstPlacement.startCoordinate[1]];

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

            });

            it(`any tile doesn't connect to center`, () => {

            });
        });
    });

    describe('#validateWords', () => {

        describe('marks word as valid when', () => {

            it('it is an actual word', () => {

            });

            it(`it's horizontal`, () => {

            });

            it(`it's vertical`, () => {

            });

            it('is connected to another word perpendicularly', () => {

            });

            it('is connected to another word in parallel', () => {

            });

            it('is intersected by multiple perpendicular words', () => {

            });
        });

        describe('marks word as invalid when', () => {

            it(`it's not a real word`, () => {

            });

            it('intersects a word, making that word invalid', () => {

            });

            it(`isn't connected to the center`, () => {

            });

            it('is a real word, but random letters somewhere else on the board', () => {

            });
        });
    });
});
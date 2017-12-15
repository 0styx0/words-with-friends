import placeWord from '../../test/helpers/placeWord';
import getWord from '../../test/helpers/getWord';
import Validate from './Validate';
import TileInfo from './TileInfo';
import * as sinon from 'sinon';
import * as casual from 'casual';
import * as wordList from 'word-list-json';

describe('Validate', () => {

    describe('#travelHorizontally', () => {

        function setupRandomWord() {

            const randomWord = getWord();

            const startCoordinate: [number, number] = [0, 0];
            const { board, tileInfos } = placeWord(randomWord, startCoordinate);

            return {
                validate: new Validate(board),
                board,
                tileInfos,
                randomWord,
                startCoordinate
            };
        }

        it('stops if callback returns `false`', () => {

            const { randomWord, startCoordinate, validate } = setupRandomWord();

            const expectedCallbackTimes = casual.integer(
                0, Math.min(randomWord.length, +process.env.BOARD_DIMENSIONS!)
            );

            const spy = sinon.spy();

            const mock = (tileInfo: TileInfo, currentCoordinate: typeof startCoordinate) => {
                spy();
                return currentCoordinate[1] < expectedCallbackTimes - 1;
            };

            validate.travelHorizontally(startCoordinate, mock);

            expect(spy.callCount).toBe(expectedCallbackTimes);
        });

        it('Puts proper tile into callback', () => {

            const { board, randomWord, startCoordinate, validate } = setupRandomWord();

            const spy = sinon.spy();

            const mock = (tileInfo: TileInfo, currentCoordinate: typeof startCoordinate) => {

                spy();
                const expected = board.get(`${currentCoordinate[0]}, ${currentCoordinate[1]}`);

                expect(tileInfo).toEqual(expected);
                return !!tileInfo.filled;
            };

            validate.travelHorizontally(startCoordinate, mock);

            expect(spy.callCount).toBe(randomWord.length + 1);
        });

        it('can go backwards', () => {

            const { randomWord, startCoordinate, validate, tileInfos } = setupRandomWord();

            const spy = sinon.spy();

            let i = randomWord.length - 1;
            const mock = (tileInfo: TileInfo, currentCoordinate: typeof startCoordinate) => {
                spy();

                tileInfos[i] ? expect(tileInfo).toEqual(tileInfos[i]) : expect(tileInfo).toEqual(new TileInfo());
                i--;
                return tileInfo.filled;
            };

            validate.travelHorizontally([startCoordinate[1], randomWord.length - 1], mock, false);

            expect(spy.callCount).toBe(randomWord.length + 1);
        });
    });

    describe('#travelVertically', () => {

        it('stops if callback returns `false`', () => {

        });

        it('only travels in the line specified (nowhere else)', () => {

        });

        it('calls `callback` param on every space it comes across', () => {

        });

        it('can go down-up', () => {

        });

        it(`doesn't go past the bottom of the board`, () => {

        });

        it(`doesn't go past the top of the board (when up = false)`, () => {

        });
    });

    describe('#getWords', () => {

        it('gets full word when given a coordinate in the middle of a vertical word', () => {

        });

        it('gets full word when given a coordinate in the middle of a horizontal word', () => {

        });

        it('gets all words that connect directly to coordinates (perpendicularly)', () => {

        });

        it('gets all words that connect directly to coordinates (parallel)', () => {

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
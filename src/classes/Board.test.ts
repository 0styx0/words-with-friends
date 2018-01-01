import * as casual from 'casual';
import TileInfo from './TileInfo';
import { getState } from '../store';

describe('Board', () => {

    describe('#set and #get', () => {

        it('can use coordinates as array', () => {

            const board = getState().board;
            const coordinates = [casual.integer(), casual.integer()];
            const value = new TileInfo();

            value.place( // just to make it not generic
                {
                    points: casual.integer(),
                    letter: casual.letter
                },
                getState().Players[0],
                casual.integer()
            );

            board.set(coordinates, value);

            expect(board.get(coordinates)).toEqual(value);
        });
    });
});
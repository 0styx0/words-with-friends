import Board from './Board';
import * as casual from 'casual';
import TileInfo from './TileInfo';
import store, { defaultState } from '../store';

const state = () => (store.getState() as typeof defaultState);

describe('Board', () => {

    describe('#set and #get', () => {

        it('can use coordinates as array', () => {

            const board = state().board;
            const coordinates = [casual.integer(), casual.integer()];
            const value = new TileInfo();
            value.place({ points: casual.integer(), letter: casual.letter }); // just to make it not generic
            board.set(coordinates, value);

            expect(board.get(coordinates)).toEqual(value);
        });
    });
});
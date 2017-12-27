import initializeBoard from './initializeBoard';
import types from './types';
import Board from '../classes/Board';


describe('initializeBoard', () => {

    it('returns correct type and new Board', () => {

        expect(initializeBoard()).toEqual({
            type: types.INIT_BOARD,
            board: new Board()
        });
    });
});
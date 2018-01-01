import board from './board';
import BoardClass from '../classes/Board';
import types from '../actions/types';


describe('board', () => {

    describe('INIT_BOARD', () => {

        it('returns new Board', () => {

            const newBoard = board(undefined, {
                type: types.INIT_BOARD,
                board: new BoardClass()
            });

            expect(newBoard).toBeInstanceOf(BoardClass);
            expect(newBoard.size).toBe((+process.env.REACT_APP_BOARD_DIMENSIONS!) ** 2);

        });
    });

    describe('PLACE_TILE_ON_BOARD', () => {

        it('puts correct tile on board at proper coordinates', () => {


        });
    });

    describe('REMOVE_TILE_FROM_BOARD', () => {

        it('removes tile as coordinates given', () => {


        });
    });
});
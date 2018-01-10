import turn from './turn';
import types from '../actions/types';
import Tilebag from '../classes/Tilebag';
import Board from '../classes/Board';
import { getState } from '../store';

describe('turn', () => {

    describe('increment_turn', () => {

        it('increments turn', () => {

            const currentTurn = 0;

            const newTurn = turn(currentTurn, {
                type: types.INCREMENT_TURN,
                turn: currentTurn,
                Tilebag: new Tilebag(),
                Players: getState().Players
            });

            expect(newTurn).toBe(currentTurn + 1);
        });
    });

    describe('init_board', () => {

        it('returns 1', () => {

            const newTurn = turn(Math.random(), {
                type: types.INIT_BOARD,
                board: new Board(),
            });

            expect(newTurn).toBe(1);
        });
    });
});
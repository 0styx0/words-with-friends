import incrementTurn from './incrementTurn';
import * as casual from 'casual';
import types from './types';
import Tilebag from '../classes/Tilebag';


describe('incrementTurn', () => {

    it('should return INCREMENT_TURN type and currentTurn', () => {

        const turn = casual.integer();
        const tilebag = new Tilebag();

        expect(incrementTurn(turn, tilebag)).toEqual({
            type: types.INCREMENT_TURN,
            turn,
            Tilebag: tilebag
        });
    });
});
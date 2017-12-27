import incrementTurn from './incrementTurn';
import * as casual from 'casual';
import types from './types';


describe('incrementTurn', () => {

    it('should return INCREMENT_TURN type and currentTurn', () => {

        const turn = casual.integer();

        expect(incrementTurn(turn)).toEqual({
            type: types.INCREMENT_TURN,
            turn
        });
    });
});
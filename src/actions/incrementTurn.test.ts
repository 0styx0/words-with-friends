import * as casual from 'casual';

import Tilebag from '../classes/Tilebag';
import incrementTurn from './incrementTurn';
import types from './types';


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
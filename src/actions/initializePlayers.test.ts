import initializePlayers from './initializePlayers';
import types from './types';
import Tilebag from '../classes/Tilebag';
import mockMath from '../test/mocks/Math';

mockMath();

describe('initializePlayers', () => {

    it('returns correct action', () => {

        const tilebag = new Tilebag();

        expect(initializePlayers(tilebag)).toEqual({
            type: types.INIT_PLAYERS,
            Tilebag: tilebag
        });
    });
});
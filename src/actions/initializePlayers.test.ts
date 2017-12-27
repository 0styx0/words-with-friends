import initializePlayers from './initializePlayers';
import types from './types';


describe('initializePlayers', () => {

    it('returns correct action', () => {

        expect(initializePlayers()).toEqual({
            type: types.INIT_PLAYERS
        });
    });
});
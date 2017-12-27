import types from './types';
import store, { defaultState } from '../store';
import putTileInHand from './putTileInHand';


describe('putTileInHand', () => {

    it('returns type, tile, and Player', () => {

        const state = (store.getState() as typeof defaultState);

        const player = state.Players[0];
        const tile = state.Tilebag.getRandomTile(0);

        expect(putTileInHand(player, tile)).toEqual({
            type: types.PLACE_TILE_IN_HAND,
            Player: player,
            tile
        });
    });
});
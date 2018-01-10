import types from './types';
import store, { defaultState } from '../store';
import putTileInHand from './putTileInHand';


describe('putTileInHand', () => {

    it('returns type, tile, and Player', () => {

        const state = (store.getState() as typeof defaultState);

        const tile = state.Tilebag.getRandomTile(0);

        expect(putTileInHand(state.Players, tile)).toEqual({
            type: types.PLACE_TILE_IN_HAND,
            Players: state.Players,
            tile
        });
    });
});
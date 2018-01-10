import types from './types';
import store, { defaultState } from '../store';
import removeTileFromHand from './removeTileFromHand';

describe('removeTileFromHand', () => {

    it('returns player, tile', () => {

        const state = (store.getState() as typeof defaultState);
        const tile = state.Tilebag.getRandomTile(0);

        expect(removeTileFromHand(state.Players, tile)).toEqual({
            type: types.REMOVE_TILE_FROM_HAND,
            Players: state.Players,
            tile
        });

    });
});
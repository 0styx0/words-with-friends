import types from './types';
import store, { defaultState } from '../store';
import * as casual from 'casual';
import removeTileFromHand from './removeTileFromHand';

describe('removeTileFromHand', () => {

    it('returns player, tile', () => {

        const state = (store.getState() as typeof defaultState);
        const player = state.Players[0];
        const tile = state.Tilebag.getRandomTile(0);

        expect(removeTileFromHand(player, tile)).toEqual({
            type: types.REMOVE_TILE_FROM_HAND,
            Player: player,
            tile
        });

    });
});
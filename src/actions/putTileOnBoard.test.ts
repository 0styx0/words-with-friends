import types from './types';
import store, { defaultState } from '../store';
import putTileOnBoard from './putTileOnBoard';
import * as casual from 'casual';


describe('putTileOnBoard', () => {

    it('returns type, tile, and Player', () => {

        const state = (store.getState() as typeof defaultState);

        const coordinates = [casual.integer(), casual.integer()];
        const tile = state.Tilebag.getRandomTile(0);

        expect(putTileOnBoard(tile, coordinates)).toEqual({
            type: types.PLACE_TILE_ON_BOARD,
            tile,
            coordinates
        });
    });
});
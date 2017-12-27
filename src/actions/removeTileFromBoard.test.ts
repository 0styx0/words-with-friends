import removeTileFromBoard from './removeTileFromBoard';
import * as casual from 'casual';
import types from './types';


describe('removeTileFromBoard', () => {

    it('returns type, coordinates', () => {

        const coordinates = [casual.integer(), casual.integer()];

        expect(removeTileFromBoard(coordinates)).toEqual({
            type: types.REMOVE_TILE_FROM_BOARD,
            coordinates
        });
    });
});
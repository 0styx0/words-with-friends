import types from './types';
import { getState } from '../store';
import putTileOnBoard from './putTileOnBoard';
import * as casual from 'casual';


describe('putTileOnBoard', () => {

    it('returns type, tile, and Player', () => {

        const state = getState();

        const coordinates = [casual.integer(), casual.integer()];
        const tile = state.Tilebag.getRandomTile(0);
        const Player = state.Players.find(player => player.turn)!;
        const turn = state.turn;

        expect(putTileOnBoard(tile, coordinates, Player, turn)).toEqual({
            type: types.PLACE_TILE_ON_BOARD,
            tile,
            coordinates,
            currentPlayer: Player,
            currentTurn: turn
        });
    });
});
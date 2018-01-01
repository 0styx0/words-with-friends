import PlayerClass from '../classes/Player';
import Player from './Player';
import types from '../actions/types';
import Tilebag from '../classes/Tilebag';

describe('Player', () => {

    describe('PLACE_TILE_IN_HAND', () => {

        it(`places correct tile in player's hand`, () => {

            const player = new PlayerClass(true, 0);
            const tile = (new Tilebag()).getRandomTile(0);

            const playerWithTile = Player(player, {
                type: types.PLACE_TILE_IN_HAND,
                Player: player,
                tile
            });

            expect(playerWithTile.tiles).toEqual([tile]);
        });
    });

    describe('REMOVE_TILE_FROM_HAND', () => {

        it('removes correct tile from hand', () => {

            const player = new PlayerClass(true, 0);
            const tile = (new Tilebag()).getRandomTile(0);
            player.addTile(tile);

            const playerWithoutTile = Player(player, {
                type: types.REMOVE_TILE_FROM_HAND,
                Player: player,
                tile
            });

            expect(playerWithoutTile.tiles).toHaveLength(0);
        });
    });
});
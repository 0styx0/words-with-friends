import types from './types';
import Tile from '../interfaces/Tile';
import PlayerClass from '../classes/Player';

export default function removeTileFromHand(Player: PlayerClass, tile: Tile) {
    return {
        type: types.REMOVE_TILE_FROM_HAND,
        Player,
        tile
    };
}
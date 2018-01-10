import types from './types';
import Tile from '../interfaces/Tile';
import PlayerClass from '../classes/Player';

export default function putTileInHand(Players: PlayerClass[], tile: Tile) {
    return {
        type: types.PLACE_TILE_IN_HAND,
        tile,
        Players
    };
}
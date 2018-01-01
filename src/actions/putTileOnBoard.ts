import types from './types';
import Tile from '../interfaces/Tile';
import Player from '../classes/Player';

export default function putTileOnBoard(
    tile: Tile, coordinates: ReadonlyArray<number>, currentPlayer: Readonly<Player>, currentTurn: number
) {
    return {
        type: types.PLACE_TILE_ON_BOARD,
        tile,
        coordinates,
        currentPlayer,
        currentTurn
    };
}
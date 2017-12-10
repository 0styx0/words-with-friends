import types from './types';
import Tile from '../interfaces/Tile';

export default function putTileOnBoard(tile: Tile, coordinates: string) {
    return {
        type: types.PLACE_TILE,
        tile,
        coordinates
    };
}
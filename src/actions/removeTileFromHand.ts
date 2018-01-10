import types from './types';
import Tile from '../interfaces/Tile';
import PlayerClass from '../classes/Player';

export default function removeTileFromHand(Players: ReadonlyArray<Readonly<PlayerClass>>, tile: Tile) {
    return {
        type: types.REMOVE_TILE_FROM_HAND,
        Players,
        tile
    };
}
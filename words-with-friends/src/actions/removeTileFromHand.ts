import { Player as PlayerType } from './interfaces';
import types from './types';
import PlayerClass from '../classes/Player';
import Tile from '../interfaces/Tile';

export default function removeTileFromHand(Player: PlayerClass, tile: Tile): PlayerType {
    return {
        type: types.REMOVE_TILE_FROM_HAND,
        Player,
        tile
    };
}
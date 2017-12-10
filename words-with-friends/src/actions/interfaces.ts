import types from './types';
import PlayerClass from '../classes/Player';
import TileInfo from '../classes/TileInfo';
import Tile from '../interfaces/Tile';

export interface Turn {
    readonly type: types.INCREMENT_TURN;
    readonly turn: number;
}

export interface Players {
    readonly type: types.INIT_PLAYERS;
    readonly Players: PlayerClass[];
}

export interface Board {
    readonly type: types.INIT_BOARD;
    readonly board: Map<string, TileInfo>;
}

export interface PlaceTile {
    readonly type: types.PLACE_TILE;
    readonly tile: Tile;
    readonly coordinates: string;
}

export interface RemoveTile {
    readonly type: types.REMOVE_TILE;
    readonly coordinates: string;
}

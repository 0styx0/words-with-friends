import types from './types';
import PlayerClass from '../classes/Player';
import Tile from '../interfaces/Tile';
import BoardClass from '../classes/Board';

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
    readonly board: BoardClass;
}

export interface PlaceTileOnBoard {
    readonly type: types.PLACE_TILE_ON_BOARD;
    readonly tile: Tile;
    readonly coordinates: number[];
}

export interface RemoveTileFromBoard {
    readonly type: types.REMOVE_TILE_FROM_BOARD;
    readonly coordinates: number[];
}

export interface PlaceTileInHand {
    readonly type: types.PLACE_TILE_IN_HAND;
    readonly tile: Tile;
    readonly Player: PlayerClass;
}

export interface RemoveTileFromHand {
    readonly type: types.REMOVE_TILE_FROM_HAND;
    readonly tile: Tile;
    readonly Player: PlayerClass;
}

export interface ResetTilebag {
    readonly type: types.RESET_TILEBAG;
}

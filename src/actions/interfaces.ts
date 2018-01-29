import BoardClass from '../classes/Board';
import PlayerClass from '../classes/Player';
import Tilebag from '../classes/Tilebag';
import Tile from '../interfaces/Tile';
import types from './types';

export interface Turn {
    readonly type: types.INCREMENT_TURN;
    readonly turn: number;
    readonly Tilebag: Tilebag;
}

export interface Players {
    readonly type: types.INIT_PLAYERS;
    readonly Tilebag: Tilebag;
}

export interface Board {
    readonly type: types.INIT_BOARD;
    readonly board: BoardClass;
}

export interface PlaceTileOnBoard {
    readonly type: types.PLACE_TILE_ON_BOARD;
    readonly tile: Tile;
    readonly currentPlayer: PlayerClass;
    readonly coordinates: number[];
    readonly currentTurn: number;
}

export interface RemoveTileFromBoard {
    readonly type: types.REMOVE_TILE_FROM_BOARD;
    readonly coordinates: number[];
}

export interface ClearRecentStatusFromTiles {
    readonly type: types.CLEAR_RECENT_STATUS_FROM_BOARD;
    readonly recentlyPlacedCoordinates: ReadonlyArray<ReadonlyArray<number>>;
}

export interface PlaceTileInHand {
    readonly type: types.PLACE_TILE_IN_HAND;
    readonly tile: Readonly<Tile>;
}

export interface RemoveTileFromHand {
    readonly type: types.REMOVE_TILE_FROM_HAND;
    readonly tile: Tile;
}

export interface ResetTilebag {
    readonly type: types.RESET_TILEBAG;
}

export interface SetScore {
    readonly type: types.SET_SCORE;
    readonly score: number;
}

import types from './types';
import PlayerClass from '../classes/Player';
import TileInfo from '../classes/TileInfo';

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

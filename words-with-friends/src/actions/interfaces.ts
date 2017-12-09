import types from './types';

export interface Turn {
    readonly type: types.INCREMENT_TURN;
    readonly turn: number;
}

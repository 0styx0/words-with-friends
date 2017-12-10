import { Board } from './interfaces';
import types from './types';
import TileInfo from '../classes/TileInfo';

export default function initializeBoard(): Board {
    return {
        type: types.INIT_BOARD,
        board: new Map<string, TileInfo>()
    };
}
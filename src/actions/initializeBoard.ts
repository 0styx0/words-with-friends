import types from './types';
import BoardMap from '../classes/Board';
import { Board } from './interfaces';

export default function initializeBoard(): Board {
    return {
        type: types.INIT_BOARD,
        board: new BoardMap()
    };
}
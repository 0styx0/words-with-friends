import { Board } from './interfaces';
import types from './types';
import BoardMap from '../classes/Board';

export default function initializeBoard(): Board {
    return {
        type: types.INIT_BOARD,
        board: new BoardMap()
    };
}
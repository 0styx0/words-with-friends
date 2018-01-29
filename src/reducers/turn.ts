import { Board, Turn } from '../actions/interfaces';
import types from '../actions/types';

export default function turn(currentTurn: number = 1, action: Turn | Board) {

    switch (action.type) {

        case types.INCREMENT_TURN:
            return currentTurn + 1;
        case types.INIT_BOARD:
            return 1;
        default:
            return currentTurn;
    }
}
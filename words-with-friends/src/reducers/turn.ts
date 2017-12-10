import types from '../actions/types';
import { Turn, Board } from '../actions/interfaces';

export default function turn(currentTurn: number = 1, action: Turn | Board) {

    switch (action.type) {

        case types.INCREMENT_TURN:
            return action.turn + 1;
        case types.INIT_BOARD:
            return 1;
        default:
            return currentTurn;
    }
}
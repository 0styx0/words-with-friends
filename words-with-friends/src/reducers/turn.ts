import types from '../actions/types';
import { Turn } from '../actions/interfaces';

export default function turn(currentTurn: number = 1, action: Turn) {

    switch (action.type) {

        case types.INCREMENT_TURN:
            return action.turn + 1;

        default:
            return currentTurn;
    }
}
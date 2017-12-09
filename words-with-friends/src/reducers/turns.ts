import types from '../actions/types';
import { Turn } from '../actions/interfaces';
// import { defaultState } from '../store';

export default function turn(state: any = [], action: Turn) {
    console.log(state, action);
    if (action.type === types.INCREMENT_TURN) {
        return state;
    }

    return state;
}
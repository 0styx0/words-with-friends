import types from '../actions/types';
import * as actionTypes from '../actions/interfaces';
import { defaultState } from '../store';

export default function Player(
    state = {} as typeof defaultState,
    action: actionTypes.Player
) {

    switch (action.type) {
        case types.REMOVE_TILE_FROM_HAND:
            action.Player.removeTile(action.tile);
            return state;
        default:
            return state;
    }
}

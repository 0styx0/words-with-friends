import types from '../actions/types';
import * as actionTypes from '../actions/interfaces';
import { defaultState } from '../store';

export default function Players(
    Players = {} as typeof defaultState.Players,
    action: actionTypes.Turn | actionTypes.Players
) {

    switch (action.type) {

        case types.INIT_PLAYERS:

            const PlayersCopy = [...Players];
            PlayersCopy[0].turn = true;
            PlayersCopy.forEach(player => player.generateHand());

            return PlayersCopy;

        case types.INCREMENT_TURN:
            return [Players[1], Players[0]];
        default:
            return Players;
    }
}

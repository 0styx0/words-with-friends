import types from '../actions/types';
import * as actionTypes from '../actions/interfaces';
import { defaultState } from '../store';
import { cloneClassInstance } from './helpers';

export default function Players(
    Players = {} as typeof defaultState.Players,
    action: actionTypes.Turn | actionTypes.Players
) {

    switch (action.type) {

        case types.INCREMENT_TURN:
        case types.INIT_PLAYERS:

            const PlayersCopy = [...Players].map(cloneClassInstance);
            PlayersCopy.forEach(player => player.generateHand());
            PlayersCopy.forEach(player => player.turn = !player.turn);

            return PlayersCopy;

        default:
            return Players;
    }
}

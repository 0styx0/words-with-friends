import types from '../actions/types';
import * as actionTypes from '../actions/interfaces';
import { defaultState } from '../store';
import { cloneClassInstance } from './helpers';
import Player from '../classes/Player';

export default function Players(
    Players = {} as typeof defaultState.Players,
    action: actionTypes.Turn | actionTypes.Players
) {

    let PlayersCopy: Player[] = Array.isArray(Players) ? [...Players].map(cloneClassInstance) : [];

    switch (action.type) {

        case types.INCREMENT_TURN:

            PlayersCopy.forEach(player => player.turn = !player.turn);
        // tslint:disable-next-line:no-switch-case-fall-through
        case types.INIT_PLAYERS:

            return PlayersCopy.map((player, i) => {
                player.generateHand(action.Tilebag);
                return player;
            });
        default:
            return Players;
    }
}

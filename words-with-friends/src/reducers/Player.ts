import types from '../actions/types';
import * as actionTypes from '../actions/interfaces';
import { defaultState } from '../store';
import PlayerClass from '../classes/Player';
import Tile from '../interfaces/Tile';

export default function Player(
    state = {} as typeof defaultState,
    action: actionTypes.PlaceTileInHand | actionTypes.RemoveTileFromHand
) {

    switch (action.type) {

        case types.PLACE_TILE_IN_HAND:
            return addTile(action.Player, action.tile);
        case types.REMOVE_TILE_FROM_HAND:
            return removeTile(action.Player, action.tile);
        default:
            return state;
    }
}

function addTile(PlayerInstance: PlayerClass, tile: Tile) {

    const PlayerClone: PlayerClass =
        Object.assign(Object.create(Object.getPrototypeOf(PlayerInstance)), PlayerInstance);
    PlayerClone.addTile(tile);
    return PlayerClone;
}

function removeTile(PlayerInstance: PlayerClass, tile: Tile) {

    const PlayerClone: PlayerClass =
        Object.assign(Object.create(Object.getPrototypeOf(PlayerInstance)), PlayerInstance);
    PlayerClone.removeTile(tile);
    return PlayerClone;
}
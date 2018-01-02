import types from '../actions/types';
import * as actionTypes from '../actions/interfaces';
import PlayerClass from '../classes/Player';
import Tile from '../interfaces/Tile';
import { cloneClassInstance } from './helpers';

export default function Player(
    state: PlayerClass = {} as PlayerClass,
    action: actionTypes.PlaceTileInHand | actionTypes.RemoveTileFromHand | actionTypes.SetScore
): PlayerClass {

    switch (action.type) {

        case types.PLACE_TILE_IN_HAND:
            return addTile(action.Player, action.tile);
        case types.REMOVE_TILE_FROM_HAND:
            return removeTile(action.Player, action.tile);
        case types.SET_SCORE:
            return setScore(action.Player, action.score);
        default:
            return state;
    }
}

function addTile(PlayerInstance: Readonly<PlayerClass>, tile: Readonly<Tile>) {

    const PlayerClone: PlayerClass = cloneClassInstance(PlayerInstance);
    PlayerClone.addTile(tile);
    return PlayerClone;
}

function removeTile(PlayerInstance: Readonly<PlayerClass>, tile: Readonly<Tile>) {

    const PlayerClone: PlayerClass = cloneClassInstance(PlayerInstance);
    PlayerClone.removeTile(tile);
    return PlayerClone;
}

function setScore(PlayerInstance: Readonly<PlayerClass>, score: number) {

    const PlayerClone: PlayerClass = cloneClassInstance(PlayerInstance);
    PlayerClone.score += score;
    return PlayerClone;
}
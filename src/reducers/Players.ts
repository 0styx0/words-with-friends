import * as actionTypes from '../actions/interfaces';
import types from '../actions/types';
import Player from '../classes/Player';
import Tile from '../interfaces/Tile';
import { defaultState } from '../store';
import Computer from '../classes/Computer';

export default function Players(
    PlayersClass: Player[] = [] as typeof defaultState.Players,
    action: actionTypes.Turn | actionTypes.Players | actionTypes.PlaceTileInHand | actionTypes.RemoveTileFromHand |
        actionTypes.SetScore

): ReadonlyArray<Readonly<Player>> {

    let PlayersCopy: Player[] = PlayersClass;
    let currentPlayer: Player = PlayersClass[0];

    if (Array.isArray(PlayersCopy)) {

        PlayersCopy = [...PlayersCopy].map(player => player.clone());
        currentPlayer = PlayersCopy.find(player => player.turn)!;
    }

    switch (action.type) {

        case types.INCREMENT_TURN:

            PlayersCopy.forEach(player => player.turn = !player.turn);
        // tslint:disable-next-line:no-switch-case-fall-through
        case types.INIT_PLAYERS:

            if (PlayersCopy[0].score < 1 && confirm('PvC?')) {
                PlayersCopy[1] = new Computer(false, 1);
            }

            return PlayersCopy.map((player, i) => {
                player.generateHand(action.Tilebag);
                return player;
            });

        case types.PLACE_TILE_IN_HAND:
            return combinePlayers(PlayersCopy, addTile(currentPlayer, action.tile));
        case types.REMOVE_TILE_FROM_HAND:
            return combinePlayers(PlayersCopy, removeTile(currentPlayer, action.tile));
        case types.SET_SCORE:
            return combinePlayers(PlayersCopy, setScore(currentPlayer, action.score));
        default:
            return PlayersClass;
    }
}

/**
 *
 * @param players - Array of players, as in action.Players
 * @param currentPlayer - the player whose turn it is
 *
 * @return array of [currentPlayer, notCurrentPlayer]
 */
function combinePlayers(players: ReadonlyArray<Readonly<Player>>, currentPlayer: Readonly<Player>) {

    const combination = [];

    const nonCurrentTurnPlayer = players.find(player => !player.turn)!;
    combination[nonCurrentTurnPlayer.playerIndex] = nonCurrentTurnPlayer;
    combination[currentPlayer.playerIndex] = currentPlayer;

    return combination;
}

function addTile(PlayerInstance: Readonly<Player>, tile: Readonly<Tile>) {

    const PlayerClone = PlayerInstance.clone();
    PlayerClone.addTile(tile);
    return PlayerClone;
}

function removeTile(PlayerInstance: Readonly<Player>, tile: Readonly<Tile>) {

    const PlayerClone = PlayerInstance.clone();
    PlayerClone.removeTile(tile);
    return PlayerClone;
}

function setScore(PlayerInstance: Readonly<Player>, score: number) {

    const PlayerClone = PlayerInstance.clone();
    PlayerClone.score += score;
    return PlayerClone as Readonly<Player>;
}

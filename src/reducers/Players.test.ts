import types from '../actions/types';
import Player from '../classes/Player';
import Tilebag from '../classes/Tilebag';
import Players from './Players';

describe('Players', () => {

    describe('switch turns when turn is incremented', () => {

        it('correctly', () => {

            const players = [new Player(true, 0), new Player(false, 1)];

            const newPlayers = Players(players, {
                type: types.INCREMENT_TURN,
                turn: 0,
                Tilebag: new Tilebag()
            });

            expect(newPlayers[0].turn).toBeFalsy();
            expect(newPlayers[1].turn).toBeTruthy();
        });
    });

    describe('initialization', () => {

        it('generates hand for both Players', () => {

            const players = [new Player(true, 0), new Player(false, 1)];

            expect(players.every(player => !!player.tiles.length)).toBeFalsy();

            const newPlayers = Players(players, {
                type: types.INIT_PLAYERS,
                Tilebag: new Tilebag()
            });

            expect(newPlayers.every(player => player.tiles.length === 7)).toBeTruthy();
        });
    });
});

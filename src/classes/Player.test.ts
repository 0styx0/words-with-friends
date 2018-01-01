import * as casual from 'casual';
import store, { defaultState, getState } from '../store';
import Player from './Player';
import Tile from '../interfaces/Tile';

const state = () => (store.getState() as typeof defaultState);

describe('Player', () => {

    function resetHand(player: Player) {

        while (player.tiles.length) {
            player.removeTile(player.tiles[0]);
        }

        expect(player.tiles).toHaveLength(0);
        return player;
    }

    describe('#generateHand', () => {

        it('puts 7 tiles in .tiles', () => {

            const player = resetHand(state().Players[0]);

            player.generateHand(getState().Tilebag);

            expect(player.tiles).toHaveLength(7);
        });

        it('adds however many tiles are needed to get to 7 tiles', () => {

            const player = resetHand(state().Players[0]);

            const initialTiles = casual.integer(1, 7);

            for (let i = 0; i < initialTiles; i++) {
                player.addTile(state().Tilebag.getRandomTile(0));
            }

            expect(player.tiles).toHaveLength(initialTiles);

            player.generateHand(getState().Tilebag);

            expect(player.tiles).toHaveLength(7);
        });

        it(`doesn't loop forever if no tiles left in tilebag (and so can't get to 7)`, () => {

            while (state().Tilebag.tiles.length) {
                state().Tilebag.getRandomTile(1);
            }

            const player = resetHand(state().Players[0]);

            player.generateHand(getState().Tilebag);

            expect(player.tiles).toHaveLength(0);
        });
    });

    describe('#removeTile', () => {

        beforeEach(() => store.dispatch({ type: 'RESET_TILEBAG' }));

        it('takes away tile specified', () => {

            const player = state().Players[0];
            player.generateHand(getState().Tilebag);

            expect(player.tiles).toHaveLength(7);

            const tileCopy: Tile[] = JSON.parse(JSON.stringify(player.tiles));
            tileCopy.shift();

            player.removeTile(player.tiles[0]);

            expect(player.tiles).toEqual(tileCopy);
        });

        it('does nothing if tile not in hand', () => {

            const player = state().Players[0];
            player.generateHand(getState().Tilebag);

            player.removeTile({ points: -1, letter: '%' });

            expect(player.tiles).toHaveLength(7);
        });
    });

    describe('#addTile', () => {

        beforeEach(() => store.dispatch({ type: 'RESET_TILEBAG' }));

        it('add tile to hand', () => {

            const player = resetHand(state().Players[0]);

            const newTile = state().Tilebag.getRandomTile(0);

            player.addTile(newTile);

            expect(player.tiles).toEqual([newTile]);
        });

        it(`sets playerIndex to player's index`, () => {

            const player = resetHand(state().Players[0]);

            const playerIndex = 0;
            const newTile = state().Tilebag.getRandomTile(playerIndex);

            player.addTile(newTile);
            expect(player.tiles[0].playerIndex).toBe(playerIndex);
        });
    });
});
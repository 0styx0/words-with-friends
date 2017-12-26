import * as casual from 'casual';
import store, { defaultState } from '../store';
import Player from './Player';

describe('Player', () => {

    const state = (store.getState() as typeof defaultState);

    describe('#generateHand', () => {

        function resetHand(player: Player) {

            while (player.tiles.length) {
                player.removeTile(player.tiles[0]);
            }

            expect(player.tiles).toHaveLength(0);
            return player;
        }
        it('puts 7 tiles in .tiles', () => {

            const player = resetHand(state.Players[0]);

            player.generateHand();

            expect(player.tiles).toHaveLength(7);
        });

        it('adds however many tiles are needed to get to 7 tiles', () => {

            const player = resetHand(state.Players[0]);

            const initialTiles = casual.integer(1, 7);

            for (let i = 0; i < initialTiles; i++) {
                player.addTile(state.Tilebag.getRandomTile(0));
            }

            expect(player.tiles).toHaveLength(initialTiles);

            player.generateHand();

            expect(player.tiles).toHaveLength(7);
        });

        it(`doesn't loop forever if no tiles left in tilebag (and so can't get to 7)`, () => {

            while (state.Tilebag.tiles.length) {
                state.Tilebag.getRandomTile(1);
            }

            const player = resetHand(state.Players[0]);

            player.generateHand();

            expect(player.tiles).toHaveLength(0);
        });
    });

    describe('#removeTile', () => {

        it('takes away tile specified', () => {


        });

        it('does nothing if tile not in hand', () => {


        });
    });

    describe('#addTile', () => {

        it('add tile to hand', () => {


        });

        it(`sets playerIndex to player's index`, () => {


        });
    });
});
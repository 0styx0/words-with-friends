import Tilebag from './Tilebag';
import * as casual from 'casual';

describe('Tilebag', () => {

    describe('constructor', () => {

        it('filled up .tiles with `alphabet`, adding each letter `alphabet.$letter.amount` times', () => {

            const tileBag = new Tilebag();

            const tileAmounts = tileBag.tiles.reduce((
                tileCounter: Map<string, number> = new Map<string, number>(), tile
            ) => {

                const currentAmountOfTileFound = tileCounter.get(tile.letter) || 0;

                return tileCounter.set(tile.letter, currentAmountOfTileFound + 1);
            }, new Map<string, number>())!;

            const tileAmountMatchesExpected =
                Array.from(Tilebag.alphabet).every(tile => tile.amount === tileAmounts.get(tile.letter));

            expect(tileAmountMatchesExpected).toBeTruthy();
        });
    });

    describe('#getRandomTile', () => {

        it('returns a copy of tile', () => {

            const tileBag = new Tilebag();
            const randomLetter = casual.string;

            const tile = tileBag.getRandomTile(casual.integer());
            tile.letter = randomLetter;

            expect(tileBag.tiles.find(currentTile => currentTile.letter === randomLetter)).toBeFalsy();
        });

        it('removes tile returned from .tiles', () => {

            const tileBag = new Tilebag();

            const tile = tileBag.getRandomTile(casual.integer());

            const initialLength = Array.from(Tilebag.alphabet).find(
                currentTile => currentTile.letter === tile.letter
            )!.amount;

            const lengthAfterGotten = tileBag.tiles.filter(
                currentTile => currentTile.letter === tile.letter
            ).length;

            expect(lengthAfterGotten).toBe(initialLength - 1);
        });

        it(`sets tile.playerIndex to index passed`, () => {

            const tileBag = new Tilebag();
            const randomNumber = casual.integer();

            const tile = tileBag.getRandomTile(randomNumber);

            expect(tile.playerIndex).toBe(randomNumber);
        });
    });
});

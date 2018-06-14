import * as casual from 'casual';
import TileInfo from './TileInfo';
import Board from './Board';
import Player from './Player';
import Powerup from './Powerup';

describe('Board', () => {

    function getTileInfo() {

        const value = new TileInfo();

        value.place(
            {
                points: casual.integer(),
                letter: casual.letter
            },
            new Player(true, 1),
            casual.integer()
        );

        return value;
    }

    describe('#set and #get', () => {

        it('can use coordinates as array', () => {

            const board = new Board();
            const coordinates = [casual.integer(), casual.integer()];
            const value = getTileInfo();

            board.set(coordinates, value);

            expect(board.get(coordinates)).toEqual(value);
        });
    });

    describe('#clone', () => {

        function cloneBoard() {

            const original = new Board();
            const coordinates = [casual.array_of_integers(), casual.array_of_integers()];

            coordinates.forEach(coordinate => original.set(coordinates[0], new TileInfo()));

            const clone = original.clone();

            return {
                original,
                clone,
                coordinates
            };
        }

        it('deep copies board', () => {

            const { clone, original, coordinates } = cloneBoard();

            coordinates.forEach(coordinate => expect(clone.get(coordinate)).toEqual(original.get(coordinate)));
        });

        it('does not change original board', () => {

            const { clone, original } = cloneBoard();

            const extraCoordinate = casual.array_of_integers();

            clone.set(extraCoordinate, new TileInfo());

            expect(original.get(extraCoordinate)).toBeUndefined();
        });

        it(`preserves tile powerups`, () => {

            const { original } = cloneBoard();
            const randomCoordinate = [0, 0];
            const tileInfoWithPowerup = getTileInfo();
            tileInfoWithPowerup.powerup = new Powerup('letter', 3);

            original.set(randomCoordinate, tileInfoWithPowerup);

            const clone = original.clone();

            expect(clone.get(randomCoordinate)).toEqual(tileInfoWithPowerup);
        });
    });
});

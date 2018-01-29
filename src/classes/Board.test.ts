import * as casual from 'casual';
import TileInfo from './TileInfo';
import Board from './Board';
import Player from './Player';

describe('Board', () => {

    describe('#set and #get', () => {

        it('can use coordinates as array', () => {

            const board = new Board();
            const coordinates = [casual.integer(), casual.integer()];
            const value = new TileInfo();

            value.place( // just to make it not generic
                {
                    points: casual.integer(),
                    letter: casual.letter
                },
                new Player(true, 1),
                casual.integer()
            );

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
    });
});
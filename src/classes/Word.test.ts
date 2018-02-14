import Word from './Word';
import Board from './Board';
import TileInfo from './TileInfo';
import placeWord from '../test/helpers/placeWord';
import getWord from '../test/helpers/getWord';
import * as casual from 'casual';
import Powerup from './Powerup';

describe(`Word`, () => {

    describe('#tallyPoints', () => {

        function addTileInfosToBoard(
            board: Board, tileInfos: ReadonlyArray<TileInfo>, coordinates: ReadonlyArray<ReadonlyArray<number>>
        ) {

            return tileInfos.reduce((boardMap, tileInfo, i) =>
                board.set(coordinates[i], tileInfo), board);
        }

        it('correctly tallies regular tiles', () => {

            const { board, coordinates, tileInfos } = placeWord(getWord(), [0, 0]);

            const unpoweredTileInfos = tileInfos.map(tileInfo => Object.assign(tileInfo, { powerup: undefined }));

            const boardWithTileInfos = addTileInfosToBoard(board, tileInfos, coordinates);

            const expectedPoints = unpoweredTileInfos.reduce((points, tileInfo) =>
                points + tileInfo.tile!.points, 0);

            expect(Word.tallyPoints(boardWithTileInfos, coordinates)).toBe(expectedPoints);
        });

        /**
         *
         * Makes board with random amount of powerups, each powerup which is random multiplier
         *
         * @param type - type of powerup to give letters. No other powerup type will be used
         */
        function createBoardWithPowerups(
            type: Readonly<'word' | 'letter'>, startCoordinate: ReadonlyArray<number> = [0, 0]
        ) {

            const { board, coordinates, tileInfos } = placeWord(getWord(), startCoordinate);
            const wordMultipliers = casual.array_of_integers(casual.integer(1, tileInfos.length));

            const tileInfosWithPowerups: ReadonlyArray<TileInfo> =
                tileInfos.map((tileInfo, i) => {

                    if (i < wordMultipliers.length) {
                        return Object.assign(tileInfo, { powerup: new Powerup(type, wordMultipliers[i]) });
                    } else {
                        const unpowered = Object.assign(tileInfo, { powerup: undefined });
                        return unpowered;
                    }
                });

            const boardWithPowerups = addTileInfosToBoard(board, tileInfos, coordinates);

            return {
                board: boardWithPowerups,
                tileInfos: tileInfosWithPowerups,
                coordinates,
                wordMultipliers
            };
        }

        test('word multipliers', () => {

            const { tileInfos, wordMultipliers, board, coordinates } =
                createBoardWithPowerups('word');

            const expectedPointsWithoutMultiplier = tileInfos.reduce((points, tileInfo) =>
                points + tileInfo.tile!.points, 0);

            const expectedPointsWithMultiplier = wordMultipliers.reduce((points, multiplyBy) =>
                points * multiplyBy, expectedPointsWithoutMultiplier);

            expect(Word.tallyPoints(board, coordinates)).toBe(expectedPointsWithMultiplier);
        });

        test('letter multipliers', () => {

            const { tileInfos, board, coordinates } =
                createBoardWithPowerups('letter');

            const expectedPoints = tileInfos.reduce((points, tileInfo) => tileInfo.calculateValue() + points, 0);

            expect(Word.tallyPoints(board, coordinates)).toBe(expectedPoints);
        });

        test('letter and word multipliers', () => {

            const wordMultipliers = createBoardWithPowerups('word');

            const lastWordCoordinate = wordMultipliers.coordinates[wordMultipliers.coordinates.length - 1];
            const letterMultipliers = createBoardWithPowerups(
                'letter', [lastWordCoordinate[0] + 1, lastWordCoordinate[1]]
            );

            const combinedTileInfos = wordMultipliers.tileInfos.concat(letterMultipliers.tileInfos);
            const combinedCoordinates = wordMultipliers.coordinates.concat(letterMultipliers.coordinates);

            const boardWithPowerups = addTileInfosToBoard(new Board(), combinedTileInfos, combinedCoordinates);

            const letterPoints = combinedTileInfos.reduce((points, tileInfo) => tileInfo.calculateValue() + points, 0);

            const totalExpectedPoints = combinedTileInfos.reduce((points, tileInfo) => {

                const wordMultiplier = (tileInfo.powerup && tileInfo.powerup.target === 'word') ?
                    tileInfo.powerup.multiplyBy :
                    1;

                return points * wordMultiplier;
            }, letterPoints);

            expect(Word.tallyPoints(boardWithPowerups, combinedCoordinates)).toBe(totalExpectedPoints);
        });
    });
});

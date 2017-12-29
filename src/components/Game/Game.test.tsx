import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ConnectedGame, { Game } from './Game';
import store, { defaultState } from '../../store';
import { Provider } from 'react-redux';
import mockMath from '../../test/mocks/Math';
import putTileOnBoard from '../../actions/putTileOnBoard';
import placeWord from '../../test/helpers/placeWord';
import { mount, ReactWrapper } from 'enzyme';
import Board from '../../classes/Board';
import getWord from '../../test/helpers/getWord';
import TileInfo from '../../classes/TileInfo';
import Powerup from '../../classes/Powerup';
import * as casual from 'casual';

mockMath();

describe('<Game />', () => {

    function setup() {

        return mount(
            <Provider store={store}>
                <ConnectedGame />
            </Provider>
        );
    }

    it('renders properly', () => {

        const tree = renderer.create(
            <Provider store={store}>
                <ConnectedGame />
            </Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    function addCoordinatesToStore(tileInfos: ReadonlyArray<TileInfo>, coordinates: number[][]) {

        for (let i = 0; i < tileInfos.length; i++) {
            store.dispatch(putTileOnBoard(tileInfos[i].tile!, coordinates[i]));
        }
    }

    describe('#turn', () => {

        /**
         * Click button to end turn and submit word
         */
        function play(wrapper: ReactWrapper) {

            const previousTurn = (store.getState() as typeof defaultState).turn;

            wrapper.find('#controls').simulate('click');

            const currentTurn = (store.getState() as typeof defaultState).turn;

            return {
                previousTurn,
                currentTurn
            };
        }

        test('turn is incremented after click and valid tile placement', () => {

            const wrapper = setup();

            const { tileInfos, coordinates } = placeWord(getWord(), [7, 7], true, new Board(), 1);

            addCoordinatesToStore(tileInfos, coordinates);

            const { previousTurn, currentTurn } = play(wrapper);

            expect(currentTurn).toBe(previousTurn + 1);
        });

        test('turn is not incremented after click if invalid tile placement', () => {

            const wrapper = setup();

            const { tileInfos, coordinates } = placeWord('A', [0, 0]);

            addCoordinatesToStore(tileInfos, coordinates);

            const { previousTurn, currentTurn } = play(wrapper);

            expect(currentTurn).toBe(previousTurn);
        });
    });

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

            const wrapper = setup();
            const component = wrapper.find(Game).instance() as Game;

            const boardWithTileInfos = addTileInfosToBoard(board, tileInfos, coordinates);

            const expectedPoints = unpoweredTileInfos.reduce((points, tileInfo) =>
                points + tileInfo.tile!.points, 0);

            expect(component.tallyPoints(boardWithTileInfos, coordinates)).toBe(expectedPoints);
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

            const wrapper = setup();
            const component = wrapper.find(Game).instance() as Game;

            const expectedPointsWithoutMultiplier = tileInfos.reduce((points, tileInfo) =>
                points + tileInfo.tile!.points, 0);

            const expectedPointsWithMultiplier = wordMultipliers.reduce((points, multiplyBy) =>
                points * multiplyBy, expectedPointsWithoutMultiplier);

            expect(component.tallyPoints(board, coordinates)).toBe(expectedPointsWithMultiplier);
        });

        test('letter multipliers', () => {

            const { tileInfos, board, coordinates } =
                createBoardWithPowerups('letter');

            const wrapper = setup();
            const component = wrapper.find(Game).instance() as Game;

            const expectedPoints = tileInfos.reduce((points, tileInfo) => tileInfo.calculateValue() + points, 0);

            expect(component.tallyPoints(board, coordinates)).toBe(expectedPoints);
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

            const wrapper = setup();
            const component = wrapper.find(Game).instance() as Game;

            expect(component.tallyPoints(boardWithPowerups, combinedCoordinates)).toBe(totalExpectedPoints);
        });
    });
});
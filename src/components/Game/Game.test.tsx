import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Game from './Game';
import store, { defaultState } from '../../store';
import { Provider } from 'react-redux';
import mockMath from '../../test/mocks/Math';
import putTileOnBoard from '../../actions/putTileOnBoard';
import placeWord from '../../test/helpers/placeWord';
import { mount } from 'enzyme';
import Board from '../../classes/Board';
import getWord from '../../test/helpers/getWord';
import TileInfo from '../../classes/TileInfo';

mockMath();

describe('<Game />', () => {

    it('renders properly', () => {

        const tree = renderer.create(
            <Provider store={store}>
                <Game />
            </Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    describe('#turn', () => {

        function setup() {

            return mount(
                <Provider store={store}>
                    <Game />
                </Provider>
            );
        }

        function addCoordinatesToStore(tileInfos: TileInfo[], coordinates: number[][]) {

            for (let i = 0; i < tileInfos.length; i++) {
                store.dispatch(putTileOnBoard(tileInfos[i].tile!, coordinates[i]));
            }
        }

        test('turn is incremented after click and valid tile placement', () => {

            const wrapper = setup();

            const { tileInfos, coordinates } = placeWord(getWord(), [7, 7], true, new Board(), 1);

            addCoordinatesToStore(tileInfos, coordinates);

            const currentTurn = (store.getState() as typeof defaultState).turn;

            wrapper.find('#controls').simulate('click');

            expect((store.getState() as typeof defaultState).turn).toBe(currentTurn + 1);
        });

        test('turn is not incremented after click if invalid tile placement', () => {

            const wrapper = setup();

            const { tileInfos, coordinates } = placeWord('A', [0, 0]);

            addCoordinatesToStore(tileInfos, coordinates);

            const currentTurn = (store.getState() as typeof defaultState).turn;

            wrapper.find('#controls').simulate('click');

            expect((store.getState() as typeof defaultState).turn).toBe(currentTurn);
        });
    });

    describe('#tallyPoints', () => {

        it('correctly tallies regular tiles', () => {

            //
        });

        test('word multipliers', () => {

            //
        });

        test('letter multipliers', () => {


        });

        test('letter and word multipliers', () => {


        });
    });
});
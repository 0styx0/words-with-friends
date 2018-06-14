import * as React from 'react';
import * as renderer from 'react-test-renderer';
import ConnectedTurn from './Turn';
import store, { defaultState } from '../../../store';
import { Provider } from 'react-redux';
import mockMath from '../../../test/mocks/Math';
import placeWord from '../../../test/helpers/placeWord';
import { mount, ReactWrapper } from 'enzyme';
import Board from '../../../classes/Board';
import getWord from '../../../test/helpers/getWord';
import addCoordinatesToStore from '../../../test/helpers/addCoordinatesToStore';

mockMath();

describe('<Turn />', () => {

    describe('render', () => {
        it('renders properly', () => {

            const tree = renderer.create(
                <Provider store={store}>
                    <ConnectedTurn />
                </Provider>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    function setup() {

        return mount(
            <Provider store={store} >
            <ConnectedTurn />
            </Provider>
        );
    }

    describe('#turn', () => {

        /**
         * Click button to end turn and submit word
         */
        function play(wrapper: ReactWrapper) {

            const previousTurn = (store.getState() as typeof defaultState).turn;

            wrapper.find('button').simulate('click');

            const currentTurn = (store.getState() as typeof defaultState).turn;

            return {
                previousTurn,
                currentTurn
            };
        }

        test('turn is incremented after click and valid tile placement', () => {

            const wrapper = setup();
            const centerCoordinates =
              [+process.env.REACT_APP_CENTER_COORDINATE!, +process.env.REACT_APP_CENTER_COORDINATE!];

            const { tileInfos, coordinates } = placeWord(getWord(), centerCoordinates, true, new Board(), 1);

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
});

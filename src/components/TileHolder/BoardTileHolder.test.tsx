import * as React from 'react';
import * as renderer from 'react-test-renderer';
import store, { getState } from '../../store';
import { Provider } from 'react-redux';
import BoardTileHolder, { BoardTileHolderContainer } from './BoardTileHolder';
import mockMath from '../../test/mocks/Math';
import { mount } from 'enzyme';
import putTileOnBoard from '../../actions/putTileOnBoard';
mockMath();

describe('<BoardTileHolder />', () => {

    describe('renders', () => {

        function snap(playerIndex: number) {

            const tree = renderer.create(
                <Provider store={store}>
                    <BoardTileHolder coordinates={[0, 0]} {...[] as any} />
                </Provider>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        }

        it(`correctly for current player's tile`, () => snap(0));

        it(`correctly for other player's tile`, () => snap(1));
    });

    function setup() {

        const coordinates = [0, 0];
        const wrapper = mount(

            <Provider store={store}>
                <BoardTileHolder Players={getState().Players} coordinates={coordinates} {...[] as any} />
            </Provider>
        );

        return {
            wrapper,
            component: wrapper.find(BoardTileHolderContainer).instance() as BoardTileHolderContainer,
            coordinates
        };
    }

    describe('#putTile', () => {

        it('adds tile to board', () => {

            const { component, coordinates } = setup();

            const currentCoordinateTile = getState().board.get(coordinates);

            expect(currentCoordinateTile).toBeFalsy();

            const newTile = getState().Tilebag.getRandomTile(0);

            component.putTile(newTile);

            const newCoordinateTile = getState().board.get(coordinates)!.tile;

            expect(newCoordinateTile).toEqual(newTile);
        });
    });

    describe('#removeTile', () => {

        it('removes tile as a prop', () => {

            const { component, coordinates } = setup();

            const initialTile = { points: -1, letter: 'invalid letter', playerIndex: 0 };

            const state = getState();
            store.dispatch(
                putTileOnBoard(initialTile, coordinates, state.Players, state.turn)
            );

            const currentCoordinateTile = getState().board.get(coordinates);

            expect(currentCoordinateTile).toBeTruthy();

            component.removeTile();

            const newCoordinateTile = getState().board.get(coordinates)!.tile;

            expect(newCoordinateTile).toBeFalsy();
        });
    });
});


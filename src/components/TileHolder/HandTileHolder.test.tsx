import * as React from 'react';
import * as renderer from 'react-test-renderer';
import store, { defaultState, getState } from '../../store';
import { Provider } from 'react-redux';
import HandTileHolder, { HandTileHolderContainer } from './HandTileHolder';
import mockMath from '../../test/mocks/Math';
import { mount } from 'enzyme';
import Tile from '../../interfaces/Tile';
mockMath();

describe('<HandTileHolder />', () => {

    describe('renders', () => {

        function snap(playerIndex: number) {

            const state = getState();

            const tree = renderer.create(
                <Provider store={store}>
                    <HandTileHolder tile={state.Tilebag.getRandomTile(playerIndex)} {...[] as any} />
                </Provider>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        }

        it(`correctly for current player's tile`, () => snap(0));

        it(`correctly for other player's tile`, () => snap(1));
    });

    function setup(tile: Tile = getState().Tilebag.getRandomTile(0)) {

        const wrapper = mount(

            <Provider store={store}>
                <HandTileHolder tile={tile} {...[] as any} />
            </Provider>
        );

        return {
            wrapper,
            component: wrapper.find(HandTileHolderContainer).instance() as HandTileHolderContainer
        };
    }

    describe('#putTile', () => {

        it('adds tile to hand', () => {

            const initialTile = { points: -1, letter: 'invalid letter', playerIndex: 0 };
            const { component } = setup(initialTile);

            const currentPlayerTiles = getState().Players.find(player => player.turn)!.tiles;

            expect(currentPlayerTiles).toHaveLength(0);
            expect(component.props.tile).toEqual(initialTile);

            const newTile = getState().Tilebag.getRandomTile(0);

            component.putTile(newTile);

            expect(currentPlayerTiles).toEqual([newTile]);
        });
    });

    describe('#removeTile', () => {

        it('removes tile as a prop', () => {

            const currentPlayerTiles = getState().Players.find(player => player.turn)!.tiles;
            expect(currentPlayerTiles).toHaveLength(1);

            const { component } = setup(currentPlayerTiles[0]);

            component.removeTile();

            const currentPlayerUpdatedTiles = getState().Players.find(player => player.turn)!.tiles;
            expect(currentPlayerUpdatedTiles).toHaveLength(0);
        });
    });
});
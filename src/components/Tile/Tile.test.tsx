import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as casual from 'casual';
import * as sinon from 'sinon';
import store, { defaultState, getState } from '../../store';
import { Provider } from 'react-redux';
import ConnectedTileContainer, { TileContainer } from './Tile';
import mathMock from '../../test/mocks/Math';
import { mount } from 'enzyme';
import putTileInHand from '../../actions/putTileInHand';
import incrementTurn from '../../actions/incrementTurn';
import Tilebag from '../../classes/Tilebag';

mathMock();

describe('<TileContainer />', () => {

    describe('renders correctly for', () => {

        function snap(playerIndex: number) {

            const state = getState() as typeof defaultState;

            const tree = renderer.create(
                <Provider store={store}>
                    <ConnectedTileContainer
                        coordinates={[casual.integer, casual.integer]}
                        tile={(new Tilebag()).getRandomTile(playerIndex)}
                        removeTile={sinon.mock}
                        {...state as any}
                    />
                </Provider>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        }

        it('current player', () => snap(0));

        it('non-current player', () => snap(1));
    });

    function setup(
        removeTile: Function = sinon.spy(),
        coordinates: ReadonlyArray<number> | undefined = [casual.integer(), casual.integer()]
    ) {

        const state = store.getState() as typeof defaultState;

        const wrapper = mount(
            <Provider store={store}>
                <ConnectedTileContainer
                    coordinates={coordinates}
                    tile={state.Tilebag.getRandomTile(0)}
                    {...state as any}
                    removeTile={removeTile}
                />
            </Provider>
        );

        return {
            wrapper,
            removeTile: removeTile as sinon.SinonSpy
        };
    }

    function drag() {

        const { wrapper } = setup();

        const dragEventMocks = {
            dataTransfer: {
                setData: sinon.mock(),
                dropEffect: ''
            }
        };

        wrapper.find(TileContainer).simulate('dragstart', dragEventMocks);

        return {
            wrapper,
            dragEventMocks,
            component: wrapper.find(TileContainer).instance()
        };
    }

    describe('#onDragStart', () => {

        it(`changes dropEffect to 'move' and sets data to stringified tile`, () => {

            const { dragEventMocks, component } = drag();

            expect(
                dragEventMocks
                    .dataTransfer
                    .setData.calledWith('tile', JSON.stringify(component.props.tile))
            ).toBeTruthy();

            expect(dragEventMocks.dataTransfer.dropEffect).toBe('move');
        });
    });

    describe('#onDragEnd', () => {

        it(`removes tile if dropEffect is 'move'`, () => {

            const { wrapper, removeTile } = setup();

            wrapper.find(TileContainer).simulate('dragend', { dataTransfer: { dropEffect: 'move' } });

            expect(removeTile.called).toBeTruthy();
        });

        it(`doesn't remove tile if dropEffect isn't 'move'`, () => {

            const { wrapper, removeTile } = setup();

            wrapper.find(TileContainer).simulate('dragend', { dataTransfer: { dropEffect: 'none' } });

            expect(removeTile.called).toBeFalsy();
        });
    });

    describe('#canDrag', () => {

        describe('returns true if', () => {

            it(`tile in current player's hand`, () => {

                const { wrapper } = setup(sinon.mock(), undefined);

                const component = wrapper.find(TileContainer).instance() as TileContainer;

                expect(component.canDrag()).toBeTruthy();
            });

            it('tile is on board but placed during current turn', () => {

                const coordinates: ReadonlyArray<number> = [casual.integer(), casual.integer()];

                const { wrapper } = setup(sinon.mock(), coordinates);

                const component = wrapper.find(TileContainer).instance() as TileContainer;

                expect(component.canDrag()).toBeTruthy();
            });
        });

        describe('return false if', () => {

            it(`tile in non-current player's hand`, () => {

                const { wrapper } = setup(sinon.mock(), undefined);
                const state = store.getState() as typeof defaultState;

                const component = wrapper.find(TileContainer).instance() as TileContainer;

                store.dispatch(putTileInHand(state.Players[1], component.props.tile));

                expect(component.canDrag()).toBeFalsy();
            });

            it('tile is on board and placed there during different turn', () => {

                const state = store.getState() as typeof defaultState;
                const coordinates: ReadonlyArray<number> = [casual.integer(), casual.integer()];

                const { wrapper } = setup(sinon.mock(), coordinates);

                store.dispatch(incrementTurn(state.turn, state.Tilebag));

                const component = wrapper.find(TileContainer).instance() as TileContainer;

                expect(component.canDrag()).toBeFalsy();
            });
        });
    });
});
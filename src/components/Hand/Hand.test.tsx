import * as React from 'react';
import Hand from './Hand';
import { Provider } from 'react-redux';
import store, { defaultState } from '../../store';
import * as renderer from 'react-test-renderer';
import removeTileFromHand from '../../actions/removeTileFromHand';


describe('<Hand />', () => {

    describe('renders 7 <HandTileHolder when Player has', () => {

        it('7 (max) tiles', () => {

            const tree = renderer.create(
                <Provider store={store}>
                    <Hand {...[] as any} playerIndex={0} />
                </Provider>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('less than 7 (max) tiles', () => {

            const state = store.getState() as typeof defaultState;

            store.dispatch(removeTileFromHand(state.Players, state.Players[0].tiles[0]));

            const tree = renderer.create(
                <Provider store={store}>
                    <Hand {...[] as any} playerIndex={0} />
                </Provider>
            ).toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

});
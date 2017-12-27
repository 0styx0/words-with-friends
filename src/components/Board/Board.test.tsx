import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Board from './Board';
import { Provider } from 'react-redux';
import store from '../../store';
import mockMath from '../../test/mocks/Math';
mockMath();

describe('Board', () => {

    it('renders correctly', () => {

        store.dispatch({
            type: 'INIT_BOARD'
        });

        const tree = renderer.create(
            <Provider store={store}>
                <Board />
            </Provider>).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
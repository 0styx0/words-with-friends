import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Game from './Game';
import store from '../../store';
import { Provider } from 'react-redux';
import mockMath from '../../test/mocks/Math';

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
});
import * as React from 'react';
import Controls from './Controls';
import * as renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import store from '../../store';

describe('<Controls />', () => {

    it('renders correctly', () => {

        const tree = renderer.create(
            <Provider store={store}>
                <Controls />
            </Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
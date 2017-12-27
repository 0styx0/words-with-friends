import * as React from 'react';
import Controls from './Controls';
import * as renderer from 'react-test-renderer';
import * as sinon from 'sinon';
import { mount } from 'enzyme';

describe('<Controls />', () => {

    it('renders correctly', () => {

        const turn = sinon.mock();

        const tree = renderer.create(
            <Controls turn={turn} />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('called props.turn when clicked', () => {

        const turn = sinon.spy();

        const wrapper = mount(<Controls turn={turn} />);
        wrapper.find('#controls').simulate('click');

        expect(turn.called).toBeTruthy();
    });
});
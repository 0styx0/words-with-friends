import * as React from 'react';
import Controls from './';

interface Props {
    turn: Function;
}

export default class ControlsContainer extends React.Component<Props, {}> {

    render() {
        return <Controls play={this.props.turn} />;
    }

}
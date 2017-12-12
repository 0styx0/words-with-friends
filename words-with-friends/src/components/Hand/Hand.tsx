import * as React from 'react';
import './index.css';
import Hand from './';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';
import Player from '../../classes/Player';

function mapStateToProps(state: typeof defaultState, props: {playerIndex: number}) {
    return {
        Player: state.Players[props.playerIndex],
        turn: state.turn // force refresh after turn
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}

type Props = typeof actionCreators & typeof defaultState & {
    Player: Player;
    playerIndex: number;
};

class HandContainer extends React.Component<Props, {}> {

    render() {

        return (
            <Hand
              key={this.props.turn}
              tiles={this.props.Player.tiles}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HandContainer as any);

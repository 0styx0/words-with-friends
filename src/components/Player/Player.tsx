import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';
import PlayerClass from '../../classes/Player';

function mapStateToProps(state: typeof defaultState, props: { playerIndex: number }) {
    return {
        Player: state.Players[props.playerIndex],
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}

type Props = typeof actionCreators & typeof defaultState & {
    readonly playerIndex: number;
    readonly Player: PlayerClass
};

export class PlayerContainer extends React.Component<Props, {}> {

    render() {

        return (
            <section>
                {this.props.Player.name}
                <br />
                Turn: {this.props.Player.turn ? 'Yes' : 'No'}
                <br />
                Points: {this.props.Player.score}
            </section>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerContainer as any);

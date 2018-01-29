import * as React from 'react';
import GameComponent from './';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';


function mapStateToProps(state: typeof defaultState) {
    return {
        turn: state.turn,
        Players: state.Players,
        board: state.board,
        Tilebag: state.Tilebag
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}


interface State {
    number: number;
}

type Props = typeof actionCreators & typeof defaultState;

export class Game extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            number: 0
        };

    }

    componentWillMount() {
        this.props.initializeBoard();
        this.props.initializePlayers(this.props.Tilebag);
    }

    render() {
        return <GameComponent />;
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Game as any);

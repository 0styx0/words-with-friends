import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import actionCreators from '../../../actions';
// import Computer from '../../../classes/Computer';
import notifyHelper from '../../../classes/notify.helper';
import Validate from '../../../classes/Validate';
import Word from '../../../classes/Word';
import { defaultState } from '../../../store';
import Turn from './';


function mapStateToProps(state: typeof defaultState) {
    return {
        turn: state.turn,
        board: state.board,
        Tilebag: state.Tilebag,
        Players: state.Players
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}

type Props = typeof actionCreators & typeof defaultState;

export class TurnContainer extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);

        this.turn = this.turn.bind(this);
    }

    render() {

        return <Turn turn={this.turn} />;
    }

    /**
     * If tiles were placed, checks their validity (@see Validate),
     *  gives player points (@see Word#tallyPoints) and changes turn
     */
    private turn() {

        const recentlyPlacedCoordinates = this.getTilesPlaced();
        // console.log((new Computer(true, 1).getAllTiles(this.props.board)));

        const validate = new Validate(this.props.board);

        if (!validate.checkTilePlacementValidity(recentlyPlacedCoordinates, this.props.turn)) {

            notifyHelper({ body: 'Tiles must be in a straight line and connected to the center' });

        } else if (recentlyPlacedCoordinates.length === 0) {

            notifyHelper({ body: 'No tiles have been placed' });

        } else if (!validate.validateWords(recentlyPlacedCoordinates)) {

            notifyHelper({ body: 'Invalid word(s)' });

        } else {

            this.props.clearRecentStatusFromBoard(recentlyPlacedCoordinates);

            this.props.setScore(
                Word.tallyPoints(this.props.board, recentlyPlacedCoordinates)
            );

            this.props.incrementTurn(this.props.turn, this.props.Tilebag);
        }
    }

    /**
     * @return tiles placed during most recent turn
     */
    private getTilesPlaced() {

        const recentlyPlacedCoordinates: number[][] = [];

        this.props.board.forEach((value, key: string) => {

            if (value.recent(this.props.turn)) {
                const numbers = key.match(/\d+/g)!;
                recentlyPlacedCoordinates.push([+numbers[0], +numbers[1]]);
            }
        });

        return recentlyPlacedCoordinates;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(TurnContainer as any);

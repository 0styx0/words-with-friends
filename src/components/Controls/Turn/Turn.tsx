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
import Board from '../../../classes/Board';


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

type Props = typeof actionCreators & typeof defaultState & { number: number };

export class TurnContainer extends React.Component<Props, {}> {

    constructor(props: Props) {
        super(props);

        this.turn = this.turn.bind(this);
    }

    render() {

        return <Turn number={this.props.turn} turn={this.turn} />;
    }

    /**
     * If tiles were placed, checks their validity (@see Validate),
     *  gives player points (@see Word#tallyPoints) and changes turn
     */
    private turn(computerJustWent: boolean) {

        // changing react state doesn't rerender fast enough so need to change DOM manually
        const playButton = document.getElementById('playButton') as HTMLButtonElement;
        playButton.disabled = true;

        const recentlyPlacedCoordinates = Board.getTilesPlaced(this.props.board, this.props.turn);

        const validate = new Validate(this.props.board);
        const currentPlayer = this.props.Players.find(player => player.turn)!;

        if (recentlyPlacedCoordinates.length === 0) {

            if (this.props.turn === 1) {

                playButton.disabled = false;
                // too much work to implement in Computer, I'm lazy
                return notifyHelper({ body: `${currentPlayer.name}: Cannot pass the first turn! `});
            }

            if (!computerJustWent && !confirm(`${currentPlayer.name}: Are you sure you want to pass?`)) {
                playButton.disabled = false;
                return;
            }

            notifyHelper({ body: `${currentPlayer.name}: Passed` });

        } else if (!validate.checkTilePlacementValidity(recentlyPlacedCoordinates, this.props.turn)) {

            playButton.disabled = false;

            return notifyHelper({
                body: `${currentPlayer.name}: Tiles must be in a straight line and connected to the center`
            });

        } else if (!validate.validateWords(recentlyPlacedCoordinates)) {

            playButton.disabled = false;
            return notifyHelper({ body: `${currentPlayer.name}: Invalid word(s)` });
        }

        this.props.clearRecentStatusFromBoard(recentlyPlacedCoordinates);

        this.props.setScore(
            Word.tallyPoints(this.props.board, recentlyPlacedCoordinates)
        );

        this.props.incrementTurn(this.props.turn, this.props.Tilebag);

        const computer: any = this.props.Players.find(player => 'orderedDictionary' in player)!;

        if (currentPlayer.tiles.length === 0) {

            playButton.disabled = true;

            alert(`${currentPlayer.name} has won the game!`);
            return;
        }

        if (computer && !computer.turn && !computerJustWent) {

            window.setTimeout(() => {

                computer.tilesCoordinatesPlacedLastTurn = recentlyPlacedCoordinates;
                computer.play(this.props.board);
                playButton.disabled = false;
                this.turn(true);

            }, 100);
        } else {
            playButton.disabled = false;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TurnContainer as any);

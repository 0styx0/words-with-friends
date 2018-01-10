import * as React from 'react';
import Turn from './';
import Validate from '../../../classes/Validate';
import TileInfo from '../../../classes/TileInfo';
import Board from '../../../classes/Board';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { defaultState } from '../../../store';
import actionCreators from '../../../actions';


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

    /**
     * Adds up points that a word is worth
     */
    tallyPoints(board: Board, recentlyPlacedCoordinates: number[][]) {

        const validate = new Validate(board);
        const words = validate.getWords(recentlyPlacedCoordinates);

        function calculateTileMultipliers(tileInfoWords: TileInfo[][]) {

            return tileInfoWords.reduce((accum: number, word) => {

                const wordMultipliers: number[] = [];

                const individualTilePoints = word.map(tile => {

                    if (tile.powerup && tile.powerup.target === 'word') {
                        wordMultipliers.push(tile.powerup.multiplyBy);
                    }

                    return tile.calculateValue();

                }).reduce((addedPoints, points) => addedPoints + points, 0);

                const total = wordMultipliers.reduce((multiplied, multiplier) =>
                    multiplier * multiplied, individualTilePoints);

                return accum + total;
            }, 0);
        }

        const totalPoints = calculateTileMultipliers(words);

        console.log('points earned', totalPoints);
        return totalPoints;
    }

    render() {

        return <Turn turn={this.turn} />;
    }

    /**
     * If tiles were placed, checks their validity (@see Validate),
     *  gives player points (@see #tallyPoints) and changes turn
     */
    private turn() {

        const recentlyPlacedCoordinates = this.getTilesPlaced();

        const validate = new Validate(this.props.board);

        if (recentlyPlacedCoordinates.length > 0 &&
            validate.checkTilePlacementValidity(recentlyPlacedCoordinates, this.props.turn) &&
            validate.validateWords(recentlyPlacedCoordinates)) {

            this.props.clearRecentStatusFromBoard(recentlyPlacedCoordinates);

            this.props.setScore(
                this.props.Players,
                this.tallyPoints(this.props.board, recentlyPlacedCoordinates)
            );

            this.props.incrementTurn(this.props.turn, this.props.Tilebag, this.props.Players);
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
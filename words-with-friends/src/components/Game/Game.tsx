import * as React from 'react';
import Validate from '../../classes/Validate';
import GameComponent from './';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import actionCreators from '../../actions';
import { defaultState } from '../../store';

function mapStateToProps(state: typeof defaultState) {
    return {
        turn: state.turn,
        Players: state.Players,
        board: state.board
    };
}

function mapDispatchToProps(dispatch: Dispatch<typeof defaultState>) {
    return bindActionCreators(actionCreators, dispatch);
}


interface State {
    number: number;
}

type Props = typeof actionCreators & typeof defaultState;

class Game extends React.Component<Props, State> {

    constructor() {
        super();

        this.turn = this.turn.bind(this);

        this.state = {
            number: 0
        };

    }

    componentWillMount() {
        this.props.initializeBoard();
        this.props.initializePlayers();
    }

    turn() {


        const recentlyPlacedCoordinates = this.getTilesPlaced();
        const validate = new Validate(this.props.board);

        if (recentlyPlacedCoordinates.length > 0 &&
            validate.checkTilePlacementValidity(recentlyPlacedCoordinates) &&
            validate.validateWords(recentlyPlacedCoordinates)) {

            (function unmarkRecentTiles(self: Game) {

                recentlyPlacedCoordinates.forEach(coordinate => {

                    const key = `${coordinate[0]}, ${coordinate[1]}`;
                    const value = self.props.board.get(key)!;
                    console.log(value);
                    value.recent = false;

                    self.props.board.set(key, value);
                });
            }(this));

            this.tallyPoints(recentlyPlacedCoordinates);

            this.props.incrementTurn(this.props.turn);

            // this.setHands();
        }
    }

    /**
     * Adds up points that a word is worth and adds that to the current user's total
     */
    tallyPoints(recentlyPlacedCoordinates: [number, number][]) {

        const validate = new Validate(this.props.board);
        const words = validate.getWords(recentlyPlacedCoordinates);

        function calculateTileMultipliers() {

            return words.reduce((accum: number, word) => {

                const wordMultipliers: number[] = [1];

                const individualTilePoints = word.
                    map(tile => {

                        if (tile.powerup && tile.powerup.target === 'word') {
                            wordMultipliers.push(tile.powerup.multiplyBy);
                        }

                        return tile.calculateValue();
                    })
                    .reduce((addedPoints, points) => addedPoints + points, 0);

                const total = wordMultipliers.reduce((multiplied, multiplier) =>
                    multiplier * multiplied, individualTilePoints);

                return accum + total;
            }, 0);
        }

        const totalPoints = calculateTileMultipliers();

        this.props.Players[this.props.turn % 2].score += totalPoints;

        console.log('points earned', totalPoints, 'new total', this.props.Players[this.props.turn % 2].score);
    }

    /**
     * @return tiles placed during most recent turn
     */
    getTilesPlaced() {

        const recentlyPlacedCoordinates: [number, number][] = [];

        this.props.board.forEach((value, key) => {

            if (value.recent) {

                const coordinates = key.split(', ');

                recentlyPlacedCoordinates.push([+coordinates[0], +coordinates[1]]);
            }
        });

        return recentlyPlacedCoordinates;
    }

    render() {
        return <GameComponent turn={this.turn} hands={this.props.Players.map(player => player.hand)} />;
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Game as any);

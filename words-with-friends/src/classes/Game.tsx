import * as React from 'react';
import HandContainer from '../components/Hand/Hand';
import Board from '../components/Board/Board';
import ControlsContainer from '../components/Controls/Controls';
import Player from './Player';
import TileInfo from '../interfaces/TileInfo';
import tilebag from '../services/tilebag';
import Validate from './Validate';
import './index.css';

interface State {
    number: number;
}

export default class Game extends React.Component<{}, State> {

    static Players: Player[] = [new Player(), new Player()];
    static turn = 1;
    static board = new Map<string, TileInfo>();

    constructor() {
        super();

        this.setHands = this.setHands.bind(this);
        this.turn = this.turn.bind(this);

        this.state = {
            number: 0
        };

    }

    componentWillMount() {

        Game.Players[0].turn = true;
        tilebag.init(); // move to somewhere else once get game mechanic workings
        this.setHands();
    }

    setHands() {

        // trying to put a hand in each player
        Game.Players = Game.Players.map((player, i) => {

            const className = (i === 1) ? 'rightHand' : '';

            player.hand = (<HandContainer key={i} className={className} canDrag={player.turn} /> as any);

            return player;
        });

        this.setState({
            number: this.state.number + 1
        });
    }

    turn() {

        const recentlyPlacedCoordinates = this.getTilesPlaced();
        const validate = new Validate(Game.board);

        if (recentlyPlacedCoordinates.length > 0 &&
            validate.checkTilePlacementValidity(recentlyPlacedCoordinates) &&
            validate.validateWords(recentlyPlacedCoordinates)) {

            Game.Players.forEach(player => {
                player.turn = !player.turn;
            });

            (function unmarkRecentTiles() {

                recentlyPlacedCoordinates.forEach(coordinate => {

                    const key = `${coordinate[0]}, ${coordinate[1]}`;
                    const value = Game.board.get(key)!;
                    value.recent = false;

                    Game.board.set(key, value);
                });
            }());

            this.tallyPoints(recentlyPlacedCoordinates);

            Game.turn++;

            this.setHands();
        }
    }

    /**
     * Adds up points that a word is worth and adds that to the current user's total
     */
    tallyPoints(recentlyPlacedCoordinates: [number, number][]) {

        const validate = new Validate(Game.board);
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

        Game.Players[Game.turn % 2].score += totalPoints;

        console.log('points earned', totalPoints, 'new total', Game.Players[Game.turn % 2].score);
    }

    /**
     * @return tiles placed during most recent turn
     */
    getTilesPlaced() {

        const recentlyPlacedCoordinates: [number, number][] = [];

        Game.board.forEach((value, key) => {

            if (value.recent) {

                const coordinates = key.split(', ');

                recentlyPlacedCoordinates.push([+coordinates[0], +coordinates[1]]);
            }
        });

        return recentlyPlacedCoordinates;
    }

    render() {

        return (
            <div id="gameContainer">
                {Game.Players[0].hand}
                <Board />
                {Game.Players[1].hand}
                <ControlsContainer turn={this.turn} />
            </div>
        );
    }
}
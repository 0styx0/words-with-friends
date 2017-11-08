import * as React from 'react';
import HandContainer from '../components/Hand/Hand';
import Board from '../components/Board/Board';
import ControlsContainer from '../components/Controls/Controls';
import Player from './Player';

interface State {
    number: number;
}

export default class Game extends React.Component<{}, State> {

    static Players: Player[] = [new Player(), new Player()];
    static turn = 1;
    static board = new Map<string, {
        filled: boolean,
        turnTileWasPlaced: number,
        recent: boolean
    }>();

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

        Game.Players.forEach(player => {
           player.turn = !player.turn;
        });

        Game.turn++;

        this.setHands();

        const recentlyPlacedCoordinates: [number, number][] = [];

        Game.board.forEach((value, key) => {

            Game.board.set(key, value);

            if (value.recent) {

                const coordinates = key.split(', ');

                recentlyPlacedCoordinates.push([+coordinates[0], +coordinates[1]]);
            }
        });

        this.checkTilePlacementValidity(recentlyPlacedCoordinates);
    }


    /**
     * Checks if tiles are placed in a valid manner (straight horizontal or vertical)
     *
     * @param coordinates - 2d array of coordinates of tiles. Must be left to right
     */
    checkTilePlacementValidity(coordinates: [number, number][]) {

        const validateVertically = (currentCoordinate: [number, number], indexOfCurrentCoordinate: number) => {

            const belowPreviousCoordinate = currentCoordinate[0] === coordinates[indexOfCurrentCoordinate - 1][0] + 1;
            const coordinateHasSameX = currentCoordinate[1] === coordinates[indexOfCurrentCoordinate - 1][1];

            return belowPreviousCoordinate && coordinateHasSameX;
        };

        const tilesArePlacedVertically = validateVertically(coordinates[1], 1);

        if (tilesArePlacedVertically) {

            for (let i = 1; i < coordinates.length; i++) {

                if (!validateVertically(coordinates[i], i)) {
                    return false;
                }
            }
        }

        return true;
    }

    render() {

        return (
            <div>
                {Game.Players[0].hand}
                <Board />
                {Game.Players[1].hand}
                <ControlsContainer turn={this.turn} />
            </div>
        );
    }
}
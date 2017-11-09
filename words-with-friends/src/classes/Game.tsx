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

        const recentlyPlacedCoordinates: [number, number][] = [];

        Game.board.forEach((value, key) => {

            if (value.recent) {

                const coordinates = key.split(', ');

                recentlyPlacedCoordinates.push([+coordinates[0], +coordinates[1]]);
            }
        });

        if (this.checkTilePlacementValidity(recentlyPlacedCoordinates)) {

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

            Game.turn++;

            this.setHands();
        }
    }


    /**
     * Checks if tiles are placed in a valid manner (straight horizontal or vertical)
     *
     * @param coordinates - 2d array of coordinates of tiles. Must be left to right
     */
    checkTilePlacementValidity(coordinates: [number, number][]) {

        /**
         * Checks if tile is directly under a tile of the previous coordinate
         */
        const validateVertically = (currentCoordinate: [number, number], indexOfCurrentCoordinate: number) => {

            const belowPreviousCoordinate = currentCoordinate[0] === coordinates[indexOfCurrentCoordinate - 1][0] + 1;
            const coordinateHasSameX = currentCoordinate[1] === coordinates[indexOfCurrentCoordinate - 1][1];

            return belowPreviousCoordinate && coordinateHasSameX;
        };

        /**
         * Checks if tile is directly to the right of a prevous tile
         */
        const validateHorizontally = (currentCoordinate: [number, number], indexOfCurrentCoordinate: number) => {

            const onSameLine = currentCoordinate[0] === coordinates[indexOfCurrentCoordinate - 1][0];
            const coordinateHasNextX = currentCoordinate[1] === coordinates[indexOfCurrentCoordinate - 1][1] + 1;

            return onSameLine && coordinateHasNextX;
        };

        const tilesArePlacedVertically = validateVertically(coordinates[1], 1);
        const tilesArePlacedHorizontally = validateHorizontally(coordinates[1], 1);

        if (!tilesArePlacedVertically && !tilesArePlacedHorizontally) {
            console.log('bad placement');
            return false;
        }

        for (let i = 1; i < coordinates.length; i++) {

            if (tilesArePlacedVertically && !validateVertically(coordinates[i], i)) {
                console.log('fail vertical');
                return false;
            }
            else if (tilesArePlacedHorizontally && !validateHorizontally(coordinates[i], i)) {
                console.log('fail horizontal');
                return false;
            }
        }

        console.log('pass');
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
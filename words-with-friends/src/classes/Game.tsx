import * as React from 'react';
import HandContainer from '../components/Hand/Hand';
import Board from '../components/Board/Board';
import ControlsContainer from '../components/Controls/Controls';
import Player from './Player';
import TileInfo from '../interfaces/TileInfo';
import tilebag from '../services/tilebag';
const dictionary = require('word-list-json'); // no @types file

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

            this.tallyPoints(recentlyPlacedCoordinates);

            Game.turn++;

            this.setHands();
        }
    }

    /**
     * Adds up points that a word is worth and adds that to the current user's total
     */
    tallyPoints(recentlyPlacedCoordinates: [number, number][]) {

        const wordMultipliers: number[] = [];

        function calculateTileMultipliers() {

            return recentlyPlacedCoordinates.reduce((accum: number, currentCoordinate) => {

                const tile = Game.board.get(`${currentCoordinate[0]}, ${currentCoordinate[1]}`)!;

                if (tile.powerup && tile.powerup.target === 'word') {
                    wordMultipliers.push(tile.powerup.multiplyBy);
                }

                return accum + tile.calculateValue();
            }, 0);
        }

        const tilePoints = calculateTileMultipliers();

        const totalPoints = wordMultipliers.reduce((accum: number, multiplier: number) =>
          accum * multiplier, tilePoints);

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


    /**
     * Checks if tiles are placed in a valid manner (straight horizontal or vertical)
     *
     * @param coordinates - 2d array of coordinates of tiles. Must be left to right
     */
    checkTilePlacementValidity(coordinates: [number, number][]) {

        if (!this.checkForCenterTile(coordinates[0])) {
            console.log('no center');
            return false;
        }

        /**
         * Travels validateVertically through the board, starting at firstCoordinate
         *
         * @param firstCoordinate - The first coordinate to start checking by
         *
         * @return boolean if all tiles in coordinates (param of checkTilePlacementValidity) is covered
         *  in the travels
         */
        const validateVertically = (firstCoordinate: [number, number]) => {

            let y = firstCoordinate[0]; // should keep going up
            const coordinatesNotTouched = [...coordinates];

            while (this.getTileInfo([y, firstCoordinate[1]]).filled) {

                const currentTileInfo = this.getTileInfo([y, firstCoordinate[1]]);

                if (currentTileInfo.recent) {

                    const recentCoordinateIdx = coordinatesNotTouched.findIndex((coordinate) =>
                      coordinate[0] === y && coordinate[1] === firstCoordinate[1]);

                    if (recentCoordinateIdx !== -1) {
                        coordinatesNotTouched.splice(recentCoordinateIdx, 1);
                    }
                }

                y++;
            }

            return !coordinatesNotTouched.length;
        };

        /**
         * Travels horizontally through the board, starting at firstCoordinate
         *
         * @param firstCoordinate - The first coordinate to start checking by
         *
         * @return boolean if all tiles in coordinates (param of checkTilePlacementValidity) is covered
         *  in the travels
         */
        const validateHorizontally = (firstCoordinate: [number, number]) => {

            let x = firstCoordinate[1]; // should keep going up
            const coordinatesNotTouched = [...coordinates];

            while (this.getTileInfo([firstCoordinate[0], x]).filled) {

                const currentTileInfo = this.getTileInfo([firstCoordinate[0], x]);

                if (currentTileInfo.recent) {

                    const recentCoordinateIdx = coordinatesNotTouched.findIndex((coordinate) =>
                      coordinate[1] === x && coordinate[0] === firstCoordinate[0]);

                    if (recentCoordinateIdx !== -1) {
                        coordinatesNotTouched.splice(recentCoordinateIdx, 1);
                    }
                }

                x++;
            }

            return !coordinatesNotTouched.length;
        };

        console.log('vertical', validateVertically(coordinates[0]), 'horizontal', validateHorizontally(coordinates[0]));
        return validateVertically(coordinates[0]) || validateHorizontally(coordinates[0]);
    }

    /**
     * Checks if recent tiles form valid words with all tiles it touches
     */
    validateWords(coordinates: [number, number][]) {

        /**
         * Given a coordinate, this checks if it's part of a valid vertical word
         */
        const validateVerticalWord = (coordinateToCheck: typeof coordinates[0]) => {

            /**
             * @return the y coordinate of the highest tile that connect to coordinateToCheck
             */
            const getHighestY = () => {

                let y = coordinateToCheck[0];

                while (this.getTileInfo([y, coordinateToCheck[1]]).filled) {
                    y--;
                }

                return y + 1;
            };

            /**
             * @return boolean if vertical word that starts at yCoordinateToStartAt is an actual word
             */
            const checkWord = (yCoordinateToStartAt: number) => {

                let y = yCoordinateToStartAt;
                let word = '';

                while (this.getTileInfo([y, coordinateToCheck[1]]).filled) {
                    word += this.getTileInfo([y, coordinateToCheck[1]]).tile!.letter;
                    y++;
                }
                console.log('word', word);

                return word.length === 1 || dictionary.includes(word.toLowerCase());
            };

            const highestY = getHighestY();
            return checkWord(highestY);
        };

        coordinates.forEach(coordinate => {
            console.log('vertical word is valid', validateVerticalWord(coordinate));
        });

    }

    getTileInfo(coordinates: [number, number]) {
        return Game.board.get(`${coordinates[0]}, ${coordinates[1]}`) || new TileInfo();
    }

    /**
     * Checks if center spot on board is filled (all tiles must emenate from center)
     */
    checkForCenterTile(currentCoordinates: [number, number]) {

        const centerCoordinates = '7, 7';

        const centerIsFilled = Game.board.get(centerCoordinates)!.filled;

        if (!centerIsFilled) {
            console.log('center not filled');
            return false;
        }

        const coordinatesTried = new Set<string>(); // so recursion in checkTileTree doesn't go on forever

        /**
         * Recursively checks all paths from `currentCoordinates` until it finds the center tile
         *
         * @return boolean if `currentCoordinates` somehow connects to the center of the board
         */
        function checkTileTree(coordinates: [number, number]): boolean {

            const key = `${coordinates[0]}, ${coordinates[1]}`;

            const space = Game.board.get(key);

            if (coordinates[0] === coordinates[1] && coordinates[0] === 7) {
                console.log('center is here');
                return true;
            }

            if (space && space.filled && !coordinatesTried.has(key)) {

                coordinatesTried.add(key);

                return checkTileTree([coordinates[0] + 1, coordinates[1]]) ||
                    checkTileTree([coordinates[0], coordinates[1] + 1]) ||
                    checkTileTree([coordinates[0] - 1, coordinates[1]]) ||
                    checkTileTree([coordinates[0], coordinates[1] - 1]);
            }

            return false;
        }

        return checkTileTree(currentCoordinates);
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
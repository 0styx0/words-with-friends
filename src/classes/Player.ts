import HandContainer from '../components/Hand/Hand';
import Tile from '../interfaces/Tile';
import Tilebag from './Tilebag';

export default class Player {

    name = '';
    turn = false;
    score = 0;
    hand: typeof HandContainer;
    private _tiles: Tile[] = [];
    private _playerIndex: number;

    constructor(turn: boolean, playerIndex: number) {
        this.turn = turn;
        this._playerIndex = playerIndex;
    }

    get tiles() {
        return this._tiles;
    }

    /**
     * Ensures player has 7 tiles (7 is b/c rules of the game)
     */
    generateHand(tilebag: Tilebag) {

        while (this._tiles.length < 7 && tilebag.tiles.length > 0) {

            const tile = tilebag.getRandomTile(this._playerIndex);
            tile.playerIndex = this._playerIndex;
            this._tiles.push(tile);
        }
    }

    removeTile(tile: Tile) {

        const positionOfTile = this._tiles.indexOf(tile);

        if (positionOfTile !== -1) {
            this._tiles.splice(positionOfTile, 1);
        }
    }

    addTile(tile: Tile) {
        tile.playerIndex = this._playerIndex;
        this._tiles.push(tile);
    }
}

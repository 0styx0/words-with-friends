import Tile from '../interfaces/Tile';
import Tilebag from './Tilebag';

export default class Player {

    name = '';
    turn = false;
    score = 0;
    private _tiles: Tile[] = [];
    private _playerIndex: number;

    constructor(turn: boolean, playerIndex: number) {
        this.turn = turn;
        this._playerIndex = playerIndex;
    }

    clone() {

        const playerClone = new Player(this.turn, this._playerIndex);

        return Object.assign(playerClone, {
            name: this.name,
            score: this.score,
            _tiles: JSON.parse(JSON.stringify(this._tiles))
        });
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

        const positionOfTile = this._tiles.findIndex(currentTile => currentTile.letter === tile.letter);

        if (positionOfTile !== -1) {
            this._tiles.splice(positionOfTile, 1);
        }
    }

    addTile(tile: Tile) {
        tile.playerIndex = this._playerIndex;
        this._tiles.push(tile);
    }
}

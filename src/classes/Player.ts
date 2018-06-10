import Tile from '../interfaces/Tile';
import notify from './notify.helper';
import Tilebag from './Tilebag';

export default class Player {

    turn = false;
    readonly playerIndex: number;
    protected _score = 0;
    protected _tiles: Tile[] = [];

    constructor(turn: boolean, playerIndex: number) {
        this.turn = turn;
        this.playerIndex = playerIndex;
    }

    get score() {
        return this._score;
    }

    set score(score: number) {

        if (score !== this._score) {
            notify({body: `${this.name}: Earned ${score - this._score} points`});
        }

        this._score = score;
    }

    get name() {
        return `Player ${this.playerIndex + 1}`;
    }

    clone() {

        const playerClone = new Player(this.turn, this.playerIndex);

        return Object.assign(playerClone, {
            _score: this._score,
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

            const tile = tilebag.getRandomTile(this.playerIndex);
            tile.playerIndex = this.playerIndex;
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
        tile.playerIndex = this.playerIndex;
        this._tiles.push(tile);
    }
}

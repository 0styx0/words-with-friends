import Powerup from './Powerup';
import Tile from '../interfaces/Tile';
import Player from '../classes/Player';
// import store, { defaultState } from '../store';

export default class TileInfo {

    filled: boolean;
    powerup?: Powerup | undefined;
    Player?: Player;
    private _tile?: Tile;
    private turnTileWasPlaced: number;

    constructor() {
        this.reset();
    }

    get tile() {
        return this._tile;
    }

    canDrag(currentTurn: number) {
        return this.turnTileWasPlaced === currentTurn;
    }

    recent(currentTurn: number) {
        return this.turnTileWasPlaced === currentTurn;
    }

    calculateValue() {

        const powerup = (this.powerup && this.powerup.target === 'letter') ? this.powerup.multiplyBy : 1;

        return this._tile ? this._tile.points * powerup : 0;
    }

    reset() {

        this.filled = false;
        this.turnTileWasPlaced = -1;
        this._tile = undefined;
        this.Player = undefined;
    }

    place(tile: Tile, player: Player, currentTurn: number) {

        this.filled = true;
        this.turnTileWasPlaced = currentTurn;
        this._tile = tile;
        this.Player = player;
    }
}
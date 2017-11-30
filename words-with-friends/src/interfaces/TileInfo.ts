import Powerup from './Powerup';
import Game from '../components/Game/Game';
import Tile from '../interfaces/Tile';

export default class TileInfo {

    filled: boolean;
    turnTileWasPlaced: number;
    recent: boolean;
    powerup?: Powerup | undefined;
    _tile?: Tile;

    constructor() {
        this.reset();
    }

    set tile(tile: Tile) {
        this._tile = tile;
    }

    get tile() {
        return (this._tile && this._tile.letter) ? this._tile! : { letter: 'A', points: 0 };
    }

    get canDrag() {
        return this.turnTileWasPlaced === Game.turn || this.turnTileWasPlaced === 0;
    }

    calculateValue() {

        const powerup = (this.powerup && this.powerup.target === 'letter') ? this.powerup.multiplyBy : 1;

        return this.tile ? this.tile.points * powerup : 0;
    }

    reset() {

        this.filled = false;
        this.turnTileWasPlaced = 0;
        this.recent = false;
        this._tile = undefined;
    }

    place(tile: Tile) {
        this.filled = true;
        this.turnTileWasPlaced = Game.turn;
        this.recent = true;
        this.tile = tile;
    }
}
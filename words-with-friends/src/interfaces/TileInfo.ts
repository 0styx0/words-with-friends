import Powerup from './Powerup';
import Game from '../classes/Game';
import Tile from '../interfaces/Tile';

export default class TileInfo {

    filled: boolean;
    turnTileWasPlaced: number;
    recent: boolean;
    powerup?: Powerup | undefined;
    tile?: Tile;

    constructor() {
        this.reset();
    }

    calculateValue() {

        const powerup = (this.powerup && this.powerup.target === 'letter') ? this.powerup.multiplyBy : 1;

        return this.tile ? this.tile.points * powerup : 0;
    }

    reset() {

        this.filled = false;
        this.turnTileWasPlaced = 0;
        this.recent = false;
        this.tile = undefined;
    }

    place(tile: Tile) {
        this.filled = true;
        this.turnTileWasPlaced = Game.turn;
        this.recent = true;
        this.tile = tile;
    }
}